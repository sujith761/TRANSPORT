import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Wrench, Plus, Search, Edit2, Calendar, IndianRupee } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const response = await api.get('/admin/maintenance');
      setRecords(response.data.data);
    } catch (error) {
      toast.error('Failed to load maintenance records');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record =>
    record.bus?.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.maintenanceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
            <p className="text-gray-600 mt-2">Track bus maintenance and service records</p>
          </div>
          <button className="flex items-center space-x-2 bg-admin-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-md">
            <Plus className="h-5 w-5" />
            <span>Add Record</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by bus, type or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                  <tr className="border-b text-left">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Bus & Type</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Cost</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Service Date</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => (
                    <motion.tr
                      key={record._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 group"
                    >
                      <td className="py-4 px-4 text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                            <Wrench className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{record.bus?.busNumber}</p>
                            <p className="text-gray-500 text-xs">{record.maintenanceType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 max-w-xs truncate">
                        {record.description}
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-900">
                        <div className="flex items-center">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {record.cost.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(record.serviceDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-gray-500">
                        No maintenance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Maintenance;

