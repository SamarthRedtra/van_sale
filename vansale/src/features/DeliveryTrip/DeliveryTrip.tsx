import React, { useEffect, useState } from "react";
import DeliveryTripDetailCard from "./components/DeliveryTripDetailCard";
import { DeliveryTripDetails } from "../../utils/types";
import getDeliveryDetails from "../../services/getTripDetails.tsx";
import LoadingOverlay from "../Loader/LoadingOverlay.tsx";
import NoTripFound from "./components/NoTripFound.tsx";
import Header from "../Components/Header.tsx";
import PosOpen from "./components/PosOpen.tsx";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.tsx";
import { getTripStatus } from "@/utils/getStatus.ts";
import { TRIP_STATUS } from "@/utils/constants.ts";

export default function DeliveryTrip() {
  const [search, setSearch] = useState("");
  const [deliveryTrips, setDeliveryTrips] = useState<DeliveryTripDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await getDeliveryDetails();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        res && setDeliveryTrips(res?.message?.data ?? []);
      } catch (err) {
        console.error(
          "ERROR IN DELIVERY TRIPS :- ",
          JSON.stringify(err, null, 2)
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filteredTrips = deliveryTrips
    .filter((trip) => {
      if (filter === "all") return true;

      const status = getTripStatus(trip);
      if (filter === "scheduled")
        return status.status === TRIP_STATUS.SCHEDULED;
      if (filter === "completed")
        return status.status === TRIP_STATUS.COMPLETED;
      if (filter === "overdue") return status.status === TRIP_STATUS.OVERDUE;
      if (filter === "partial")
        return status.status === TRIP_STATUS.PARTIALLY_COMPLETED;
    })
    .filter((trip) => {
      return (
        trip?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
        trip?.custom_route?.toLowerCase()?.includes(search.toLowerCase())
      );
    });

  return (
    <div className="mx-auto min-h-screen">
      <div className="bg-white shadow">
        <Header title="POS" />
        {/* <div className="bg-purple-500 p-4">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">My Planned Trips</span>
            <Select
              value={filter}
              onValueChange={(value) => {
                setFilter(value);
              }}
            >
              <SelectTrigger className="w-[120px] bg-white">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trips</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="partial">Partially Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div> */}
      </div>

      <div className="p-4">
        {/*<div className="relative">
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
        </div> */}
        {isLoading && <LoadingOverlay />}
        {!isLoading && (
          <div className="mt-4 flex flex-col gap-4">

            <PosOpen />
            {/* {filteredTrips.length ? (
              filteredTrips.map((item, index) => (
                <DeliveryTripDetailCard key={index} tripDetails={item} />
              ))
            ) : (
              <NoTripFound />
              
            )} */}
            

          </div>
        )}
      </div>
    </div>
  );
}
