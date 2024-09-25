import { useFrappeGetDoc } from "frappe-react-sdk";
import { useParams } from "react-router-dom";
import DeliveryStopDetailCard from "./components/DeliveryStopDetailCard";
import { Key } from "react";
import { DeliveryStop, DeliveryTripDetails } from "../../utils/types";
import LoadingOverlay from "../Loader/LoadingOverlay";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export default function TripDetails() {
  const params = useParams();
  const { data, isLoading } = useFrappeGetDoc<DeliveryTripDetails>(
    "Delivery Trip",
    params?.trip_id
  );

  return (
    <div className="mx-auto min-h-screen">
      <div className="bg-white shadow">
        <div className="flex justify-between items-center p-4">
          <h1
            onClick={() => window.history.back()}
            className="text-xl font-bold flex gap-2 items-center justify-center select-none cursor-pointer"
          >
            <ChevronLeftIcon className="w-7 h-7" />
            <span>My Trips</span>
          </h1>
        </div>
        <div className="bg-purple-500 p-4">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">My Planned Trips</span>
            <button className="bg-white text-purple-500 px-3 py-1 rounded-full text-sm">
              Today
            </button>
          </div>
        </div>
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
            type="text"
            placeholder="Type here to search"
            className="w-full pl-10 pr-4 py-2 border rounded-full"
          />
        </div>
        {isLoading && <LoadingOverlay />}
        {!isLoading && (
          <div className="mt-4 flex flex-col gap-4">
            {data?.delivery_stops &&
              data?.delivery_stops.length > 0 &&
              data?.delivery_stops?.map(
                (stop: DeliveryStop, index: Key | null | undefined) => (
                  <DeliveryStopDetailCard
                    key={index}
                    stop={stop}
                    isCTAAllowed
                  />
                )
              )}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-4"></div>
      </div>
    </div>
  );
}
