import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Fix default icon paths
const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({ locations, center, zoom = 15, height = '500px' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Don't initialize if ref is not available
    if (!mapRef.current) return;

    // Determine center and zoom
    let mapCenter = center;
    let mapZoom = zoom;

    // Convert center to array format if it's an object
    if (mapCenter && typeof mapCenter === 'object' && !Array.isArray(mapCenter)) {
      mapCenter = [mapCenter.lat, mapCenter.lng];
    }

    // If no center provided, calculate from locations
    if (!mapCenter && locations && locations.length > 0) {
      if (locations.length === 1) {
        mapCenter = [locations[0].lat, locations[0].lng];
        mapZoom = 15;
      } else {
        // Calculate bounds for multiple locations
        const bounds = L.latLngBounds(
          locations
            .filter(loc => loc.lat && loc.lng)
            .map(loc => [loc.lat, loc.lng])
        );
        
        if (!bounds.isValid()) {
          mapCenter = [20.5937, 78.9629]; // Default to India
          mapZoom = 5;
        } else {
          const centerPoint = bounds.getCenter();
          mapCenter = [centerPoint.lat, centerPoint.lng];
        }
      }
    } else {
      mapCenter = mapCenter || [20.5937, 78.9629]; // Default to India
    }

    // Initialize map if not already created
    if (!mapInstanceRef.current) {
      const centerCoords = Array.isArray(mapCenter) ? mapCenter : [mapCenter.lat || 20.5937, mapCenter.lng || 78.9629];
      mapInstanceRef.current = L.map(mapRef.current, {
        center: centerCoords,
        zoom: mapZoom,
        zoomControl: true,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for each location
    if (locations && locations.length > 0) {
      locations.forEach((location, index) => {
        if (!location.lat || !location.lng) return;

        const marker = L.marker([location.lat, location.lng], {
          title: location.name || location.title || `Location ${index + 1}`,
        }).addTo(map);

        // Create popup content
        const hasInfo = location.name || location.title || location.description || location.address;
        if (hasInfo) {
          const popupContent = `
            <div style="padding: 8px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">
                ${location.name || location.title || 'Pickup Location'}
              </h3>
              ${location.description ? `<p style="margin: 0; color: #666; font-size: 14px;">${location.description}</p>` : ''}
              ${location.address ? `<p style="margin: 4px 0 0 0; color: #888; font-size: 12px;">${location.address}</p>` : ''}
            </div>
          `;
          marker.bindPopup(popupContent);

          // If single location, open popup automatically
          if (locations.length === 1) {
            setTimeout(() => {
              marker.openPopup();
            }, 300);
          }
        }

        markersRef.current.push(marker);
      });

      // Fit bounds if multiple locations
      if (locations.length > 1) {
        const validLocations = locations.filter(loc => loc.lat && loc.lng);
        if (validLocations.length > 0) {
          const bounds = L.latLngBounds(
            validLocations.map(loc => [loc.lat, loc.lng])
          );
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [20, 20] });
          }
        }
      } else if (locations.length === 1 && locations[0].lat && locations[0].lng) {
        // Center on single location
        map.setView([locations[0].lat, locations[0].lng], mapZoom);
      }
    } else if (mapCenter) {
      // Just center the map if no locations
      const centerCoords = Array.isArray(mapCenter) ? mapCenter : [mapCenter.lat || 20.5937, mapCenter.lng || 78.9629];
      map.setView(centerCoords, mapZoom);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach(marker => {
          mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];
      }
    };
  }, [locations, center, zoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%', margin: '20px 0', borderRadius: '8px', overflow: 'hidden', zIndex: 0 }} 
      aria-label="Map"
    />
  );
};

export default Map;
