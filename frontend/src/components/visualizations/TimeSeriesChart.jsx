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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl text-xs space-y-1">
        <p className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
          Period / Date: {label}
        </p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: <span className="font-extrabold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TimeSeriesChart = ({
  data = [],
  chartType = 'timeseries_line',
  title = 'Time-Series Data',
  height = 420,
}) => {
  // Sort data chronologically if year or date present
  const sortedData = [...data].sort((a, b) => {
    const keyA = String(a.date || a.year || '');
    const keyB = String(b.date || b.year || '');
    return keyA.localeCompare(keyB, undefined, { numeric: true });
  });

  const xAxisKey = sortedData.length > 0 && sortedData[0].year ? 'year' : 'date';

  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 px-1">
        <TrendingUp className="w-4 h-4 text-teal-500" />
        <span>Time-series trajectory with <strong>{sortedData.length}</strong> data points</span>
      </div>

      <div className="w-full rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'timeseries_bar' ? (
              <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="value" name="Metric Value" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : chartType === 'timeseries_area' ? (
              <AreaChart data={sortedData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Area type="monotone" dataKey="value" name="Metric Value" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#areaColor)" />
              </AreaChart>
            ) : (
              <LineChart data={sortedData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Line type="monotone" dataKey="value" name="Metric Value" stroke="#0d9488" strokeWidth={3} dot={{ r: 5, fill: '#0d9488' }} activeDot={{ r: 8 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesChart;
