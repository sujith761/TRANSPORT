import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bus, 
  User, 
  Map, 
  Wrench, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/students', icon: Users, label: 'Students' },
    { path: '/applications', icon: FileText, label: 'Applications' },
    { path: '/buses', icon: Bus, label: 'Buses' },
    { path: '/drivers', icon: User, label: 'Drivers' },
    { path: '/routes', icon: Map, label: 'Routes' },
    { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
  ];

  return (
    <div className="h-screen w-64 bg-white shadow-lg fixed left-0 top-0 flex flex-col">
      <div className="p-6 bg-gradient-to-r from-admin-primary to-admin-secondary text-white">
        <h2 className="text-xl font-bold">KASC Admin</h2>
        <p className="text-sm text-blue-100">Transport Management</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'sidebar-link-active' : 'sidebar-link'
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
