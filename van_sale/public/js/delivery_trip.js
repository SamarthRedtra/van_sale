frappe.ui.form.on('Delivery Trip', {
    refresh: function (frm) {
        // Add button to the form
        frm.add_custom_button(__('Show Delivery Status'), function () {
            show_delivery_status_modal(frm);
        }, __(""));
    },
    custom_route: function (frm) {
        if (!frm?.doc?.custom_route) return;

        frappe.call({
            method: 'van_sale.bolt_distribution.doctype.route_master.route_master.get_route_details',
            args: {
                route_name: frm.doc.custom_route,
            },
            callback: function (response) {
                if (response?.message && response?.message?.data) {
                    // Clear the existing delivery stops first
                    frm.clear_table("delivery_stops");

                    // Add new delivery stops from the fetched data
                    response?.message?.data?.forEach(element => {
                        let stop = frm.add_child("delivery_stops");
                        frappe.model.set_value(stop.doctype, stop.name, {
                            "customer": element?.customer_name ?? "",
                            "address": element?.customer_address ?? "",
                            "customer_address": element?.location ?? "",
                            "contact": element?.contact_name ?? ""
                        });
                    });

                    // Refresh the delivery_stops field to update the UI
                    frm.refresh_field("delivery_stops");
                }
            },
        });
    },
});


function show_delivery_status_modal(frm) {
    // Create the modal
    const dialog = new frappe.ui.Dialog({
        title: 'Delivery Status',
        size: 'large',
        fields: [
            {
                label: '',
                fieldname: 'status_html',
                fieldtype: 'HTML'
            }
        ]
    });

    // Get delivery status data (you might need to modify this based on actual delivery stop data)
    const delivery_stops = get_delivery_status_list(frm.doc?.delivery_stops || []);



    // Build the HTML structure for delivery status cards
    const html_content = `
        <div class="delivery-status-modal">
            <div class="status-filter">
                <span class="status-tag pending">Pending (${delivery_stops.pending_list.length ?? 0})</span>
                <span class="status-tag in-transit">In-transit (${delivery_stops.in_transit_list.length ?? 0})</span>
                <span class="status-tag delivered">Delivered (${delivery_stops.delivered_list.length ?? 0})</span>
            </div>
            <div class="status-columns">
                <div class="status-column pending-column">
                    ${render_status_cards(delivery_stops.pending_list, 'pending')}
                </div>
                <div class="status-column in-transit-column">
                    ${render_status_cards(delivery_stops.in_transit_list, 'in_transit')}
                </div>
                <div class="status-column delivered-column">
                    ${render_status_cards(delivery_stops.delivered_list, 'delivered')}
                </div>
            </div>
        </div>
    `;

    // Set the HTML inside the modal
    dialog.fields_dict.status_html.$wrapper.html(html_content);

    // Show the modal
    dialog.show();
}

// Render delivery status cards based on status
function render_status_cards(stops, status) {
    let html = '';
    stops.forEach(stop => {
        html += `
                <div class="delivery-card">
                    <div class="customer-info">
                        <h4>${stop?.customer ?? "-"}</h4>
                        <p class="customer_address">${stop?.customer_address ?? "-"}</p>
                        <p>${stop?.phone ?? "-"}</p>
                    </div>
                    <div class="status-info">
                        <span class="status-icon ${status.toLowerCase()}"></span>
                        <div class="delivery-timeline">
                            <span class="start-time">${stop.start_time || '00:00'}</span>
                            <span class="timeline">
                                <div class="moving-truck-icon">
                                    <img src="/assets/van_sale/assets/moving-truck-icon.svg" />
                                </div>
                            </span>
                            <span class="end-time">${stop.end_time || '00:00'}</span>
                        </div>
                    </div>
                </div>
            `;
    });
    return html;
}


function get_delivery_status_list(delivery_stops) {
    const pending_list = [];
    const in_transit_list = [];
    const delivered_list = [];

    delivery_stops.forEach(stop => {
        if (stop.visited) {
            delivered_list.push(stop);
        } else if (!stop.visited && stop.custom_in_transition) {
            in_transit_list.push(stop);
        } else {
            pending_list.push(stop);
        }
    });

    return { pending_list, in_transit_list, delivered_list };
}