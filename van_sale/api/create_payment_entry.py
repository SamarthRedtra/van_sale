from erpnext.accounts.doctype.payment_entry.payment_entry import get_payment_entry
import frappe


# van_sale.api.create_payment_entry.create_payment_entry
@frappe.whitelist()
def create_payment_entry(sales_invoice, delivery_stop):
    if not sales_invoice:
        frappe.throw(frappe._("Sales Invoice is required"), exc=frappe.ValidationError)

    if not delivery_stop:
        frappe.throw(frappe._("Delivery Stop is required"), exc=frappe.ValidationError)

    sales_invoice_doc = frappe.get_doc("Sales Invoice", sales_invoice)
    sales_invoice_doc.submit()

    payment_entry_doc = get_payment_entry(dt="Sales Invoice", dn=sales_invoice)
    payment_entry_doc.reference_no = "Cash"
    payment_entry_doc.insert(ignore_permissions=True)

    delivery_stop_doc = frappe.get_doc("Delivery Stop", delivery_stop)
    delivery_stop_doc.custom_is_paid = 1
    delivery_stop_doc.save(ignore_permissions=True)

    return {
        "message": "Payment Entry created",
        "payment_entry": payment_entry_doc.name,
        "status": "success",
    }
