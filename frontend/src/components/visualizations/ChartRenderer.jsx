import React from 'react';
import MapView from './MapView';
import HeatmapView from './HeatmapView';
import TimeSeriesChart from './TimeSeriesChart';
import { HelpCircle } from 'lucide-react';

const ChartRenderer = ({ dataset }) => {
  if (!dataset || !dataset.parsedData || !Array.isArray(dataset.parsedData)) {
    return (
      <div className="p-8 text-center bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
        <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        <p>No valid data parsed for this visualization.</p>
      </div>
    );
  }

  const { chartType, parsedData, title } = dataset;

  switch (chartType) {
    case 'latlng':
      return <MapView data={parsedData} title={title} />;
    case 'statewise':
      return <HeatmapView data={parsedData} title={title} />;
    case 'timeseries_line':
    case 'timeseries_bar':
    case 'timeseries_area':
      return <TimeSeriesChart data={parsedData} chartType={chartType} title={title} />;
    default:
      return (
        <div className="p-8 text-center bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-2xl border border-amber-200">
          <p>Unrecognized visualization chart type: {chartType}</p>
        </div>
      );
  }
};

export default ChartRenderer;
