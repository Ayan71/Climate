import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const COLORS = [
  '#1e3a8a', '#0284c7', '#059669', '#ca8a04', '#dc2626',
  '#9333ea', '#475569', '#2563eb', '#0d9488', '#d97706'
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded border border-slate-200 shadow-md text-xs font-sans">
        <p className="font-semibold text-slate-800 border-b border-slate-100 pb-1 mb-1">
          Date / Period: {label}
        </p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color }} className="font-medium">
            {entry.name}: <span className="font-bold">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TimeSeriesChart = ({
  data = [],
  columns = [],
  chartType = 'timeseries_line',
  title = 'Time-Series Data',
  height = 380,
}) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-50 border border-slate-200 rounded text-slate-500 text-sm font-sans">
        No dataset rows available to plot.
      </div>
    );
  }

  // Sort data chronologically if year or date present
  const sortedData = [...data].sort((a, b) => {
    const keyA = String(a.date || a.year || '');
    const keyB = String(b.date || b.year || '');
    return keyA.localeCompare(keyB, undefined, { numeric: true });
  });

  const sampleRow = sortedData[0] || {};
  const xAxisKey = sampleRow.year ? 'year' : sampleRow.date ? 'date' : Object.keys(sampleRow)[0] || 'date';

  // Determine numeric metric keys for multi-line plotting
  const numericKeys = [];
  Object.keys(sampleRow).forEach(key => {
    if (
      key !== xAxisKey &&
      key !== 'state' &&
      key !== 'originalState' &&
      key !== 'name' &&
      key !== 'latitude' &&
      key !== 'longitude' &&
      key !== '_id' &&
      key !== 'id'
    ) {
      if (typeof sampleRow[key] === 'number') {
        numericKeys.push(key);
      }
    }
  });

  if (numericKeys.length === 0) {
    numericKeys.push('value');
  }

  const isMultiLine = chartType === 'multiline' || (chartType === 'timeseries_line' && numericKeys.length > 1);

  return (
    <div className="w-full font-sans space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <div className="flex items-center space-x-1.5 font-medium">
          <TrendingUp className="w-4 h-4 text-slate-700" />
          <span><strong>{sortedData.length}</strong> observations recorded</span>
        </div>
        {isMultiLine && (
          <span className="text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            Multi-series view ({numericKeys.length} metrics)
          </span>
        )}
      </div>

      <div className="w-full rounded border border-slate-200 p-4 bg-white">
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'timeseries_bar' ? (
              <BarChart data={sortedData} margin={{ top: 15, right: 25, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                <XAxis dataKey={xAxisKey} stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: 10 }} />
                {numericKeys.slice(0, 4).map((key, idx) => (
                  <Bar key={key} dataKey={key} name={key === 'value' ? 'Metric Value' : key} fill={COLORS[idx % COLORS.length]} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            ) : chartType === 'timeseries_area' ? (
              <AreaChart data={sortedData} margin={{ top: 15, right: 25, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                <XAxis dataKey={xAxisKey} stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: 10 }} />
                <Area type="monotone" dataKey={numericKeys[0]} name={numericKeys[0] === 'value' ? 'Metric Value' : numericKeys[0]} stroke="#1e3a8a" strokeWidth={2} fillOpacity={1} fill="url(#areaGradient)" />
              </AreaChart>
            ) : (
              <LineChart data={sortedData} margin={{ top: 15, right: 25, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                <XAxis dataKey={xAxisKey} stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: 10 }} />
                {numericKeys.slice(0, 6).map((key, idx) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={key === 'value' ? 'Metric Value' : key}
                    stroke={COLORS[idx % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4, fill: COLORS[idx % COLORS.length] }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesChart;
