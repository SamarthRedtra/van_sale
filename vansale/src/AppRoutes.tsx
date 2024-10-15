import { Route, Routes, useNavigate } from "react-router-dom";
import DeliveryTrip from "./features/DeliveryTrip/DeliveryTrip.tsx";
import NotFound from "./features/NotFound/NotFound.tsx";
import { Page } from "./features/Page/Page.tsx";
import TripDetails from "./features/TripDetails/TripDetails.tsx";
import DeliveryStopDetails from "./features/DeliveryStopDetails/DeliveryStopDetails.tsx";
import Login from "./features/login/Login.tsx";
import { useFrappeAuth } from "frappe-react-sdk";
import { useEffect } from "react";
import SalesInvoice from "./features/SalesInvoice/SalesInvoice.tsx";
import PaymentDueStops from "./features/PaymentDueStops/PaymentDueStops.tsx";

type isRouteActive = boolean;

type RouteConfig = Array<[string, JSX.Element, isRouteActive]>;

const pageRoutes: RouteConfig = [
  ["/vansale/login", <Login />, true],
  ["/vansale", <DeliveryTrip />, true],
  ["/vansale/delivery-trip/:trip_id", <TripDetails />, true],
  ["/vansale/payment-due-stops", <PaymentDueStops />, true],
  [
    "/vansale/delivery-trip/:trip_id/:customer_id",
    <DeliveryStopDetails />,
    true,
  ],
  [
    "/vansale/delivery-trip/:trip_id/:customer_id/sales-invoice",
    <SalesInvoice />,
    true,
  ],
];

export default function AppRoutes() {
  const { currentUser, isLoading } = useFrappeAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!currentUser) {
      navigate("/vansale/login");
    }
  }, [isLoading, currentUser]);

  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      {pageRoutes.map(
        ([path, element, isRouteActive]) =>
          isRouteActive && (
            <Route
              key={path}
              path={path}
              element={<Page key={path}>{element}</Page>}
            />
          )
      )}
    </Routes>
  );
}
