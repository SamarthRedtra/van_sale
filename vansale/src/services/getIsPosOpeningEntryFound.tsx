import axios from "axios";

const getIsPosOpeningEntryFound = async (warehouse: string) => {
  const res = await axios({
    method: "GET",
    url:
      "/api/method/van_sale.api.delivery_trip.is_pos_opening_entry_found?warehouse=" +
      warehouse,
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });
  
  return await res.data;
};

export default getIsPosOpeningEntryFound;
