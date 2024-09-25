import axios from "axios";

const getDeliveryDetails = async () => {
  const res = await axios.get(
    "/api/method/van_sale.api.delivery_trip.get_all_delivery_trips"
  );

  return await res.data;
};

export default getDeliveryDetails;
