import axios from "axios";

const getIsPosOpeningEntryFound = async (delivery_trip_id: string) => {
  const res = await axios({
    method: "GET",
    url:
      "/api/method/van_sale.api.delivery_trip.is_pos_opening_entry_found?delivery_trip_id=" +
      delivery_trip_id,
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data;
};

export default getIsPosOpeningEntryFound;
