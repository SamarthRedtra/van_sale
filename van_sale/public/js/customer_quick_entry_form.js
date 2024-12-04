frappe.provide("frappe.ui.form");



frappe.ui.toolbar.add_button_to_navbar = function () {
	const backButtonHtml = `<li class="nav-item">
	<a 
	  class="nav-link bg-blue-500 hover:bg-blue-600 text-black font-medium rounded px-3 py-2 shadow flex items-center" 
	  href="/vansale" 
	  title="Back to VanSale"
	  style="margin-right: 10px; display: flex; align-items: center; gap: 5px;"
	>
	  ${frappe.utils.icon('arrow-left', 'md')}
	  <span> Back </span>
	</a>
  </li>
`;
	// Add the button to the Navbar
	$('header.navbar > .container > .navbar-collapse > ul').prepend(backButtonHtml);
  }
  
  // Execute the function
frappe.ui.toolbar.add_button_to_navbar();
console.log(frappe.ui.toolbar.add_button_to_navbar()
,"executed");
setTimeout(() => {
	if(frappe.is_mobile()){
		frappe.ui.toolbar.add_button_to_navbar();
	}
},500)


frappe.ui.form.CustomerQuickEntryForm = class CustomerQuickEntryForm extends (
	frappe.ui.form.QuickEntryForm
) {
	constructor(doctype, after_insert, init_callback, doc, force) {
		super(doctype, after_insert, init_callback, doc, force);
		this.skip_redirect_on_error = true;
	}

	render_dialog() {
		this.mandatory = this.mandatory.concat(this.get_variant_fields());
		super.render_dialog();

		// Add event listeners to update the customer name
		this.dialog.fields_dict.first_name.$input.on('change', () => this.update_customer_name());
		this.dialog.fields_dict.last_name.$input.on('change', () => this.update_customer_name());
	}

	insert() {
		const map_field_names = {
			email_address: "email_id",
			mobile_number: "mobile_no",
		};

		Object.entries(map_field_names).forEach(([fieldname, new_fieldname]) => {
			this.dialog.doc[new_fieldname] = this.dialog.doc[fieldname];
			delete this.dialog.doc[fieldname];
		});

		return super.insert();
	}

	get_variant_fields() {
		var variant_fields = [

			{
				fieldtype: "Section Break",
				label: __("Primary Contact Details"),
				collapsible: 1,
			},
			{
				label: __("Email Id"),
				fieldname: "email_address",
				fieldtype: "Data",
				options: "Email"
			},
			{
				label: __("Mobile Number"),
				fieldname: "mobile_number",
				fieldtype: "Phone",
			},
			{
				fieldtype: "Section Break",
				label: __("Primary Address Details"),
				collapsible: 1,
			},
			{
				label: __("Address Line 1"),
				fieldname: "address_line1",
				fieldtype: "Data",
				
			},
			{
				label: __("Latitude"),
				fieldname: "custom_latitude",
				fieldtype: "Float",
				
			},
			{
				label: __("Address Line 2"),
				fieldname: "address_line2",
				fieldtype: "Data",
			},
			{
				label: __("Postal Code"),
				fieldname: "pincode",
				fieldtype: "Data",
			},
			{
				fieldtype: "Column Break",
			},
			{
				label: __("City"),
				fieldname: "city",
				fieldtype: "Data",
			},
			{
				label: __("Longitude"),
				fieldname: "custom_longitude",
				fieldtype: "Float",
				
			},
			{
				label: __("State"),
				fieldname: "state",
				fieldtype: "Data",
			},
			{
				label: __("Country"),
				fieldname: "country",
				fieldtype: "Link",
				options: "Country",
			
			},
			{
				label: __("Customer POS Id"),
				fieldname: "customer_pos_id",
				fieldtype: "Data",
				hidden: 1,
			},
		];

		return variant_fields;
	}

	update_customer_name() {
		const first_name = this.dialog.fields_dict.first_name.get_value();
		const last_name = this.dialog.fields_dict.last_name.get_value();
		const customer_name = `${first_name} ${last_name}`.trim();

		this.dialog.fields_dict.customer_name.set_value(customer_name);
	}
};
