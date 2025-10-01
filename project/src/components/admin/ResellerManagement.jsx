import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Eye, Settings, CheckCircle, XCircle } from 'lucide-react';

function ResellerManagement() {
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    package: 'all',
    status: 'all',
    search: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setResellers([
        {
          id: 1,
          user_email: 'jane@company.com',
          user_name: 'Jane Smith',
          package: 'gold',
          domain: 'sms.company.com',
          brand_name: 'Company SMS',
          commission_rate: 15.00,
          is_active: true,
          customers_count: 25,
          total_revenue: 45000.00,
          created_at: '2024-01-10',
          expires_at: '2024-12-31'
        },
        {
          id: 2,
          user_email: 'bob@reseller.com',
          user_name: 'Bob Johnson',
          package: 'silver',
          domain: null,
          brand_name: 'Bob SMS Services',
          commission_rate: 10.00,
          is_active: true,
          customers_count: 12,
          total_revenue: 18000.00,
          created_at: '2024-01-12',
          expires_at: '2024-06-30'
        },
        {
          id: 3,
          user_email: 'alice@premium.com',
          user_name: 'Alice Brown',
          package: 'platinum',
          domain: 'messages.premium.com',
          brand_name: 'Premium Messaging',
          commission_rate: 20.00,
          is_active: true,
          customers_count: 50,
          total_revenue: 125000.00,
          created_at: '2024-01-05',
          expires_at: '2025-01-05'
        },
        {
          id: 4,
          user_email: 'charlie@inactive.com',
          user_name: 'Charlie Wilson',
          package: 'silver',
          domain: null,
          brand_name: 'Charlie SMS',
          commission_rate: 10.00,
          is_active: false,
          customers_count: 5,
          total_revenue: 2500.00,
          created_at: '2024-01-08',
          expires_at: '2024-01-08'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getPackageBadge = (packageType) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
    switch (packageType) {
      case 'platinum':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'gold':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'silver':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleStatusToggle = (resellerId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activate' : 'deactivate';
    
    if (window.confirm(`Are you sure you want to ${action} this reseller?`)) {
      setResellers(prev => prev.map(reseller => 
        reseller.id === resellerId ? { ...reseller, is_active: newStatus } : reseller
      ));
    }
  };

  const filteredResellers = resellers.filter(reseller => {
    if (filters.package !== 'all' && reseller.package !== filters.package) return false;
    if (filters.status !== 'all') {
      const isActive = filters.status === 'active';
      if (reseller.is_active !== isActive) return false;
    }
    if (filters.search && !reseller.user_email.toLowerCase().includes(filters.search.toLowerCase()) && 
        !reseller.user_name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !reseller.brand_name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mr-4">
            <UserCheck className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reseller Management</h2>
            <p className="text-gray-600">Manage white-label partners and their settings</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{resellers.length}</div>
              <div className="text-sm text-gray-500">Total Resellers</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {resellers.filter(r => r.is_active).length}
              </div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">C</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {resellers.reduce((sum, r) => sum + r.customers_count, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Customers</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">₦</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                ₦{resellers.reduce((sum, r) => sum + r.total_revenue, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resellers..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Package</label>
            <select
              value={filters.package}
              onChange={(e) => setFilters(prev => ({ ...prev, package: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Packages</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resellers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reseller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResellers.map((reseller) => (
                <tr key={reseller.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-700">
                            {reseller.user_name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{reseller.user_name}</div>
                        <div className="text-sm text-gray-500">{reseller.user_email}</div>
                        <div className="text-xs text-gray-400">{reseller.brand_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getPackageBadge(reseller.package)}>
                      {reseller.package}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reseller.domain || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reseller.commission_rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reseller.customers_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{reseller.total_revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {reseller.is_active ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        reseller.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {reseller.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 flex items-center">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </button>
                      <button 
                        onClick={() => handleStatusToggle(reseller.id, reseller.is_active)}
                        className={`flex items-center ${
                          reseller.is_active 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {reseller.is_active ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ResellerManagement;