import { useParams, useNavigate } from "react-router-dom";
import { useFrappeGetDoc } from "frappe-react-sdk";
import { format } from "date-fns";

export default function InvoiceDetails() {
  const { invoiceId } = useParams(); // Get the invoice ID from the URL
  const navigate = useNavigate();

  // Fetch invoice details using useFrappeGetDoc
  const { data: invoice, isLoading, error } = useFrappeGetDoc("POS Invoice", invoiceId);

  if (isLoading) {
    return <div className="p-4">Loading invoice details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Failed to load invoice details.</div>;
  }

  if (!invoice) {
    return <div className="p-4 text-gray-500">Invoice not found.</div>;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow p-4 rounded-lg mb-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">Invoice Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 text-sm font-semibold"
        >
          Back
        </button>
      </div>

      {/* Customer Details */}
      <div className="bg-white shadow p-4 rounded-lg mb-4">
        <h3 className="text-sm font-semibold text-gray-600">Customer</h3>
        <p className="text-lg font-bold">{invoice.customer || "-"}</p>
      </div>

      {/* Invoice Information */}
      <div className="bg-white shadow p-4 rounded-lg mb-4">
        <h3 className="text-sm font-semibold text-gray-600">Invoice Information</h3>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Invoice Number</span>
            <span className="font-medium">{invoice.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Date</span>
            <span className="font-medium">
              {invoice.posting_date
                ? format(new Date(invoice.posting_date), "dd MMM yyyy")
                : "-"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Time</span>
            <span className="font-medium">
              {invoice.posting_time
                ? format(new Date(`1970-01-01T${invoice.posting_time}Z`), "hh:mm a")
                : "--:--"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Status</span>
            <span
              className={`font-medium py-1 px-2 rounded-lg ${
                invoice.status.toLowerCase() === "paid"
                  ? "bg-green-100 text-green-800"
                  : invoice.status.toLowerCase() === "unpaid"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {invoice.status || "Unknown"}
            </span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white shadow p-4 rounded-lg mb-4">
        <h3 className="text-sm font-semibold text-gray-600">Items</h3>
        <div className="mt-2 space-y-4">
          {invoice.items?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-2 last:border-0"
            >
              <div>
                <p className="text-sm font-medium">{item.item_name}</p>
                <p className="text-xs text-gray-500">
                  {item.qty} × {item.rate.toFixed(2)}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {invoice.currency} {item.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Grand Total */}
      <div className="bg-white shadow p-4 rounded-lg">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>
            {invoice.currency} {invoice.grand_total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
