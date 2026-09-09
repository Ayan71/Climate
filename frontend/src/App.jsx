import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './redux/store';

// Common Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Climate from './pages/public/Climate';
import Energy from './pages/public/Energy';
import Power from './pages/public/Power';
import DatasetDetails from './pages/public/DatasetDetails';
import NotFound from './pages/public/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UploadDataset from './pages/admin/UploadDataset';
import MyDatasets from './pages/admin/MyDatasets';
import EditDataset from './pages/admin/EditDataset';
import Profile from './pages/admin/Profile';

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import DatasetApproval from './pages/superadmin/DatasetApproval';
import AdminManagement from './pages/superadmin/AdminManagement';
import AllDatasets from './pages/superadmin/AllDatasets';
import ActivityLogs from './pages/superadmin/ActivityLogs';

const LayoutWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/superadmin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex w-full">
        {isAdminRoute && <Sidebar />}

        <main className={`flex-1 ${isAdminRoute ? 'p-6 md:p-8 max-w-7xl' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'} w-full`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/climate" element={<Climate />} />
            <Route path="/energy" element={<Energy />} />
            <Route path="/power" element={<Power />} />
            <Route path="/dataset/:id" element={<DatasetDetails />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/upload" element={<UploadDataset />} />
              <Route path="/admin/my-datasets" element={<MyDatasets />} />
              <Route path="/admin/edit/:id" element={<EditDataset />} />
              <Route path="/admin/profile" element={<Profile />} />
            </Route>

            {/* Protected Super Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
              <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/superadmin/approvals" element={<DatasetApproval />} />
              <Route path="/superadmin/admins" element={<AdminManagement />} />
              <Route path="/superadmin/datasets" element={<AllDatasets />} />
              <Route path="/superadmin/logs" element={<ActivityLogs />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {!isAdminRoute && <Footer />}
      <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <LayoutWrapper />
      </Router>
    </Provider>
  );
};

export default App;
