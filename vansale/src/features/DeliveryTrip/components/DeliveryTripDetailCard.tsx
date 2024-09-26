import { useNavigate } from "react-router-dom";
import { DeliveryTripDetails } from "../../../utils/types";
import { formatDate } from "../../../utils/formatDate.ts";
import { TRIP_STATUS } from "../../../utils/constants.ts";
import {getTripStatus} from "../../../utils/getStatus.ts";

interface DeliveryTripDetailCardProps {
  tripDetails: DeliveryTripDetails;
}

export default function DeliveryTripDetailCard({
  tripDetails,
}: DeliveryTripDetailCardProps) {
  const navigate = useNavigate();

  const handleDetailViewClick = () => {
    navigate(`/vansale/delivery-trip/${tripDetails.name}`);
  };

  const status_obj = getTripStatus(tripDetails);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-start border border-gray-200 p-2 rounded-t-md">
        <div className="flex flex-col justify-between items-start">
          <h2>
            <span className="font-semibold">
              {tripDetails?.custom_route ?? "-"}
            </span>
            <span className="ml-2 text-sm">({tripDetails?.name ?? "-"})</span>
          </h2>
          <p className="text-sm text-gray-500">
            {tripDetails?.delivery_stops?.length ?? 0} Delivery Stops
          </p>
        </div>
        <span
          className={`text-xs py-1 rounded-3xl font-bold px-2 ${
              status_obj.status === TRIP_STATUS.SCHEDULED
              ? "bg-[#ef9e00] text-white"
              : status_obj.status === TRIP_STATUS.UPCOMING
              ? "bg-[#ffefc2] text-[#9e7602]"
              : "bg-[#1faa00] text-white"
          }`}
        >
          {status_obj.message}
        </span>
      </div>
      <div className="flex text-sm">
        <p className="flex p-2 rounded-bl-md flex-col border border-gray-200">
          <span>🚗 Vehicle No.</span>
          <span className="font-semibold">{tripDetails?.vehicle ?? "-"}</span>
        </p>
        <p className="flex p-2 flex-col border border-gray-200">
          <span>📅 Date</span>
          <span className="font-semibold">
            {formatDate(tripDetails?.departure_time ?? "")}
          </span>
        </p>
        <div className="flex p-2 rounded-br-md justify-between items-center flex-1 border border-gray-200">
          <p className="flex flex-col">
            <span>👤 Diver</span>
            <span className="font-semibold">
              {tripDetails?.driver_name ?? "-"}
            </span>
          </p>
          <button
            onClick={handleDetailViewClick}
            className="bg-[#0050b5] text-white py-1 px-3 text-sm font-semibold rounded-lg"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
