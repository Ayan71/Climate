import React from 'react';
import MapView from './MapView';
import HeatmapView from './HeatmapView';
import TimeSeriesChart from './TimeSeriesChart';
import PieView from './PieView';
import { HelpCircle } from 'lucide-react';

const ChartRenderer = ({ dataset }) => {
  if (!dataset || !dataset.parsedData || !Array.isArray(dataset.parsedData)) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 text-slate-500 rounded font-sans">
        <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        <p className="text-sm font-medium">No valid data available for this visualization.</p>
      </div>
    );
  }

  const { chartType, parsedData, title, columns } = dataset;

  switch (chartType) {
    case 'latlng':
      return <MapView data={parsedData} title={title} />;
    case 'statewise':
      return <HeatmapView data={parsedData} title={title} />;
    case 'pie':
      return <PieView data={parsedData} title={title} isDoughnut={false} />;
    case 'doughnut':
      return <PieView data={parsedData} title={title} isDoughnut={true} />;
    case 'multiline':
    case 'timeseries_line':
    case 'timeseries_bar':
    case 'timeseries_area':
      return <TimeSeriesChart data={parsedData} columns={columns} chartType={chartType} title={title} />;
    default:
      return (
        <TimeSeriesChart data={parsedData} columns={columns} chartType="timeseries_line" title={title} />
      );
  }
};

export default ChartRenderer;
