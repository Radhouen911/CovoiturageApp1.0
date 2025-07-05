import { useEffect, useRef } from "react";

const MapComponent = ({ from, to, onFromChange, onToChange }) => {
  const mapRef = useRef(null);
  const markerFromRef = useRef(null);
  const markerToRef = useRef(null);

  useEffect(() => {
    // Load Leaflet if not already loaded
    if (!window.L) {
      const leafletScript = document.createElement("script");
      leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      document.head.appendChild(leafletScript);

      const leafletCSS = document.createElement("link");
      leafletCSS.rel = "stylesheet";
      leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(leafletCSS);

      leafletScript.onload = initializeMap;
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current) {
        mapRef.current = window.L.map("map").setView([36.8065, 10.1815], 7); // Centered on Tunisia
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 12,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        ).addTo(mapRef.current);

        markerFromRef.current = window.L.marker([36.8065, 10.1815], {
          draggable: true,
        }).addTo(mapRef.current);
        markerToRef.current = window.L.marker([36.8065, 10.1815], {
          draggable: true,
        }).addTo(mapRef.current);

        markerFromRef.current.on("dragend", (e) => {
          const latlng = e.target.getLatLng();
          reverseGeocode(latlng, onFromChange);
        });

        markerToRef.current.on("dragend", (e) => {
          const latlng = e.target.getLatLng();
          reverseGeocode(latlng, onToChange);
        });

        updateMapFromFields();
      }
    }

    function updateMapFromFields() {
      if (from && markerFromRef.current) {
        geocode(from, (latlng) => {
          if (latlng) {
            markerFromRef.current.setLatLng(latlng).update();
            if (markerToRef.current)
              mapRef.current.fitBounds([
                markerFromRef.current.getLatLng(),
                markerToRef.current.getLatLng(),
              ]);
          }
        });
      }
      if (to && markerToRef.current) {
        geocode(to, (latlng) => {
          if (latlng) {
            markerToRef.current.setLatLng(latlng).update();
            if (markerFromRef.current)
              mapRef.current.fitBounds([
                markerFromRef.current.getLatLng(),
                markerToRef.current.getLatLng(),
              ]);
          }
        });
      }
    }

    function geocode(address, callback) {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&countrycodes=tn&viewbox=6.9,37.3,11.6,33.0&bounded=1`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            callback({ lat: parseFloat(lat), lng: parseFloat(lon) });
          }
        })
        .catch((error) => console.error("Geocoding error:", error));
    }

    function reverseGeocode(latlng, callback) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&countrycodes=tn&addressdetails=1`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.address && data.address.city) {
            callback(data.address.city);
          } else if (data && data.address && data.address.town) {
            callback(data.address.town);
          } else if (data && data.display_name) {
            callback(data.display_name.split(",")[0]); // Fallback to first part
          }
        })
        .catch((error) => console.error("Reverse geocoding error:", error));
    }

    // Update map when from or to changes
    updateMapFromFields();
  }, [from, to, onFromChange, onToChange]);

  return (
    <div
      id="map"
      style={{
        height: "400px",
        width: "100%",
        margin: "20px 0",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    ></div>
  );
};

export default MapComponent;
