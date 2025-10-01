import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Shield, 
  CreditCard,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Admin Dashboard Components
import AdminOverview from '../components/admin/AdminOverview';
import UserManagement from '../components/admin/UserManagement';
import MessageManagement from '../components/admin/MessageManagement';
import SpamManagement from '../components/admin/SpamManagement';
import PricingManagement from '../components/admin/PricingManagement';
import PaymentManagement from '../components/admin/PaymentManagement';
import ResellerManagement from '../components/admin/ResellerManagement';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResellers: 0,
    totalMessages: 0,
    totalRevenue: 0,
    todayMessages: 0,
    todayRevenue: 0
  });

  // Navigation items for admin
  const navigation = [
    { name: 'Overview', href: '/admin', icon: BarChart3, current: location.pathname === '/admin' },
    { name: 'Users', href: '/admin/users', icon: Users, current: location.pathname === '/admin/users' },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare, current: location.pathname === '/admin/messages' },
    { name: 'Resellers', href: '/admin/resellers', icon: UserCheck, current: location.pathname === '/admin/resellers' },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard, current: location.pathname === '/admin/payments' },
    { name: 'Spam Filter', href: '/admin/spam', icon: Shield, current: location.pathname === '/admin/spam' },
    { name: 'Pricing', href: '/admin/pricing', icon: DollarSign, current: location.pathname === '/admin/pricing' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, current: location.pathname === '/admin/settings' },
  ];

  // Load admin statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Simulate API call for now
        setTimeout(() => {
          setStats({
            totalUsers: 1247,
            totalResellers: 23,
            totalMessages: 45678,
            totalRevenue: 234567.50,
            todayMessages: 234,
            todayRevenue: 1234.50
          });
        }, 1000);
      } catch (error) {
        console.error('Failed to load admin stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Shield className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      item.current
                        ? 'bg-red-100 text-red-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`mr-4 h-6 w-6 ${item.current ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Shield className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      item.current
                        ? 'bg-red-100 text-red-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-3 h-6 w-6 ${item.current ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{user?.full_name || 'Admin'}</p>
                <p className="text-xs font-medium text-gray-500">Administrator</p>
              </div>
              <button
                onClick={logout}
                className="ml-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {navigation.find(item => item.current)?.name || 'Admin Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your SMS platform
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Quick stats */}
                <div className="hidden lg:flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                    <div className="text-gray-500">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{stats.todayMessages}</div>
                    <div className="text-gray-500">Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">₦{stats.todayRevenue.toLocaleString()}</div>
                    <div className="text-gray-500">Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<AdminOverview stats={stats} />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/messages" element={<MessageManagement />} />
              <Route path="/resellers" element={<ResellerManagement />} />
              <Route path="/payments" element={<PaymentManagement />} />
              <Route path="/spam" element={<SpamManagement />} />
              <Route path="/pricing" element={<PricingManagement />} />
              <Route path="/settings" element={<div className="bg-white rounded-lg shadow p-6"><h2 className="text-xl font-semibold">System Settings</h2><p className="text-gray-600 mt-2">Platform configuration settings will be available here.</p></div>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;