import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
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

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-slate-200 p-4 space-y-6 flex-shrink-0 font-sans">
      {/* Role Badge */}
      <div className="p-3 rounded bg-slate-50 border border-slate-200 flex items-center space-x-3">
        <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${isSuperAdmin ? 'bg-slate-900' : 'bg-blue-800'}`}>
          {isSuperAdmin ? <ShieldAlert className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
        </div>
        <div>
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
    </aside>
  );
};

export default Sidebar;
