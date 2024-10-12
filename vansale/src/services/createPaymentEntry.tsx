import axios from "axios";

const createPaymentEntry = async (
  delivery_stop_id: string,
  sales_invoice_id: string
) => {
  const res = await axios({
    method: "POST",
    url: "/api/method/van_sale.api.create_payment_entry.create_payment_entry",
    data: {
      delivery_stop: delivery_stop_id,
      sales_invoice: sales_invoice_id,
    },
  });

  return await res.data;
};

export default createPaymentEntry;
