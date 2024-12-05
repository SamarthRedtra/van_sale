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
import CancelledStops from "./features/CancelledStops/CancelledStops.tsx";
import PosInvoice from "./features/PosInvoice/PosInvoice.tsx";
import ClosedInvoice from "./features/ClosedInvoice/ClosedInvoice.tsx";
import InvoiceDetails from "./features/PosInvoice/Components/InvoiceDetails.tsx";
import ClosedInvoiceDetails from "./features/ClosedInvoice/Components/InvoiceDetails.tsx";
import SalesInvoicetwo from "./features/SalesInvoicetwo/SalesInvoicetwo.tsx";
import SInvoiceDetails from "./features/SalesInvoicetwo/Components/sInvoiceDetails.tsx";

type isRouteActive = boolean;

type RouteConfig = Array<[string, JSX.Element, isRouteActive]>;

const pageRoutes: RouteConfig = [
  ["/vansale/login", <Login />, true],
  ["/vansale", <DeliveryTrip />, true],
  ["/vansale/delivery-trip/:trip_id", <TripDetails />, true],
  ["/vansale/payment-due-stops", <PaymentDueStops />, true],
  ["/vansale/cancelled-stops", <CancelledStops />, true],
  ["/vansale/pos-invoice", <PosInvoice />, true],
  ["/vansale/closed-invoice", <ClosedInvoice />, true],
  ["/vansale/closed-invoice/:invoiceId", <ClosedInvoiceDetails />, true],
  ["/vansale/pos-invoice/:invoiceId", <InvoiceDetails />, true],
  ["/vansale/s-invoice", <SalesInvoicetwo />, true],
  ["/vansale/s-invoice/:invoiceId", <SInvoiceDetails />, true],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
