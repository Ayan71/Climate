import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/authSlice';
import { toast } from 'react-toastify';
import { Lock, Mail, ShieldCheck, UserCheck, ArrowRight, KeyRound, Globe } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const user = result.payload.user;
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  const fillCredentials = (role) => {
    if (role === 'superadmin') {
      setEmail('superadmin@vasudhaindia.org');
      setPassword('Admin@123');
    } else {
      setEmail('admin@vasudhaindia.org');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Globe className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Portal Login</h2>
          <p className="text-xs text-slate-500">Authorized administrative access for dataset management</p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-center">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('superadmin')}
              className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 hover:bg-amber-200 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-800 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-teal-100 dark:bg-teal-950/70 hover:bg-teal-200 text-teal-900 dark:text-teal-200 text-xs font-bold border border-teal-300 dark:border-teal-800 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Standard Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@vasudhaindia.org"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-semibold text-teal-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-teal-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
