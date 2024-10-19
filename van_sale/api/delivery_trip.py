import json
import frappe
from datetime import datetime, date
import frappe.utils
from werkzeug.wrappers import Response
from frappe.desk.doctype.notification_settings.notification_settings import (
    set_seen_value,
)
from frappe.desk.doctype.notification_log.notification_log import get_notification_logs


# van_sale.api.delivery_trip.get_all_delivery_trips
@frappe.whitelist()
def get_all_delivery_trips():
    cur_user = frappe.session.user

    # Initialize trip list
    trip_list = []

    # Fetch all delivery trips with status 'In Transit'
    in_transit = frappe.get_list(
        "Delivery Trip",
        fields=["*"],
        filters={"status": "In Transit", "custom_user": cur_user},
    )
    trip_list.extend(in_transit)

    # Fetch scheduled trips
    scheduled = frappe.get_list(
        "Delivery Trip",
        fields=["*"],
        filters={
            "status": "Scheduled",
            "custom_user": cur_user,
            "departure_time": [">=", date.today()],
        },
    )
    trip_list.extend(scheduled)

    # Fetch overdue trips
    overdue = frappe.get_list(
        "Delivery Trip",
        fields=["*"],
        filters={
            "status": "Scheduled",
            "custom_user": cur_user,
            "departure_time": ["<", date.today()],
        },
    )
    trip_list.extend(overdue)

    # Fetch partially completed trips
    partially_completed = frappe.get_list(
        "Delivery Trip",
        fields=["*"],
        filters={"status": "Partially Completed", "custom_user": cur_user},
    )
    trip_list.extend(partially_completed)

    # Fetch completed trips
    completed = frappe.get_list(
        "Delivery Trip",
        fields=["*"],
        filters={"status": "Completed", "custom_user": cur_user},
    )
    trip_list.extend(completed)

    # Iterate over the trips and fetch associated delivery stops
    for delivery in trip_list:
        delivery["delivery_stops"] = frappe.get_all(
            "Delivery Stop",
            fields=["*"],
            filters={"parent": delivery.name},
        )

    # Return success response with data
    return {"message": "success", "data": trip_list}


def is_already_in_transit_stop(trip_name, stop_name):
    stop_info = frappe.get_value(
        "Delivery Stop", {"parent": trip_name, "custom_in_transition": 1, "visited": 0}
    )

    if stop_info:
        return stop_info != stop_name
    else:
        return False


# van_sale.api.delivery_trip.start_delivery
@frappe.whitelist()
def start_delivery(trip_name, stop_name):
    if not frappe.db.exists("Delivery Trip", trip_name):
        return Response(
            json.dumps({"message": "No delivery trip found with name: " + trip_name}),
            status=417,
            content_type="application/json",
        )

    if is_already_in_transit_stop(trip_name, stop_name):
        return Response(
            json.dumps({"message": "Stop is already in transit"}),
            status=417,
            content_type="application/json",
        )

    if not frappe.db.exists("Delivery Stop", stop_name):
        return Response(
            json.dumps({"message": "No delivery stop found with name: " + stop_name}),
            status=417,
            content_type="application/json",
        )

    delivery_trip_doc = frappe.get_doc("Delivery Trip", trip_name)

    in_transit_delivery_trip_name = frappe.get_value(
        "Delivery Trip",
        {
            "status": "In Transit",
            "custom_warehouse": delivery_trip_doc.custom_warehouse,
            "status": "In Transit",
        },
        "name",
    )
    if in_transit_delivery_trip_name and in_transit_delivery_trip_name != trip_name:
        return Response(
            json.dumps(
                {
                    "message": "Delivery trip is already in transit "
                    + in_transit_delivery_trip_name
                }
            ),
            status=417,
            content_type="application/json",
        )

    if delivery_trip_doc.status != "In Transit":
        frappe.db.set_value("Delivery Trip", trip_name, "status", "In Transit")
        frappe.db.commit()

    if not frappe.db.exists(
        "POS Profile", {"warehouse": delivery_trip_doc.custom_warehouse}
    ):
        return Response(
            json.dumps(
                {
                    "message": "No POS Profile found for warehouse: "
                    + delivery_trip_doc.custom_warehouse
                }
            ),
            status=417,
            content_type="application/json",
        )

    if not frappe.db.exists("User", delivery_trip_doc.custom_user):
        return Response(
            json.dumps(
                {"message": "No user found with name: " + delivery_trip_doc.custom_user}
            ),
            status=417,
            content_type="application/json",
        )

    if frappe.db.exists(
        "POS Profile User", {"user": delivery_trip_doc.custom_user, "default": 1}
    ):
        pos_user_profile = frappe.get_doc(
            "POS Profile User", {"user": delivery_trip_doc.custom_user, "default": 1}
        )
        pos_user_profile.default = 0
        pos_user_profile.save(ignore_permissions=True)

    pos_profile = frappe.get_doc(
        "POS Profile", {"warehouse": delivery_trip_doc.custom_warehouse}
    )
    pos_profile.applicable_for_users = []

    pos_profile.append(
        "applicable_for_users", {"user": delivery_trip_doc.custom_user, "default": 1}
    )
    pos_profile.save(ignore_permissions=True)

    stop = frappe.get_doc("Delivery Stop", stop_name)
    stop.update({"custom_in_transition": 1, "custom_start_timing": frappe.utils.now()})
    stop.save(ignore_permissions=True)

    return {
        "message": "success",
    }


