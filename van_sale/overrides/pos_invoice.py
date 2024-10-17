from erpnext.accounts.doctype.pos_invoice.pos_invoice import POSInvoice
import frappe
import frappe.defaults


class VanSalePOSInvoice(POSInvoice):
    def mark_customer_visited(self):
        if not self.set_warehouse:
            frappe.throw("No warehouse found for POS Profile: " + self.pos_profile)

        delivery_trip = frappe.get_doc(
            "Delivery Trip",
            {
                "custom_warehouse": self.set_warehouse,
            },
        )

        delivery_stop_filters = {
            "customer": self.customer,
            "parent": delivery_trip.name,
            "visited": 0,
        }

        if frappe.db.exists("Delivery Stop", delivery_stop_filters):
            delivery_stop = frappe.get_doc("Delivery Stop", delivery_stop_filters)
            delivery_stop.update({"visited": 1, "custom_pos_invoice": self.name, "custom_end_timing": frappe.utils.now()})
            delivery_stop.save()

    def on_submit(self):
        self.mark_customer_visited()
