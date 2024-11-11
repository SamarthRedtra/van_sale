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
def is_pos_opening_entry_found(delivery_trip_id):
    response = {"message": "success", "is_found": False}

    if not delivery_trip_id or not frappe.db.exists("Delivery Trip", delivery_trip_id):
        return response

    delivery_trip_doc = frappe.get_doc("Delivery Trip", delivery_trip_id)

    pos_opening_entry = frappe.db.exists(
        "POS Opening Entry",
        {"custom_delivery_trip": delivery_trip_doc.name, "status": "Open"},
    )

    if not pos_opening_entry:
        return response

    return {
        "message": "success",
        "is_found": True,
        "pos_profile": frappe.get_value(
            "POS Opening Entry", pos_opening_entry, "pos_profile"
        ),
    }


# van_sale.api.delivery_trip.pos_close_entry
@frappe.whitelist()
def pos_close_entry(delivery_trip_id, warehouse):
    delivery_trip_doc = frappe.get_doc("Delivery Trip", delivery_trip_id)

    # Validate warehouse and POS Profile
    if not warehouse or not frappe.db.exists("POS Profile", {"warehouse": warehouse}):
        return {"message": f"No POS Profile found for warehouse: {warehouse}"}

    pos_profile = delivery_trip_doc.custom_pos_profile
    pos_profile_doc = frappe.get_doc("POS Profile", pos_profile)

    # Check for open POS Opening Entry
    pos_opening = frappe.get_value(
        "POS Opening Entry", {"pos_profile": pos_profile, "status": "Open"}, "name"
    )

    if not pos_opening:
        return {
            "message": f"No POS Opening Entry found for POS Profile: {pos_profile_doc.name}"
        }

    # Current datetime
    now = datetime.now()

    pos_invoice_list = []
    total_item_quantity = 0
    grand_total = 0
    paid_amount = 0
    payment_data = {}

    # Consolidate data from POS Invoices
    for stop in delivery_trip_doc.delivery_stops:
        if stop.custom_pos_invoice:
            pos_invoice_doc = frappe.get_doc("POS Invoice", stop.custom_pos_invoice)

            if pos_invoice_doc.status == "Consolidated":
                continue

            pos_invoice_list.append({"pos_invoice": stop.custom_pos_invoice})
            total_item_quantity += int(pos_invoice_doc.total_qty or 0)
            grand_total += float(pos_invoice_doc.grand_total or 0)
            paid_amount += float(pos_invoice_doc.paid_amount or 0)

            # Consolidate payment amounts by mode_of_payment
            for payment in pos_invoice_doc.payments:
                mode = payment.mode_of_payment
                amount = float(payment.amount or 0)
                if mode not in payment_data:
                    payment_data[mode] = {
                        "opening_amount": 0,
                        "expected_amount": 0,
                        "closing_amount": 0,
                    }

                payment_data[mode]["expected_amount"] += amount
                payment_data[mode]["closing_amount"] += amount

    # Prepare payment reconciliation list
    payment_reconciliation = [
        {
            "mode_of_payment": mode,
            "opening_amount": data["opening_amount"],
            "expected_amount": data["expected_amount"],
            "closing_amount": data["closing_amount"],
        }
        for mode, data in payment_data.items()
    ]

    # Create and submit the POS Closing Entry document
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
            "payment_reconciliation": payment_reconciliation,
            "grand_total": grand_total,
            "net_total": paid_amount,
            "total_quantity": total_item_quantity,
        }
    )

    voucher.insert()
    voucher.submit()

    # Update Delivery Trip status and save custom POS Closing Entry link
    delivery_trip_doc.custom_pos_closing_entry_link = voucher.name
    delivery_trip_doc.save(ignore_permissions=True)

    is_partially_completed = any(
        stop.visited == 0 for stop in delivery_trip_doc.delivery_stops
    )

    frappe.db.set_value(
        "Delivery Trip",
        delivery_trip_id,
        "status",
        "Partially Completed" if is_partially_completed else "Completed",
    )
    frappe.db.commit()

    # Return success message
    return {"message": "POS Closing Entry created"}


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