# van_sale.api.delivery_trip.is_pos_opening_entry_found
@frappe.whitelist()
def is_pos_opening_entry_found(warehouse):
    response = {"message": "success", "is_found": False}

    if not warehouse or not frappe.db.exists("POS Profile", {"warehouse": warehouse}):
        return response

    pos_profile = frappe.get_doc("POS Profile", {"warehouse": warehouse})

    pos_opening_entry = frappe.db.exists(
        "POS Opening Entry", {"pos_profile": pos_profile.name, "status": "Open"}
    )

    return {
        "message": "success",
        "is_found": True if pos_opening_entry else False,
        "pos_profile": pos_profile.name,
    }


# van_sale.api.delivery_trip.pos_close_entry
@frappe.whitelist()
def pos_close_entry(delivery_trip_id, warehouse):
    frappe.clear_cache()
    delivery_trip_doc = frappe.get_doc("Delivery Trip", delivery_trip_id)

    # Check if warehouse is valid and associated with a POS Profile
    if not warehouse or not frappe.db.exists("POS Profile", {"warehouse": warehouse}):
        return {"message": f"No POS Profile found for warehouse: {warehouse}"}

    # Fetch the POS Profile document
    pos_profile = frappe.get_value("POS Profile", {"warehouse": warehouse}, "name")
    pos_profile_doc = frappe.get_doc("POS Profile", pos_profile)

    # Check if there is an open POS Opening Entry for the POS Profile
    pos_opening = frappe.get_value(
        "POS Opening Entry", {"pos_profile": pos_profile, "status": "Open"}, "name"
    )

    if not pos_opening:
        return {
            "message": f"No POS Opening Entry found for POS Profile: {pos_profile_doc.name}"
        }

    # Get the current datetime
    now = datetime.now()

    pos_invoice_list = []
    total_item_quantity = 0
    grand_total = 0
    rounded_total = 0
    paid_amount = 0

    for stop in delivery_trip_doc.delivery_stops:
        if stop.custom_pos_invoice:
            pos_invoice_doc = frappe.get_doc("POS Invoice", stop.custom_pos_invoice)
            if pos_invoice_doc.status == "Consolidated":
                continue

            pos_invoice_list.append({"pos_invoice": stop.custom_pos_invoice})
            total_item_quantity += int(pos_invoice_doc.total_qty or 0)
            grand_total += float(pos_invoice_doc.grand_total or 0)
            rounded_total += float(pos_invoice_doc.rounded_total or 0)
            paid_amount += float(pos_invoice_doc.paid_amount or 0)

    # Create a new POS Closing Entry document
    voucher = frappe.get_doc(
        {
            "doctype": "POS Closing Entry",
            "pos_profile": pos_profile_doc.name,
            "user": frappe.session.user,
            "company": pos_profile_doc.company,
            "pos_opening_entry": pos_opening,
            "period_end_date": now,
            "posting_date": now.date(),
            "posting_time": now.strftime("%H:%M:%S"),
            "pos_transactions": pos_invoice_list,
            "payment_reconciliation": [
                {
                    "mode_of_payment": "Cash",
                    "opening_amount": 0,
                    "expected_amount": grand_total,
                    "closing_amount": paid_amount,
                }
            ],
            "grand_total": grand_total,
            "net_total": paid_amount,
            "total_quantity": total_item_quantity,
        }
    )

    # Insert the document into the database
    voucher.insert()

    # Submit the document
    voucher.submit()

    delivery_trip_doc.custom_pos_closing_entry_link = voucher.name
    delivery_trip_doc.save(ignore_permissions=True)

    is_partially_completed = False

    for stop in delivery_trip_doc.delivery_stops:
        if stop.visited == 0:
            is_partially_completed = True
            break

    frappe.db.set_value(
        "Delivery Trip",
        delivery_trip_id,
        "status",
        "Partially Completed" if is_partially_completed else "Completed",
    )
    frappe.db.commit()

    # Return the name of the newly created POS Closing Entry
    return {"message": f"POS Closing Entry created"}


