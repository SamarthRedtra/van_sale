import frappe
from frappe.desk.form.assign_to import add as add_assignment
from erpnext.stock.doctype.delivery_trip.delivery_trip import DeliveryTrip


class VanSaleDeliveryTrip(DeliveryTrip):
    def add_assinee(self):
        add_assignment(
            {
                "doctype": "Delivery Trip",
                "name": self.name,
                "assign_to": [self.custom_user],
            }, 
            ignore_permissions=True
        )

    def on_submit(self):
        super().on_submit()

        if self.custom_warehouse and self.custom_user:
            if frappe.db.exists("POS Profile", {"warehouse": self.custom_warehouse}):
                pos_profile = frappe.get_doc(
                    "POS Profile", {"warehouse": self.custom_warehouse}
                )

                pos_profile.applicable_for_users = []

                pos_profile.append("applicable_for_users", {"user": self.custom_user})

                pos_profile.save()

                self.add_assinee()
            else:
                frappe.throw(
                    f"No POS Profile found for warehouse: {self.custom_warehouse}"
                )
        else:
            frappe.throw("Both warehouse and user are not valid.")
