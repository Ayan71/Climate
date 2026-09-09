import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Info } from 'lucide-react';

// Custom Marker Icon for Leaflet
const createCustomIcon = (color = '#0d9488') => {
  const svgHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
    </svg>
  `;
  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const defaultIcon = createCustomIcon('#0d9488');

const MapView = ({ data = [], title = 'India Coordinates Map' }) => {
  // Center map on India (approx 22.59, 78.96)
  const center = [22.5937, 78.9629];
  const zoom = 5;

  const validPoints = data.filter(
    (p) =>
      typeof p.latitude === 'number' &&
      !isNaN(p.latitude) &&
      typeof p.longitude === 'number' &&
      !isNaN(p.longitude)
  );

  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span>Showing <strong>{validPoints.length}</strong> geographical telemetry stations across India</span>
        </div>
      </div>

      <div className="relative w-full h-[450px] md:h-[520px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {validPoints.map((point, index) => (
            <Marker
              key={index}
              position={[point.latitude, point.longitude]}
              icon={defaultIcon}
            >
              <Tooltip direction="top" offset={[0, -30]} opacity={1} permanent={false}>
                <div className="font-semibold text-slate-900">
                  {point.name || point.city || `Point ${index + 1}`}
                </div>
                <div className="text-xs text-emerald-600 font-bold">
                  Value: {point.value}
                </div>
              </Tooltip>

              <Popup>
                <div className="p-1 min-w-[200px] text-slate-800">
                  <div className="flex items-center space-x-1 font-bold text-sm text-slate-900 border-b pb-1 mb-2">
                    <Info className="w-4 h-4 text-emerald-600" />
                    <span>{point.name || point.city || 'Station Details'}</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p><strong>Latitude:</strong> {point.latitude}</p>
                    <p><strong>Longitude:</strong> {point.longitude}</p>
                    <p className="text-emerald-700 font-bold text-sm pt-1">
                      <strong>Reading Value:</strong> {point.value}
                    </p>
                    {point.city && <p><strong>City/Location:</strong> {point.city}</p>}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
