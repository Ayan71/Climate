import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#1e3a8a', '#0284c7', '#0d9488', '#16a34a', '#ca8a04',
  '#dc2626', '#9333ea', '#475569', '#2563eb', '#059669'
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-slate-200 rounded shadow-md text-xs font-sans">
        <p className="font-semibold text-slate-800">{data.name}</p>
        <p className="text-slate-600 font-medium mt-1">
          Value: <span className="text-blue-700 font-bold">{data.value?.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

const PieView = ({ data, isDoughnut = false, title = '' }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-50 border border-slate-200 rounded text-slate-500 text-sm font-sans">
        No slice data available to render Pie Chart.
      </div>
    );
  }

  const innerRadius = isDoughnut ? 55 : 0;
  const outerRadius = 90;

  return (
    <div className="w-full bg-white p-4 border border-slate-200 rounded font-sans">
      {title && <h3 className="text-sm font-semibold text-slate-800 mb-3">{title}</h3>}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#1e3a8a"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieView;
