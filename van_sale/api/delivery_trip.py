import frappe


# van_sale.api.delivery_trip.get_all_delivery_trips
@frappe.whitelist()
def get_all_delivery_trips():
    cur_user = frappe.session.user

    delivery_list = frappe.get_list(
        "Delivery Trip",
        fields=["*"],
        filters={"custom_user": cur_user},
    )

    for delivery in delivery_list:
        delivery["delivery_stops"] = frappe.get_all(
            "Delivery Stop",
            fields=["*"],
            filters={"parent": delivery.name},
        )

    return {"message": "success", "data": delivery_list}


@frappe.whitelist()
def get_pos_profile(warehouse):
    return frappe.get_doc("Warehouse", warehouse).pos_profile


# van_sale.api.delivery_trip.get_delivery_trip_list
@frappe.whitelist()
def get_delivery_trip_list():
    cur_user = frappe.session.user

    pending_trip = frappe.get_all(
        "Delivery Trip",
        fields=["*"],
        filters={"status": "Pending", "custom_user": cur_user},
    )

    scheduled_trip = frappe.get_all(
        "Delivery Trip",
        fields=["*"],
        filters={"status": "Scheduled", "custom_user": cur_user},
    )

    completed_trip = frappe.get_all(
        "Delivery Trip",
        fields=["*"],
        filters={"status": "Completed", "custom_user": cur_user},
    )

    
    
    return frappe.get_all(
        "Delivery Trip",
        fields=["*"],
        filters={"custom_user": cur_user},
    )
