import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('adminToken')}`;
      const response = await api.get('/auth/me');

      // getMe returns { success: true, data: <user_object> }
      const userData = response.data.data;

      if (userData && userData.role === 'admin') {
        setUser(userData);
      } else {
        console.warn('User is not an admin, logging out.');
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error?.response?.status, error?.message);
      // Don't call logout here if interceptor already cleared the token
      // Just reset local state
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      fetchUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('adminToken', userToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user && user.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
