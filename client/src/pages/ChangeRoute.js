import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const academicYears = {
  UG: ['I Year', 'II Year', 'III Year'],
  PG: ['I Year', 'II Year']
};

const ChangeRoute = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    registerNumber: user?.registerNumber || '',
    department: user?.department || '',
    academicYear: '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    address: '',
    currentRoute: '',
    newRoute: '',
    reason: ''
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/routes');
      setRoutes(response.data.data);
    } catch (error) {
      toast.error('Failed to load routes');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.currentRoute === formData.newRoute) {
      toast.error('Current route and new route cannot be the same');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/transport/change', {
        ...formData,
        applicationType: 'change'
      });
      toast.success(response.data.message);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const isUG = user?.department?.startsWith('B.');
  const availableYears = isUG ? academicYears.UG : academicYears.PG;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/home')}
          className="p-2 rounded-full bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm border border-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Request Route Change</h1>
      </div>

      <div className="glass-card rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <RefreshCw className="w-64 h-64 text-green-600" />
        </div>

        <div className="flex items-center space-x-4 mb-8 relative z-10">
          <div className="h-16 w-16 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 transform -rotate-3">
            <RefreshCw className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Change Route</h2>
            <p className="text-slate-500 font-medium">Request to switch your bus route</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {/* Form content remains similar but with updated spacing/styling if needed, 
                 but for brevity I'm keeping logic same, just structure update */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                <input type="text" value={formData.name} className="input-field bg-slate-50/50" readOnly />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Register Number</label>
                <input type="text" value={formData.registerNumber} className="input-field bg-slate-50/50" readOnly />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                <input type="text" value={formData.department} className="input-field bg-slate-50/50" readOnly />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Academic Year <span className="text-red-500">*</span></label>
                <select name="academicYear" value={formData.academicYear} onChange={handleChange} required className="input-field">
                  <option value="">Select Year</option>
                  {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input type="email" value={formData.email} className="input-field bg-slate-50/50" readOnly />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Current Address <span className="text-red-500">*</span></label>
                <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" className="input-field"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Current Route <span className="text-red-500">*</span></label>
                <select name="currentRoute" value={formData.currentRoute} onChange={handleChange} required className="input-field">
                  <option value="">Select current route</option>
                  {routes.map(route => (
                    <option key={route._id} value={route._id}>
                      {route.routeName} - {route.routeNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">New Route <span className="text-red-500">*</span></label>
                <select name="newRoute" value={formData.newRoute} onChange={handleChange} required className="input-field">
                  <option value="">Select new route</option>
                  {routes.map(route => (
                    <option key={route._id} value={route._id}>
                      {route.routeName} - {route.routeNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Change <span className="text-red-500">*</span></label>
                <textarea name="reason" value={formData.reason} onChange={handleChange} required rows="3" className="input-field" placeholder="Why do you need to change?"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
            <div className="bg-amber-100 p-1 rounded-full text-amber-600 mt-1">
              <RefreshCw className="h-4 w-4" />
            </div>
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Route change requests must be submitted at least 3 days in advance.
              Your request will be subject to admin approval.
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/20"
            >
              {loading ? 'Processing...' : 'Submit Request'}
            </motion.button>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="px-8 font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ChangeRoute;
