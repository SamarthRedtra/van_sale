import { useState } from "react";
import Header from "../Components/Header";
import DeliveryStopDetailCard from "../TripDetails/components/DeliveryStopDetailCard";
import LoadingOverlay from "../Loader/LoadingOverlay";
import NoCustomerFound from "../TripDetails/components/NoCustomerFound";
import { useFrappeGetDocList, useFrappeAuth } from "frappe-react-sdk";
import InvoiceDetailCard from "./Components/InvoiceComponent";

export default function PosInvoice() {
  const { currentUser } = useFrappeAuth();
  const [search, setSearch] = useState("");

  // Fetch POS-Invoice data using useFrappeGetDocList
  const { data, isLoading, error } = useFrappeGetDocList("POS Invoice", {
    fields: [
      "name",
      "grand_total",
      "currency",
      "customer",
      "posting_time",
      "status",
      "posting_date",
    ],
    filters: [["owner", "=", currentUser]], // Only fetch invoices for the current user
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  // Dynamic filtering
  const filteredInvoices = (data || []).filter((invoice) => {
    const searchTerm = search.toLowerCase();
    return (
      invoice.customer?.toLowerCase().includes(searchTerm) ||
      invoice.name?.toLowerCase().includes(searchTerm) ||
      invoice.currency?.toLowerCase().includes(searchTerm) ||
      (invoice.grand_total?.toString() || "").includes(searchTerm) ||
      (invoice.posting_date?.toLowerCase() || "").includes(searchTerm) ||
      (invoice.posting_time?.toLowerCase() || "").includes(searchTerm)
    );
  });

  return (
    <div className="mx-auto min-h-screen">
      <div className="bg-white shadow">
        <Header title="My POS Invoice" />
      </div>

      <div className="p-4">
        <div className="relative">
          <svg
            className="w-5 h-5 absolute left-3 top-3 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={search}
            type="text"
            placeholder="Search by name, customer, amount, or date"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            onChange={handleSearch}
          />
        </div>
        {isLoading && <LoadingOverlay />}
        {error && <p className="text-red-500">Error loading invoices.</p>}
        {!isLoading && !error && (
          <div className="mt-4 flex flex-col gap-4">
            {filteredInvoices.length ? (
              filteredInvoices.map((invoice) => (
                <InvoiceDetailCard
                  key={invoice.name}
                  invoice={{
                    ...invoice,
                    status: invoice.status || "Unknown", // Provide status dynamically
                  }}
                  isCTAAllowed={true} // Show the action button
                />
              ))
            ) : (
              <NoCustomerFound />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
