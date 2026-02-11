import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FileText, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const academicYears = {
  UG: ['I Year', 'II Year', 'III Year'],
  PG: ['I Year', 'II Year']
};

const ApplyTransport = () => {
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
    route: ''
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
      const response = await api.post('/transport/apply', {
        ...formData,
        applicationType: 'new'
      });
      toast.success(response.data.message);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application failed');
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
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/home')}
          className="p-2 rounded-full bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm border border-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Application Form</h1>
      </div>

      <div className="glass-card rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <FileText className="w-64 h-64 text-blue-600" />
        </div>

        <div className="flex items-center space-x-4 mb-8 relative z-10">
          <div className="h-16 w-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform rotate-3">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">New Application</h2>
            <p className="text-slate-500 font-medium">Request transport service for the academic year</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Student Details</h3>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input type="text" value={formData.name} readOnly className="input-field bg-slate-50/50" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Register Number</label>
                <input type="text" value={formData.registerNumber} readOnly className="input-field bg-slate-50/50" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                <input type="text" value={formData.department} readOnly className="input-field bg-slate-50/50" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Academic Year</label>
                <select name="academicYear" value={formData.academicYear} onChange={handleChange} required className="input-field">
                  <option value="">Select Year</option>
                  {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Contact & Route</h3>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input type="email" value={formData.email} readOnly className="input-field bg-slate-50/50" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" className="input-field" placeholder="Door No, Street, Area, City - Pincode"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Bus Route</label>
                <select name="route" value={formData.route} onChange={handleChange} required className="input-field">
                  <option value="">Choose a route</option>
                  {routes.map(route => (
                    <option key={route._id} value={route._id}>
                      {route.routeName} - {route.routeNumber} ({route.startingPoint} → {route.endingPoint})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
            <div className="bg-blue-100 p-1 rounded-full text-blue-600 mt-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-sm text-blue-800">Your application will be reviewed by the transport administration. Please ensure all details are correct before submitting.</p>
          </div>

          <div className="flex space-x-4 pt-4">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex-1 btn-primary py-4 font-bold text-lg shadow-xl shadow-blue-500/20">
              {loading ? 'Processing...' : 'Submit Application'}
            </motion.button>
            <button type="button" onClick={() => navigate('/home')} className="px-8 font-bold text-slate-500 hover:text-slate-800 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ApplyTransport;
