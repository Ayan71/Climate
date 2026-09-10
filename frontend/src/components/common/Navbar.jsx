import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery } from '../../redux/uiSlice';
import { logout } from '../../redux/authSlice';
import {
  Globe,
  Search,
  LogIn,
  LogOut,
  LayoutDashboard,
  Zap,
  Activity,
  Wind,
  Menu,
  X,
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { searchQuery } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'All Datasets', path: '/', icon: Globe },
    { name: 'Climate', path: '/climate', icon: Wind },
    { name: 'Energy', path: '/energy', icon: Zap },
    { name: 'Power', path: '/power', icon: Activity },
  ];

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 font-sans shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-slate-900 flex items-center justify-center text-white font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Climate & Power Data Portal
              </span>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Vasudha India</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search Bar & User Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search portal datasets..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:border-slate-800 w-48"
              />
            </div>

            {/* Auth Controls */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
                <Link
                  to={user?.role === 'superadmin' ? '/superadmin/dashboard' : '/admin/dashboard'}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded bg-slate-900 hover:bg-black text-white transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded bg-slate-900 hover:bg-black text-white transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded text-xs font-bold text-slate-800 hover:bg-slate-100"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <Link
                to={user?.role === 'superadmin' ? '/superadmin/dashboard' : '/admin/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 bg-slate-900 text-white rounded text-xs font-bold"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-center py-2 bg-red-50 text-red-600 rounded text-xs font-bold"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2 bg-slate-900 text-white rounded text-xs font-bold"
            >
              Admin Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
