import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Applications from './pages/Applications';
import Buses from './pages/Buses';
import Drivers from './pages/Drivers';
import RoutesPage from './pages/Routes';
import Maintenance from './pages/Maintenance';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/students" element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
            } />
            
            <Route path="/applications" element={
              <PrivateRoute>
                <Applications />
              </PrivateRoute>
            } />
            
            <Route path="/buses" element={
              <PrivateRoute>
                <Buses />
              </PrivateRoute>
            } />
            
            <Route path="/drivers" element={
              <PrivateRoute>
                <Drivers />
              </PrivateRoute>
            } />
            
            <Route path="/routes" element={
              <PrivateRoute>
                <RoutesPage />
              </PrivateRoute>
            } />
            
            <Route path="/maintenance" element={
              <PrivateRoute>
                <Maintenance />
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
