import axios from "axios";

const getCountryMasterList = async () => {
  const res = await axios({
    method: "GET",
    url: "/api/resource/Country?limit=0",
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data;
};

export default getCountryMasterList;
