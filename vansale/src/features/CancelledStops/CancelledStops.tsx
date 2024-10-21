import { useEffect, useState } from "react";
import Header from "../Components/Header";
import { DeliveryStop } from "@/utils/types";
import DeliveryStopDetailCard from "../TripDetails/components/DeliveryStopDetailCard";
import LoadingOverlay from "../Loader/LoadingOverlay";
import NoCustomerFound from "../TripDetails/components/NoCustomerFound";
import getCancelledStopList from "@/services/getCancelledStopList";

export default function CancelledStops() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deliveredStops, setDeliveryStops] = useState<DeliveryStop[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await getCancelledStopList();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        res && setDeliveryStops(res?.message?.delivery_stops ?? []);
      } catch (err) {
        console.error(
          "ERROR IN getCancelledStopList :- ",
          JSON.stringify(err, null, 2)
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredStops = deliveredStops.filter((stop) => {
    return (
      stop?.customer?.toLowerCase().includes(search.toLowerCase()) ||
      stop?.parent?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="mx-auto min-h-screen">
      <div className="bg-white shadow">
        <Header title="Cancelled Stops" />
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
            placeholder="Type here to search"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            onChange={handleSearch}
          />
        </div>
        {isLoading && <LoadingOverlay />}
        {!isLoading && (
          <div className="mt-4 flex flex-col gap-4">
            {filteredStops.length ? (
              filteredStops.map((item, index) => (
                <DeliveryStopDetailCard
                  key={index}
                  stop={item}
                  isCTAAllowed
                  showStopName
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
