import "./App.css";
import { FrappeProvider } from "frappe-react-sdk";
import AppRoutes from "./AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

const askNotificationPermission = async () => {
  if ("Notification" in window && "serviceWorker" in navigator) {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.log("Notification permission denied.");
    }
  }
};

function App() {
  useEffect(() => {
    askNotificationPermission();
  }, []);

  return (
    <div className="App">
      <FrappeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </FrappeProvider>
    </div>
  );
}

export default App;
