import { useState } from "react";
import type { PItem } from "../../../utils/types";
import Input from "../../login/components/Input";

interface ProductItemProps {
  item: PItem;
  handleAdd: (item: { quantity: number; price: number } & PItem) => void;
}

type FormData = {
  price: {
    value: string;
    error: string;
  };
  quantity: {
    value: string;
    error: string;
  };
};

export default function ProductItem({ item, handleAdd }: ProductItemProps) {
  const [formData, setFormData] = useState<FormData>({
    price: {
      value: "",
      error: "",
    },
    quantity: {
      value: "",
      error: "",
    },
  });

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [key]: {
        value: value,
        error: "",
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 m-4 border rounded-md p-6 shadow-sm bg-white">
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2 flex-1">
          <p className="font-semibold">Name:</p>
          <p>{item.item_name}</p>
        </div>
        <div className="flex gap-2 flex-1">
          <p className="font-semibold">Rate:</p>
          <p>
            {item?.price_list_rate ?? 0} / {item.uom}
          </p>
        </div>
        <div className="flex gap-2 flex-1">
          <p className="font-semibold">Available:</p>
          <p>{item?.actual_qty ?? 0}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 items-start flex-1">
          <label htmlFor="price" className="font-medium">
            Price
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            autoComplete="price"
            required
            value={formData.price.value}
            onChange={(e: { target: { value: string } }) =>
              handleChange("price", e.target.value)
            }
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div className="flex flex-col gap-2 items-start flex-1">
          <label htmlFor="quantity" className="font-medium">
            Quantity
          </label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            autoComplete="quantity"
            required
            value={formData.quantity.value}
            onChange={(e: { target: { value: string } }) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                handleChange("quantity", value);
              }
            }}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
      </div>
      <div>
        <button
          onClick={() =>
            handleAdd({
              ...item,
              price: Number(formData.price.value),
              quantity: Number(formData.quantity.value),
            })
          }
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-fit"
        >
          Add
        </button>
      </div>
    </div>
  );
}
