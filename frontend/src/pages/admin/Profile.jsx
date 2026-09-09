import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import API from '../../services/api';
import { fetchProfile } from '../../redux/authSlice';
import { toast } from 'react-toastify';
import { User, Lock, Save } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.put('/auth/profile', { name, currentPassword, newPassword });
      toast.success('Profile updated successfully!');
      dispatch(fetchProfile());
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Account Profile</h1>
        <p className="text-xs text-slate-500">Manage account credentials and security settings</p>
      </div>

      <form onSubmit={handleUpdate} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
          <input
            type="email"
            disabled
            value={user?.email || ''}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold cursor-not-allowed"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Change Password</h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow-lg flex items-center justify-center space-x-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Update Settings'}</span>
        </button>
      </form>
    </div>
  );
};

export default Profile;
