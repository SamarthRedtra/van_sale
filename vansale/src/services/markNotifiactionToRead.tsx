import axios from "axios";

const markNotificationToRead = async (notification_id: string) => {
  const res = await axios({
    method: "POST",
    url: "/api/method/frappe.desk.doctype.notification_log.notification_log.mark_as_read",
    data: {
      docname: notification_id,
    },
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data;
};

export default markNotificationToRead;
