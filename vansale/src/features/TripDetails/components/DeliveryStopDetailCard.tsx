import { useNavigate, useParams } from "react-router-dom";
import { DELIVERY_STATUS_CONST } from "../../../utils/constants.ts";
import { ClockIcon } from "@radix-ui/react-icons";
import { DeliveryStop } from "../../../utils/types";
import { getDeliveryStatus } from "../../../utils/getStatus.ts";
import { PhoneCall } from "lucide-react";
import { format } from "date-fns";

interface DeliveryStopDetailCardProps {
  stop: DeliveryStop;
  showStopName?: boolean;
  isCTAAllowed?: boolean;
  hasIcon?: boolean;
}

export default function DeliveryStopDetailCard({
  stop,
  showStopName = false,
  isCTAAllowed = false,
  hasIcon = false,
}: DeliveryStopDetailCardProps) {
  const { trip_id } = useParams();
  const navigate = useNavigate();

  const status = getDeliveryStatus(stop);

  const isStart = !stop?.visited && !stop?.custom_in_transition;

  const handleClick = (stopId: string) => async () => {
    if (!stopId) return;
    navigate(`/vansale/delivery-trip/${trip_id}/${stopId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border border-gray-200 p-2 rounded-t-md flex flex-col justify-start gap-1 items-start">
        <div className="flex gap-4 justify-between items-start w-full">
          {hasIcon && (
            <div className="bg-[#f4ebfe] rounded-md">
              <p className="text-2xl font-bold p-1.5 px-2 text-[#9e25fc]">
                {stop?.customer
                  .split(" ")
                  .slice(0, 2)
                  .map((item) => item[0])
                  .join("")
                  .toLocaleUpperCase() ?? ""}
              </p>
            </div>
          )}
          <div className="flex flex-col flex-1 justify-between items-start">
            <h2 className="font-semibold max-w-48 w-full text-start">
              {stop?.customer ?? "-"}
            </h2>
            <p
              className="text-sm text-gray-500 truncate max-w-48 w-full text-start"
              title={showStopName ? stop?.parent : stop?.address ?? ""}
            >
              {showStopName
                ? stop?.parent ?? ""
                : stop?.address?.replace("<br>", ",") ?? 0}
            </p>
          </div>
          {!!stop?.custom_mobile_no && (
            <a href={`tel:${stop?.custom_mobile_no ?? ""}`}>
              <div className="w-11 h-11 border border-[#c2dfff] flex items-center justify-center rounded-full bg-[#d9ebff]">
                <PhoneCall />
              </div>
            </a>
          )}
        </div>
        <div className="flex justify-start gap-2">
          <span
            className={`text-[10px] py-1 rounded-3xl font-bold px-2 ${
              status === DELIVERY_STATUS_CONST.IN_TRANSIT
                ? "bg-[#00abff] text-white"
                : status === DELIVERY_STATUS_CONST.PENDING
                ? "bg-[#ffefc2] text-[#9e7602]"
                : "bg-[#1faa00] text-white"
            }`}
          >
            {status}
          </span>

          {Boolean(stop?.visited) &&
            Boolean(stop?.custom_is_credit) &&
            !stop?.custom_is_paid && (
              <span
                className={`text-[10px] py-1 rounded-3xl font-bold px-2 bg-[#ffefc2] text-[#9e7602]`}
              >
                Pending Invoice
              </span>
            )}
        </div>
      </div>
      <div className="flex text-sm">
        <div className="flex p-2 flex-col gap-1.5 border border-gray-200">
          <p className="flex items-center gap-1 text-xs">
            <ClockIcon color="#00f" />
            <span>Est. Arrival</span>
          </p>
          <span className="font-semibold">{"--:-- --"}</span>
        </div>
        <div className="flex p-2 rounded-br-md justify-between items-center flex-1 border border-gray-200">
          <div className="flex flex-col gap-1.5">
            <p className="flex items-center gap-1 text-xs">
              <ClockIcon color="#00f" />
              <span>Delivered</span>
            </p>
            <span className="font-semibold">
              {stop?.custom_end_timing
                ? format(new Date(stop?.custom_end_timing), "hh:mm a")
                : "--:-- --"}
            </span>
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
