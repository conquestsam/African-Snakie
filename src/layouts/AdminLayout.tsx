import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Leaf,
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);
  
  useEffect(() => {
    // Close sidebar on mobile when route changes
    setIsSidebarOpen(false);
  }, [location.pathname]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const navItems = [
    { path: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    { path: '/admin/products', icon: <ShoppingBag className="h-5 w-5" />, label: 'Products' },
    { path: '/admin/orders', icon: <Package className="h-5 w-5" />, label: 'Orders' },
    { path: '/admin/customers', icon: <Users className="h-5 w-5" />, label: 'Customers' },
    { path: '/admin/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-green-600">African Snakie Admin</h1>
          </div>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 mb-6">
            <Link
              to="/"
              className="flex items-center text-gray-600 py-2 px-4 rounded-md hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Back to Site</span>
            </Link>
          </div>
          
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-2 px-4 mx-4 rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center text-red-600 py-2 px-4 mx-4 mt-6 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 focus:outline-none lg:hidden"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          
          <div className="flex items-center">
            <div className="relative">
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium text-gray-700">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminLayout;