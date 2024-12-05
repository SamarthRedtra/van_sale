
import frappe
from frappe.model.mapper import get_mapped_doc

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


@frappe.whitelist()
def create_driver(source_name, target_doc=None):
	return _make_driver(source_name, target_doc)


def _make_driver(source_name, target_doc=None, ignore_permissions=False):
	doclist = get_mapped_doc(
		"Employee",
		source_name,
		{
			"Employee": {
				"doctype": "Driver",
				"field_map": {
					"name": "employee",
					"employee_name": "full_name",
                    "cell_number":"cell_number"
				},
				"field_no_map": ["disabled"],
			}
		},
		target_doc,
		ignore_permissions=ignore_permissions,
	)

	return doclist