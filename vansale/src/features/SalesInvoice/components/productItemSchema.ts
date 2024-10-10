import { z as zod } from "zod";

const ProductItemSchema = zod
  .object({
    price: zod
      .string({ invalid_type_error: "Required" })
      .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
        message: "Price must be a number greater than 0",
      }),
    margin_type: zod.string(),
    quantity: zod
      .string({ invalid_type_error: "Required" })
      .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
        message: "Quantity must be a number greater than 0",
      }),
    discount: zod.string({ invalid_type_error: "Required" }).nullable(), // Make discount optional since it's conditionally validated
    amount: zod.string({ invalid_type_error: "Required" }).nullable(), // Make amount optional since it's conditionally validated
  })
  .refine(
    (data) => {
      if (data.margin_type === "Percentage") {
        return (
          data.discount !== undefined && data?.discount && +data.discount > 0
        );
      } else {
        return true;
      }
    },
    {
      message: "Discount must be a number greater than 0",
      path: ["discount"], // This sets the error path for either discount or amount
    }
  )
  .refine(
    (data) => {
      if (data.margin_type === "Amount") {
        return data.amount !== undefined && data?.amount && +data.amount > 0;
      } else {
        return true;
      }
    },
    {
      message: "Amount must be a number greater than 0",
      path: ["amount"], // This sets the error path for either discount or amount
    }
  );

export default ProductItemSchema;
