import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminDatasets, deleteDataset } from '../../redux/datasetSlice';
import StatusBadge from '../../components/common/StatusBadge';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Upload,
  FileSpreadsheet,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Edit,
  Plus,
} from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { adminList, loading } = useSelector((state) => state.datasets);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAdminDatasets({ myOnly: 'true' }));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dataset?')) {
      const result = await dispatch(deleteDataset(id));
      if (deleteDataset.fulfilled.match(result)) {
        toast.success('Dataset deleted successfully');
      } else {
        toast.error(result.payload || 'Failed to delete dataset');
      }
    }
  };

  const total = adminList.length;
  const pending = adminList.filter((d) => d.status === 'pending').length;
  const approved = adminList.filter((d) => d.status === 'approved').length;
  const rejected = adminList.filter((d) => d.status === 'rejected').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-xs text-slate-500">Manage and upload Climate, Energy, and Power datasets for Super Admin approval</p>
        </div>

        <Link
          to="/admin/upload"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-teal-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dataset</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Total Submissions</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{total}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Pending Review</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{pending}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Approved & Live</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{approved}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Rejected</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{rejected}</p>
          </div>
        </div>
      </div>

      {/* Tabular Dataset List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Uploaded Datasets Table</h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Chart Title</th>
                <th className="p-3.5">Domain</th>
                <th className="p-3.5">Chart Type</th>
                <th className="p-3.5">Approval Status</th>
                <th className="p-3.5">Submitted On</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Loading datasets...</td>
                </tr>
              ) : adminList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No datasets uploaded yet. Click "Add New Dataset" to submit your first CSV dataset.
                  </td>
                </tr>
              ) : (
                adminList.map((dataset) => (
                  <tr key={dataset._id || dataset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                      {dataset.title}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {dataset.domain}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {dataset.chartType}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={dataset.status} />
                      {dataset.rejectionReason && (
                        <p className="text-[10px] text-rose-500 font-semibold mt-1">Reason: {dataset.rejectionReason}</p>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(dataset.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <Link
                        to={`/dataset/${dataset._id || dataset.id}`}
                        className="inline-flex p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950 transition-colors"
                        title="View Visualization"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {dataset.status === 'pending' && (
                        <Link
                          to={`/admin/edit/${dataset._id || dataset.id}`}
                          className="inline-flex p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                          title="Edit Pending Dataset"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      )}

                      <button
                        onClick={() => handleDelete(dataset._id || dataset.id)}
                        className="inline-flex p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        title="Delete Dataset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
