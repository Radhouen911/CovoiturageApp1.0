import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = ({ 
  center = [48.8566, 2.3522], // Default to Paris
  zoom = 13,
  markers = [],
  route = null,
  onMapClick = null,
  className = "",
  height = "400px"
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Add click handler
    if (onMapClick) {
      mapInstanceRef.current.on('click', (e) => {
        onMapClick({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        });
      });
    }

    setIsMapLoaded(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData, index) => {
      const marker = L.marker([markerData.latitude, markerData.longitude])
        .addTo(mapInstanceRef.current);

      if (markerData.popup) {
        marker.bindPopup(markerData.popup);
      }

      if (markerData.title) {
        marker.bindTooltip(markerData.title);
      }

      markersRef.current.push(marker);
    });
  }, [markers, isMapLoaded]);

  // Update route when route prop changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded || !route) return;

    // Remove existing route
    if (routeRef.current) {
      mapInstanceRef.current.removeLayer(routeRef.current);
    }

    // Add new route
    if (route.coordinates && route.coordinates.length > 0) {
      const routeLayer = L.polyline(route.coordinates, {
        color: route.color || '#007bff',
        weight: route.weight || 4,
        opacity: route.opacity || 0.8
      }).addTo(mapInstanceRef.current);

      routeRef.current = routeLayer;

      // Fit map to route bounds
      mapInstanceRef.current.fitBounds(routeLayer.getBounds(), {
        padding: [20, 20]
      });
    }
  }, [route, isMapLoaded]);

  // Update center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current && isMapLoaded) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom, isMapLoaded]);

  return (
    <div 
      ref={mapRef} 
      className={`map-container ${className}`}
      style={{ height }}
    >
      <style>{`
        .map-container {
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Map; 