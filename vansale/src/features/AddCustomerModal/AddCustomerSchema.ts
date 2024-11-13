import { z } from "zod";

const AddCustomerSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerType: z.enum(["Company", "Individual", "Partnership"], {
    required_error: "Please select a customer type",
  }),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  city: z.string().min(1, "City is required"),
  latitude: z
    .string()
    .regex(
      /^-?((1?[0-7]?|[0-9]?)[0-9]|180)(\.[0-9]{1,10})?$/,
      "Invalid latitude"
    )
    .optional()
    .or(z.literal("")),
  longitude: z
    .string()
    .regex(
      /^-?((1?[0-7]?|[0-9]?)[0-9]|180)(\.[0-9]{1,10})?$/,
      "Invalid longitude"
    )
    .optional()
    .or(z.literal("")),
  addressLine2: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
});

export default AddCustomerSchema;
