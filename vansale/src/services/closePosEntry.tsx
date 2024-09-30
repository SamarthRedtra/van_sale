import axios from "axios";

const closePosEntry = async (delivery_trip_id: string, warehouse: string) => {
  const res = await axios({
    method: "POST",
    url: "/api/method/van_sale.api.delivery_trip.pos_close_entry",
    data: {
      delivery_trip_id: delivery_trip_id,
      warehouse: warehouse,
    },
  });

  return await res.data;
};

export default closePosEntry;
