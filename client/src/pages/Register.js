import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Hash, MapPin, Phone, Building2, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const departments = {
  UG: ['B.Sc CS', 'B.Sc IT', 'B.Com', 'BBA', 'BCA', 'B.A English', 'B.Sc Maths', 'B.Sc Physics', 'B.Sc Chemistry'],
  PG: ['M.Sc CS', 'M.Sc IT', 'M.Com', 'MBA', 'MCA', 'M.A English', 'M.Sc Maths']
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    department: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        registerNumber: formData.registerNumber,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        department: formData.department,
        city: formData.city
      });

      toast.success(response.data.message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 py-12">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl relative z-10 px-4"
      >
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/50 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500 text-lg">Join the KASC Transport Community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Register Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      name="registerNumber"
                      value={formData.registerNumber}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all uppercase"
                      placeholder="21KASC001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Department</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                    >
                      <option value="">Select Department</option>
                      <optgroup label="UG Programs">
                        {departments.UG.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </optgroup>
                      <optgroup label="PG Programs">
                        {departments.PG.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="1234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Your City"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 rounded-xl text-lg font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center group transform transition-all hover:-translate-y-1"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-slate-200 pt-6">
            <p className="text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
