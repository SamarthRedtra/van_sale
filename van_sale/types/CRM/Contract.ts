import { ContractItems } from '../BoltDistribution/ContractItems'
import { ContractFulfilmentChecklist } from './ContractFulfilmentChecklist'

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
	custom_items?: ContractItems[]
	/**	Requires Fulfilment : Check	*/
	requires_fulfilment?: 0 | 1
	/**	Fulfilment Deadline : Date	*/
	fulfilment_deadline?: string
	/**	Fulfilment Terms : Table - Contract Fulfilment Checklist	*/
	fulfilment_terms?: ContractFulfilmentChecklist[]
	/**	Signee (Company) : Signature	*/
	signee_company?: any
	/**	Signed By (Company) : Link - User	*/
	signed_by_company?: string
	/**	Document Type : Select	*/
	document_type?: "" | "Quotation" | "Project" | "Sales Order" | "Purchase Order" | "Sales Invoice" | "Purchase Invoice"
	/**	Document Name : Dynamic Link	*/
	document_name?: string
	/**	Amended From : Link - Contract	*/
	amended_from?: string
}