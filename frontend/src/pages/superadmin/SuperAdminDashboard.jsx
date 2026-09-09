import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
  TrendingUp,
  PieChart,
  ShieldCheck,
  ArrowRight,
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

const COLORS = ['#0d9488', '#f59e0b', '#3b82f6'];

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

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white border border-amber-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Super Admin Command Center</span>
          </div>
          <h1 className="text-3xl font-extrabold">Executive System Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-300">Complete oversight of datasets, admin users, approval queue, and audit logs.</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/superadmin/approvals"
            className="flex items-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg transition-all"
          >
            <span>Review Pending Queue ({cards.pendingDatasets || 0})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Datasets</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{cards.totalDatasets || 0}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-[11px] text-amber-600 font-bold uppercase tracking-wider">Pending Review</p>
          <p className="text-2xl font-extrabold text-amber-600">{cards.pendingDatasets || 0}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">Approved & Published</p>
          <p className="text-2xl font-extrabold text-emerald-600">{cards.approvedDatasets || 0}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-[11px] text-rose-600 font-bold uppercase tracking-wider">Rejected</p>
          <p className="text-2xl font-extrabold text-rose-600">{cards.rejectedDatasets || 0}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">Total Admins</p>
          <p className="text-2xl font-extrabold text-blue-600">{cards.totalAdmins || 0}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-[11px] text-teal-600 font-bold uppercase tracking-wider">Active Admins</p>
          <p className="text-2xl font-extrabold text-teal-600">{cards.activeAdmins || 0}</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Distribution Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 font-bold text-base text-slate-900 dark:text-white">
            <BarChart className="w-5 h-5 text-teal-600" />
            <span>Datasets Count by Domain</span>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="domain" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" name="Dataset Count" fill="#0d9488" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visualization Type Pie Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 font-bold text-base text-slate-900 dark:text-white">
            <PieChart className="w-5 h-5 text-amber-600" />
            <span>Visualization Type Breakdown</span>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RePie>
                <Pie
                  data={chartTypeData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
