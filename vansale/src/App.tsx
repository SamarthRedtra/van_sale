import "./App.css";
import { FrappeProvider } from "frappe-react-sdk";
import AppRoutes from "./AppRoutes";
import { BrowserRouter } from "react-router-dom";

function App() {
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
