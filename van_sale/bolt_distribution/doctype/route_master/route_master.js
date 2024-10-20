// Copyright (c) 2024, info@redtra.com and contributors
// For license information, please see license.txt

frappe.ui.form.on("Route Master", {
    refresh(frm) {
        // Filter 'to' field options based on 'from' field selection
        frm.fields_dict.to.get_query = function (doc) {
            return {
                filters: [
                    ['name', '!=', frm.doc.from]
                ]
            };
        };

        // Filter 'from' field options based on 'to' field selection
        frm.fields_dict.from.get_query = function (doc) {
            return {
                filters: [
                    ['name', '!=', frm.doc.to]
                ]
            };
        };
    },

    // Trigger filtering when 'from' field is changed
    from: function (frm) {
        frm.refresh_field('to');  // Refresh 'to' field to apply the filter
    },

    // Trigger filtering when 'to' field is changed
    to: function (frm) {
        frm.refresh_field('from');  // Refresh 'from' field to apply the filter
    }
});
