import { useEffect, useState } from "react";
import type { PItem } from "../../../utils/types";
import Input from "../../login/components/Input";
import zod from "zod";
import ProductItemSchema from "./productItemSchema";
import { Autocomplete, TextField } from "@mui/material";
import getItemList from "../../../services/getItemList";

interface ProductItemProps {
  posProfile?: string;
  handleAdd: (
    item: {
      quantity: number;
      price: number;
      discount: number;
      amount: number;
    } & PItem
  ) => void;
}

type FormData = {
  price: {
    value: string;
    error: string;
  };
  margin_type: {
    value: string;
    error: string;
  };
  quantity: {
    value: string;
    error: string;
  };
  discount: {
    value: string;
    error: string;
  };
  amount: {
    value: string;
    error: string;
  };
};

export default function ProductItem({
  posProfile,
  handleAdd,
  contract_items,
  contract
}: ProductItemProps) {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<PItem | null>(null);
  const [searchItem, setSearchItem] = useState<PItem[]>([]);
  const [formData, setFormData] = useState<FormData>({
    price: {
      value: "",
      error: "",
    },
    margin_type: {
      value: "Percentage",
      error: "",
    },
    quantity: {
      value: "",
      error: "",
    },
    discount: {
      value: "",
      error: "",
    },
    amount: {
      value: "",
      error: "",
    },
  });

  const handleChange = (key: keyof FormData, value: string) => {
    if (
      key === "quantity" &&
      selectedItem &&
      +value > selectedItem.actual_qty
    ) {
      setFormData({
        ...formData,
        [key]: {
          value: value,
          error: "Quantity must be less than or equal to actual quantity",
        },
      });
      return;
    }
    setFormData({
      ...formData,
      [key]: {
        value: value,
        error: "",
      },
    });
  };

  useEffect(() => {
    if (!posProfile) return;
    (async () => {
      const itemRes = await getItemList({
        pos_profile: posProfile,
        search_term: search,
      });

      if (itemRes?.message?.items && itemRes?.message?.items.length > 0) {
        setSearchItem(itemRes.message.items);
      } else {
        setSearchItem([]);
      }
    })();
  }, [search, posProfile]);

  const handleAddProduct = async () => {
    if (!selectedItem) return;

    try {
      await ProductItemSchema.parseAsync({
        price: String(selectedItem.price_list_rate || 0),
        margin_type: formData.margin_type.value,
        quantity: formData.quantity.value,
        discount: formData.discount.value,
        amount: formData.amount.value,
      });
      handleAdd({
        ...selectedItem,
        price: Number(formData.price.value),
        quantity: Number(formData.quantity.value),
        discount:
          formData.margin_type.value === "Percentage"
            ? Number(formData.discount.value ?? 0)
            : (Number(formData.amount.value ?? 0) * 100) /
              Number(selectedItem.price_list_rate),
        amount:
          formData.margin_type.value === "Amount"
            ? Number(formData.amount.value ?? 0)
            : (Number(selectedItem.price_list_rate) *
                Number(formData.discount.value ?? 0)) /
              100,
        charge_type: contract_items.includes(selectedItem.item_code)? false : true,     
        contract:contract 
      });

      setFormData({
        price: {
          value: "",
          error: "",
        },
        margin_type: {
          value: "Percentage",
          error: "",
        },
        quantity: {
          value: "",
          error: "",
        },
        discount: {
          value: "",
          error: "",
        },
        amount: {
          value: "",
          error: "",
        },
      });
    } catch (err) {
      if (err instanceof zod.ZodError) {
        const updatedFormData = {
          ...formData,
        };

        err.issues.forEach((error) => {
          const key = error.path[0] as keyof FormData;

          updatedFormData[key] = {
            value: formData[key].value,
            error: error.message,
          };

          setFormData(updatedFormData);
        });
      }
    }
  };

  const handleSelectItem = (item_name: string) => {
    if (!item_name) {
      setSelectedItem(null);
      return;
    }

    const itemFound = searchItem.find((item) => item.item_name === item_name);

    if (itemFound) {
      setSelectedItem(itemFound);
    }
  };

  return (
    <div className="flex flex-col gap-2 m-4 border rounded-md p-4 shadow-sm bg-white text-sm">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col items-start gap-2 flex-1 justify-between">
          <p className="font-semibold">Name:</p>
          <Autocomplete
            fullWidth
            options={searchItem?.map((item) => item.item_name) ?? []}
            renderInput={(params) => <TextField {...params} />}
            onInputChange={(_, value) => setSearch(value ?? "")}
            onChange={(_, value) => handleSelectItem(value ?? "")}
            sx={{
              "& .MuiOutlinedInput-root": {},
              "& .MuiInputBase-root": {
                padding: "0.5rem 0.5rem !important",
                height: "40px !important",
              },
            }}
          />
        </div>
        <div className="flex gap-2 flex-1 flex-col items-start">
          <p className="font-semibold">Available:</p>
          <Input
            value={selectedItem?.actual_qty ?? 0}
            disabled
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 items-start flex-1">
          <label htmlFor="price" className="font-medium">
            Price
          </label>
          <Input
            value={selectedItem?.price_list_rate ?? 0}
            disabled
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
            error={formData.quantity.error}
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

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 items-start flex-1 justify-between">
          <label htmlFor="discountType" className="font-medium">
            Discount Type
          </label>
          <select
            id="discountType"
            value={formData.margin_type.value}
            onChange={(e) => handleChange("margin_type", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Percentage">Percentage</option>
            <option value="Amount">Amount</option>
          </select>
        </div>

        {formData.margin_type.value === "Percentage" ? (
          <div className="flex flex-col gap-2 items-start flex-1">
            <label htmlFor="discount" className="font-medium">
              Discount
            </label>
            <Input
              id="discount"
              name="discount"
              type="number"
              autoComplete="discount"
              required
              error={formData.discount.error}
              value={formData.discount.value}
              onChange={(e: { target: { value: string } }) => {
                let value: string | number = e.target.value;
                if (+value < 0) {
                  value = 0;
                } else if (+value > 100) {
                  value = 100;
                }
                handleChange("discount", String(value));
              }}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-start flex-1">
            <label htmlFor="amount" className="font-medium">
              Amount
            </label>
            <Input
              id="amount"
              name="amount"
              type="number"
              autoComplete="amount"
              required
              error={formData.amount.error}
              value={formData.amount.value}
              onChange={(e: { target: { value: string } }) => {
                let value: string | number = e.target.value;
                if (+value < 0) {
                  value = 0;
                }
                handleChange("amount", String(value));
              }}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleAddProduct}
          disabled={!selectedItem}
          className="disabled:opacity-50 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-fit"
        >
          Add
        </button>
      </div>
    </div>
  );
}
