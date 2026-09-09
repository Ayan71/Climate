import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdmins, createAdminUser, toggleAdminStatus, deleteAdminUser } from '../../redux/adminSlice';
import Modal from '../../components/common/Modal';
import { toast } from 'react-toastify';
import { UserPlus, UserCheck, UserX, Trash2, Mail, Lock, User, ShieldCheck } from 'lucide-react';

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
      toast.success('Admin account created successfully! Credentials emailed.');
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
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Admin User Management</h1>
          <p className="text-xs text-slate-500">Create, configure, enable, or disable Admin credentials</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow-lg transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New Admin Account</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Admin Name</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Account Status</th>
                <th className="p-3.5">Created On</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading admin accounts...</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No admin accounts found. Click "Create New Admin" to add one.</td></tr>
              ) : (
                list.map((admin) => (
                  <tr key={admin._id || admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-xs">
                        {admin.name.charAt(0)}
                      </div>
                      <span>{admin.name}</span>
                    </td>
                    <td className="p-3.5">{admin.email}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggle(admin._id || admin.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-colors ${
                          admin.isActive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                        }`}
                      >
                        {admin.isActive ? 'Active (Enabled)' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-3.5 text-slate-400">{new Date(admin.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleDelete(admin._id || admin.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
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
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Admin Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@vasudhaindia.org"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Initial Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin@123"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-teal-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 dark:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-teal-600 hover:bg-teal-700 shadow"
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
