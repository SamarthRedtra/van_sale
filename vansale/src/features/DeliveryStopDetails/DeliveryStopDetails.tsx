import { useFrappeGetDoc } from "frappe-react-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { DeliveryStop, DeliveryTripDetails } from "../../utils/types";
import DeliveryStopDetailCard from "../TripDetails/components/DeliveryStopDetailCard.tsx";
import PreviewMap from "../PreviewMap.tsx";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import LoadingOverlay from "../Loader/LoadingOverlay.tsx";
import startDelivery from "../../services/startDelivery.tsx";
import { useEffect, useMemo, useState } from "react";
import Toast from "../Components/Toast.tsx";
import { getDeliveryStatus, getTripStatus } from "../../utils/getStatus.ts";
import { DELIVERY_STATUS_CONST, TRIP_STATUS } from "../../utils/constants.ts";
import getIsPosOpeningEntryFound from "../../services/getIsPosOpeningEntryFound.tsx";
import InvoiceDetailCard from "./components/InvoiceDetailCard.tsx";
import createPaymentEntry from "../../services/createPaymentEntry.tsx";
import ConfirmationComp from "../Components/ConfirmationComp.tsx";

export default function DeliveryStopDetails() {
  const navigate = useNavigate();
  const { customer_id, trip_id } = useParams();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [posProfile, setPosProfile] = useState<string>("");
  const [isPosOpenEntryFound, setIsPosOpenEntryFound] =
    useState<boolean>(false);
  const [isApiCalling, setIsApiCalling] = useState<boolean>(false);

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

        setIsApiCalling(true);

        const res = await getIsPosOpeningEntryFound(tripDetails?.name);
        setPosProfile(
          res?.message?.pos_profile || tripDetails?.custom_pos_profile || ""
        );
        if (res?.message?.is_found) {
          setIsPosOpenEntryFound(true);
        } else {
          setIsPosOpenEntryFound(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsPosOpenEntryFound(false);
      } finally {
        setIsApiCalling(false);
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
      setIsApiCalling(true);

      const res = await startDelivery(data.parent, data.name);
      if (res) {
        mutate();
        setSuccessMsg("Delivery started successfully");
      }
    } catch (err: any) {
      if (err?.response?.data?.message) {
        console.log("This is isPosOpenEntryFound :- ", isPosOpenEntryFound);

        setErrorMsg(err?.response?.data?.message);
      }
    } finally {
      setIsApiCalling(false);
    }
  };

  const createSalesInvoice = async () => {
    if (!data) return;
    navigate(
      `/vansale/delivery-trip/${data.parent}/${customer_id}/sales-invoice`
    );
  };

  const handleCloseAlert = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleCreatePaymentEntry = async () => {
    if (!customer_id || !data?.custom_sales_invoice) return;
    try {
      setIsApiCalling(true);
      await createPaymentEntry(customer_id, data?.custom_sales_invoice);
      setSuccessMsg("Payment Entry created successfully");
      mutate();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message ?? "Something went wrong!");
    } finally {
      setIsApiCalling(false);
    }
  };

  const isCTADisabled = useMemo(() => {
    if (tripDetails) {
      const tripStatus = getTripStatus(tripDetails).status;
      return (
        !!tripDetails.custom_pos_closing_entry_link ||
        tripStatus === TRIP_STATUS.DRAFT ||
        tripStatus === TRIP_STATUS.OVERDUE ||
        tripStatus === TRIP_STATUS.CANCELLED ||
        tripStatus === TRIP_STATUS.COMPLETED ||
        tripStatus === TRIP_STATUS.PARTIALLY_COMPLETED ||
        status === DELIVERY_STATUS_CONST.DELIVERED
      );
    }
    return status === DELIVERY_STATUS_CONST.DELIVERED;
  }, [status, tripDetails]);

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

        <div className="flex flex-col gap-2 p-4 bg-[#ebf1f9]">
          <div className="flex flex-1 flex-col items-start truncate">
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
              <span> {data?.custom_mobile_no || "-"}</span>
            </p>
          </div>
          <div className="flex gap-2 text-sm">
            {data &&
              data.custom_is_credit === 1 &&
              data.custom_is_paid === 0 && (
                <ConfirmationComp
                  handleClick={handleCreatePaymentEntry}
                  dialogCTAText="Collect Payment"
                  dialogTitle="Are you sure you want collect Payment?"
                  disabled={isApiCalling}
                >
                  <button
                    className="bg-[#1faa00] text-white px-3 py-1 rounded font-semibold disabled:bg-gray-400 disabled:text-white"
                    disabled={isApiCalling}
                  >
                    Collect Payment
                  </button>
                </ConfirmationComp>
              )}

            {status === DELIVERY_STATUS_CONST.IN_TRANSIT && (
              <button
                onClick={createSalesInvoice}
                className="bg-[#1faa00] text-white px-3 py-1 rounded font-semibold disabled:bg-gray-400 disabled:text-white"
                disabled={isCTADisabled || isApiCalling}
              >
                Create Credit Invoice
              </button>
            )}
            <ConfirmationComp
              handleClick={handleStartDelivery}
              dialogCTAText={
                status === DELIVERY_STATUS_CONST.IN_TRANSIT
                  ? "Create Invoice"
                  : "Start Delivery"
              }
              dialogTitle={
                status === DELIVERY_STATUS_CONST.IN_TRANSIT
                  ? "Are you sure you want to Create POS Invoice"
                  : "Are you sure you want to Start Delivery"
              }
              disabled={isCTADisabled}
            >
              <button
                className="bg-[#1faa00] text-white px-3 py-1 rounded font-semibold disabled:bg-gray-400 disabled:text-white"
                disabled={isCTADisabled}
              >
                {status === DELIVERY_STATUS_CONST.IN_TRANSIT
                  ? "Create POS Invoice"
                  : "Start Delivery"}
              </button>
            </ConfirmationComp>
          </div>
        </div>
      </div>
      {(isLoading || isApiCalling) && <LoadingOverlay />}
      {!isLoading && (
        <>
          <div className="flex flex-col gap-4 p-4">
            {data && <DeliveryStopDetailCard stop={data} />}
          </div>

          {status === DELIVERY_STATUS_CONST.DELIVERED &&
            data?.custom_pos_invoice && (
              <InvoiceDetailCard posInvoice={data.custom_pos_invoice} />
            )}

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
