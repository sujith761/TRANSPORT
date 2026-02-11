import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Bell,
  FileText,
  Download,
  AlertCircle
} from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Dummy data for demo if API fails or is empty, to show off UI
      // In real scenario, just use the API calls.
      // For now, I'll stick to API calls but handle errors gracefully.
      const [appsResponse, notifsResponse] = await Promise.all([
        api.get('/transport/status').catch(() => ({ data: { data: [] } })),
        api.get('/transport/notifications').catch(() => ({ data: { data: [] } }))
      ]);

      setApplications(appsResponse.data.data || []);
      setNotifications(notifsResponse.data.data || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      rejected: 'bg-rose-100 text-rose-700 border-rose-200'
    };

    const icons = {
      pending: <Clock className="h-3.5 w-3.5" />,
      approved: <CheckCircle className="h-3.5 w-3.5" />,
      rejected: <XCircle className="h-3.5 w-3.5" />
    };

    return (
      <span className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${styles[status]}`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const getApplicationTypeLabel = (type) => {
    const labels = {
      new: 'New Application',
      change: 'Route Change',
      cancel: 'Cancellation'
    };
    return labels[type] || type;
  };

  const downloadQRCode = (application) => {
    if (!application.qrCode) {
      toast.error('QR Code not available');
      return;
    }

    const link = document.createElement('a');
    link.href = application.qrCode;
    link.download = `transport-qr-${application.registerNumber}.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const approvedCount = applications.filter(app => app.status === 'approved').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/home')}
            className="p-2 rounded-full bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm border border-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Overview of your transport status</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card p-6 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Clock className="w-24 h-24 text-amber-500" />
          </div>
          <div className="relative z-10">
            <p className="text-amber-600 font-bold text-sm uppercase tracking-wider mb-2">Pending</p>
            <h3 className="text-4xl font-bold text-slate-800">{pendingCount}</h3>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card p-6 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <CheckCircle className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-2">Approved</p>
            <h3 className="text-4xl font-bold text-slate-800">{approvedCount}</h3>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card p-6 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <XCircle className="w-24 h-24 text-rose-500" />
          </div>
          <div className="relative z-10">
            <p className="text-rose-600 font-bold text-sm uppercase tracking-wider mb-2">Rejected</p>
            <h3 className="text-4xl font-bold text-slate-800">{rejectedCount}</h3>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Recent Applications
          </h2>

          {applications.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No Applications Yet</h3>
              <p className="text-slate-500 mb-6">Start by applying for transport service</p>
              <button
                onClick={() => navigate('/apply')}
                className="btn-primary"
              >
                Apply Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, index) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all border border-white/60"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-bold text-slate-900">
                          {getApplicationTypeLabel(app.applicationType)}
                        </h3>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-sm text-slate-500">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {app.status === 'approved' && app.qrCode && (
                      <button
                        onClick={() => downloadQRCode(app)}
                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors text-sm font-semibold"
                      >
                        <Download className="h-4 w-4" />
                        <span>Get QR Code</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div>
                      <p className="text-slate-400 font-medium mb-1">Register Number</p>
                      <p className="font-semibold text-slate-700">{app.registerNumber}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium mb-1">Department</p>
                      <p className="font-semibold text-slate-700">{app.department}</p>
                    </div>
                    {app.route && (
                      <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-slate-400 font-medium mb-1 text-xs uppercase tracking-wide">Route Details</p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-800">{app.route.routeName} - {app.route.routeNumber}</p>
                          <p className="text-slate-500 text-xs">{app.route.startingPoint} → {app.route.endingPoint}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {app.status === 'rejected' && app.rejectionReason && (
                    <div className="mt-4 bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-rose-800">Application Rejected</p>
                        <p className="text-sm text-rose-600 mt-1">{app.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Sidebar */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-indigo-600" />
            Notifications
          </h2>

          <div className="glass-panel rounded-2xl p-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Bell className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No new notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl transition-all ${notif.isRead
                      ? 'bg-transparent hover:bg-white/50'
                      : 'bg-white shadow-sm border border-blue-100'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold ${notif.isRead ? 'text-slate-700' : 'text-blue-700'}`}>
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">{notif.message}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                      {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
