frappe.ui.form.on('Service Level Agreement', {
    custom_bulk_update_working_hours:function(frm){
        let dialog = new frappe.ui.Dialog({
            title: __('Bulk Update Weekly Schedule'),
            fields: [
                {
                    label: 'Days',
                    fieldname: 'days',
                    fieldtype: 'HTML',
                    options: `
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                            <label style="width: 45%;"><input type="checkbox" name="days" value="Monday"> Monday</label>
                            <label style="width: 45%;"><input type="checkbox" name="days" value="Tuesday"> Tuesday</label>
                            <label style="width: 45%;"><input type="checkbox" name="days" value="Wednesday"> Wednesday</label>
                            <label style="width: 45%;"><input type="checkbox" name="days" value="Thursday"> Thursday</label>
                            <label style="width: 45%;"><input type="checkbox" name="days" value="Friday"> Friday</label>
                            <label style="width: 45%;"><input type="checkbox" name="days" value="Saturday"> Saturday</label>
                            <label style="width: 45%;"><input type="checkbox" name="days" value="Sunday"> Sunday</label>
                        </div>
                    `
                },
                {
                    label: 'From Time',
                    fieldname: 'from_time',
                    fieldtype: 'Time',
                    reqd: 1
                },
                {
                    label: 'To Time',
                    fieldname: 'to_time',
                    fieldtype: 'Time',
                    reqd: 1
                }
            ],
            primary_action_label: 'Update Schedule',
            primary_action() {
                const selected_days = Array.from(
                    dialog.fields_dict.days.$wrapper.find('input[name="days"]:checked')
                ).map(input => input.value);

                if (selected_days.length === 0) {
                    frappe.msgprint(__('Please select at least one day.'));
                    return;
                }

                // Loop through selected days and apply the schedule for each
                selected_days.forEach(day => {
                    // Check if an entry for this day already exists
                    let existing_row = frm.doc.support_and_resolution.find(row => row.workday === day);
                    if (existing_row) {
                        // Update the existing entry
                        frappe.model.set_value(existing_row.doctype, existing_row.name, 'start_time', dialog.get_value('from_time'));
                        frappe.model.set_value(existing_row.doctype, existing_row.name, 'end_time', dialog.get_value('to_time'));
                    } else {
                        // Add a new entry for the selected day
                        let row = frm.add_child("support_and_resolution");
                        row.workday = day;
                        row.start_time = dialog.get_value('from_time');
                        row.end_time = dialog.get_value('to_time');
                    }
                });
                frm.refresh_field("support_and_resolution");
                dialog.hide();
            }
        });
        dialog.show();

    }

})
