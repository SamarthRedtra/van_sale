from erpnext.setup.doctype.vehicle.vehicle import Vehicle
import frappe
import frappe.defaults


class VanSaleVehicle(Vehicle):
    def create_warehouse(self):
        warehouse = {
            "warehouse_name": self.name,
            "custom_is_vehicle": 1,
            "custom_vehicle": self.name,
            "company": frappe.defaults.get_defaults().company or "",
        }

        warehouse_doc = frappe.new_doc("Warehouse")
        warehouse_doc.update(warehouse)
        warehouse_doc.insert()

        self.custom_warehouse = warehouse_doc.name
        self.save()

    def after_insert(self):
        self.create_warehouse()
