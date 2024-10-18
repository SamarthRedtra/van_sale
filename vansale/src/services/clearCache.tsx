import axios from "axios";

const clearCache = async (user: string) => {
  const res = await axios({
    url: "/api/method/van_sale.api.delivery_trip.clear_user_cache",
    method: "POST",
    data: {
      user: user,
    },
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data;
};

export default clearCache;
