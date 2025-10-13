import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  Upload, 
  BarChart3, 
  Wallet, 
  Settings, 
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Dashboard Components
import DashboardOverview from '../components/dashboard/DashboardOverview';
import SendSMS from '../components/dashboard/SendSMS';
import BulkSMS from '../components/dashboard/BulkSMS';
import MessageHistory from '../components/dashboard/MessageHistory';
import WalletPage from '../components/dashboard/WalletPage';
import Templates from '../components/dashboard/Templates';
import Profile from '../components/dashboard/Profile';

function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Navigation items
  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: BarChart3, current: location.pathname === '/dashboard' },
    { name: 'Send SMS', href: '/dashboard/send', icon: Send, current: location.pathname === '/dashboard/send' },
    { name: 'Bulk SMS', href: '/dashboard/bulk', icon: Upload, current: location.pathname === '/dashboard/bulk' },
    { name: 'Message History', href: '/dashboard/messages', icon: MessageSquare, current: location.pathname === '/dashboard/messages' },
    { name: 'Templates', href: '/dashboard/templates', icon: Settings, current: location.pathname === '/dashboard/templates' },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet, current: location.pathname === '/dashboard/wallet' },
    { name: 'Profile', href: '/dashboard/profile', icon: User, current: location.pathname === '/dashboard/profile' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <MessageSquare className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Prime Sms</span>
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
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-700">{user?.full_name || 'User'}</p>
                <p className="text-sm font-medium text-gray-500">₦{user?.credits || '0.00'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <MessageSquare className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Prime Sms</span>
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
                  <User className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{user?.full_name || 'User'}</p>
                <p className="text-xs font-medium text-gray-500">₦{user?.credits || '0.00'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
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
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {navigation.find(item => item.current)?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Welcome back, {user?.full_name || 'User'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="hidden md:block">
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="h-6 w-6" />
                </button>
                
                {/* User menu - desktop only */}
                <div className="hidden md:block">
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{user?.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500">Balance: ₦{user?.credits || '0.00'}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-red-600" />
                    </div>
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
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/send" element={<SendSMS />} />
              <Route path="/bulk" element={<BulkSMS />} />
              <Route path="/messages" element={<MessageHistory />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;