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
            ignore_permissions=True,
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
                pos_profile.custom_is_driver_profile = 1

                pos_profile.save()
                pos_profile.reload()

                self.add_assinee()
                self.db_set("custom_pos_profile", pos_profile.name, commit=True)
            else:
                frappe.throw(
                    f"No POS Profile found for warehouse: {self.custom_warehouse}"
                )
        else:
            frappe.throw("Both warehouse and user are not valid.")
        
    def on_update_after_submit(self):
        super().on_update_after_submit()    
        if self.status == "Completed":
            issues_list = [ i.custom_linked_issue for i in self.delivery_stops if i.custom_linked_issue]
            if len(issues_list) > 0:
                frappe.db.set_value("Issue",{"name": ['in', issues_list]}, "status", "Resolved",commit=True)

    def on_cancel(self):
        if self.custom_pos_opening_entry_link:
            frappe.throw(
                frappe._(
                    "Can not cancel an already partially completed Delivery Trip. Pleas ask driver to close POS to close the trip."
                )
            )

        super().on_cancel()
