import axios from "axios";

const createSalesInvoice = async ({
  tripDetails,
  stopDetails,
  productItems,
  dueDate,
}: {
  tripDetails: any;
  stopDetails: any;
  productItems: any;
  dueDate: any;
}) => {
  try {
    const res = await axios({
      url: "/api/method/van_sale.api.delivery_trip.create_sales_invoice",
      method: "POST",
      data: JSON.stringify({
        trip_details: tripDetails,
        stop_details: stopDetails,
        product_items: productItems,
        due_date: dueDate,
      }),

      headers: {
        "Content-Type": "application/json",
        "x-frappe-csrf-token": window?.csrf_token ?? "",
      },
    });

    return await res.data;
  } catch (error) {
    console.error("API error:", error);
  }
};

export default createSalesInvoice;
