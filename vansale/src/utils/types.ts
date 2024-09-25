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
}
