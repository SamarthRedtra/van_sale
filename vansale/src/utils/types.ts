// Delivery Trip Types
export interface DeliveryTripDetails {
  name: string;
  owner: string;
  creation: Date;
  modified: Date;
  modified_by: string;
  docstatus: number;
  idx: number;
  naming_series: string;
  company: string;
  custom_route: string;
  custom_pos_closing_entry?: string;
  custom_pos_closing_entry_link: string;
  email_notification_sent: number;
  driver: string;
  driver_name: string;
  driver_email: string;
  total_distance: number;
  vehicle: string;
  custom_warehouse: string;
  departure_time: string;
  employee: string;
  custom_user: string;
  status: string;
  doctype: string;
  custom_pos_profile?: string;
  delivery_stops: DeliveryStop[];
}

export interface DeliveryStop {
  name: string;
  owner: string;
  creation: Date;
  modified: Date;
  modified_by: string;
  docstatus: number;
  idx: number;
  customer: string;
  address: string;
  locked: number;
  customer_address: string;
  visited: number;
  custom_in_transition: number;
  grand_total: number;
  contact: string;
  customer_contact: string;
  custom_mobile_no?: string;
  distance: number;
  lat: number;
  lng: number;
  custom_pos_invoice: string;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
  custom_is_credit: number;
  custom_is_paid: number;
  custom_sales_invoice?: string;
  custom_start_timing?: string;
  custom_end_timing?: string;
  is_cancelled?: boolean;
  departure_time?: string;
}

// POS Invoice Types

export interface POSInvoice {
  name: string;
  owner: string;
  creation: Date;
  modified: Date;
  modified_by: string;
  docstatus: number;
  idx: number;
  title: string;
  naming_series: string;
  customer: string;
  customer_name: string;
  pos_profile: string;
  consolidated_invoice: string;
  is_pos: number;
  is_return: number;
  update_billed_amount_in_sales_order: number;
  update_billed_amount_in_delivery_note: number;
  company: string;
  posting_date: Date;
  posting_time: string;
  set_posting_time: number;
  due_date: string;
  customer_address: string;
  address_display: string;
  currency: string;
  conversion_rate: number;
  selling_price_list: string;
  price_list_currency: string;
  plc_conversion_rate: number;
  ignore_pricing_rule: number;
  set_warehouse: string;
  update_stock: number;
  total_billing_amount: number;
  total_qty: number;
  base_total: number;
  base_net_total: number;
  total: number;
  net_total: number;
  total_net_weight: number;
  taxes_and_charges: string;
  tax_category: string;
  base_total_taxes_and_charges: number;
  total_taxes_and_charges: number;
  loyalty_points: number;
  loyalty_amount: number;
  redeem_loyalty_points: number;
  apply_discount_on: string;
  base_discount_amount: number;
  additional_discount_percentage: number;
  discount_amount: number;
  base_grand_total: number;
  base_rounding_adjustment: number;
  base_rounded_total: number;
  base_in_words: string;
  grand_total: number;
  rounding_adjustment: number;
  rounded_total: number;
  in_words: string;
  total_advance: number;
  outstanding_amount: number;
  allocate_advances_automatically: number;
  base_paid_amount: number;
  paid_amount: number;
  base_change_amount: number;
  change_amount: number;
  account_for_change_amount: string;
  write_off_amount: number;
  base_write_off_amount: number;
  write_off_outstanding_amount_automatically: number;
  write_off_account: string;
  write_off_cost_center: string;
  group_same_items: number;
  language: string;
  is_discounted: number;
  status: string;
  debit_to: string;
  party_account_currency: string;
  is_opening: string;
  remarks: string;
  amount_eligible_for_commission: number;
  commission_rate: number;
  total_commission: number;
  doctype: string;
  pricing_rules: any[];
  payments: Payment[];
  packed_items: any[];
  items: Item[];
  timesheets: any[];
  payment_schedule: any[];
  sales_team: any[];
  taxes: any[];
  advances: any[];
}

