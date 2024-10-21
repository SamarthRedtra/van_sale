import { useFrappeGetDoc } from "frappe-react-sdk";
import { useNavigate, useParams } from "react-router-dom";
import DeliveryStopDetailCard from "./components/DeliveryStopDetailCard";
import React, { Key, useEffect, useMemo, useState } from "react";
import { DeliveryStop, DeliveryTripDetails } from "../../utils/types";
import LoadingOverlay from "../Loader/LoadingOverlay";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import NoCustomerFound from "./components/NoCustomerFound.tsx";
import { formatDate } from "../../utils/formatDate.ts";
import getIsPosOpeningEntryFound from "../../services/getIsPosOpeningEntryFound.tsx";
import { TRIP_STATUS } from "../../utils/constants.ts";
import closePosEntry from "../../services/closePosEntry.tsx";
import Toast from "../Components/Toast.tsx";
import { Button } from "@/components/ui/button.tsx";
import ConfirmationComp from "../Components/ConfirmationComp.tsx";

export default function TripDetails() {
  const [isPosOpenEntryFound, setIsPosOpenEntryFound] = useState(false);
  const [isApiCalled, setIsApiCalled] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    status: "" | "success" | "error" | "info" | "warning";
    message: string;
  }>({
    status: "",
    message: "",
  });
  const [selectedTab, setSelectedTab] = useState<"scheduled" | "delivered">(
    "scheduled"
  );
  const [search, setSearch] = useState("");
  const params = useParams();
  const { data, isLoading, mutate } = useFrappeGetDoc<DeliveryTripDetails>(
    "Delivery Trip",
    params?.trip_id
  );
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleTabSelection = (tab: "scheduled" | "delivered") => () => {
    if (tab === selectedTab) return;
    setSearch("");
    setSelectedTab(tab);
  };

  const handleButtonClick = async () => {
    if (!data?.name || !data?.custom_warehouse) return;
    try {
      setIsApiCalled(true);

      const res = await closePosEntry(data.name, data.custom_warehouse);
      if (res) {
        setApiStatus({
          status: "success",
          message: "Successfully closed POS",
        });
        mutate();
      }
    } catch (err: any) {
      setApiStatus({
        status: "error",
        message: err?.response?.data?.message ?? "Something went wrong!",
      });
    } finally {
      setIsApiCalled(false);
    }
  };

  useEffect(() => {
    if (!data || !data.custom_warehouse) {
      setIsPosOpenEntryFound(false);
      return;
    }
    (async () => {
      try {
        setIsApiCalled(true);

        const res = await getIsPosOpeningEntryFound(data.name);
        if (res?.message?.is_found) {
          setIsPosOpenEntryFound(true);
        } else {
          setIsPosOpenEntryFound(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsPosOpenEntryFound(false);
      } finally {
        setIsApiCalled(false);
      }
    })();
  }, [data]);

  const status = useMemo(() => {
    const deliveredStops = data?.delivery_stops?.filter(
      (stop: DeliveryStop) => {
        return stop.visited;
      }
    ).length;
    const pendingStops = data?.delivery_stops?.filter((stop: DeliveryStop) => {
      return !stop.visited && !stop.custom_in_transition;
    }).length;
    const scheduledStops = data?.delivery_stops?.filter(
      (stop: DeliveryStop) => {
        return !stop.visited;
      }
    ).length;

    return {
      delivered: deliveredStops,
      pending: pendingStops,
      scheduled: scheduledStops,
    };
  }, [data?.delivery_stops]);

  const filteredStops = useMemo(() => {
    return (
      data?.delivery_stops?.filter((stop: DeliveryStop) => {
        const isAllowToFilter =
          selectedTab === "delivered" ? Boolean(stop.visited) : !stop.visited;
        return (
          isAllowToFilter &&
          stop.customer?.toLowerCase().includes(search.toLowerCase())
        );
      }) || []
    );
  }, [selectedTab, search, data?.delivery_stops]);

  const handleToastClose = () => {
    setApiStatus({
      status: "",
      message: "",
    });
  };

  return (
    <div className="mx-auto min-h-screen relative">
      <div className="bg-white shadow sticky">
        <div className="flex justify-between items-center p-4">
          <h1
            onClick={() => navigate("/vansale")}
            className="text-xl font-bold flex gap-2 items-center justify-center select-none cursor-pointer"
          >
            <ChevronLeftIcon className="w-7 h-7" />
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
          {isPosOpenEntryFound &&
            (data?.status === TRIP_STATUS.IN_TRANSIT ||
              data?.status === TRIP_STATUS.COMPLETED ||
              data?.status === TRIP_STATUS.PARTIALLY_COMPLETED) && (
              <ConfirmationComp
                handleClick={handleButtonClick}
                dialogCTAText="Close POS"
                dialogTitle="Are you sure you want to close POS?"
                disabled={isLoading || isApiCalled}
              >
                <Button variant="destructive">Close POS</Button>
              </ConfirmationComp>
            )}
        </div>
      </div>

      <div className="flex items-center w-full justify-center sticky">
        <button
          onClick={handleTabSelection("scheduled")}
          className={`px-3 flex-1 py-2 my-2 rounded text-black border-r-2 ${
            selectedTab === "scheduled" ? "font-semibold" : ""
          }`}
        >
          Scheduled ({status.scheduled})
        </button>
        <button
          onClick={handleTabSelection("delivered")}
          className={`px-3 flex-1 py-3 rounded text-black ${
            selectedTab === "delivered" ? "font-semibold" : ""
          }`}
        >
          Delivered ({status.delivered})
        </button>
      </div>

      <div className="flex items-center justify-center p-3 bg-[#ef9e00] text-white font-semibold sticky">
        <p className="m-0 p-0">{status.pending} Pending Delivery stops</p>
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
        {(isLoading || isApiCalled) && <LoadingOverlay />}
        {!isLoading && (
          <div className="mt-4 flex flex-col gap-4">
            {filteredStops.length ? (
              filteredStops?.map(
                (stop: DeliveryStop, index: Key | null | undefined) => (
                  <DeliveryStopDetailCard
                    key={index}
                    tripDetails={data}
                    stop={stop}
                    tripStatus={data?.status}
                    isCTAAllowed
                    hasIcon
                  />
                )
              )
            ) : (
              <NoCustomerFound />
            )}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-4"></div>

        {apiStatus.status && (
          <Toast
            message={apiStatus.message}
            type={apiStatus.status}
            onClose={handleToastClose}
          />
        )}
      </div>
    </div>
  );
}