# van_sale.api.delivery_trip.get_cancelled_stops
@frappe.whitelist()
def get_cancelled_stops():
    user = frappe.session.user

    # Fetch the delivery trip names associated with the user in a single query
    delivery_name_list = frappe.get_all(
        "Delivery Trip",
        filters={
            "custom_user": user,
            "status": ["in", ["Partially Completed", "Completed"]],
        },
        pluck="name",
    )

    # If no delivery trips found, return an empty list early
    if not delivery_name_list:
        return []

    # Fetch the unpaid credit delivery stops in one go, filtering by the parent delivery trips
    delivery_stop_list = frappe.get_all(
        "Delivery Stop",
        filters={
            "visited": 0,
            "parent": ["in", delivery_name_list],
        },
        fields=["*"],
    )

    # Adding static field is_cancelled = True
    for stop in delivery_stop_list:
        stop["is_cancelled"] = True
        stop["departure_time"] = frappe.get_value(
            "Delivery Trip", stop.parent, "departure_time"
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


# van_sale.api.delivery_trip.update_pos_opening_entry
@frappe.whitelist()
def update_pos_opening_entry(delivery_trip, pos_profile):
    if not delivery_trip or not pos_profile:
        return

    if frappe.db.exists(
        "POS Opening Entry", {"pos_profile": pos_profile, "status": "Open"}
    ) and frappe.db.exists("Delivery Trip", delivery_trip):
        pos_opening_entry_doc = frappe.get_doc(
            "POS Opening Entry", {"pos_profile": pos_profile, "status": "Open"}
        )

        pos_opening_entry_doc.update({"custom_delivery_trip": delivery_trip})

        pos_opening_entry_doc.save(ignore_permissions=True)

        delivery_trip = frappe.get_doc("Delivery Trip", delivery_trip)

        delivery_trip.update(
            {"custom_pos_opening_entry_link": pos_opening_entry_doc.name}
        )

        delivery_trip.save(ignore_permissions=True)


# van_sale.api.delivery_trip.close_in_transit_delivery_trip
@frappe.whitelist()
def close_in_transit_delivery_trip(delivery_trip):
    if not frappe.db.exists("Delivery Trip", delivery_trip):
        frappe.throw(frappe._("Delivery Trip not found."), frappe.DoesNotExistError)

    delivery_trip_doc = frappe.get_doc("Delivery Trip", delivery_trip)

    if delivery_trip_doc.status == "In Transit":
        is_partially_completed = any(
            stop.visited == 0 for stop in delivery_trip_doc.delivery_stops
        )

        frappe.db.set_value(
            "Delivery Trip",
            delivery_trip,
            "status",
            "Partially Completed" if is_partially_completed else "Completed",
        )
        frappe.db.commit()


# van_sale.api.delivery_trip.add_to_delivery_trip
@frappe.whitelist()
def add_to_delivery_trip(delivery_trip, customer):
    if not frappe.db.exists("Delivery Trip", delivery_trip):
        frappe.throw(frappe._("Delivery Trip not found."), frappe.DoesNotExistError)

    if not frappe.db.exists("Customer", customer):
        frappe.throw(frappe._("Customer not found."), frappe.DoesNotExistError)

    delivery_trip_doc = frappe.get_doc("Delivery Trip", delivery_trip)

    query = f"""
        SELECT
            contact.mobile_no
        FROM
            `tabContact` AS contact
        LEFT JOIN
            `tabDynamic Link` AS dl ON dl.parent = contact.name
        WHERE
            contact.name = '{customer}'
    """

    customer_mobile_no_list = frappe.db.sql(query, as_dict=True)

    address_query = f"""
        SELECT
            address.name
        FROM
            `tabAddress` AS address
        LEFT JOIN
            `tabDynamic Link` AS dl ON dl.parent = address.name
        WHERE
            dl.link_name = '{customer}'
    """

    customer_address_list = frappe.db.sql(address_query, as_dict=True)

    customer_mobile_no = (
        customer_mobile_no_list[0].mobile_no if customer_mobile_no_list else None
    )
    customer_address = customer_address_list[0].name if customer_address_list else None

    # Append the new delivery stop, including the required address field
    delivery_trip_doc.append(
        "delivery_stops",
        {
            "customer": customer,
            "custom_mobile_no": customer_mobile_no,
            "address": customer_address,  # Ensure address is included to avoid MandatoryError
        },
    )

    # Save the updated delivery trip document
    delivery_trip_doc.save(ignore_permissions=True)

    # Commit the transaction to the database
    frappe.db.commit()

    return {"message": "Delivery trip updated successfully"}
