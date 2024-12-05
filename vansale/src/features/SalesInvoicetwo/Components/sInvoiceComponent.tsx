import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ClockIcon } from "@radix-ui/react-icons";
import {
  Bell,
  BellDot,
  HandCoins,
  LogOut,
  Menu,
  Receipt,
  House,
  Truck,
  Ban,
  Printer
} from "lucide-react";

interface InvoiceDetailCardProps {
  invoice: {
    name: string;
    customer: string;
    grand_total: number;
    currency: string;
    posting_date: string;
    posting_time: string;
    status: string; // Added status field
  };
  isCTAAllowed?: boolean;
}

export default function InvoiceDetailCard({
  invoice,
  isCTAAllowed = false,
}: InvoiceDetailCardProps) {
  const navigate = useNavigate();

  const handleClick = (invoiceId: string) => {
    navigate(`/vansale/s-invoice/${invoiceId}`);
  };

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

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "overdue":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border border-gray-200 p-2 rounded-t-md flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h2 className="font-semibold text-lg">{invoice.customer || "-"}</h2>
            <p className="text-sm text-gray-500">{invoice.name || "-"}</p>
  
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">
              {invoice.currency} {invoice.grand_total.toFixed(2)}
            </p>
            <span
              className={`text-xs py-1 px-2 rounded-lg font-bold ${getStatusClass(
                invoice.status
              )}`}
            >
              {invoice.status || "Unknown"}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <p>
            <ClockIcon />{" "}
            {invoice.posting_date
              ? format(new Date(invoice.posting_date), "dd MMM yyyy")
              : "-"}
          </p>
          <p>
          {invoice?.posting_time
              ? format(
                  new Date(`1970-01-01T${sanitizePostingTime(invoice.posting_time)}Z`),
                  "hh:mm a"
                )
              : "--:--"}
          </p>
        </div>
      </div>
      {isCTAAllowed && (
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={() => handleClick(invoice.name)}
            className="bg-blue-600 text-white py-1 px-3 text-sm font-semibold rounded-lg"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
}
