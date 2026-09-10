import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import indiaGeoJSON from '../../data/india-states.json';
import { Layers, Info } from 'lucide-react';

const getColor = (value, minVal, maxVal) => {
  if (value === undefined || value === null || isNaN(value)) return '#cbd5e1';
  const range = maxVal - minVal || 1;
  const ratio = (value - minVal) / range;

  if (ratio > 0.8) return '#d97706'; // darker amber/gold
  if (ratio > 0.6) return '#f59e0b'; // amber
  if (ratio > 0.4) return '#fbbf24'; // yellow
  if (ratio > 0.2) return '#fde047'; // light yellow
  return '#fef9c3'; // soft cream/yellow
};

const HeatmapView = ({ data = [] }) => {
  const [hoveredState, setHoveredState] = useState(null);

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
      color: '#334155',
      dashArray: '',
      fillOpacity: 0.85,
    };
  };

  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.ST_NM || 'State';
    const stateCode = feature.properties.state_code || '';
    const val = valueMap[stateName.toLowerCase()];

    // Permanent tooltip displaying state code
    if (stateCode) {
      layer.bindTooltip(
        `<div style="font-weight:bold; font-size:11px; color:#0f172a;">${stateCode}</div>`,
        { permanent: true, direction: 'center', className: 'state-code-label' }
      );
    }

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 3,
          color: '#0f172a',
          fillOpacity: 0.95,
        });
        setHoveredState({ name: stateName, code: stateCode, value: val !== undefined ? val : 'N/A' });
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
    <div className="w-full flex flex-col space-y-2 font-sans">
      <div className="flex items-center justify-between px-1 text-xs text-slate-600">
        <div className="flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-slate-700" />
          <span>India State-level Choropleth Heatmap (Min: <strong>{minVal}</strong>, Max: <strong>{maxVal}</strong>)</span>
        </div>

        {hoveredState && (
          <div className="flex items-center space-x-1 px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold border border-slate-300">
            <Info className="w-3.5 h-3.5" />
            <span>{hoveredState.name} ({hoveredState.code}): {hoveredState.value}</span>
          </div>
        )}
      </div>

      <div className="relative w-full h-[450px] rounded border border-slate-200 overflow-hidden shadow-sm">
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
        <div className="absolute bottom-3 right-3 z-[400] bg-white p-2.5 rounded shadow border border-slate-200 text-xs">
          <p className="font-bold text-slate-800 mb-1 text-[11px]">Intensity Scale</p>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-500">Low</span>
            <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: '#fef9c3' }}></div>
            <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: '#fde047' }}></div>
            <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
            <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: '#d97706' }}></div>
            <span className="text-[10px] text-slate-500">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapView;
