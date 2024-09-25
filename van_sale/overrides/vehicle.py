from erpnext.setup.doctype.vehicle.vehicle import Vehicle
import frappe
import frappe.defaults


class VanSaleVehicle(Vehicle):
    def update_warehouse(self):
        vehicle_name = frappe.get_value(
            "Warehouse", self.custom_warehouse, "custom_vehicle"
        )
        if vehicle_name and vehicle_name != self.name:
            frappe.throw("Warehouse already linked with another vehicle")

        warehouse_name = frappe.get_value("Warehouse", {"custom_vehicle": self.name})
        if warehouse_name and warehouse_name != self.custom_warehouse:
            frappe.throw("Vehicle already linked with another warehouse")

        warehouse_doc = frappe.get_doc("Warehouse", self.custom_warehouse)

        warehouse = {
            "warehouse_name": self.name,
            "custom_is_vehicle": 1,
            "custom_vehicle": self.name,
            "company": frappe.defaults.get_defaults().company or "",
        }

        warehouse_doc.update(warehouse)
        warehouse_doc.save()

    def after_insert(self):
        if self.custom_is_warehouse and self.custom_warehouse:
            self.update_warehouse()

    def on_update(self):
        if self.custom_is_warehouse and self.custom_warehouse:
            self.update_warehouse()
