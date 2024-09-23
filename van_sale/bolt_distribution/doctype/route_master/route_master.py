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
        contacts = frappe.db.sql(
            """
            SELECT contact.name AS contact_name
            FROM `tabContact` AS contact
            JOIN `tabDynamic Link` AS link ON link.parent = contact.name
            WHERE link.link_doctype = 'Customer'
            AND link.link_name = %s
        """,
            item.customer_name,
            as_dict=True,
        )

        updated_route_details.append(
            {
                **item.as_dict(),
                "contact_name": (
                    contacts[0].contact_name if contacts[0].contact_name else None
                ),
                "customer_address": frappe.get_value(
                    "Customer", item.customer_name, "customer_primary_address"
                ),
            }
        )

    return {"message": "success", "data": updated_route_details}
