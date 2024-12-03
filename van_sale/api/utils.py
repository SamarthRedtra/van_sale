
import frappe
@frappe.whitelist()
def get_pos_profile(user=None):
    if not user:
        user = frappe.session.user
    pos_profiles= frappe.get_all("POS Profile User", filters={"user": user}, fields=["parent"],pluck="parent")
    if not pos_profiles:
        return []
    pos_profiles_final= frappe.get_all("POS Profile", filters={"name": ["in", pos_profiles],"disabled": 0}, fields=["*"])
    return pos_profiles_final


@frappe.whitelist()
def get_user_info(user=None):
    if not user:
        user = frappe.session.user
    return frappe.get_doc("User", user)
