# Copyright (c) 2024, info@redtra.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class RouteMaster(Document):
    def update_customer_details(self):
        if self.table_foap:
            for row in self.table_foap:
                if not row.customer_name:
                    continue

                customer_details = frappe.get_doc("Customer", row.customer_name)
                address_details = frappe.get_doc(
                    "Address", customer_details.customer_primary_address
                )

                row.city = address_details.city
                row.latitude = address_details.custom_latitude
                row.longitude = address_details.custom_longitude

                row.save()

    def after_insert(self):
        self.update_customer_details()

    def on_update(self):
        self.update_customer_details()


# van_sale.bolt_distribution.doctype.route_master.route_master.get_route_details
@frappe.whitelist()
def get_route_details(route_name):
    if not route_name:
        frappe.throw(frappe._("Please provide Route Name"), exc=frappe.ValidationError)

    if not frappe.db.exists("Route Master", route_name):
        frappe.throw(frappe._("Route does not exists"), exc=frappe.DoesNotExistError)

    route_details = frappe.get_doc("Route Master", route_name)

    updated_route_details = []

    for item in route_details.table_foap:
        customer_info = frappe.get_doc("Customer", item.customer_name)

        contacts = frappe.db.sql(
            """
            SELECT contact.*
            FROM `tabContact` AS contact
            JOIN `tabDynamic Link` AS link ON link.parent = contact.name
            WHERE link.link_doctype = 'Customer'
            AND link.link_name = %s
            LIMIT 1
        """,
            item.customer_name,
            as_dict=True,
        )

        address_details = None

        if frappe.db.exists("Address", customer_info.customer_primary_address):
            address_details = frappe.get_doc(
                "Address", customer_info.customer_primary_address
            )
        else:
            frappe.throw(
                frappe._(f"Address does not exists {item.customer_name}"),
                exc=frappe.DoesNotExistError,
            )

        contact_details = contacts[0] if contacts and contacts[0] else None

        updated_route_details.append(
            {
                **item.as_dict(),
                "contact_name": (
                    contact_details.contact_name if contact_details else None
                ),
                "mobile_number": (
                    contact_details.mobile_no if contact_details else None
                ),
                "customer_address": (
                    customer_info.primary_address
                    if customer_info.primary_address
                    else None
                ),
                "latitude": (
                    address_details.custom_latitude if address_details else None
                ),
                "longitude": (
                    address_details.custom_longitude if address_details else None
                ),
            }
        )

    return {"message": "success", "data": updated_route_details}
