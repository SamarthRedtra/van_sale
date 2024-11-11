import { CreateCustomerPayload } from "@/utils/types";
import axios from "axios";

const createCustomer = async (payload: CreateCustomerPayload) => {
  const res = await axios({
    method: "POST",
    url: "/api/method/van_sale.api.create_customer.create_customer",
    data: { payload },
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data;
};

export default createCustomer;
