import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { toast } from 'react-toastify';
import {
  LayoutDashboard,
  Upload,
  CheckSquare,
  Users,
  FileSpreadsheet,
  Activity,
  UserCheck,
  ShieldAlert,
  Layers,
  LogOut,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'superadmin';

  const superAdminLinks = [
    { name: 'Analytics Dashboard', path: '/superadmin/dashboard', icon: LayoutDashboard },
    { name: 'Dataset Approvals', path: '/superadmin/approvals', icon: CheckSquare },
    { name: 'Category Management', path: '/superadmin/categories', icon: Layers },
    { name: 'Manage Admins', path: '/superadmin/admins', icon: Users },
    { name: 'All Datasets', path: '/superadmin/datasets', icon: FileSpreadsheet },
    { name: 'System Audit Logs', path: '/superadmin/logs', icon: Activity },
  ];

  const adminLinks = [
    { name: 'My Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Upload New Dataset', path: '/admin/upload', icon: Upload },
    { name: 'My Datasets', path: '/admin/my-datasets', icon: FileSpreadsheet },
    { name: 'My Profile', path: '/admin/profile', icon: UserCheck },
  ];

  const links = isSuperAdmin ? superAdminLinks : adminLinks;

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-slate-200 p-4 space-y-6 flex flex-col justify-between flex-shrink-0 font-sans">
      <div className="space-y-6">
        {/* Role Badge */}
        <div className="p-3 rounded bg-slate-50 border border-slate-200 flex items-center space-x-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${isSuperAdmin ? 'bg-slate-900' : 'bg-blue-800'}`}>
            {isSuperAdmin ? <ShieldAlert className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-xs text-slate-900 truncate">{user?.name || 'User Account'}</p>
            <p className="text-[10px] font-semibold uppercase text-slate-500">{isSuperAdmin ? 'Super Admin' : 'Admin Portal'}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Main Navigation</p>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout Action at Bottom */}
      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
