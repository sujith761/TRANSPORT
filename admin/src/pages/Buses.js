import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Bus, Plus, Search, Edit2, Trash2, MapPin, User } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await api.get('/admin/buses');
      setBuses(response.data.data);
    } catch (error) {
      toast.error('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const filteredBuses = buses.filter(bus =>
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route?.routeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bus Management</h1>
            <p className="text-gray-600 mt-2">Manage fleet, routes, and assignments</p>
          </div>
          <button className="flex items-center space-x-2 bg-admin-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-md">
            <Plus className="h-5 w-5" />
            <span>Add New Bus</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by bus number, registration or route..."
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
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Bus Details</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Route</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Driver</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Capacity</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuses.map((bus, index) => (
                    <motion.tr
                      key={bus._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 group"
                    >
                      <td className="py-4 px-4 text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <Bus className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{bus.busNumber}</p>
                            <p className="text-gray-500 text-xs">{bus.registrationNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{bus.route?.routeName || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{bus.driver?.name || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <span>{bus.capacity} Seats</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bus.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {bus.isActive ? 'Active' : 'Inactive'}
                        </span>
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
                  {filteredBuses.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-gray-500">
                        No buses found matching your search.
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

export default Buses;

