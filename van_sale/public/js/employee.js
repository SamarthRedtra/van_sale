frappe.ui.form.on('Employee', {
    refresh: function(frm) {
        frm.add_custom_button("Create Driver", function () {
            frappe.model.open_mapped_doc({
                method: "van_sale.bolt_distribution.doctype.create_driver",
                frm: cur_frm,
            });
        }).addClass("btn-primary");
    },
 })