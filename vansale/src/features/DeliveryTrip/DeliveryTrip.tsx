import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select.tsx";
import LoadingOverlay from "../Loader/LoadingOverlay.tsx";
import Header from "../Components/Header.tsx";
import PosOpen from "./components/PosOpen.tsx";
import getPosProfiles from "@/services/getPosProfiles";
import Cookies from "js-cookie";

export default function DeliveryTrip() {
  const [search, setSearch] = useState("");
  const [deliveryTrips, setDeliveryTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [posProfiles, setPosProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch POS Profiles API
  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const profiles: any = await getPosProfiles();
      setPosProfiles(profiles || []);
    } catch (error) {
      console.error("Error fetching POS profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfileToCookie = (profileId: string) => {
    Cookies.set("selectedPosProfile", profileId, { expires: 7 }); // Save for 7 days
    setSelectedProfile(profileId);
    setShowModal(false);
  };

  const checkCookieForProfile = () => {
    const cookieProfile = Cookies.get("selectedPosProfile");
    if (cookieProfile) {
      setSelectedProfile(cookieProfile);
      return true; // Profile exists in cookie
    }
    return false; // Profile not found in cookie
  };

  useEffect(() => {
    // Check if the profile is in the cookie
    const isProfileSet = checkCookieForProfile();
    if (!isProfileSet) {
      fetchProfiles(); // Fetch profiles only if no profile is set in the cookie
      setShowModal(true); // Show modal if no profile is set
    }
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      // Fetch delivery trips logic here based on the selected profile
      console.log("Selected Profile:", selectedProfile);
    }
  }, [selectedProfile]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="mx-auto min-h-screen">
      {isLoading && <LoadingOverlay />}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded shadow-md max-w-md w-full">
            <h2 className="text-lg font-semibold mb-6">Select POS Profile</h2>
            {posProfiles.length ? (
              <Select
                onValueChange={(value) => {
                  saveProfileToCookie(value);
                }}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left shadow-sm">
                  <SelectValue placeholder="Select POS" />
                </SelectTrigger>
                <SelectContent className="z-[9999] bg-white rounded-md shadow-lg">
                  {posProfiles.map((profile) => (
                    <SelectItem key={profile.name} value={profile.name}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p>No POS profiles found</p>
            )}
          </div>
        </div>
      )}

      {selectedProfile && (
        <>
          <div className="bg-white shadow">
            <Header title="POS" />
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

            <div className="mt-4 flex flex-col gap-4">
              <PosOpen pos_profile={selectedProfile}/>
              {/* Map over filtered delivery trips */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}