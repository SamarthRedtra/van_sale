import frappe
from erpnext.stock.doctype.warehouse.warehouse import Warehouse


class VanSaleWarehouse(Warehouse):
    def update_vehicle_info(self):
        """Common method to update vehicle-related fields."""
        is_vehicle = self.get("custom_is_vehicle", "")

        if is_vehicle and not self.flags.is_processed:
            vehicle_doc = frappe.get_doc("Vehicle", self.custom_vehicle)
            
            self.custom_license_plate = vehicle_doc.license_plate
            self.custom_model = vehicle_doc.model
            self.custom_make = vehicle_doc.make

            self.custom_odometer_value_last = vehicle_doc.last_odometer
            self.custom_chassis_no = vehicle_doc.chassis_no
            self.custom_acquisition_date = vehicle_doc.acquisition_date
            self.custom_vehicle_value = vehicle_doc.vehicle_value
            self.custom_location = vehicle_doc.location

            self.custom_insurance_company = vehicle_doc.insurance_company
            self.custom_policy_no = vehicle_doc.policy_no
            self.custom_start_date = vehicle_doc.start_date
            self.custom_end_date = vehicle_doc.end_date

            # Set the flag to prevent recursion
            self.flags.is_processed = True

            # Save the document after setting the value
            self.save()

        
    def on_update(self):
        super().on_update()
        """Called during the update event."""
        self.update_vehicle_info()


    def after_insert(self):
        """Called after the document is inserted."""
        self.update_vehicle_info()
