import axios from "axios";

const getCancelledStopList = async () => {
  const res = await axios({
    method: "GET",
    url: "/api/method/van_sale.api.delivery_trip.get_cancelled_stops",
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data;
};

export default getCancelledStopList;
