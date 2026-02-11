import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const academicYears = {
  UG: ['I Year', 'II Year', 'III Year'],
  PG: ['I Year', 'II Year']
};

const CancelRoute = () => {
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
    setLoading(true);

    try {
      const response = await api.post('/transport/cancel', {
        ...formData,
        applicationType: 'cancel'
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
        <h1 className="text-2xl font-bold text-slate-900">Request Cancellation</h1>
      </div>

      <div className="glass-card rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <XCircle className="w-64 h-64 text-red-600" />
        </div>

        <div className="flex items-center space-x-4 mb-8 relative z-10">
          <div className="h-16 w-16 bg-gradient-to-tr from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 transform -rotate-3">
            <XCircle className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Cancel Service</h2>
            <p className="text-slate-500 font-medium">Terminate your transport subscription</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
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
                <label className="block text-sm font-bold text-slate-700 mb-2">Address <span className="text-red-500">*</span></label>
                <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" className="input-field"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Current Route <span className="text-red-500">*</span></label>
                <select name="currentRoute" value={formData.currentRoute} onChange={handleChange} required className="input-field">
                  <option value="">Select your current route</option>
                  {routes.map(route => (
                    <option key={route._id} value={route._id}>
                      {route.routeName} - {route.routeNumber} ({route.startingPoint})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Cancellation <span className="text-red-500">*</span></label>
                <textarea name="reason" value={formData.reason} onChange={handleChange} required rows="3" className="input-field" placeholder="Why do you wish to cancel?"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
            <div className="bg-red-100 p-1 rounded-full text-red-600 mt-1">
              <XCircle className="h-4 w-4" />
            </div>
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> Once your cancellation request is approved, you will no longer
              have access to the transport service. You will need to submit a new application if you
              wish to use the service again in the future.
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-red-500/20"
            >
              {loading ? 'Processing...' : 'Confirm Cancellation'}
            </motion.button>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="px-8 font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CancelRoute;
