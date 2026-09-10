import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';
import {
  PieChart,
  ShieldCheck,
  ArrowRight,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RePie,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#1e3a8a', '#0284c7', '#059669', '#ca8a04', '#dc2626'];

const SuperAdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await API.get('/analytics/dashboard');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const cards = analytics?.cards || {};
  const domainData = analytics?.domainBreakdown || [];
  const chartTypeData = analytics?.chartTypeBreakdown || [];

  if (loading) {
    return <div className="p-8 text-center text-xs font-sans text-slate-500">Loading system metrics...</div>;
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Banner */}
      <div className="p-6 rounded bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-[10px] uppercase font-bold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Super Admin Executive Portal</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">System Statistics & Overview</h1>
          <p className="text-xs text-slate-400">Manage dataset approval queue, category configuration, admin permissions, and audit logs.</p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/superadmin/approvals"
            className="flex items-center space-x-1.5 px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded text-xs transition-colors shadow-sm"
          >
            <span>Review Pending Queue ({cards.pendingDatasets || 0})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Total Users</p>
          <p className="text-xl font-bold text-slate-900">{cards.totalUsers || cards.totalAdmins || 0}</p>
        </div>

        <div className="p-3.5 rounded bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Total Datasets</p>
          <p className="text-xl font-bold text-slate-900">{cards.totalDatasets || 0}</p>
        </div>

        <div className="p-3.5 rounded bg-white border border-amber-300 bg-amber-50/50 shadow-sm space-y-1">
          <p className="text-[10px] text-amber-800 font-bold uppercase">Pending Review</p>
          <p className="text-xl font-bold text-amber-700">{cards.pendingDatasets || 0}</p>
        </div>

        <div className="p-3.5 rounded bg-white border border-green-300 bg-green-50/50 shadow-sm space-y-1">
          <p className="text-[10px] text-green-800 font-bold uppercase">Approved</p>
          <p className="text-xl font-bold text-green-700">{cards.approvedDatasets || 0}</p>
        </div>

        <div className="p-3.5 rounded bg-white border border-red-200 bg-red-50/50 shadow-sm space-y-1">
          <p className="text-[10px] text-red-800 font-bold uppercase">Rejected</p>
          <p className="text-xl font-bold text-red-700">{cards.rejectedDatasets || 0}</p>
        </div>

        <div className="p-3.5 rounded bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] text-blue-800 font-bold uppercase">Active Admins</p>
          <p className="text-xl font-bold text-blue-700">{cards.activeAdmins || 0}</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Distribution Bar Chart */}
        <div className="bg-white rounded border border-slate-200 p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 font-bold text-sm text-slate-900 border-b pb-2">
            <BarChart2 className="w-4 h-4 text-slate-700" />
            <span>Dataset Distribution by Domain</span>
          </div>

          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                <XAxis dataKey="domain" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Dataset Count" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visualization Type Pie Breakdown */}
        <div className="bg-white rounded border border-slate-200 p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 font-bold text-sm text-slate-900 border-b pb-2">
            <PieChart className="w-4 h-4 text-slate-700" />
            <span>Visualization Type Breakdown</span>
          </div>

          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RePie>
                <Pie
                  data={chartTypeData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label
                >
                  {chartTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </RePie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
