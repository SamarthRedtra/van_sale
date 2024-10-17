import { useNavigate } from "react-router-dom";
import { DeliveryTripDetails } from "../../../utils/types";
import { formatDate } from "../../../utils/formatDate.ts";
import { TRIP_STATUS } from "../../../utils/constants.ts";
import { getTripStatus } from "../../../utils/getStatus.ts";
import { useMemo } from "react";
import { Calendar, Truck, User } from "lucide-react";

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

  const style = useMemo(() => {
    if (!status_obj.status) return {};
    switch (status_obj.status) {
      case TRIP_STATUS.SCHEDULED:
        return { backgroundColor: "#ef9e00", color: "#fff" };
      case TRIP_STATUS.UPCOMING:
        return { backgroundColor: "#ffefc2", color: "#9e7602" };
      case TRIP_STATUS.IN_TRANSIT:
        return { backgroundColor: "#f5f5f5", color: "#9e7602" };
      case TRIP_STATUS.CANCELLED:
        return { backgroundColor: "#f5f5f5", color: "#9e7602" };
      case TRIP_STATUS.COMPLETED:
        return { backgroundColor: "#1faa00", color: "#fff" };
      case TRIP_STATUS.OVERDUE:
        return { backgroundColor: "#FFA500", color: "#fff" };
      case TRIP_STATUS.PARTIALLY_COMPLETED:
        return { backgroundColor: "#1faa00", color: "#fff" };
      default:
        return { backgroundColor: "#1faa00", color: "#9e7602" };
    }
  }, [status_obj.status]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-start border border-gray-200 p-2 rounded-t-md">
        <div className="flex flex-col justify-between items-start">
          <h2>
            <span className="font-semibold">
              {tripDetails?.custom_route ?? "-"}
            </span>
          </h2>
          <p className="text-sm text-gray-500">({tripDetails?.name ?? "-"})</p>
          <p className="text-sm font-semibold">
            {tripDetails?.delivery_stops?.length ?? 0} Delivery Stops
          </p>
        </div>
        <span
          className={`text-xs py-1 rounded-3xl font-bold px-2`}
          style={style}
        >
          {status_obj.message}
        </span>
      </div>
      <div className="text-sm">
        <div className="flex ">
          <div className="flex p-2 flex-col border border-gray-200">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>Vehicle No.</span>
            </p>
            <span className="font-semibold">{tripDetails?.vehicle ?? "-"}</span>
          </div>
          <div className="flex p-2 flex-col border border-gray-200">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </p>
            <span className="font-semibold">
              {formatDate(tripDetails?.departure_time ?? "")}
            </span>
          </div>
          <div className="flex p-2 justify-between items-center flex-1 border border-gray-200">
            <div className="flex flex-col">
              <p className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Driver</span>
              </p>
              <span className="font-semibold">
                {tripDetails?.driver_name ?? "-"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex p-3">
          <button
            onClick={handleDetailViewClick}
            className="bg-[#0050b5] text-white py-1 px-3 text-sm font-semibold rounded-lg w-full"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
