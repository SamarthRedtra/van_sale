frappe.provide("erpnext.PointOfSale");

frappe.ui.form.on('POS Invoice', {
    set_warehouse: function (frm) {
        if (!frm?.doc?.set_warehouse) {
            // Get the 'pos_profile' query parameter from the URL
            const posProfile = new URLSearchParams(window.location.search).get("pos_profile");

            // if (!posProfile) {
            //     return;
            // }

            frappe.call({
                method: "frappe.client.get",
                args: {
                    doctype: "POS Profile",
                    name: posProfile || window?.cur_pos?.pos_profile // Replace with the actual profile name or ID
                },
                callback: function (data) {
                    if (data?.message) {
                        // Prefill the fields in POS entry with the fetched data
                        frm.set_value("set_warehouse", data.message.warehouse);
                        frm.refresh_field("set_warehouse");
                    }
                }
            })
        }
    }
});


function applyStyling() {
    const filterContainer = $(".point-of-sale-app .items-selector .filter-section");

    if (filterContainer.length) {
        filterContainer.css("grid-template-columns", "repeat(1, minmax(0, 1fr))");

        const itemCodeSearchField = filterContainer.find('.search-field');
        if (itemCodeSearchField.length) {
            itemCodeSearchField.css("margin", "0");
        }
    }

    const productCardContainers = $(".items-container .item-wrapper");

    if (productCardContainers.length) {
        productCardContainers.each(function () {
            const image = $(this).find('.item-display.abbr');
            if (image.length) {
                image.css({
                    "min-height": "5rem",
                    "height": "5rem",
                });
            }
        });
    }
}

frappe.pages["point-of-sale"].refresh = function (wrapper) {
    setTimeout(async () => {
        if (!window?.frappe.is_mobile()) return

        const inputField = cur_dialog?.$wrapper.find?.('input[data-fieldname="pos_profile"]');

        if (!inputField?.length) return;

        const urlParams = new URLSearchParams(window.location.search);
        const POSProfile = urlParams.get('pos_profile');

        if (POSProfile && inputField?.length ) {
            inputField[0].value = POSProfile;
            inputField[0].dispatchEvent(new Event('change'));
        }

        $('.standard-actions .btn-primary').on('click', () => {
            setTimeout(() => {
                window.location.reload();
                applyStyling();
            }, 1900)
        });
    }, 1800);

    setTimeout(() => {
        if (!window?.frappe.is_mobile()) return

        setTimeout(() => {
            applyStyling();
        }, 2000);

        const customer_section = $(".customer-field")
        const customerInputField = customer_section?.find('input[data-target="Customer"]')

        if (customerInputField?.length) {
            const urlParams = new URLSearchParams(window.location.search);
            const customerName = urlParams.get('customer_name');

            if (customerName) {
                customerInputField[0].value = customerName;
                customerInputField[0].dispatchEvent(new Event('change'));
            }
        }
    }, 1500);

    setTimeout(() => {
        const frappeAwesomeBar =
            document?.body?.getElementsByClassName('search-bar')?.[0]

        if (frappeAwesomeBar) {
            frappeAwesomeBar.remove()
        }
    }, 50)

    // Set up a MutationObserver to detect when the button is added to the DOM
    const observer = new MutationObserver(function (mutationsList) {
        mutationsList.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                // Check if the button with the class 'summary-btn new-btn' exists
                const button = $('.summary-btn.new-btn');
                if (button.length) {
                    // Remove the original button
                    button.remove();

                    // Create your new button
                    const newButton = $('<div class="vansale-start-new-stop btn new-btn">Start New Stop</div>');

                    // Append the new button to the .abs-container .summary-btns element
                    const summary_btn = $('.abs-container .summary-btns');
                    if (summary_btn.length) {
                        summary_btn.append(newButton);
                    } else {
                        console.log('Summary button container not found.');
                    }

                    // Add an event listener for the new button
                    newButton.on('click', function (event) {
                        event.preventDefault();

                        redirect_url = '/vansale';

                        // Get query parameters from the current URL
                        const urlParams = new URLSearchParams(window.location.search);
                        const tripId = urlParams.get('trip_id');

                        if (tripId) {
                            redirect_url += `/delivery-trip/${tripId}`;
                        }

                        window.location.href = redirect_url;
                    });

                    // Disconnect the observer once the button is replaced
                    observer.disconnect();
                }
            }
        });
    });

    // Observe changes in the DOM where the button could be added (typically the wrapper or a specific container)
    observer.observe(wrapper, {
        childList: true,
        subtree: true,
    });
}
