import axios from "axios";

interface ItemListPayload {
  pos_profile: string;
  search_term?: string;
  price_list?: string;
  item_group?: string;
  start?: number;
  page_length?: number;
}

const getItemList = async ({
  start,
  page_length,
  price_list,
  item_group,
  search_term,
  pos_profile,
}: ItemListPayload) => {
  const payload = {
    start: start || 0,
    page_length: page_length || 10,
    price_list: price_list || "Standard Selling",
    item_group: item_group || "All Item Groups",
    search_term: search_term || "",
    pos_profile: pos_profile,
  };

  const res = await axios({
    method: "POST",
    url: "/api/method/erpnext.selling.page.point_of_sale.point_of_sale.get_items",
    data: payload,
    headers: {
      "x-frappe-csrf-token": window?.csrf_token ?? "",
    },
  });

  return await res.data;
};

export default getItemList;
