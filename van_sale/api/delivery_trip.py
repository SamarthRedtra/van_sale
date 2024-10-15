import json
import frappe
from datetime import datetime, date
from werkzeug.wrappers import Response


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
        pos_user_profile.save()

    pos_profile = frappe.get_doc(
        "POS Profile", {"warehouse": delivery_trip_doc.custom_warehouse}
    )
    pos_profile.applicable_for_users = []

    pos_profile.append(
        "applicable_for_users", {"user": delivery_trip_doc.custom_user, "default": 1}
    )
    pos_profile.save()

    stop = frappe.get_doc("Delivery Stop", stop_name)
    stop.update({"custom_in_transition": 1})
    stop.save()

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
            pos_invoice_list.append({"pos_invoice": stop.custom_pos_invoice})
            pos_invoice_doc = frappe.get_doc("POS Invoice", stop.custom_pos_invoice)
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

    delivery_trip_doc.custom_pos_closing_entry = voucher.name
    delivery_trip_doc.save()

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
