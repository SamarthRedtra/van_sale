import axios from "axios";

const startDelivery = async (trip_name: string, stop_name: string) => {
  const res = await axios({
    method: "PUT",
    url: "/api/method/van_sale.api.delivery_trip.start_delivery",
    data: {
      trip_name,
      stop_name,
    },
  });

  return await res.data;
};

export default startDelivery;
