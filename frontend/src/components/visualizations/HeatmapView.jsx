import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import indiaGeoJSON from '../../data/india-states.json';
import { Layers, Info } from 'lucide-react';

const getColor = (value, minVal, maxVal) => {
  if (value === undefined || value === null || isNaN(value)) return '#cbd5e1';
  const range = maxVal - minVal || 1;
  const ratio = (value - minVal) / range;

  if (ratio > 0.8) return '#0f766e'; // deep teal
  if (ratio > 0.6) return '#0d9488'; // teal
  if (ratio > 0.4) return '#14b8a6'; // medium emerald
  if (ratio > 0.2) return '#5eead4'; // light emerald
  return '#ccfbf1'; // soft teal
};

const HeatmapView = ({ data = [], title = 'India State-wise Heatmap' }) => {
  const [hoveredState, setHoveredState] = useState(null);

  // Map state values
  const valueMap = {};
  let minVal = Infinity;
  let maxVal = -Infinity;

  data.forEach((item) => {
    const sName = item.state || item.originalState;
    const val = parseFloat(item.value);
    if (sName && !isNaN(val)) {
      valueMap[sName.toLowerCase()] = val;
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
    }
  });

  if (minVal === Infinity) minVal = 0;
  if (maxVal === -Infinity) maxVal = 100;

  const styleFeature = (feature) => {
    const stateName = feature.properties.ST_NM || '';
    const val = valueMap[stateName.toLowerCase()];
    return {
      fillColor: getColor(val, minVal, maxVal),
      weight: 1.5,
      opacity: 1,
      color: '#ffffff',
      dashArray: '3',
      fillOpacity: 0.85,
    };
  };

  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.ST_NM || 'State';
    const val = valueMap[stateName.toLowerCase()];

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 3,
          color: '#0f766e',
          fillOpacity: 0.95,
        });
        setHoveredState({ name: stateName, value: val !== undefined ? val : 'N/A' });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(styleFeature(feature));
        setHoveredState(null);
      },
    });
  };

  const center = [22.5937, 78.9629];
  const zoom = 5;

  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          <Layers className="w-4 h-4 text-teal-600" />
          <span>Interactive State-level Heatmap (Min: <strong>{minVal}</strong>, Max: <strong>{maxVal}</strong>)</span>
        </div>

        {hoveredState && (
          <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1 bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 rounded-full border border-teal-300 dark:border-teal-700 animate-pulse">
            <Info className="w-3.5 h-3.5" />
            <span>{hoveredState.name}: {hoveredState.value}</span>
          </div>
        )}
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

          <GeoJSON
            data={indiaGeoJSON}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 right-4 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Intensity Legend</p>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-500">Low</span>
            <div className="w-4 h-3 rounded" style={{ backgroundColor: '#ccfbf1' }}></div>
            <div className="w-4 h-3 rounded" style={{ backgroundColor: '#5eead4' }}></div>
            <div className="w-4 h-3 rounded" style={{ backgroundColor: '#14b8a6' }}></div>
            <div className="w-4 h-3 rounded" style={{ backgroundColor: '#0d9488' }}></div>
            <div className="w-4 h-3 rounded" style={{ backgroundColor: '#0f766e' }}></div>
            <span className="text-[10px] text-slate-500">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapView;
