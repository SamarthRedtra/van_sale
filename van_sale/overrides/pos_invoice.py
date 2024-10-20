from erpnext.accounts.doctype.pos_invoice.pos_invoice import POSInvoice
import frappe
import frappe.defaults
from frappe.model import docstatus


class VanSalePOSInvoice(POSInvoice):
    def mark_customer_visited(self):
        if not self.set_warehouse:
            frappe.throw("No warehouse found for POS Profile: " + self.pos_profile)

        delivery_trip_from_pos_opening = frappe.db.get_value("POS Opening Entry",filters={'pos_profile': self.pos_profile,'status':'Open'},fieldname='custom_delivery_trip')
        
        if not delivery_trip_from_pos_opening:
            frappe.throw(f"Delivery Trip Not Found Against {self.pos_profile}")
            
        delivery_stop_filters = {
            "customer": self.customer,
            "parent": delivery_trip_from_pos_opening,
            "visited": 0,
        }

        if frappe.db.exists("Delivery Stop", delivery_stop_filters):
            delivery_stop = frappe.get_doc("Delivery Stop", delivery_stop_filters)
            delivery_stop.update(
                {
                    "visited": 1,
                    "custom_pos_invoice": self.name,
                    "custom_end_timing": frappe.utils.now(),
                }
            )
            delivery_stop.save()

    def on_submit(self):
        if frappe.db.get_value('POS Profile',self.pos_profile,'custom_is_driver_profile'):
            self.mark_customer_visited()
