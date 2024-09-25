import { useNavigate } from "react-router-dom";
import { DeliveryTripDetails } from "../../../utils/types.ts";
import { formatDate } from "../../../utils/formatDate.ts";

interface DeliveryTripDetailCardProps {
  tripDetials: DeliveryTripDetails;
}

export default function DeliveryTripDetailCard({
  tripDetials,
}: DeliveryTripDetailCardProps) {
  const navigate = useNavigate();

  const handleDetailViewClick = () => {
    navigate(`/vansale/delivery-trip/${tripDetials.name}`);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-start border border-gray-200 p-2 rounded-t-md">
        <div className="flex flex-col justify-between items-start">
          <h2>
            <span className="font-semibold">
              {tripDetials?.custom_route ?? "-"}
            </span>
            <span className="ml-2 text-sm">({tripDetials?.name ?? "-"})</span>
          </h2>
          <p className="text-sm text-gray-500">
            {tripDetials?.delivery_stops?.length ?? 0} Delivery Stops
          </p>
        </div>
        {/* <span
          className={`text-xs py-1 rounded-3xl font-bold px-2 ${
            status === CONSTANTS.SCHEDULED_FOR_TODAY
              ? "bg-[#ef9e00] text-white"
              : status === CONSTANTS.UPCOMING
              ? "bg-[#ffefc2] text-[#9e7602]"
              : "bg-[#1faa00] text-white"
          }`}
        >
          {status}
        </span> */}
      </div>
      <div className="flex text-sm">
        <p className="flex p-2 rounded-bl-md flex-col border border-gray-200">
          <span>🚗 Vehicle No.</span>
          <span className="font-semibold">{tripDetials?.vehicle ?? "-"}</span>
        </p>
        <p className="flex p-2 flex-col border border-gray-200">
          <span>📅 Date</span>
          <span className="font-semibold">
            {formatDate(tripDetials?.departure_time ?? "")}
          </span>
        </p>
        <div className="flex p-2 rounded-br-md justify-between items-center flex-1 border border-gray-200">
          <p className="flex flex-col">
            <span>👤 Diver</span>
            <span className="font-semibold">
              {tripDetials?.driver_name ?? "-"}
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
