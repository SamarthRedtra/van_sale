import { PropsWithChildren } from "react";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary.tsx";
import AppContextProvider from "../../contexts/AppContext.tsx";

export const Page: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundary>
      <AppContextProvider>{children}</AppContextProvider>
    </ErrorBoundary>
  );
};
