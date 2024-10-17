import { useEffect, useState } from "react";
import getIsPosOpeningEntryFound from "../../services/getIsPosOpeningEntryFound";
import {
  useFrappeCreateDoc,
  useFrappeGetDoc,
  useFrappeUpdateDoc,
} from "frappe-react-sdk";
import { DeliveryStop, DeliveryTripDetails, PItem } from "../../utils/types";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import LoadingOverlay from "../Loader/LoadingOverlay";
import ProductItem from "./components/ProductItem";
import { format } from "date-fns";
import ProductItemDetails from "./components/ProductItemDetails";
import NoItemSelected from "./components/NoItemSelected";
import Toast from "../Components/Toast";

export default function SalesInvoice() {
  const { trip_id, customer_id } = useParams();
  const navigate = useNavigate();
  const [isPosOpenEntryFound, setIsPosOpenEntryFound] = useState(false);
  const [posProfile, setPosProfile] = useState<string>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [successMsg, setSuccessMsg] = useState<string>();
  const { data: tripDetails, isLoading } = useFrappeGetDoc<DeliveryTripDetails>(
    "Delivery Trip",
    trip_id
  );
  const { data: stopDetails } = useFrappeGetDoc<DeliveryStop>(
    "Delivery Stop",
    customer_id
  );
  const { updateDoc, loading } = useFrappeUpdateDoc();
  const [dueDate, setDueDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [productItems, setProductItems] = useState<
    ({
      quantity: number;
      price: number;
      discount: number;
      amount: number;
    } & PItem)[]
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsPosOpenEntryFound(false);
      }
    })();
  }, [tripDetails]);

  const handleAdd = (
    item: {
      quantity: number;
      price: number;
      discount: number;
      amount: number;
    } & PItem
  ) => {
    setProductItems((prev) => [...prev, item]);
  };

  const handleCreateInvoice = async () => {
    try {
      const salesDoc = await createDoc("Sales Invoice", {
        posting_time: format(new Date(), "HH:mm:ss"),
        customer: stopDetails?.customer,
        due_date: dueDate ?? "",
        custom_warehouse: tripDetails?.custom_warehouse,
        items: productItems.map((item) => {
          return {
            item_code: item.item_code,
            qty: item.quantity,
            price_list_rate: item.price_list_rate,
            net_amount: (item?.price_list_rate ?? 0) * item.quantity,
            discount_percentage: item.discount ?? 0,
            amount: item.amount ?? 0,
          };
        }),
      });

      if (customer_id) {
        await updateDoc("Delivery Stop", customer_id, {
          custom_is_credit: 1,
          custom_sales_invoice: salesDoc?.name ?? "",
          custom_end_timing: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
          visited: 1,
        });
      }
      setSuccessMsg("Invoice created successfully");
      setTimeout(() => {
        navigate(`/vansale/delivery-trip/${trip_id}/${customer_id}`);
      }, 2000);
    } catch (err: any) {
      console.log(isPosOpenEntryFound);
      setErrorMsg(err?.response?.data?.message ?? "Something went wrong!");
    }
  };

  const handleDeleteItem = (value: number) => {
    setProductItems(productItems.filter((_, index) => index !== value));
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
      {!isLoading && (
        <>
          <div className="flex gap-2 items-center justify-end p-4 text-sm">
            <label htmlFor="date">Due Date :</label>
            <input
              id="date"
              className="border border-gray-300 rounded-md p-2"
              type="date"
              onChange={(e) => setDueDate(e.target.value)}
              value={dueDate}
              min={format(new Date(), "yyyy-MM-dd")}
            />
          </div>
          <p className="text-xl text-left font-bold p-4">All Items</p>

          <ProductItem handleAdd={handleAdd} posProfile={posProfile} />

          <div>
            <p className="text-xl text-left font-bold p-4">Selected Items</p>
          </div>
          <div className="flex flex-col p-4 gap-3">
            {productItems.length > 0 ? (
              productItems.map((product, idx) => (
                <ProductItemDetails
                  key={idx}
                  item={product}
                  index={idx}
                  handleDelete={handleDeleteItem}
                />
              ))
            ) : (
              <NoItemSelected />
            )}
          </div>
          {productItems?.length > 0 && (
            <div className="flex justify-end p-4">
              <button
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-fit"
                onClick={handleCreateInvoice}
                disabled={loading}
              >
                Create Invoice
              </button>
            </div>
          )}
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
