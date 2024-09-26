import { useNavigate, useParams } from "react-router-dom";
import { DELIVERY_STATUS_CONST } from "../../../utils/constants.ts";
import { CheckCircledIcon, ClockIcon } from "@radix-ui/react-icons";
import { DeliveryStop } from "../../../utils/types";
import { getDeliveryStatus } from "../../../utils/getStatus.ts";
// import { useFrappePutCall } from "frappe-react-sdk";
// import { useState } from "react";

interface DeliveryStopDetailCardProps {
  stop: DeliveryStop;
  isCTAAllowed?: boolean;
}

export default function DeliveryStopDetailCard({
  stop,
  isCTAAllowed = false,
}: DeliveryStopDetailCardProps) {
  const { trip_id } = useParams();
  const navigate = useNavigate();
  // const { call, isCompleted } = useFrappePutCall("frappe.client.set_value");

  const status = getDeliveryStatus(stop);

  const isStart = !stop?.visited && !stop?.custom_in_transition;

  const handleClick = (stopId: string) => async () => {
    if (!stopId) return;
    // if (isStart) {
    //   const data = await call({
    //     doctype: "Delivery Stop",
    //     name: stopId,
    //     fieldname: "custom_in_transition",
    //     value: 1,
    //   });

    //   if (data?.message) {
    //     const updatedStop = data?.message?.delivery_stops?.find(
    //       (item: DeliveryStop) => item.name === stopId
    //     );
    //     setStopDetails(updatedStop);
    //   }
    // } else {
    // window.location.href = "/app/point-of-sale";
    navigate(`/vansale/delivery-trip/${trip_id}/${stopId}`);
    // }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-start border border-gray-200 p-2 rounded-t-md">
        <div className="flex flex-col justify-between items-start">
          <h2 className="font-semibold">{stop?.customer ?? "-"}</h2>
          <p
            className="text-sm text-gray-500 truncate max-w-56 w-full"
            title={stop?.address ?? ""}
          >
            {stop?.address?.replace("<br>", ",") ?? 0}
          </p>
        </div>
        {/* <span
          className={`text-xs py-1 rounded-3xl font-bold px-2 ${
            status === DELIVERY_STATUS_CONST.IN_TRANSIT
              ? "bg-[#00abff] text-white"
              : status === DELIVERY_STATUS_CONST.PENDING
              ? "bg-[#ffefc2] text-[#9e7602]"
              : "bg-[#1faa00] text-white"
          }`}
        >
          {isCompleted}
        </span> */}
      </div>
      <div className="flex text-sm">
        <div className="flex p-2 w-28 rounded-bl-md flex-col gap-1.5 border border-gray-200">
          <p className="flex items-center gap-1 text-sm">
            <CheckCircledIcon color="#00f" />
            <span>Status</span>
          </p>
          <span
            className={`text-xs py-1 rounded-3xl font-bold px-2 ${
              status === DELIVERY_STATUS_CONST.IN_TRANSIT
                ? "bg-[#00abff] text-white"
                : status === DELIVERY_STATUS_CONST.PENDING
                ? "bg-[#ffefc2] text-[#9e7602]"
                : "bg-[#1faa00] text-white"
            }`}
          >
            {status}
          </span>
        </div>
        <div className="flex p-2 flex-col gap-1.5 border border-gray-200">
          <p className="flex items-center gap-1 text-sm">
            <ClockIcon color="#00f" />
            <span>Est. Arrival</span>
          </p>
          <span className="font-semibold">{"10:00 AM"}</span>
        </div>
        <div className="flex p-2 rounded-br-md justify-between items-center flex-1 border border-gray-200">
          <div className="flex flex-col gap-1.5">
            <p className="flex items-center gap-1 text-sm">
              <ClockIcon color="#00f" />
              <span>Delivered</span>
            </p>
            <span className="font-semibold">{"11:34 AM"}</span>
          </div>
          {isCTAAllowed && (
            <button
              onClick={handleClick(stop?.name ?? "")}
              className="bg-[#0050b5] text-white py-1 px-3 text-sm font-semibold rounded-lg"
            >
              {isStart ? "Start" : "View"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
