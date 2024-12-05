import { useState, useEffect } from "react";
import Header from "../Components/Header";
import LoadingOverlay from "../Loader/LoadingOverlay";
import NoCustomerFound from "../TripDetails/components/NoCustomerFound";
import { useFrappeGetDocList, useFrappeAuth } from "frappe-react-sdk";
import InvoiceDetailCard from "./Components/InvoiceComponent";
import Cookie from "js-cookie";
import getPosProfiles from "@/services/getPosProfiles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './invoice.css'
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select.tsx";

export default function ClosedInvoice() {
  const { currentUser } = useFrappeAuth();
  const posprofileFromCookie = Cookie.get("selectedPosProfile");
  const [search, setSearch] = useState("");
  const [posProfile, setPosProfile] = useState(posprofileFromCookie || ""); // Default to cookie value
  const [posProfiles, setPosProfiles] = useState([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const formattedSelectedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  const filtersDate = [["pos_profile", "=", posProfile],["posting_date", "=", `${formattedSelectedDate}`]];
  const filters = [["pos_profile", "=", posProfile]];

  const or_filters = [
    ["name", "like", `%${debouncedSearch}%`],
    ["grand_total", "like", `%${debouncedSearch}%`],
    ["user", "like", `%${debouncedSearch}%`],
    ["status", "like", `%${debouncedSearch}%`],
    

  ];
  // Fetch POS-Invoice data using useFrappeGetDocList
  const { data, isLoading: isLoadingInvoices, error } = useFrappeGetDocList("POS Closing Entry", {
    fields: [
      "*"
    ],
    filters: selectedDate ? filtersDate : filters,
    orFilters:or_filters,
    orderBy: { field: "posting_date", order: "desc" },
    limit: 30,
    });


  console.log(data)
  console.log(selectedDate)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);


  // Fetch POS Profiles
  const fetchProfiles = async () => {
    try {
      setIsLoadingProfiles(true);
      const profiles: any = await getPosProfiles(); // Replace with your service call
      setPosProfiles(profiles || []);
    } catch (error) {
      console.error("Error fetching POS profiles:", error);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handlePosProfileChange = (value: string) => {
    setPosProfile(value);
    //Cookie.set("selectedPosProfile", value); // Update the cookie with the new selection
  };




  return (
    <div className="mx-auto min-h-screen">
      <div className="bg-white shadow">
        <Header title="POS Closing" />
      </div>

      <div className="p-4">
        {/* POS Profile Selector */}
        <div className="mb-4">
          <label htmlFor="posProfile" className="block text-sm font-medium text-gray-700 font-bold">
            Select POS Profile
          </label>
          {isLoadingProfiles ? (
            <div className="text-gray-500">Loading POS profiles...</div>
          ) : (
            <Select
              onValueChange={(value) => {
                handlePosProfileChange(value);
              }}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left shadow-sm">
                <SelectValue placeholder="Select POS" className="font-bold" />
              </SelectTrigger>
              <SelectContent className="z-[9999] bg-white rounded-md shadow-lg">
                {posProfiles.map((profile) => (
                  <SelectItem key={profile.name} value={profile.name}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="mb-4">
  <label htmlFor="date" className="block text-sm font-medium text-gray-700 font-bold">
    Select Date
  </label>
  <div className="w-full">
    <DatePicker
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:border-indigo-500"
      placeholderText="Select a date"
    />
  </div>
</div>


        {/* Search Input */}
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
            placeholder="Search by name, company, grand total and user"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            onChange={handleSearch}
          />
        </div>

        {isLoadingInvoices && <LoadingOverlay />}
        {error && <p className="text-red-500">Error loading invoices.</p>}
        {!isLoadingInvoices && !error && (
          <div className="mt-4 flex flex-col gap-4">
            {data?.length ? (
              data?.map((invoice) => (
                <InvoiceDetailCard
                  key={invoice.name}
                  invoice={{
                    ...invoice,
                    posting_date: invoice.posting_date || "N/A", // Provide default value if date is invalid
                    posting_time: invoice.posting_time || "N/A", // Provide default value if time is invalid
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