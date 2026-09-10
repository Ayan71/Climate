import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdmins, createAdminUser, toggleAdminStatus, deleteAdminUser } from '../../redux/adminSlice';
import Modal from '../../components/common/Modal';
import { toast } from 'react-toastify';
import { UserPlus, Trash2, Mail, Lock, User } from 'lucide-react';

const AdminManagement = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.admins);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Admin@123');

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const result = await dispatch(createAdminUser({ name, email, password }));
    if (createAdminUser.fulfilled.match(result)) {
      toast.success('Admin account created successfully!');
      setCreateModalOpen(false);
      setName('');
      setEmail('');
      setPassword('Admin@123');
    } else {
      toast.error(result.payload || 'Failed to create admin');
    }
  };

  const handleToggle = async (id) => {
    const res = await dispatch(toggleAdminStatus(id));
    if (toggleAdminStatus.fulfilled.match(res)) {
      toast.info(`Admin status updated: ${res.payload.isActive ? 'Enabled' : 'Disabled'}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Admin account?')) {
      const res = await dispatch(deleteAdminUser(id));
      if (deleteAdminUser.fulfilled.match(res)) {
        toast.success('Admin account deleted.');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Admin User Management</h1>
          <p className="text-xs text-slate-500">Create, configure, enable, or disable Admin credentials</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded text-xs shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New Admin Account</span>
        </button>
      </div>

      <div className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-900 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Admin Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Account Status</th>
                <th className="p-3">Created On</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading admin accounts...</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No admin accounts found. Click "Create New Admin" to add one.</td></tr>
              ) : (
                list.map((admin) => (
                  <tr key={admin._id || admin.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 flex items-center space-x-2">
                      <div className="w-6 h-6 rounded bg-slate-900 text-white font-bold flex items-center justify-center text-[10px]">
                        {admin.name.charAt(0)}
                      </div>
                      <span>{admin.name}</span>
                    </td>
                    <td className="p-3 text-slate-700">{admin.email}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggle(admin._id || admin.id)}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                          admin.isActive
                            ? 'bg-green-50 text-green-800 border-green-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {admin.isActive ? 'Active (Enabled)' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-3 text-slate-500">{new Date(admin.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleDelete(admin._id || admin.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete Admin"
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

      {/* Create Admin Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Admin Account"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateAdmin} className="space-y-3 font-sans">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Admin Full Name</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full pl-8 pr-3 py-2 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@vasudhaindia.org"
                className="w-full pl-8 pr-3 py-2 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Initial Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin@123"
                className="w-full pl-8 pr-3 py-2 text-xs rounded border border-slate-300 bg-white font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-bold text-white bg-slate-900 hover:bg-black shadow-sm"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminManagement;
