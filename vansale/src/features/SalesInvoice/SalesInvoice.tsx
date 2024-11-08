import { useEffect, useState } from "react";
import getIsPosOpeningEntryFound from "../../services/getIsPosOpeningEntryFound";
import { useFrappeGetDoc, useFrappeUpdateDoc } from "frappe-react-sdk";
import { DeliveryStop, DeliveryTripDetails, PItem ,Contract} from "../../utils/types";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import LoadingOverlay from "../Loader/LoadingOverlay";
import ProductItem from "./components/ProductItem";
import { format } from "date-fns";
import ProductItemDetails from "./components/ProductItemDetails";
import NoItemSelected from "./components/NoItemSelected";
import Toast from "../Components/Toast";
import createSalesInvoice from "@/services/createSalesInvoice";
import ConfirmationComp from "../Components/ConfirmationComp";

export default function SalesInvoice() {
  const { trip_id, customer_id,contract_id } = useParams();

  const navigate = useNavigate();
  const [isPosOpenEntryFound, setIsPosOpenEntryFound] = useState(false);
  const [posProfile, setPosProfile] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const { data: tripDetails, isLoading } = useFrappeGetDoc<DeliveryTripDetails>(
    "Delivery Trip",
    trip_id
  );
  const { data: stopDetails } = useFrappeGetDoc<DeliveryStop>(
    "Delivery Stop",
    customer_id
  );

  const { data: contractDetails } = useFrappeGetDoc<Contract>(
    "Contract",
    contract_id
  );

  const [isApiCalling, setIsApiCalling] = useState(false);
  const [totalAmt ,setTotalamt] = useState(0)
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
      charge_type: boolean;
      contract:string
    } & PItem)[]
  >([]);


  useEffect(() => {
    (async () => {
      try {
        if (!tripDetails?.custom_warehouse) return;

        const res = await getIsPosOpeningEntryFound(
          tripDetails?.custom_warehouse
        );

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
      }
    })();
   
   

  }, [tripDetails]);

  useEffect(() => {
    console.log("productItems", productItems);
    setTotalamt(
      productItems.reduce((acc, item) => {
        return item.charge_type ? acc + item.price_list_rate * item.quantity : acc;
      }, 0)
    );
  }, [productItems, productItems?.price_list_rate]);





  const handleAdd = (
    item: {
      quantity: number;
      price: number;
      discount: number;
      amount: number;
      charge_type: boolean;
      contract:string
    } & PItem
  ) => {
    setProductItems((prev) => {
      // Check if the item is already present by comparing item_name
      const existingItemIndex = prev.findIndex(
        (existingItem) => existingItem.item_name === item.item_name
      );

      if (existingItemIndex !== -1) {
        // Item already exists, update the quantity
        const updatedItems = [...prev];
        const existingItem = updatedItems[existingItemIndex];

        // Calculate the new total quantity
        const newQuantity = existingItem.quantity + item.quantity;

        // Ensure the new quantity does not exceed actual_qty
        if (newQuantity > item.actual_qty && item.is_stock_item == 1) {
          existingItem.quantity = item.actual_qty;
        } else {
          existingItem.quantity = newQuantity;
        }

        return updatedItems;
      } else {

        // Item doesn't exist, ensure the added quantity is not greater than actual_qty
        if (item.quantity > item.actual_qty && item.is_stock_item == 1) {
          item.quantity = item.actual_qty;

        }
        else if(item.quantity == 0 && item.is_stock_item == 0){
          item.quantity = 1
        }
        
       

        return [...prev, item];
      }
    });
  };

  const handleCreateInvoice = async () => {
    try {
      setIsApiCalling(true);
      const salesDoc = await createSalesInvoice({
        tripDetails,
        stopDetails,
        productItems,
        dueDate,
      });

      if(salesDoc.message?.status === "error"){
        setErrorMsg(salesDoc.message?.message ?? "Something went wrong!");
        return;
      }

      if (customer_id) {
        await updateDoc("Delivery Stop", customer_id, {
          custom_is_credit: 1,
          custom_sales_invoice: salesDoc?.message?.invoice_name ?? "",
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
    } finally {
      setIsApiCalling(false);
    }
  };

  const handleDeleteItem = (value: number) => {
    setProductItems(productItems.filter((_, index) => index !== value));
  };

  const handleCloseAlert = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleUpdateItem = (value: number, quantity: number) => {
    setProductItems((prev) => {
      const updatedItems = [...prev];
      updatedItems[value].quantity = quantity;
      return updatedItems;
    });
  };

  console.log("isPosOpenEntryFound", isPosOpenEntryFound, productItems);

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
      {(isLoading || isApiCalling) && <LoadingOverlay />}
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
         

          <div className="bg-white shadow-md rounded-lg p-4">
            {/* Selected Items Header */}
            <div className="mb-4">
              <p className="text-xl font-bold text-gray-800">Selected Items</p>
            </div>

            {/* Chargeable and Non-Chargeable Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Non-Chargeable Items Section */}
              <div className="p-4 bg-gray-100 rounded-md">
                <p className="font-semibold text-gray-700 mb-2">Non-Chargeable Items</p>
                <ul className="space-y-2">
                  {productItems
                    .filter((item) => !item.charge_type)
                    .map((item, idx) => (
                      <li key={idx} className="text-gray-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                        {item.item_name}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Chargeable Items Section */}
              <div className="p-4 bg-blue-50 rounded-md">
                <p className="font-semibold text-blue-700 mb-2">Chargeable Items</p>
                <ul className="space-y-2">
                  {productItems
                    .filter((item) => item.charge_type)
                    .map((item, idx) => (
                      <li key={idx} className="text-blue-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        {item.item_name} - ${item.price_list_rate} x {item.quantity} = {item.currency? item.currency : ""} {item.price_list_rate * item.quantity}
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Total Amount Section */}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-800">Chargeable Items Amount:</p>
              <p className="text-lg font-bold text-blue-700">{productItems[0]?.currency? productItems[0]?.currency : ""} {totalAmt}</p>
            </div>
          </div>
          <p className="text-xl text-left font-bold p-4">All Items</p>

          <ProductItem handleAdd={handleAdd} posProfile={posProfile} contract={contractDetails?.name} contract_items = {contractDetails?.custom_items.map(d => d.item)}  />

   
            <div className="mb-4">
              <p className="text-xl font-bold text-gray-800">Selected Items</p>
          
            </div>


          <div className="flex flex-col p-4 gap-3">
            {productItems.length > 0 ? (
              productItems.map((product, idx) => (
                <ProductItemDetails
                  key={idx}
                  item={product}
                  index={idx}
                  handleDelete={handleDeleteItem}
                  handleUpdate={handleUpdateItem}
                />
              ))
            ) : (
              <NoItemSelected />
            )}
          </div>
          {productItems?.length > 0 && (
            <ConfirmationComp
              handleClick={handleCreateInvoice}
              dialogCTAText="Create Invoice"
              dialogTitle="Are you sure you want create Sales Invoice?"
              disabled={loading || isApiCalling}
            >
              <div className="flex justify-end p-4">
                <button
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-fit disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading || isApiCalling}
                >
                  Create Invoice
                </button>
              </div>
            </ConfirmationComp>
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
