import React, { useEffect, useState } from "react";
import DeliveryTripDetailCard from "./components/DeliveryTripDetailCard";
import { DeliveryTripDetails } from "../../utils/types";
import getDeliveryDetails from "../../services/getTripDetails.tsx";
import LoadingOverlay from "../Loader/LoadingOverlay.tsx";
import NoTripFound from "./components/NoTripFound.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Bell, LogOut, Menu } from "lucide-react";
import { useFrappeAuth } from "frappe-react-sdk";

export default function DeliveryTrip() {
  const [search, setSearch] = useState("");
  const [deliveryTrips, setDeliveryTrips] = useState<DeliveryTripDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useFrappeAuth();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await getDeliveryDetails();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        res && setDeliveryTrips(res?.message?.data ?? []);
      } catch (err) {
        console.error(
          "ERROR IN DELIVERY TRIPS :- ",
          JSON.stringify(err, null, 2)
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filteredTrips = deliveryTrips.filter((trip) => {
    return (
      trip?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
      trip?.custom_route?.toLowerCase()?.includes(search.toLowerCase())
    );
  });

  const handleLogoutClick = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="mx-auto min-h-screen">
      <div className="bg-white shadow">
        <div className="flex justify-between items-center p-4">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
          <h1 className="text-xl font-bold">My Trips</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogoutClick}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
          {/* <h1 className="text-xl font-bold">My Trips</h1> */}
          {/* <div className="flex items-center space-x-4">
            <span className="text-2xl">🔔</span>
            <span className="text-2xl">☰</span>
          </div> */}
        </div>
        <div className="bg-purple-500 p-4">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">My Planned Trips</span>
            {/* <button className="bg-white text-purple-500 px-3 py-1 rounded-full text-sm">
              Today
            </button> */}
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
            value={search}
            type="text"
            placeholder="Type here to search"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            onChange={handleSearch}
          />
        </div>
        {isLoading && <LoadingOverlay />}
        {!isLoading && (
          <div className="mt-4 flex flex-col gap-4">
            {filteredTrips.length ? (
              filteredTrips.map((item, index) => (
                <DeliveryTripDetailCard key={index} tripDetails={item} />
              ))
            ) : (
              <NoTripFound />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
