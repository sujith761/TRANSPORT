import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Users,
  FileText,
  Bus,
  Clock,
  CheckCircle,
  XCircle,
  User
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-admin-primary"></div>
        </div>
      </Layout>
    );
  }

  const stats = [
    {
      title: 'Total Students',
      value: analytics?.totalStudents || 0,
      icon: Users,
      bgColor: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Students',
      value: analytics?.activeStudents || 0,
      icon: Users,
      bgColor: 'bg-indigo-500',
      change: 'Recent logins'
    },
    {
      title: 'Total Applications',
      value: analytics?.totalApplications || 0,
      icon: FileText,
      bgColor: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Active Buses',
      value: analytics?.activeBuses || 0,
      icon: Bus,
      bgColor: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Total Drivers',
      value: analytics?.totalDrivers || 0,
      icon: User,
      bgColor: 'bg-orange-500',
      change: '+3%'
    },
  ];

  const applicationStats = [
    {
      title: 'Pending',
      value: analytics?.pendingApplications || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Approved',
      value: analytics?.approvedApplications || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Rejected',
      value: analytics?.rejectedApplications || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome to KASC Transport Admin Portal</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} h-12 w-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Application Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Application Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {applicationStats.map((stat, index) => (
              <div key={index} className={`${stat.bgColor} rounded-lg p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                    <p className={`text-4xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-12 w-12 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students Per Route Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Students Per Route</h3>
            {analytics?.studentsPerRoute && analytics.studentsPerRoute.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.studentsPerRoute}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="routeNumber" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No data available</p>
            )}
          </div>

          {/* Application Types */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Applications by Type</h3>
            {analytics?.applicationsByType && analytics.applicationsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.applicationsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ _id, count }) => `${_id}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.applicationsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No data available</p>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Applications</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reg No</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Route</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.recentApplications && analytics.recentApplications.length > 0 ? (
                  analytics.recentApplications.map((app, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{app.user?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{app.user?.registerNumber || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{app.route?.routeName || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm capitalize">{app.applicationType}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{new Date(app.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">No recent applications</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
