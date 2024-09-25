import { useFrappeGetDoc } from "frappe-react-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { DeliveryStop } from "../../utils/types.ts";
import DeliveryStopDetailCard from "../TripDetails/components/DeliveryStopDetailCard.tsx";
import PreviewMap from "../PreviewMap.tsx";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import LoadingOverlay from "../Loader/LoadingOverlay.tsx";

export default function DeliveryStopDetails() {
  const navigate = useNavigate();
  const { customer_id } = useParams();

  const { data, isLoading } = useFrappeGetDoc<DeliveryStop>(
    "Delivery Stop",
    customer_id
  );

  const handleStartDelivery = () => {
    window.location.href = "/app/point-of-sale";
  };

  return (
    <div className="mx-auto min-h-screen">
      <div className="bg-white shadow">
        <div className="flex justify-between items-center p-4">
          <h1
            onClick={() => navigate(-1)}
            className="text-xl font-bold flex gap-2 items-center select-none cursor-pointer"
          >
            <ChevronLeftIcon className="w-7 h-7" />
            <span>{data?.customer ?? "-"}</span>
          </h1>
        </div>

        <div className="flex justify-between items-center p-4 bg-[#ebf1f9]">
          <div className="flex flex-col items-start truncate">
            <p className="flex gap-2 items-center">
              <strong>Address:</strong>
              <span
                className="truncate max-w-44 w-full"
                title={data?.customer_address ?? ""}
              >
                {data?.customer_address?.split("<br>").join(", ") ?? "-"}
              </span>
            </p>
            <p className="flex gap-2 items-center">
              <strong>Contact:</strong>
              <span> {data?.custom_mobile_no ?? "-"}</span>
            </p>
          </div>
          <button
            onClick={handleStartDelivery}
            className="bg-[#1faa00] text-white px-3 py-1 rounded font-semibold"
          >
            Start Delivery
          </button>
        </div>
      </div>
      {isLoading && <LoadingOverlay />}
      {!isLoading && (
        <>
          <div className="flex flex-col gap-4 p-4">
            {data && <DeliveryStopDetailCard stop={data} />}
          </div>

          <div className="p-4">
            <PreviewMap lat={data?.lat ?? 0} long={data?.lng ?? 0} />
          </div>
        </>
      )}
    </div>
  );
}
