import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Shield, Mail, Lock, Bus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (!response.data.success) {
        toast.error(response.data.message || 'Login failed');
        setLoading(false);
        return;
      }

      const { user, token } = response.data.data;

      if (!user || user.role !== 'admin') {
        toast.error('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }

      login(user, token);
      toast.success('Login successful!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-admin-dark via-admin-primary to-admin-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto h-24 w-24 bg-admin-primary rounded-full flex items-center justify-center mb-4"
            >
              <Shield className="h-12 w-12 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
            <p className="mt-2 text-gray-600">KASC Transport Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="admin@kasc.edu"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline h-4 w-4 mr-1" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> This portal is restricted to authorized administrators only.
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bus className="h-6 w-6 text-admin-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Kongu Arts and Science College</p>
              <p className="text-sm font-semibold text-gray-900">Transport Administration</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