export interface Item {
  name: string;
  owner: string;
  creation: Date;
  modified: Date;
  modified_by: string;
  docstatus: number;
  idx: number;
  has_item_scanned: number;
  item_code: string;
  item_name: string;
  description: string;
  item_group: string;
  image: string;
  qty: number;
  stock_uom: string;
  uom: string;
  conversion_factor: number;
  stock_qty: number;
  price_list_rate: number;
  base_price_list_rate: number;
  margin_type: string;
  margin_rate_or_amount: number;
  rate_with_margin: number;
  discount_percentage: number;
  discount_amount: number;
  base_rate_with_margin: number;
  rate: number;
  amount: number;
  base_rate: number;
  base_amount: number;
  pricing_rules: string;
  is_free_item: number;
  grant_commission: number;
  net_rate: number;
  net_amount: number;
  base_net_rate: number;
  base_net_amount: number;
  delivered_by_supplier: number;
  income_account: string;
  is_fixed_asset: number;
  expense_account: string;
  enable_deferred_revenue: number;
  weight_per_unit: number;
  total_weight: number;
  warehouse: string;
  use_serial_batch_fields: number;
  allow_zero_valuation_rate: number;
  item_tax_rate: string;
  actual_batch_qty: number;
  actual_qty: number;
  delivered_qty: number;
  cost_center: string;
  page_break: number;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
}

export interface Payment {
  name: string;
  owner: string;
  creation: Date;
  modified: Date;
  modified_by: string;
  docstatus: number;
  idx: number;
  default: number;
  mode_of_payment: string;
  amount: number;
  account: string;
  type: string;
  base_amount: number;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
}

// Delivery Trip Types

export interface IProductItem {
  message: Message;
}

export interface Message {
  items: PItem[];
}

export interface PItem {
  item_code: string;
  item_name: string;
  description: string;
  stock_uom: string;
  item_image: null;
  is_stock_item: number;
  actual_qty: number;
  uom: string;
  price_list_rate?: number;
  currency?: string;
  batch_no?: null;
}


export interface Contract{
	name: string
	creation: string
	modified: string
	owner: string
	modified_by: string
	docstatus: 0 | 1 | 2
	parent?: string
	parentfield?: string
	parenttype?: string
	idx?: number
	/**	Party Type : Select	*/
	party_type: "Customer" | "Supplier" | "Employee"
	/**	Signed : Check	*/
	is_signed?: 0 | 1
	/**	Contract Type : Select	*/
	custom_contract_type: "Only Service" | "Service with Compressor" | "Compressor with Spares"
	/**	Party Name : Dynamic Link	*/
	party_name: string
	/**	Party User : Link - User	*/
	party_user?: string
	/**	Status : Select	*/
	status?: "Unsigned" | "Active" | "Inactive"
	/**	Fulfilment Status : Select	*/
	fulfilment_status?: "N/A" | "Unfulfilled" | "Partially Fulfilled" | "Fulfilled" | "Lapsed"
	/**	Start Date : Date	*/
	start_date?: string
	/**	End Date : Date	*/
	end_date?: string
	/**	Signee : Data	*/
	signee?: string
	/**	Signed On : Datetime	*/
	signed_on?: string
	/**	IP Address : Data	*/
	ip_address?: string
	/**	Contract Template : Link - Contract Template	*/
	contract_template?: string
	/**	Contract Terms : Text Editor	*/
	contract_terms: string
	/**	Items : Table - Contract Items	*/
	custom_items?: [];
	/**	Requires Fulfilment : Check	*/
	requires_fulfilment?: 0 | 1
	/**	Fulfilment Deadline : Date	*/
	fulfilment_deadline?: string
	/**	Fulfilment Terms : Table - Contract Fulfilment Checklist	*/
	fulfilment_terms?: [];
	/**	Signee (Company) : Signature	*/
	signee_company?: any;
	/**	Signed By (Company) : Link - User	*/
	signed_by_company?: string
	/**	Document Type : Select	*/
	document_type?: "" | "Quotation" | "Project" | "Sales Order" | "Purchase Order" | "Sales Invoice" | "Purchase Invoice"
	/**	Document Name : Dynamic Link	*/
	document_name?: string
	/**	Amended From : Link - Contract	*/
	amended_from?: string
}