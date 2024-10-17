from erpnext.setup.doctype.vehicle.vehicle import Vehicle
import frappe
import frappe.defaults


class VanSaleVehicle(Vehicle):
    def update_warehouse(self):
        if self.flags.is_processed:
            return
        
        # Check if the vehicle is linked to another warehouse
        linked_warehouse = frappe.get_value("Warehouse", {"custom_vehicle": self.name})

        # If there's a linked warehouse and it's different from the current warehouse, raise an error
        if linked_warehouse and linked_warehouse != self.custom_warehouse:
            frappe.throw(
                f"Vehicle {self.name} is already linked with warehouse {linked_warehouse}."
            )

        # If no custom_warehouse, insert a new one
        if not self.custom_warehouse:
            # Create a new warehouse for the vehicle
            warehouse_doc = frappe.get_doc(
                {
                    "doctype": "Warehouse",
                    "warehouse_name": self.name,
                    "custom_is_vehicle": 1,
                    "custom_vehicle": self.name,
                    "company": frappe.defaults.get_defaults().company or "",
                }
            ).insert(ignore_permissions=True)
            self.custom_warehouse = warehouse_doc.name
            self.flags.is_processed = True
        else:
            # If custom_warehouse exists, update the warehouse linked to the vehicle
            warehouse_doc = frappe.get_doc("Warehouse", self.custom_warehouse)
            warehouse_doc.custom_is_vehicle = 1
            warehouse_doc.custom_vehicle = self.name
            warehouse_doc.save()
            self.flags.is_processed = True

        frappe.logger("debug").error(['---------234------------', self.as_dict()])

    def after_insert(self):
        # Create warehouse if it's flagged as a warehouse vehicle
        if self.custom_is_warehouse:
            self.update_warehouse()

    def on_update(self):
        # If custom_is_warehouse is true but no warehouse is linked, create or update it
        if self.custom_is_warehouse:
            self.update_warehouse()