# van_sale.api.delivery_trip.get_pending_payment_stops
@frappe.whitelist()
def get_pending_payment_stops():
    user = frappe.session.user

    # Fetch the delivery trip names associated with the user in a single query
    delivery_name_list = frappe.get_all(
        "Delivery Trip", filters={"custom_user": user}, pluck="name"
    )

    # If no delivery trips found, return an empty list early
    if not delivery_name_list:
        return []

    # Fetch the unpaid credit delivery stops in one go, filtering by the parent delivery trips
    delivery_stop_list = frappe.get_all(
        "Delivery Stop",
        filters={
            "custom_is_paid": 0,
            "custom_is_credit": 1,
            "parent": ["in", delivery_name_list],
        },
        fields=["*"],
    )

    return {
        "message": "Success",
        "delivery_stops": delivery_stop_list,
    }


# van_sale.api.delivery_trip.get_notification_list
@frappe.whitelist()
def get_notification_list():
    set_seen_value(user=frappe.session.user, value=1)

    notifications = get_notification_logs(limit=100)

    notification_list = []
    count = 0

    for notification in notifications.get("notification_logs", []):
        if count == 20:
            break

        if notification.document_type == "Delivery Trip":
            notification_list.append(notification)
            count += 1

    return {
        "message": "Success",
        "notification_logs": notification_list,
    }


# van_sale.api.delivery_trip.create_sales_invoice
@frappe.whitelist()
def create_sales_invoice(trip_details, stop_details, product_items, due_date=None):
    try:
        # Create Sales Invoice document
        sales_invoice = frappe.get_doc(
            {
                "doctype": "Sales Invoice",
                "posting_time": frappe.utils.now(),  # Posting time in "HH:mm:ss" format
                "customer": stop_details.get("customer"),
                "due_date": due_date or "",
                "custom_warehouse": trip_details.get("custom_warehouse"),
                "update_stock": 1,
                "set_warehouse": trip_details.get("custom_warehouse"),
                "custom_delivery_trip": trip_details.get("name"),
                "items": [
                    {
                        "item_code": item.get("item_code"),
                        "qty": item.get("quantity"),
                        "price_list_rate": item.get("price_list_rate"),
                        "net_amount": (item.get("price_list_rate") or 0)
                        * item.get("quantity"),
                        "discount_percentage": item.get("discount") or 0,
                        "amount": item.get("amount") or 0,
                    }
                    for item in product_items
                ],
            }
        )

        # Insert the document and submit
        sales_invoice.insert()
        sales_invoice.submit()

        return {
            "status": "success",
            "message": frappe._("Sales Invoice created successfully"),
            "invoice_name": sales_invoice.name,
        }

    except Exception as e:
        frappe.log_error(
            frappe.get_traceback(), frappe._("Sales Invoice Creation Error")
        )
        return {"status": "error", "message": str(e)}


# van_sale.api.delivery_trip.clear_user_cache
@frappe.whitelist(allow_guest=True)
def clear_user_cache(user=None, doctype=None):
    """
    Clear user cache.

    This is a whitelisted function. It is allowed to be called via an API call
    or a web call.

    Returns a dict with a message key. The value of message key is a string
    that indicates whether the cache was cleared successfully or not. If the
    cache is cleared successfully, the value of message key is
    "Cache Cleared Successfully". If an error occurs, the value of message key
    is an error message string.

    :return: A dict with a message key.
    :rtype: dict
    """
    try:
        frappe.clear_cache(user=user, doctype=doctype)
        return {"message": frappe._("Cache Cleared Successfully")}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Cache Clearing Error")
        return {"error": frappe._("Error clearing cache: {0}").format(str(e))}
