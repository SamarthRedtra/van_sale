import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

type PreviewMapProps = {
  lat: number;
  long: number;
};

export default function PreviewMap({ lat, long }: PreviewMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map only if it hasn't been initialized yet
      const map = L.map("map_preview", {
        center: [lat, long],
        zoom: 12,
        zoomSnap: 0.001,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const myIcon = L.icon({
        iconUrl: "/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [15, 41],
        popupAnchor: [-3, -41],
        shadowUrl: "/marker-shadow.png",
        shadowSize: [41, 41],
        shadowAnchor: [15, 41],
      });

      L.marker([lat, long], {
        icon: myIcon,
      }).addTo(map);

      map.zoomControl.remove();
      map.attributionControl.remove();

      mapRef.current = map;
    }

    return () => {
      // Cleanup the map instance on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="map_preview"
      style={{
        borderRadius: "16px",
        height: "440px",
        width: "100%",
        overflow: "hidden",
      }}
    ></div>
  );
}
