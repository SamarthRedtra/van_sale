import axios from "axios";

const getCityMasterList = async () => {
  const res = await axios({
    method: "GET",
    url: "/api/resource/City Master?limit=0",
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data;
};

export default getCityMasterList;
