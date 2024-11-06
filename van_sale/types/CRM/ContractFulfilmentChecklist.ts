
export interface ContractFulfilmentChecklist{
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
	/**	Fulfilled : Check	*/
	fulfilled?: 0 | 1
	/**	Requirement : Data	*/
	requirement?: string
	/**	Notes : Text	*/
	notes?: string
	/**	Amended From : Link - Contract Fulfilment Checklist	*/
	amended_from?: string
}