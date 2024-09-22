from erpnext.stock.doctype.delivery_trip.delivery_trip import DeliveryTrip
import frappe


class VanSaleDeliveryTrip(DeliveryTrip):
    def on_submit(self):
        super().on_submit()

        if self.custom_warehouse and self.custom_user:
            if frappe.db.exists("POS Profile User", {"user": self.custom_user, "default": 1}):
                pos_user_profile = frappe.get_doc(
                    "POS Profile User", {"user": self.custom_user, "default": 1}
                )
                pos_profile = frappe.delete_doc(
                    "POS Profile User", pos_user_profile.name
                )

            if frappe.db.exists("POS Profile", {"warehouse": self.custom_warehouse}):
                pos_profile = frappe.get_doc(
                    "POS Profile", {"warehouse": self.custom_warehouse}
                )

                pos_profile.applicable_for_users = []

                pos_profile.append(
                    "applicable_for_users", {"user": self.custom_user, "default": 1}
                )

                pos_profile.save()
            else:
                frappe.throw(
                    f"No POS Profile found for warehouse: {self.custom_warehouse}"
                )
        else:
            frappe.throw("Both warehouse and user are not valid.")
