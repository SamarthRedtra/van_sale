import axios from "axios";
import clearCache from "./clearCache";
import Cookie from "js-cookie";

const logout = async (currentUser: string) => {
  const res = await axios({
    url: "/api/method/logout",
    method: "POST",
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  if (res.status === 200) {
    await clearCache(currentUser);
    Cookie.remove("selectedPosProfile");

  }

  return await res.data;
};

export default logout;
