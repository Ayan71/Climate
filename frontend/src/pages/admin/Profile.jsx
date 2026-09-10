import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import API from '../../services/api';
import { fetchProfile } from '../../redux/authSlice';
import { toast } from 'react-toastify';
import { Save } from 'lucide-react';

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
    <div className="max-w-xl mx-auto space-y-6 pb-12 font-sans">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900">Account Profile</h1>
        <p className="text-xs text-slate-500">Manage account credentials and security settings</p>
      </div>

      <form onSubmit={handleUpdate} className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Email Address</label>
          <input
            type="email"
            disabled
            value={user?.email || ''}
            className="w-full p-2 text-xs rounded border border-slate-200 bg-slate-100 text-slate-500 font-medium cursor-not-allowed"
          />
        </div>

        <div className="pt-3 border-t border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase">Change Password</h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded text-xs shadow flex items-center justify-center space-x-1.5 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving Changes...' : 'Update Profile Settings'}</span>
        </button>
      </form>
    </div>
  );
};

export default Profile;
