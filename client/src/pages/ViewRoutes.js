import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Search, Bus, MapPin, ArrowLeft, X, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const ViewRoutes = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      // Mock data in case API fails or is empty for demo
      const response = await api.get('/routes').catch(() => ({ data: { data: [] } }));
      setRoutes(response.data.data || []);
      setFilteredRoutes(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value) {
      setFilteredRoutes(routes);
    } else {
      const filtered = routes.filter(route =>
        route.routeName.toLowerCase().includes(value.toLowerCase()) ||
        route.routeNumber.toLowerCase().includes(value.toLowerCase()) ||
        route.startingPoint.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRoutes(filtered);
    }
  };

  const viewRouteDetails = async (routeId) => {
    try {
      const response = await api.get(`/routes/${routeId}/details`);
      setSelectedRoute(response.data.data);
    } catch (error) {
      toast.error('Failed to load route details');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/home')}
            className="p-2 rounded-full bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm border border-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bus Routes</h1>
            <p className="text-slate-500">Find your best route to campus</p>
          </div>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search routes..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border-dashed border-2 border-slate-300">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bus className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">No routes found</h3>
          <p className="text-slate-500 mt-2">Try searching for a different location or route number</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route, index) => (
            <motion.div
              key={route._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => viewRouteDetails(route._id)}
              className="glass-card group cursor-pointer overflow-hidden rounded-2xl border border-white/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-2">
                      Route {route.routeNumber}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {route.routeName}
                    </h3>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div className="w-0.5 h-8 bg-slate-200" />
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">Start</p>
                        <p className="font-semibold text-slate-700">{route.startingPoint}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">End</p>
                        <p className="font-semibold text-slate-700">{route.endingPoint}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-4">
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">Time</p>
                        <p className="font-mono text-slate-700">{route.startTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">Time</p>
                        <p className="font-mono text-slate-700">{route.endTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {route.stops && (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <span className="flex items-center">
                      <Bus className="h-4 w-4 mr-2" />
                      {route.stops.length} Stops
                    </span>
                    {route.distance && <span>{route.distance} km</span>}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Glass Modal for Route Details */}
      <AnimatePresence>
        {selectedRoute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedRoute(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shrink-0 relative">
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <Bus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedRoute.route.routeName}</h3>
                    <p className="text-blue-100 flex items-center space-x-2">
                      <span className="bg-white/20 px-2 py-0.5 rounded text-sm">Route {selectedRoute.route.routeNumber}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Start Time</p>
                    <p className="text-lg font-semibold text-slate-800">{selectedRoute.route.startTime}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">End Time</p>
                    <p className="text-lg font-semibold text-slate-800">{selectedRoute.route.endTime}</p>
                  </div>
                </div>

                {/* Bus Info */}
                {selectedRoute.bus && (
                  <div className="border border-slate-100 rounded-xl p-5">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                      <Bus className="h-5 w-5 mr-2 text-blue-600" />
                      Vehicle Information
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div>
                        <p className="text-slate-500">Bus Number</p>
                        <p className="font-semibold text-slate-800">{selectedRoute.bus.busNumber}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Capacity</p>
                        <p className="font-semibold text-slate-800">{selectedRoute.bus.capacity} Seats</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stops Timeline */}
                {selectedRoute.route.stops && selectedRoute.route.stops.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-6 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      Route Stops
                    </h4>
                    <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {selectedRoute.route.stops.map((stop, idx) => (
                        <div key={idx} className="relative">
                          {/* Timeline Dot */}
                          <div className={`absolute -left-[29px] w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-[10px] font-bold ${idx === 0 || idx === selectedRoute.route.stops.length - 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            {idx + 1}
                          </div>

                          <div className="flex justify-between items-start bg-slate-50 p-3 rounded-lg">
                            <div>
                              <p className="font-bold text-slate-800">{stop.stopName}</p>
                              {stop.landmark && <p className="text-xs text-slate-500">{stop.landmark}</p>}
                            </div>
                            <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {stop.arrivalTime}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="w-full btn-primary py-3"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ViewRoutes;
