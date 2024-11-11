import json
import frappe


# van_sale.api.create_customer.create_customer
@frappe.whitelist()
def create_customer(payload):
    if not payload:
        frappe.throw(frappe._("Payload is required"), exc=frappe.ValidationError)

    # Load JSON only if `payload` is a string
    if isinstance(payload, str):
        payload = json.loads(payload)

    # Get `customer_name` and perform a quick existence check
    customer_name = payload.get("customer_name", "")
    if not customer_name:
        frappe.throw(frappe._("Customer name is required"), exc=frappe.ValidationError)

    # Check existence with a more efficient SQL query to reduce overhead
    if frappe.db.exists({"doctype": "Customer", "customer_name": customer_name}):
        frappe.throw(
            frappe._(f"Customer {customer_name} already exists"),
            exc=frappe.ValidationError,
        )

    # Create the new Customer document
    doc = frappe.get_doc(
        {
            "doctype": "Customer",
            "customer_type": payload.get("customer_type", ""),
            "customer_name": customer_name,
            "address_line1": payload.get("address_line1", ""),
            "address_line2": payload.get("address_line2", ""),
            "city": payload.get("city", ""),
            "state": payload.get("state", ""),
            "country": payload.get("country", ""),
            "pincode": payload.get("pincode", ""),
            "email_id": payload.get("email_id", ""),
            "mobile_no": payload.get("mobile_number", ""),
            "custom_latitude": payload.get("custom_latitude", ""),
            "custom_longitude": payload.get("custom_longitude", ""),
            "email_address": payload.get("email_id", ""),
            "mobile_number": payload.get("mobile_number", ""),
        }
    )

    # Insert the document with `ignore_permissions=True` to save a permission check step
    doc.insert(ignore_permissions=True)

    # Commit the transaction immediately if this is a standalone API (to reduce transaction time)
    frappe.db.commit()

    return doc
