import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to request reset token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded border border-slate-200 p-8 shadow-sm space-y-6">
        <Link
          to="/login"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded bg-slate-900 text-white mx-auto flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Forgot Password</h2>
          <p className="text-xs text-slate-500">Enter your email address to receive a password reset link</p>
        </div>

        {sent ? (
          <div className="p-4 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <p className="font-bold">Reset Link Sent!</p>
            </div>
            <p className="text-slate-700 leading-relaxed">
              If an account exists for <strong>{email}</strong>, a password reset link has been generated. Please check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vasudhaindia.org"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded text-xs shadow transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending Reset Link...' : 'Send Password Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
