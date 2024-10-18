import { PItem } from "../../../utils/types";

interface IPItem {
  item: {
    quantity: number;
    price: number;
    discount: number;
    amount: number;
  } & PItem;
  index: number;
  handleDelete: (value: number) => void;
}

export default function ProductItemDetails({
  item,
  index,
  handleDelete,
}: IPItem) {
  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-2 gap-2">
          <h2 className="text-xl font-bold text-gray-800 flex-1 truncate text-start">
            {item.item_name ?? "-"}
          </h2>
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded text-start">
            {(item?.discount ?? 0).toFixed(2)}% OFF
          </span>
          <button
            className="w-8 h-8 flex items-center  justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full transition duration-300 ease-in-out"
            onClick={() => handleDelete(index)}
            aria-label="Delete product"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Quantity:</span>
            <span className="text-sm text-gray-800">{item.quantity}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              Unit of Measure (UOM):
            </span>
            <span className="text-sm text-gray-800">{item.uom}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Rate:</span>
            <span className="text-sm text-gray-800">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: item.currency,
              }).format(item?.price_list_rate ?? 0)}{" "}
              / {item.uom}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-bold">Total Amount:</span>
          <span className="text-lg font-semibold text-green-600">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: item.currency,
            }).format(
              (item.price_list_rate ?? 0) * (item?.quantity ?? 0) -
                (item?.amount ?? 0) * (item?.quantity ?? 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
