import frappe
from frappe.model.mapper import get_mapped_doc


@frappe.whitelist()
def create_driver(source_name, target_doc=None):
	return _make_driver(source_name, target_doc)




def _make_driver(source_name, target_doc=None, ignore_permissions=False):
    """
    Internal method to map fields from Employee to Driver using get_mapped_doc.
    """
    doclist = get_mapped_doc(
        "Employee",  # Source Doctype
        source_name,  # Name of the source document (Employee)
        {
            "Employee": {  # Mapping from Employee to Driver
                "doctype": "Driver",  # Target Doctype
                "field_map": {
                    "name": "employee",          # Map Employee 'name' to Driver 'employee'
                    "employee_name": "full_name",  # Map 'employee_name' to 'full_name'
                    "cell_number": "cell_number"  # Map 'cell_number' to Driver 'cell_number'
                },
            }
        },
        target_doc,  # Target document if passed
        ignore_permissions=True,
    )

    return doclist