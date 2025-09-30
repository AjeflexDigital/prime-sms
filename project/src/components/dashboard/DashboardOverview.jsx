import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  TrendingUp, 
  Wallet, 
  Users, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMessages: 0,
    todayMessages: 0,
    successfulMessages: 0,
    failedMessages: 0,
    totalSpent: 0,
    todaySpent: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalMessages: 1250,
        todayMessages: 45,
        successfulMessages: 1198,
        failedMessages: 52,
        totalSpent: 4375.50,
        todaySpent: 157.50,
        successRate: 95.8
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      red: 'bg-red-50 text-red-600',
      yellow: 'bg-yellow-50 text-yellow-600'
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                {changeType === 'increase' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.full_name || 'User'}!</h2>
            <p className="text-red-100">Here's what's happening with your SMS campaigns today.</p>
          </div>
          <div className="text-right">
            <p className="text-red-100 text-sm">Current Balance</p>
            <p className="text-3xl font-bold">₦{user?.credits || '0.00'}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Messages"
          value={stats.totalMessages.toLocaleString()}
          icon={MessageSquare}
          change="+12.5%"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Today's Messages"
          value={stats.todayMessages}
          icon={Send}
          change="+8.2%"
          changeType="increase"
          color="green"
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={TrendingUp}
          change="+2.1%"
          changeType="increase"
          color="green"
        />
        <StatCard
          title="Total Spent"
          value={`₦${stats.totalSpent.toLocaleString()}`}
          icon={Wallet}
          change="+15.3%"
          changeType="increase"
          color="yellow"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { recipient: '+234 801 234 5678', message: 'Your order has been confirmed...', status: 'delivered', time: '2 mins ago' },
              { recipient: '+234 802 345 6789', message: 'Welcome to our platform...', status: 'sent', time: '5 mins ago' },
              { recipient: '+234 803 456 7890', message: 'Your payment was successful...', status: 'delivered', time: '8 mins ago' },
              { recipient: '+234 804 567 8901', message: 'Reminder: Your appointment...', status: 'failed', time: '12 mins ago' }
            ].map((msg, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{msg.recipient}</p>
                  <p className="text-sm text-gray-500 truncate max-w-xs">{msg.message}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    msg.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    msg.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {msg.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Send className="h-5 w-5 text-red-600 mr-3" />
                <span className="font-medium text-gray-900">Send Single SMS</span>
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">Bulk SMS Upload</span>
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Add Credits</span>
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                <span className="font-medium text-gray-900">Schedule Message</span>
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Network Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { network: 'MTN', messages: 450, success: 98.2, color: 'yellow' },
            { network: 'Airtel', messages: 320, success: 96.8, color: 'red' },
            { network: 'Glo', messages: 280, success: 94.5, color: 'green' },
            { network: '9mobile', messages: 200, success: 97.1, color: 'blue' }
          ].map((network, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                network.color === 'yellow' ? 'bg-yellow-100' :
                network.color === 'red' ? 'bg-red-100' :
                network.color === 'green' ? 'bg-green-100' :
                'bg-blue-100'
              }`}>
                <Activity className={`h-6 w-6 ${
                  network.color === 'yellow' ? 'text-yellow-600' :
                  network.color === 'red' ? 'text-red-600' :
                  network.color === 'green' ? 'text-green-600' :
                  'text-blue-600'
                }`} />
              </div>
              <h4 className="font-semibold text-gray-900">{network.network}</h4>
              <p className="text-sm text-gray-500">{network.messages} messages</p>
              <p className="text-sm font-medium text-green-600">{network.success}% success</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;