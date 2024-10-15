import axios from "axios";

const getPaymentPendingStopList = async () => {
  const res = await axios({
    method: "GET",
    url: "/api/method/van_sale.api.delivery_trip.get_pending_payment_stops",
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data;
};

export default getPaymentPendingStopList;
