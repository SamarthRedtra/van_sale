import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import getInitialState, { CustomerType } from "./getInitialValues";
import AddCustomerSchema from "./AddCustomerSchema";
import { ZodError } from "zod";
import createCustomer from "@/services/createCustomer";
import Toast from "../Components/Toast";
import { ToastProps } from "@/utils/types";
import LoadingOverlay from "../Loader/LoadingOverlay";
import ConfirmationComp from "../Components/ConfirmationComp";
import addDeliveryStop from "@/services/addDeliveryStop";
import { useParams } from "react-router-dom";

interface AddCustomerModalProps {
  refetch: () => void;
}

export default function AddCustomerModal({ refetch }: AddCustomerModalProps) {
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [isAddToDelivery, setIsAddToDelivery] = useState(false);
  const [formData, setFormData] = useState(getInitialState());
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [toast, setToast] = useState<ToastProps>({
    message: "",
    type: "",
  });

  const handleChange = (key: keyof typeof formData, value: string) => {
    // Check if the key is 'mobileNumber'
    if (key === "mobileNumber") {
      // Filter value to only contain digits 0-9 and limit to 10 characters
      value = value.replace(/\D/g, "").slice(0, 10);
    } else if (key === "postalCode") {
      // Filter value to only contain digits 0-9 and limit to 6 characters
      value = value.replace(/\D/g, "").slice(0, 6);
    } else if (key === "latitude" || key === "longitude") {
      // Filter value to only contain floating point numbers
      value = value.replace(/[^-+.\d]/g, "");
    }

    setFormData({
      ...formData,
      [key]: {
        value: value,
        error: "",
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoadingApi(true);
      const payload = await AddCustomerSchema.parseAsync({
        customerName: formData.customerName.value,
        customerType: formData.customerType.value,
        email: formData.email.value,
        mobileNumber: formData.mobileNumber.value,
        addressLine1: formData.addressLine1.value,
        addressLine2: formData.addressLine2.value,
        city: formData.city.value,
        state: formData.state.value,
        postalCode: formData.postalCode.value,
        latitude: formData.latitude.value,
        longitude: formData.longitude.value,
        country: formData.country.value,
      });

      const res = await createCustomer({
        customer_name: payload.customerName,
        customer_type: payload.customerType,
        email_id: payload?.email || "",
        mobile_number: payload.mobileNumber,
        address_line1: payload.addressLine1,
        address_line2: payload?.addressLine2 || "",
        city: payload.city,
        state: payload?.state || "",
        pincode: payload?.postalCode || "",
        custom_latitude: parseFloat(payload.latitude),
        custom_longitude: parseFloat(payload.longitude),
        country: payload.country,
      });

      if (res) {
        setOpen(false);
        setToast({
          message: "Customer created successfully",
          type: "success",
        });

        setSelectedCustomer(res?.message?.name || "");

        setFormData(getInitialState());

        setTimeout(() => {
          setIsAddToDelivery(true);
        }, 500);
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        error.issues.forEach((issue) => {
          const updatedFormData = { ...formData };
          const key = issue.path[0] as keyof typeof updatedFormData;
          updatedFormData[key].error = issue.message;
          setFormData(updatedFormData);
        });
      } else {
        setToast({
          message: error?.response?.data?.exception || "Something went wrong!",
          type: "error",
        });
        console.error("Error creating the customer :- ", error);
      }
    } finally {
      setIsLoadingApi(false);
    }
  };

  const handleToastClose = () => {
    setToast({
      message: "",
      type: "",
    });
  };

  const handleAddToDeliveryTripClose = async () => {
    try {
      const res = await addDeliveryStop({
        delivery_trip: params?.trip_id || "",
        customer: selectedCustomer,
      });

      if (res) {
        refetch();
        setToast({
          message: "Customer added to delivery trip successfully",
          type: "success",
        });
      }
    } catch (err: any) {
      setToast({
        message: err?.response?.data?.message || "Something went wrong!",
        type: "error",
      });
    } finally {
      setIsAddToDelivery(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">New Customer</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[768px] max-w-[425px] sm:max-h-[90vh] max-h-screen overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>New Customer</DialogTitle>
          </DialogHeader>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="customerName" className="text-sm font-medium">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="customerName"
                value={formData.customerName.value}
                onChange={(e) => handleChange("customerName", e.target.value)}
                required
              />
              {formData.customerName.error && (
                <p className="text-sm font-medium text-destructive">
                  {formData.customerName.error}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="customerType" className="text-sm font-medium">
                Customer Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.customerType.value}
                onValueChange={(value) => handleChange("customerType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CustomerType.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold mt-3">
                  Primary Contact Details
                </h3>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Id
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email.value}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                  {formData.email.error && (
                    <p className="text-sm font-medium text-destructive">
                      {formData.email.error}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="mobile" className="text-sm font-medium">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="mobile"
                    value={formData.mobileNumber.value}
                    onChange={(e) =>
                      handleChange("mobileNumber", e.target.value)
                    }
                    required
                  />
                  {formData.mobileNumber.error && (
                    <p className="text-sm font-medium text-destructive">
                      {formData.mobileNumber.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold mt-3">
                  Primary Address Details
                </h3>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label
                      htmlFor="addressLine1"
                      className="text-sm font-medium"
                    >
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="addressLine1"
                      value={formData.addressLine1.value}
                      onChange={(e) =>
                        handleChange("addressLine1", e.target.value)
                      }
                      required
                    />
                    {formData.addressLine1.error && (
                      <p className="text-sm font-medium text-destructive">
                        {formData.addressLine1.error}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="city" className="text-sm font-medium">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="city"
                      value={formData.city.value}
                      onChange={(e) => handleChange("city", e.target.value)}
                      required
                    />
                    {formData.city.error && (
                      <p className="text-sm font-medium text-destructive">
                        {formData.city.error}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="latitude" className="text-sm font-medium">
                      Latitude
                    </label>
                    <Input
                      id="latitude"
                      placeholder="0.000"
                      value={formData.latitude.value}
                      onChange={(e) => handleChange("latitude", e.target.value)}
                      required
                    />
                    {formData.latitude.error && (
                      <p className="text-sm font-medium text-destructive">
                        {formData.latitude.error}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="longitude" className="text-sm font-medium">
                      Longitude
                    </label>
                    <Input
                      id="longitude"
                      placeholder="0.000"
                      value={formData.longitude.value}
                      onChange={(e) =>
                        handleChange("longitude", e.target.value)
                      }
                      required
                    />
                    {formData.longitude.error && (
                      <p className="text-sm font-medium text-destructive">
                        {formData.longitude.error}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label
                      htmlFor="addressLine2"
                      className="text-sm font-medium"
                    >
                      Address Line 2
                    </label>
                    <Input
                      id="addressLine2"
                      value={formData.addressLine2.value}
                      onChange={(e) =>
                        handleChange("addressLine2", e.target.value)
                      }
                    />
                    {formData.addressLine2.error && (
                      <p className="text-sm font-medium text-destructive">
                        {formData.addressLine2.error}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="state" className="text-sm font-medium">
                      State
                    </label>
                    <Input
                      id="state"
                      value={formData.state.value}
                      onChange={(e) => handleChange("state", e.target.value)}
                    />
                    {formData.state.error && (
                      <p className="text-sm font-medium text-destructive">
                        {formData.state.error}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="postalCode" className="text-sm font-medium">
                      Postal Code
                    </label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode.value}
                      onChange={(e) =>
                        handleChange("postalCode", e.target.value)
                      }
                    />
                    {formData.postalCode.error && (
                      <p className="text-sm font-medium text-destructive">
                        {formData.postalCode.error}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="country" className="text-sm font-medium">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="country"
                      value={formData.country.value}
                      onChange={(e) => handleChange("country", e.target.value)}
                      required
                    />
                    {formData.country.error && (
                      <p className="text-sm font-medium text-destructive">
                        {formData.country.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {toast.type === "error" && (
              <div
                className="flex items-center p-4 mb-4 text-sm text-red-800 bg-red-100 border border-red-300 rounded-lg"
                role="alert"
              >
                <span className="font-medium">{toast.message}</span>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#0050b5] text-white py-1 px-3 text-sm font-semibold rounded-lg"
                onClick={handleSubmit}
                disabled={isLoadingApi}
              >
                {isLoadingApi && <LoadingOverlay />}
                Create Customer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}
      {isAddToDelivery && (
        <ConfirmationComp
          handleClick={handleAddToDeliveryTripClose}
          dialogCTAText="Add to Delivery Trip"
          dialogTitle="Are you sure you want to add to delivery trip?"
          disabled={isLoadingApi}
          isOpen={isAddToDelivery}
          key={`${isAddToDelivery}-${isLoadingApi}`}
        />
      )}
    </>
  );
}
