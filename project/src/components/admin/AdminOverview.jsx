import React from 'react';
import { Users, MessageSquare, DollarSign, TrendingUp, UserCheck, AlertTriangle } from 'lucide-react';

function AdminOverview({ stats }) {
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
                <TrendingUp className={`h-4 w-4 mr-1 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`} />
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

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          change="+12.5%"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Total Messages"
          value={stats.totalMessages.toLocaleString()}
          icon={MessageSquare}
          change="+8.2%"
          changeType="increase"
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          change="+15.3%"
          changeType="increase"
          color="yellow"
        />
        <StatCard
          title="Active Resellers"
          value={stats.totalResellers}
          icon={UserCheck}
          change="+5.1%"
          changeType="increase"
          color="red"
        />
      </div>

      {/* Today's Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-gray-700">Messages Sent</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.todayMessages}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">Revenue Generated</span>
              </div>
              <span className="font-semibold text-gray-900">₦{stats.todayRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-500 mr-3" />
                <span className="text-gray-700">New Registrations</span>
              </div>
              <span className="font-semibold text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-700">Failed Messages</span>
              </div>
              <span className="font-semibold text-gray-900">3</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New user registered', user: 'john@example.com', time: '2 mins ago', type: 'user' },
              { action: 'Bulk SMS sent', user: 'jane@company.com', time: '5 mins ago', type: 'message' },
              { action: 'Payment received', user: 'bob@business.com', time: '8 mins ago', type: 'payment' },
              { action: 'Reseller approved', user: 'alice@reseller.com', time: '12 mins ago', type: 'reseller' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'message' ? 'bg-green-500' :
                    activity.type === 'payment' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">1.2s</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 mb-1">98.5%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">45GB</div>
            <div className="text-sm text-gray-600">Storage Used</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;