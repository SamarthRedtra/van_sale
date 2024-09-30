import { useFrappeGetDoc } from "frappe-react-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { DeliveryStop, DeliveryTripDetails } from "../../utils/types";
import DeliveryStopDetailCard from "../TripDetails/components/DeliveryStopDetailCard.tsx";
import PreviewMap from "../PreviewMap.tsx";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import LoadingOverlay from "../Loader/LoadingOverlay.tsx";
import startDelivery from "../../services/startDelivery.tsx";
import { useEffect, useState } from "react";
import Toast from "../Components/Toast.tsx";
import { getDeliveryStatus } from "../../utils/getStatus.ts";
import { DELIVERY_STATUS_CONST } from "../../utils/constants.ts";
import getIsPosOpeningEntryFound from "../../services/getIsPosOpeningEntryFound.tsx";

export default function DeliveryStopDetails() {
  const navigate = useNavigate();
  const { customer_id, trip_id } = useParams();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [posProfile, setPosProfile] = useState<string>("");
  const [isPosOpenEntryFound, setIsPosOpenEntryFound] =
    useState<boolean>(false);

  const { data: tripDetails } = useFrappeGetDoc<DeliveryTripDetails>(
    "Delivery Trip",
    trip_id
  );
  const { data, isLoading, mutate } = useFrappeGetDoc<DeliveryStop>(
    "Delivery Stop",
    customer_id
  );

  const status = getDeliveryStatus(data);

  useEffect(() => {
    (async () => {
      try {
        if (!tripDetails?.custom_warehouse) return;

        const res = await getIsPosOpeningEntryFound(
          tripDetails?.custom_warehouse
        );
        setPosProfile(res?.message?.pos_profile);
        if (res?.message?.is_found) {
          setIsPosOpenEntryFound(true);
        } else {
          setIsPosOpenEntryFound(false);
        }
      } catch (error) {
        setIsPosOpenEntryFound(false);
      }
    })();
  }, [tripDetails]);

  const handleStartDelivery = async () => {
    if (!data) return;

    if (status === DELIVERY_STATUS_CONST.IN_TRANSIT) {
      window.location.href = `/app/point-of-sale?trip_id=${data.parent}&pos_profile=${posProfile}&customer_name=${data.customer}`;
      return;
    }

    try {
      const res = await startDelivery(data.parent, data.name);
      if (res) {
        mutate();
        setSuccessMsg("Delivery started successfully");
      }
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setErrorMsg(err?.response?.data?.message);
      }
    }
  };

  const handleCloseAlert = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <div className="mx-auto min-h-screen">
      <div className="bg-white shadow">
        <div className="flex justify-between items-center p-4">
          <h1
            onClick={() => navigate(`/vansale/delivery-trip/${data?.parent}`)}
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
            className="bg-[#1faa00] text-white px-3 py-1 rounded font-semibold disabled:opacity-50"
            disabled={
              false
              // true ||
              // (status === DELIVERY_STATUS_CONST.IN_TRANSIT &&
              //   !isPosOpenEntryFound)
            }
          >
            {status === DELIVERY_STATUS_CONST.IN_TRANSIT
              ? "Create Invoice"
              : "Start Delivery"}
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

      {errorMsg && (
        <Toast message={errorMsg} type="error" onClose={handleCloseAlert} />
      )}
      {successMsg && (
        <Toast message={successMsg} type="success" onClose={handleCloseAlert} />
      )}
    </div>
  );
}
