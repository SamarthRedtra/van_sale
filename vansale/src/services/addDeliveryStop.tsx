import axios from "axios";

const addDeliveryStop = async ({
  delivery_trip,
  customer,
}: {
  delivery_trip: string;
  customer: string;
}) => {
  const res = await axios({
    method: "POST",
    url: "/api/method/van_sale.api.delivery_trip.add_to_delivery_trip",
    data: {
      delivery_trip: delivery_trip,
      customer: customer,
    },
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data;
};

export default addDeliveryStop;
