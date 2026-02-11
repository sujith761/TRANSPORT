import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { User, Plus, Search, Edit2, Trash2, Phone, Award, Bus } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/admin/drivers');
      setDrivers(response.data.data);
    } catch (error) {
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
            <p className="text-gray-600 mt-2">Manage driver information and assignments</p>
          </div>
          <button className="flex items-center space-x-2 bg-admin-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-md">
            <Plus className="h-5 w-5" />
            <span>Add New Driver</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, license or phone..."
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
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Driver Name</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">License Number</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Experience</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Assigned Bus</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((driver, index) => (
                    <motion.tr
                      key={driver._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 group"
                    >
                      <td className="py-4 px-4 text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{driver.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{driver.licenseNumber}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{driver.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span>{driver.experience} Years</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <Bus className="h-4 w-4 text-blue-500" />
                          <span>{driver.assignedBus?.busNumber || 'None'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredDrivers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-gray-500">
                        No drivers found matching your search.
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

export default Drivers;

