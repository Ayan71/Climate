import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/authSlice';
import { toast } from 'react-toastify';
import { Lock, Mail, ShieldCheck, UserCheck, ArrowRight, Globe, AlertTriangle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [expiredNotice, setExpiredNotice] = useState(false);

  // If user is already authenticated, redirect to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'superadmin') {
        navigate('/superadmin/dashboard', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Handle ?expired=true query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('expired') === 'true') {
      setExpiredNotice(true);
      // Clean up URL parameter without full page reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setExpiredNotice(false);

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const loggedUser = result.payload.user;
      toast.success(`Welcome back, ${loggedUser.name}!`);
      if (loggedUser.role === 'superadmin') {
        navigate('/superadmin/dashboard', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
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
    <div className="min-h-[70vh] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded border border-slate-200 p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded bg-slate-900 text-white mx-auto flex items-center justify-center font-bold">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Admin Portal Login</h2>
          <p className="text-xs text-slate-500">Authorized administrative login for dataset management</p>
        </div>

        {/* Expired Session Notice */}
        {expiredNotice && (
          <div className="p-3 rounded bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>Your session has expired or is invalid. Please sign in again.</span>
          </div>
        )}

        {/* Demo Quick Fill Buttons */}
        <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('superadmin')}
              className="flex items-center justify-center space-x-1 p-2 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="flex items-center justify-center space-x-1 p-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Standard Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
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
                placeholder="superadmin@vasudhaindia.org"
                className="w-full pl-9 pr-3 py-2 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Password</label>
              {/* <Link to="/forgot-password" className="text-[11px] font-semibold text-slate-600 hover:underline">
                Forgot password?
              </Link> */}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded text-xs shadow flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
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
