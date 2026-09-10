import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminDatasets, deleteDataset } from '../../redux/datasetSlice';
import StatusBadge from '../../components/common/StatusBadge';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
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
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-xs text-slate-500">Manage and upload Climate, Energy, and Power datasets for Super Admin review & approval</p>
        </div>

        <Link
          to="/admin/upload"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded text-xs shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dataset</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-slate-100 text-slate-700 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Submissions</p>
            <p className="text-xl font-bold text-slate-900">{total}</p>
          </div>
        </div>

        <div className="p-4 rounded bg-white border border-amber-200 bg-amber-50/50 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-amber-800 font-bold uppercase">Pending Review</p>
            <p className="text-xl font-bold text-amber-700">{pending}</p>
          </div>
        </div>

        <div className="p-4 rounded bg-white border border-green-200 bg-green-50/50 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-green-100 text-green-800 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-green-800 font-bold uppercase">Approved & Live</p>
            <p className="text-xl font-bold text-green-700">{approved}</p>
          </div>
        </div>

        <div className="p-4 rounded bg-white border border-red-200 bg-red-50/50 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-red-100 text-red-800 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-red-800 font-bold uppercase">Rejected</p>
            <p className="text-xl font-bold text-red-700">{rejected}</p>
          </div>
        </div>
      </div>

      {/* Tabular Dataset List */}
      <div className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Uploaded Datasets Table</h2>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-900 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Submitted On</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
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
                  <tr key={dataset._id || dataset.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 max-w-xs truncate">
                      {dataset.title}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-800">
                        {dataset.domain}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">
                      {dataset.category || 'General'}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={dataset.status} />
                      {dataset.rejectionReason && (
                        <p className="text-[10px] text-red-600 font-semibold mt-0.5">Reason: {dataset.rejectionReason}</p>
                      )}
                    </td>
                    <td className="p-3 text-slate-500">
                      {new Date(dataset.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link
                        to={`/dataset/${dataset._id || dataset.id}`}
                        className="inline-flex p-1 text-slate-600 hover:text-slate-900"
                        title="View Visualization"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {dataset.status === 'pending' && (
                        <Link
                          to={`/admin/edit/${dataset._id || dataset.id}`}
                          className="inline-flex p-1 text-blue-600 hover:text-blue-800"
                          title="Edit Pending Dataset"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      )}

                      <button
                        onClick={() => handleDelete(dataset._id || dataset.id)}
                        className="inline-flex p-1 text-red-600 hover:text-red-800"
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
