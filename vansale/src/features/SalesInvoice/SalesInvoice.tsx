import { useEffect, useState } from "react";
import getIsPosOpeningEntryFound from "../../services/getIsPosOpeningEntryFound";
import { useFrappeCreateDoc, useFrappeGetDoc } from "frappe-react-sdk";
import { DeliveryTripDetails, PItem } from "../../utils/types";
import { useNavigate, useParams } from "react-router-dom";
import getItemList from "../../services/getItemList";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import LoadingOverlay from "../Loader/LoadingOverlay";
import Toast from "../Components/Toast";
import ProductItem from "./components/ProductItem";
import { format } from "date-fns";

export default function SalesInvoice() {
  const { trip_id, customer_id } = useParams();
  const navigate = useNavigate();
  const [isPosOpenEntryFound, setIsPosOpenEntryFound] = useState(false);
  const [posProfile, setPosProfile] = useState<string>();
  const [itemList, setItemList] = useState<PItem[]>([]);
  const { data: tripDetails, isLoading } = useFrappeGetDoc<DeliveryTripDetails>(
    "Delivery Trip",
    trip_id
  );
  const [dueDate, setDueDate] = useState<string>();
  const [productItems, setProductItems] = useState<
    ({ quantity: number; price: number } & PItem)[]
  >([]);

  const { createDoc } = useFrappeCreateDoc();

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

        const itemRes = await getItemList({
          pos_profile: res?.message?.pos_profile,
        });

        if (itemRes?.message?.items && itemRes?.message?.items.length > 0) {
          setItemList(itemRes.message.items);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsPosOpenEntryFound(false);
      }
    })();
  }, [tripDetails]);

  useEffect(() => {
    if (!posProfile) return;
    (async () => {
      try {
        const itemList = await getItemList({
          pos_profile: posProfile,
        });
        console.log("itemList", itemList);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [posProfile]);

  const handleAdd = (item: { quantity: number; price: number } & PItem) => {
    setProductItems((prev) => [...prev, item]);
  };

  const handleCreateInvoice = () => {
    createDoc("Sales Invoice", {
      posting_time: format(new Date(), "HH:mm:ss"),
      customer: customer_id,
      due_date: dueDate ?? "",
      items: productItems.map((item) => {
        return {
          item_code: item.item_code,
          qty: item.quantity,
          price_list_rate: item.price_list_rate,
          net_amount: (item?.price_list_rate ?? 0) * item.quantity,
        };
      }),
    });
  };

  return (
    <div className="mx-auto min-h-screen">
      <div className="bg-white shadow">
        <div className="flex justify-between items-center p-4">
          <h1
            onClick={() =>
              navigate(`/vansale/delivery-trip/${trip_id}/${customer_id}`)
            }
            className="text-xl font-bold flex gap-2 items-center select-none cursor-pointer"
          >
            <ChevronLeftIcon className="w-7 h-7" />
            <span>Stop</span>
          </h1>
        </div>
      </div>
      {isLoading && <LoadingOverlay />}
      {!isLoading &&
        (itemList?.length > 0 ? (
          <>
            <div className="flex gap-2 items-center p-4">
              <label htmlFor="date">Due Date :</label>
              <input
                id="date"
                className="border border-gray-300 rounded-md p-2"
                type="date"
                onChange={(e) => setDueDate(e.target.value)}
                value={dueDate}
              />
            </div>
            <p className="text-xl font-bold p-4">All Items</p>
            {itemList.map((item, idx) => (
              <ProductItem key={idx} item={item} handleAdd={handleAdd} />
            ))}
            <div className="flex justify-end p-4">
              <button
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-fit"
                onClick={handleCreateInvoice}
              >
                Create Invoice
              </button>
            </div>
          </>
        ) : (
          <p className="text-xl font-bold p-4">No Items</p>
        ))}

      {/* {errorMsg && (
        <Toast message={errorMsg} type="error" onClose={handleCloseAlert} />
      )}
      {successMsg && (
        <Toast message={successMsg} type="success" onClose={handleCloseAlert} />
      )} */}
    </div>
  );
}
