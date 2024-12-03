import axios from "axios";
const getPosProfiles= async () => {
  const res = await axios({
    method: "GET",
    url: "/api/method/van_sale.api.utils.get_pos_profile",
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data.message;
};

export default getPosProfiles;
