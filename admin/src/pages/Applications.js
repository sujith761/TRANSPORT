import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FileText, CheckCircle, XCircle, Eye, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      let url = '/admin/applications';
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }
      const response = await api.get(url);
      setApplications(response.data.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await api.put(`/admin/applications/${id}/approve`);
      toast.success('Application approved successfully');
      fetchApplications();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await api.put(`/admin/applications/${id}/reject`, { reason: rejectionReason });
      toast.success('Application rejected');
      fetchApplications();
      setShowModal(false);
      setRejectionReason('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  const viewDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status] || '';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
          <p className="text-gray-600 mt-2">Review and manage transport applications</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Filter className="h-5 w-5 text-gray-500" />
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  filter === 'all' ? 'bg-admin-primary text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-admin-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reg No</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Route</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{app.user?.name || app.name}</td>
                      <td className="py-3 px-4 text-sm font-semibold">{app.registerNumber}</td>
                      <td className="py-3 px-4 text-sm capitalize">{app.applicationType}</td>
                      <td className="py-3 px-4 text-sm">{app.route?.routeName || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewDetails(app)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(app._id)}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => viewDetails(app)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {applications.length === 0 && (
                <p className="text-center text-gray-500 py-8">No applications found</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-admin-primary p-6 text-white">
              <h3 className="text-2xl font-bold">Application Details</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-semibold">{selectedApp.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Register Number</p>
                  <p className="font-semibold">{selectedApp.registerNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-semibold">{selectedApp.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Academic Year</p>
                  <p className="font-semibold">{selectedApp.academicYear}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{selectedApp.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="font-semibold">{selectedApp.mobile}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold">{selectedApp.address}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-semibold">{selectedApp.route?.routeName} - {selectedApp.route?.routeNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Application Type</p>
                  <p className="font-semibold capitalize">{selectedApp.applicationType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>
                {selectedApp.reason && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-semibold">{selectedApp.reason}</p>
                  </div>
                )}
              </div>

              {selectedApp.status === 'pending' && (
                <>
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows="3"
                      className="input-field"
                      placeholder="Enter reason for rejection..."
                    ></textarea>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleApprove(selectedApp._id)}
                      disabled={actionLoading}
                      className="flex-1 btn-success"
                    >
                      {actionLoading ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(selectedApp._id)}
                      disabled={actionLoading}
                      className="flex-1 btn-danger"
                    >
                      {actionLoading ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="w-full btn-secondary"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Applications;
