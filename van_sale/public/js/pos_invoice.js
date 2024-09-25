frappe.ui.form.on('POS Invoice', {
    onload: function (frm) {
        // Check if it's a new POS entry
        if (frm.is_new()) {
            // Fetch POS profile data
            frappe.call({
                method: "frappe.client.get",
                args: {
                    doctype: "POS Profile",
                    name: "POS Profile Name" // Replace with the actual profile name or ID
                },
                callback: function (data) {
                    if (data.message) {
                        // Prefill the fields in POS entry with the fetched data
                        frm.set_value("customer", data.message.customer);
                        frm.set_value("price_list", data.message.price_list);
                        frm.set_value("warehouse", data.message.warehouse);
                        // Set other necessary fields as per your requirements
                    }
                }
            });
        }
    }
});
