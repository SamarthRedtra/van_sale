import { useParams, useNavigate } from "react-router-dom";
import { useFrappeGetDoc } from "frappe-react-sdk";
import { format } from "date-fns";
import { Printer } from 'lucide-react';
import { ChevronLeftIcon } from "@radix-ui/react-icons";


export default function InvoiceDetails() {
  const { invoiceId } = useParams(); // Get the invoice ID from the URL
  const navigate = useNavigate();


  function sanitizePostingTime(postingTime: string | any) {
    if (!postingTime) return null;
  
    // Remove fractional seconds and split into parts
    const timeParts = postingTime.split(".")[0].split(":");
  
    // Ensure hours, minutes, and seconds are two digits
    for (let i = 0; i < timeParts.length; i++) {
      if (timeParts[i].length === 1) {
        timeParts[i] = `0${timeParts[i]}`;
      }
    }
  
    // If seconds are missing or incomplete, add a default value
    while (timeParts.length < 3) {
      timeParts.push("00"); // Add missing parts as "00"
    }
  
    return timeParts.join(":"); // Return sanitized time
  }

  

  const handlePrint = () => {
    window.location.href= `/printview?doctype=POS%20Invoice&name=${invoiceId}&trigger_print=1&format=POS Invoice&no_letterhead=0&letterhead=Bolt%20Header&settings=%7B%7D&_lang=en`
  }

  // Fetch invoice details using useFrappeGetDoc
  const { data: invoice, isLoading, error } = useFrappeGetDoc("POS Closing Entry", invoiceId);
  console.log(invoice)

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
      POS Closing
      {/* Header */}
      <div className="bg-white shadow p-4 rounded-lg mb-4 flex justify-between items-center">
      <div className="flex justify-between items-center p-4">
          <h1
            onClick={() =>
              navigate(`/vansale/closed-invoice/`)
            }
            className="text-xl font-bold flex gap-2 items-center select-none cursor-pointer"
          >
            <ChevronLeftIcon className="w-7 h-7 color-inherit text-black" />
            <span className="text-sm font-semibold">{invoice.name}</span> 
          </h1>
        </div>
        {/* <Printer className="w-6 h-6" onClick={handlePrint}/> */}


      </div>

      {/* Customer Details */}
      <div className="bg-white shadow p-4 rounded-lg mb-4">
        <h3 className="text-sm font-semibold text-gray-600">Customer</h3>
        <p className="text-lg font-bold">{invoice.user || "-"}</p>
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
            <span>POS Opening Entry</span>
            <span className="font-medium">{invoice.pos_opening_entry}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Posting Date</span>
            <span className="font-medium">
              {invoice.posting_date
                ? format(new Date(invoice.posting_date), "dd MMM yyyy")
                : "-"}
            </span>
          </div>
     
          <div className="flex justify-between text-sm">
            <span>Period Start Date</span>
            <span className="font-medium">
              {invoice.posting_date
                ? format(new Date(invoice.period_start_date), "dd MMM yyyy")
                : "-"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Period End Date</span>
            <span className="font-medium">
              {invoice.posting_date
                ? format(new Date(invoice.period_end_date), "dd MMM yyyy")
                : "-"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Posting Time</span>
            <span className="font-medium">
            {invoice?.posting_time
              ? format(
                  new Date(`1970-01-01T${sanitizePostingTime(invoice.posting_time)}Z`),
                  "hh:mm a"
                )
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

      <div className="bg-white shadow p-4 rounded-lg mb-4">
  <h3 className="text-sm font-semibold text-gray-600 mb-2">
    Modes of Payments
  </h3>
  <div className="space-y-4">
    {invoice?.payment_reconciliation?.map((item, index) => (
      <div
        key={index}
        className="bg-gray-50 shadow-md rounded-lg p-4"
      >
        {/* Section Header for Each Mode of Payment */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">
            {item.mode_of_payment}
          </h4>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              item.mode_of_payment === "Cash"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {item.mode_of_payment}
          </span>
        </div>

        {/* Payment Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Opening Amount</span>
            <span className="font-medium">{item.opening_amount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Expected Amount</span>
            <span className="font-medium">{item.expected_amount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Closing Amount</span>
            <span className="font-medium">{item.closing_amount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Difference</span>
            <span className="font-medium">{item.difference}</span>
          </div>
        </div>
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
