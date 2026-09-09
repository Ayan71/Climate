import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminDatasets, deleteDataset, approveDataset, rejectDataset } from '../../redux/datasetSlice';
import StatusBadge from '../../components/common/StatusBadge';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, Trash2, CheckCircle2, XCircle } from 'lucide-react';

const AllDatasets = () => {
  const dispatch = useDispatch();
  const { adminList, loading } = useSelector((state) => state.datasets);

  useEffect(() => {
    dispatch(fetchAdminDatasets());
  }, [dispatch]);

  const handleApprove = async (id) => {
    const res = await dispatch(approveDataset(id));
    if (approveDataset.fulfilled.match(res)) {
      toast.success('Dataset approved and published!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete dataset?')) {
      const res = await dispatch(deleteDataset(id));
      if (deleteDataset.fulfilled.match(res)) {
        toast.success('Dataset deleted.');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Master Dataset Management</h1>
        <p className="text-xs text-slate-500">View and manage all datasets submitted by any Admin across system</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Domain</th>
                <th className="p-3.5">Chart Type</th>
                <th className="p-3.5">Uploader</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading...</td></tr>
              ) : adminList.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No datasets found in database.</td></tr>
              ) : (
                adminList.map((d) => (
                  <tr key={d._id || d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-xs truncate">{d.title}</td>
                    <td className="p-3.5"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800">{d.domain}</span></td>
                    <td className="p-3.5 font-mono text-[11px]">{d.chartType}</td>
                    <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-300">{d.uploadedBy?.name || 'Admin'}</td>
                    <td className="p-3.5"><StatusBadge status={d.status} /></td>
                    <td className="p-3.5 text-right space-x-2">
                      <Link to={`/dataset/${d._id || d.id}`} className="p-1 text-teal-600 hover:bg-teal-50 rounded"><Eye className="w-4 h-4 inline" /></Link>
                      {d.status === 'pending' && (
                        <button onClick={() => handleApprove(d._id || d.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded" title="Approve">
                          <CheckCircle2 className="w-4 h-4 inline" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(d._id || d.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 className="w-4 h-4 inline" />
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

export default AllDatasets;
