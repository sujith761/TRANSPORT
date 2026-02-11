import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Plus, Search, Edit2, Trash2, MapPin, Clock, Navigation } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/routes');
      setRoutes(response.data.data);
    } catch (error) {
      toast.error('Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.routeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.startingPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.endingPoint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Route Management</h1>
            <p className="text-gray-600 mt-2">Manage bus routes, stops, and schedules</p>
          </div>
          <button className="flex items-center space-x-2 bg-admin-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-md">
            <Plus className="h-5 w-5" />
            <span>Add New Route</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by route name, number or points..."
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
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Route Details</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Starting Point</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Ending Point</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Schedule</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Stops</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.map((route, index) => (
                    <motion.tr
                      key={route._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 group"
                    >
                      <td className="py-4 px-4 text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-lg text-green-600">
                            <Navigation className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{route.routeName}</p>
                            <p className="text-gray-500 text-xs">#{route.routeNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span>{route.startingPoint}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span>{route.endingPoint}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{route.startTime} - {route.endTime}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">
                          {route.stops?.length || 0} Stops
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
                  {filteredRoutes.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-gray-500">
                        No routes found matching your search.
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

export default Routes;

