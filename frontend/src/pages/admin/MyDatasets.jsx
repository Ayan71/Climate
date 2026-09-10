import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminDatasets, deleteDataset } from '../../redux/datasetSlice';
import StatusBadge from '../../components/common/StatusBadge';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, Trash2, Edit, Plus } from 'lucide-react';

const MyDatasets = () => {
  const dispatch = useDispatch();
  const { adminList, loading } = useSelector((state) => state.datasets);

  useEffect(() => {
    dispatch(fetchAdminDatasets({ myOnly: 'true' }));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this dataset?')) {
      const res = await dispatch(deleteDataset(id));
      if (deleteDataset.fulfilled.match(res)) {
        toast.success('Dataset deleted.');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Uploaded Datasets</h1>
          <p className="text-xs text-slate-500">View and track all datasets submitted by your account</p>
        </div>
        <Link
          to="/admin/upload"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded text-xs shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Dataset</span>
        </Link>
      </div>

      <div className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-900 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Submitted</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading datasets...</td></tr>
              ) : adminList.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No datasets uploaded by your account yet.</td></tr>
              ) : (
                adminList.map((d) => (
                  <tr key={d._id || d.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{d.title}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-800">{d.domain}</span></td>
                    <td className="p-3 text-slate-600 font-medium">{d.category || 'General'}</td>
                    <td className="p-3"><StatusBadge status={d.status} /></td>
                    <td className="p-3 text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right space-x-2">
                      <Link to={`/dataset/${d._id || d.id}`} className="p-1 text-slate-600 hover:text-slate-900" title="Inspect"><Eye className="w-4 h-4 inline" /></Link>
                      {d.status === 'pending' && <Link to={`/admin/edit/${d._id || d.id}`} className="p-1 text-blue-600 hover:text-blue-800" title="Edit"><Edit className="w-4 h-4 inline" /></Link>}
                      <button onClick={() => handleDelete(d._id || d.id)} className="p-1 text-red-600 hover:text-red-800" title="Delete"><Trash2 className="w-4 h-4 inline" /></button>
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

export default MyDatasets;
