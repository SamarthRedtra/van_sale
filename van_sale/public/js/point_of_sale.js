frappe.provide("erpnext.PointOfSale");

frappe.pages["point-of-sale"].refresh = function (wrapper) {
    setTimeout(async () => {
        const inputField = cur_dialog?.$wrapper.find?.('input[data-fieldname="pos_profile"]');

        if (!inputField?.length) {
            return;
        }
        const urlParams = new URLSearchParams(window.location.search);
        const POSProfile = urlParams.get('pos_profile');

        if (POSProfile) {
            inputField[0].value = POSProfile;
            inputField[0].dispatchEvent(new Event('change'));
        }

        $('.standard-actions .btn-primary').on('click', () => {
            setTimeout(() => {
                window.location.reload();
            }, 1000)
        });
    }, 2000);

    setTimeout(() => {
        const customer_section = $(".customer-field")

        const customerInputField = customer_section.find('input[data-target="Customer"]')

        if (!customerInputField?.length) {
            return;
        }
        const urlParams = new URLSearchParams(window.location.search);
        const customerName = urlParams.get('customer_name');

        if (customerName) {
            customerInputField[0].value = customerName;
            customerInputField[0].dispatchEvent(new Event('change'));
        }
    }, 2000);

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
