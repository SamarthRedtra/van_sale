frappe.ui.form.on('Delivery Trip', {
    onload: function (frm) {
        setTimeout(() => {
            frm.remove_custom_button('Delivery Note', 'Get stops from');
        }, 10);
    },
    refresh: function (frm) {
        setTimeout(() => {
            frm.remove_custom_button('Delivery Note', 'Get stops from');
            window.show_pending_stops = show_pending_stops
            window.show_in_transit_stops = show_in_transit_stops
            window.show_delivered_stops = show_delivered_stops
            window.show_cancelled_stops = show_cancelled_stops
            window.show_all_stops = show_all_stops
        }, 10);

        if (frm.doc.docstatus === 1) {  // Check if the document is submitted
            frm.set_df_property('delivery_stops', 'cannot_delete_rows', true); // Hide delete button
            frm.set_df_property('delivery_stops', 'cannot_delete_all_rows', true); // Hide delete all button
        }

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
                    response?.message?.data?.forEach((element, index) => {
                        let stop = frm.add_child("delivery_stops");
                        frappe.model.set_value(stop.doctype, stop.name, {
                            "customer": element?.customer_name ?? "",
                            "custom_mobile_no": element?.mobile_number ?? "",
                            "customer_address": element?.location ?? "",
                            "contact": element?.contact_name ?? "",
                            "lat": element?.latitude ?? 0,
                            "lng": element?.longitude ?? 0,
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
        size: 'extra-large',
        fields: [
            {
                label: '',
                fieldname: 'status_html',
                fieldtype: 'HTML'
            }
        ]
    });

    // Get delivery status data (you might need to modify this based on actual delivery stop data)
    const delivery_stops = get_delivery_status_list(frm.doc?.delivery_stops || [], frm.doc);

    // Build the HTML structure for delivery status cards
    const html_content = `
        <div class="vansale_modal">
            <div class="vansale_status-filter">
                <button class="vansale_status-tag vansale_all vansale_active" data-btn_status="all" onclick="show_all_stops()">All (${delivery_stops.pending_list.length + delivery_stops.in_transit_list.length + delivery_stops.delivered_list.length + delivery_stops.cancelled_list.length})</button>
                <button class="vansale_status-tag vansale_pending" data-btn_status="pending" onclick="show_pending_stops()">Pending (${delivery_stops.pending_list.length})</button>
                <button class="vansale_status-tag vansale_in-transit" data-btn_status="in-transit" onclick="show_in_transit_stops()">In-transit (${delivery_stops.in_transit_list.length})</button>
                <button class="vansale_status-tag vansale_delivered" data-btn_status="delivered" onclick="show_delivered_stops()">Delivered (${delivery_stops.delivered_list.length})</button>
                <button class="vansale_status-tag vansale_cancelled" data-btn_status="cancelled" onclick="show_cancelled_stops()">Cancelled (${delivery_stops.cancelled_list.length})</button>
            </div>
            <div class="vansale_delivery-cards">
                ${render_status_cards(delivery_stops.pending_list, 'pending')}
                ${render_status_cards(delivery_stops.in_transit_list, 'in-transit')}
                ${render_status_cards(delivery_stops.delivered_list, 'delivered')}
                ${render_status_cards(delivery_stops.cancelled_list, 'cancelled')}
            </div>
        </div>
    `;

    // Set the HTML inside the modal
    dialog.fields_dict.status_html.$wrapper.html(html_content);

    // Show the modal
    dialog.show();
}


function show_all_stops() {
    // Show pending stops
    const get_pending_stops_list = $('[data-status="pending"]');

    if (get_pending_stops_list.length > 0) {
        get_pending_stops_list.each(function () {
            $(this).css("display", "block");
        });
    }

    // Show in-transit stops
    const get_in_transit_stops_list = $('[data-status="in-transit"]');

    if (get_in_transit_stops_list.length > 0) {
        get_in_transit_stops_list.each(function () {
            $(this).css("display", "block");
        });
    }

    // Show delivered stops
    const get_delivered_stops_list = $('[data-status="delivered"]');

    if (get_delivered_stops_list.length > 0) {
        get_delivered_stops_list.each(function () {
            $(this).css("display", "block");
        });
    }

    // Show cancelled stops
    const get_cancelled_stops_list = $('[data-status="cancelled"]');

    if (get_cancelled_stops_list.length > 0) {
        get_cancelled_stops_list.each(function () {
            $(this).css("display", "block");
        });
    }
}
function show_pending_stops() {
    // Show pending stops
    const get_pending_stops_list = $('[data-status="pending"]');

    if (get_pending_stops_list.length > 0) {
        get_pending_stops_list.each(function () {
            $(this).css("display", "block");
        });
    }

    // Hide in-transit stops
    const get_in_transit_stops_list = $('[data-status="in-transit"]');

    if (get_in_transit_stops_list.length > 0) {
        get_in_transit_stops_list.each(function () {
            $(this).css("display", "none");
        });
    }

    // Hide delivered stops
    const get_delivered_stops_list = $('[data-status="delivered"]');

    if (get_delivered_stops_list.length > 0) {
        get_delivered_stops_list.each(function () {
            $(this).css("display", "none");
        });
    }

    // Hide cancelled stops
    const get_cancelled_stops_list = $('[data-status="cancelled"]');

    if (get_cancelled_stops_list.length > 0) {
        get_cancelled_stops_list.each(function () {
            $(this).css("display", "none");
        });
    }
}


function show_in_transit_stops() {
    // Hide pending stops
    const get_pending_stops_list = $('[data-status="pending"]');

    if (get_pending_stops_list.length > 0) {
        get_pending_stops_list.each(function () {
            $(this).css("display", "none");
        });
    }

    // Show in-transit stops
    const get_in_transit_stops_list = $('[data-status="in-transit"]');

    if (get_in_transit_stops_list.length > 0) {
        get_in_transit_stops_list.each(function () {
            $(this).css("display", "block");
        });
    }

    // Hide delivered stops
    const get_delivered_stops_list = $('[data-status="delivered"]');

    if (get_delivered_stops_list.length > 0) {
        get_delivered_stops_list.each(function () {
            $(this).css("display", "none");
        });
    }

    // Hide cancelled stops
    const get_cancelled_stops_list = $('[data-status="cancelled"]');

    if (get_cancelled_stops_list.length > 0) {
        get_cancelled_stops_list.each(function () {
            $(this).css("display", "none");
        });
    }
}

function show_delivered_stops() {
    // Hide pending stops
    const get_pending_stops_list = $('[data-status="pending"]');

    if (get_pending_stops_list.length > 0) {
        get_pending_stops_list.each(function () {
            $(this).css("display", "none");
        });
    }

    // Hide in-transit stops
    const get_in_transit_stops_list = $('[data-status="in-transit"]');

    if (get_in_transit_stops_list.length > 0) {
        get_in_transit_stops_list.each(function () {
            $(this).css("display", "none");
        });
    }

    // Show delivered stops
    const get_delivered_stops_list = $('[data-status="delivered"]');

    if (get_delivered_stops_list.length > 0) {
        get_delivered_stops_list.each(function () {
            $(this).css("display", "block");
        });
    }

    // Hide cancelled stops
    const get_cancelled_stops_list = $('[data-status="cancelled"]');

    if (get_cancelled_stops_list.length > 0) {
        get_cancelled_stops_list.each(function () {
            $(this).css("display", "none");
        });
    }
}

function show_cancelled_stops() {
    // Hide pending stops
    const get_pending_stops_list = $('[data-status="pending"]');

    if (get_pending_stops_list.length > 0) {
        get_pending_stops_list.each(function () {
            $(this).css("display", "none");
        });
    }

    // Hide in-transit stops
    const get_in_transit_stops_list = $('[data-status="in-transit"]');

    if (get_in_transit_stops_list.length > 0) {
        get_in_transit_stops_list.each(function () {
            $(this).css("display", "none");
        });
    }

    // Hide delivered stops
    const get_delivered_stops_list = $('[data-status="delivered"]');

    if (get_delivered_stops_list.length > 0) {
        get_delivered_stops_list.each(function () {
            $(this).css("display", "none");
        });
    }

    // Show cancelled stops
    const get_cancelled_stops_list = $('[data-status="cancelled"]');

    if (get_cancelled_stops_list.length > 0) {
        get_cancelled_stops_list.each(function () {
            $(this).css("display", "block");
        });
    }
}


// Render delivery status cards based on status
function render_status_cards(stops, status) {
    let html = '';
    stops.forEach(stop => {
        html += `
            <div class="vansale_delivery-card" data-status="${status}">
                <div class="vansale_customer-info">
                    <h4>${stop.customer || '-'}</h4>
                    <p class="vansale_customer-address">${stop.customer_address || '-'}</p>
                    <p>${stop.phone || '-'}</p>
                </div>
                <div class="vansale_status-info">
                    <span class="vansale_status-icon vansale_${status}"></span>
                    <span>${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </div>
                <div class="vansale_delivery-timeline">
                    <span class="vansale_start-time">${stop.start_time || '00:00'}</span>
                    <span class="vansale_timeline">
                        <img src="/assets/van_sale/assets/moving-truck-icon.svg" class="vansale_moving-truck-icon" alt="Truck">
                    </span>
                    <span class="vansale_end-time">${stop.end_time || '00:00'}</span>
                </div>
            </div>
        `;
    });
    return html;
}


function get_delivery_status_list(delivery_stops, doc) {
    const pending_list = [];
    const in_transit_list = [];
    const delivered_list = [];
    const cancelled_list = [];

    delivery_stops.forEach(stop => {
        if (stop.visited) {
            delivered_list.push(stop);
        } else if (doc?.status && doc.status === "Partially Completed" && !stop.visited) {
            cancelled_list.push(stop);
        } else if (!stop.visited && stop.custom_in_transition) {
            in_transit_list.push(stop);
        } else {
            pending_list.push(stop);
        }
    });

    return { pending_list, in_transit_list, delivered_list, cancelled_list };
}
