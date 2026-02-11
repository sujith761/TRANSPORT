import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ApplyTransport from './pages/ApplyTransport';
import ChangeRoute from './pages/ChangeRoute';
import CancelRoute from './pages/CancelRoute';
import ViewRoutes from './pages/ViewRoutes';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/home" element={
              <PrivateRoute>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/apply" element={
              <PrivateRoute>
                <Layout>
                  <ApplyTransport />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/change-route" element={
              <PrivateRoute>
                <Layout>
                  <ChangeRoute />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/cancel-route" element={
              <PrivateRoute>
                <Layout>
                  <CancelRoute />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/routes" element={
              <PrivateRoute>
                <Layout>
                  <ViewRoutes />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
