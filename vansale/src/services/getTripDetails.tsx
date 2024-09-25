const getDeliveryDetails = async () => {
  const res = await fetch(
    "https://api.frappe.io/api/method/frappe.client.get_list",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctype: "Delivery Trip",
        filters: {},
        fields: ["*"],
        limit_page_length: 100,
      }),
    }
  );
  const data = await res.json();
  return data;
};

export default getDeliveryDetails;
