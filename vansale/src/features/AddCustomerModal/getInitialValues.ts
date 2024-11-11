const CustomerType = [
  { value: "Company", label: "Company" },
  { value: "Individual", label: "Individual" },
  { value: "Partnership", label: "Partnership" },
];

const getInitialState = () => {
  return {
    customerName: {
      value: "",
      error: "",
    },
    customerType: {
      value: CustomerType[0].value,
      error: "",
    },
    email: {
      value: "",
      error: "",
    },
    mobileNumber: {
      value: "",
      error: "",
    },
    addressLine1: {
      value: "",
      error: "",
    },
    city: {
      value: "",
      error: "",
    },
    latitude: {
      value: "",
      error: "",
    },
    longitude: {
      value: "",
      error: "",
    },
    addressLine2: {
      value: "",
      error: "",
    },
    state: {
      value: "",
      error: "",
    },
    postalCode: {
      value: "",
      error: "",
    },
    country: {
      value: "",
      error: "",
    },
  };
};

export { CustomerType };
export default getInitialState;
