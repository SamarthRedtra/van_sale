from frappe.contacts.doctype.contact.contact import Contact
import frappe

class CustomContact(Contact):
    def on_update(self):
        if self.company_name:
            self.db_set('first_name',self.company_name,commit=True)
            frappe.db.commit()
            