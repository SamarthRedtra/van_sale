import axios from "axios";
import clearCache from "./clearCache";

const logout = async (currentUser: string) => {
  const res = await axios.post("/api/method/logout");

  if (res.status === 200) {
    await clearCache(currentUser);
  }

  return await res.data;
};

export default logout;
