import axios from "axios";

const getCustomerList = async () => {
  const res = await axios({
    method: "GET",
    url: "/api/resource/Customer?limit=0",
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data;
};

export default getCustomerList;
