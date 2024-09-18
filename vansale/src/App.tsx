import "./App.css";
import { FrappeProvider } from "frappe-react-sdk";

function App() {
  return (
    <div className="App">
      <FrappeProvider>
        <>
          <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
            <div className="bg-white shadow">
              <div className="flex justify-between items-center p-4">
                <h1 className="text-xl font-bold">My Trips</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">🔔</span>
                  <span className="text-2xl">☰</span>
                </div>
              </div>
              <div className="bg-purple-500 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">
                    My Planned Trips
                  </span>
                  <button className="bg-white text-purple-500 px-3 py-1 rounded-full text-sm">
                    Today
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="relative">
                <svg
                  className="w-5 h-5 absolute left-3 top-3 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Type here to search"
                  className="w-full pl-10 pr-4 py-2 border rounded-full"
                />
              </div>

              <div className="mt-4 space-y-4">
                {["Scheduled For Today", "Upcoming", "Completed"].map(
                  (status, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold">Pune To Mumbai</h2>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            status === "Scheduled For Today"
                              ? "bg-yellow-100 text-yellow-800"
                              : status === "Upcoming"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        6 Delivery Stops
                      </p>
                      <div className="flex justify-between text-sm mb-2">
                        <span>🚗 13:15</span>
                        <span>📅 Today</span>
                        <span>👤 Avinash</span>
                      </div>
                      <button className="w-full bg-blue-500 text-white py-2 rounded">
                        View
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </>
      </FrappeProvider>
    </div>
  );
}

export default App;
