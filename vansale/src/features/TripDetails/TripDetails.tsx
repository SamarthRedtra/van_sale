import { useFrappeGetDoc } from "frappe-react-sdk";
import { useParams } from "react-router-dom";
import DeliveryStopDetailCard from "./components/DeliveryStopDetailCard";
import React, {Key, useMemo, useState} from "react";
import { DeliveryStop, DeliveryTripDetails } from "../../utils/types";
import LoadingOverlay from "../Loader/LoadingOverlay";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import NoCustomerFound from "./components/NoCustomerFound.tsx";
import {formatDate} from "../../utils/formatDate.ts";

export default function TripDetails() {
  const [selectedTab, setSelectedTab] = useState<"scheduled" | "delivered">("scheduled");
  const [search, setSearch] = useState("");
  const params = useParams();
  const { data, isLoading } = useFrappeGetDoc<DeliveryTripDetails>(
    "Delivery Trip",
    params?.trip_id
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleTabSelection = (tab: "scheduled" | "delivered") => () => {
    if (tab === selectedTab) return
    setSearch("")
    setSelectedTab(tab);
  };

  const handleButtonClick = () => {
  //   TODO: Handle button click
  };

  const status = useMemo(() => {
    const deliveredStops = data?.delivery_stops?.filter((stop: DeliveryStop) => {
      return stop.visited;
    }).length
    const pendingStops = data?.delivery_stops?.filter((stop: DeliveryStop) => {
      return !stop.visited && !stop.custom_in_transition;
    }).length
    const scheduledStops = data?.delivery_stops?.filter((stop: DeliveryStop) => {
      return !stop.visited;
    }).length

    return {
      "delivered": deliveredStops,
      "pending": pendingStops,
      "scheduled": scheduledStops
    }
  }, [data?.delivery_stops]);

  const filteredStops = useMemo(() => {
    return data?.delivery_stops?.filter((stop: DeliveryStop) => {
      const isAllowToFilter = selectedTab === "delivered" ? Boolean(stop.visited) : !stop.visited
      return isAllowToFilter && stop.customer?.toLowerCase().includes(search.toLowerCase());
    }) || [];
  }, [selectedTab, search, data?.delivery_stops]);

  return (
      <div className="mx-auto min-h-screen">
        <div className="bg-white shadow">
          <div className="flex justify-between items-center p-4">
            <h1
                onClick={() => window.history.back()}
                className="text-xl font-bold flex gap-2 items-center justify-center select-none cursor-pointer"
            >
              <ChevronLeftIcon className="w-7 h-7"/>
              <span>My Trips</span>
            </h1>
          </div>

          <div className="flex justify-between items-center p-4 bg-[#ebf1f9]">
            <div className="flex flex-col items-start truncate">
              <p className="flex gap-2 items-center">
                <strong>Route:</strong>
                <span
                    className="truncate max-w-44 w-full"
                    title={data?.custom_route ?? ""}
                >
                {data?.custom_route ?? "-"}
              </span>
              </p>
              <p className="flex gap-2 items-center">
                <strong>Date:</strong>
                <span> {formatDate(data?.departure_time ?? "")}</span>
              </p>
            </div>
            <button
                onClick={handleButtonClick}
                className="bg-[#f00] text-white px-3 py-1 rounded font-semibold"
            >
              Close POS
            </button>
          </div>
        </div>

        <div className="flex items-center w-full justify-center">
          <button
              onClick={handleTabSelection('scheduled')}
              className={`px-3 flex-1 py-2 my-2 rounded text-black border-r-2 ${selectedTab === 'scheduled' ? 'font-semibold' : ''}`}
          >
            Scheduled ({status.scheduled})
          </button>
          <button
              onClick={handleTabSelection('delivered')}
              className={`px-3 flex-1 py-3 rounded text-black ${selectedTab === 'delivered' ? 'font-semibold' : ''}`}
          >
            Delivered ({status.delivered})
          </button>
        </div>

        <div className="flex items-center justify-center p-3 bg-[#ef9e00] text-white font-semibold">
          <p className="m-0 p-0">
            {status.pending} Pending Delivery stops
          </p>
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
          {isLoading && <LoadingOverlay/>}
          {!isLoading && (
              <div className="mt-4 flex flex-col gap-4">
                {
                  filteredStops.length
                      ? filteredStops?.map(
                          (stop: DeliveryStop, index: Key | null | undefined) => (
                              <DeliveryStopDetailCard
                                  key={index}
                                  stop={stop}
                                  isCTAAllowed
                              />
                          )
                      )
                      : <NoCustomerFound/>
                }
              </div>
          )}

          <div className="mt-4 flex flex-col gap-4"></div>
        </div>
      </div>
  );
}
