import axios from "axios";

const closeDeliveryTrip = async (delivery_trip: string) => {
  const res = await axios({
    method: "POST",
    url: "/api/method/van_sale.api.delivery_trip.close_in_transit_delivery_trip",
    data: {
      delivery_trip: delivery_trip,
    },
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data;
};

export default closeDeliveryTrip;
