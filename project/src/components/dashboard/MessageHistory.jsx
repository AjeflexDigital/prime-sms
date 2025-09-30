import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, Download, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

function MessageHistory() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 20;

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          recipient: '+234 801 234 5678',
          content: 'Your order has been confirmed and will be delivered within 24 hours.',
          senderId: 'MYSTORE',
          status: 'delivered',
          pages: 1,
          cost: 3.50,
          network: 'MTN',
          sentAt: '2024-01-15 10:30:00',
          deliveredAt: '2024-01-15 10:30:15'
        },
        {
          id: 2,
          recipient: '+234 802 345 6789',
          content: 'Welcome to our platform! Your account has been activated successfully.',
          senderId: 'SMS_PLATFORM',
          status: 'sent',
          pages: 1,
          cost: 3.50,
          network: 'AIRTEL',
          sentAt: '2024-01-15 09:15:00',
          deliveredAt: null
        },
        {
          id: 3,
          recipient: '+234 803 456 7890',
          content: 'Payment received successfully. Reference: TXN123456789. Thank you for your business.',
          senderId: 'PAYMENTS',
          status: 'failed',
          pages: 1,
          cost: 3.50,
          network: 'GLO',
          sentAt: '2024-01-15 08:45:00',
          deliveredAt: null,
          failedReason: 'Invalid number'
        },
        {
          id: 4,
          recipient: '+234 804 567 8901',
          content: 'Reminder: Your appointment is scheduled for tomorrow at 2:00 PM. Please arrive 15 minutes early.',
          senderId: 'CLINIC',
          status: 'delivered',
          pages: 2,
          cost: 7.00,
          network: 'ETISALAT',
          sentAt: '2024-01-14 16:20:00',
          deliveredAt: '2024-01-14 16:20:08'
        },
        {
          id: 5,
          recipient: '+234 805 678 9012',
          content: 'Your OTP is 123456. Valid for 10 minutes.',
          senderId: 'VERIFY',
          status: 'delivered',
          pages: 1,
          cost: 3.50,
          network: 'MTN',
          sentAt: '2024-01-14 14:10:00',
          deliveredAt: '2024-01-14 14:10:03'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'delivered':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'sent':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filters.status !== 'all' && message.status !== filters.status) return false;
    if (filters.search && !message.recipient.includes(filters.search) && !message.content.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const startIndex = (currentPage - 1) * messagesPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + messagesPerPage);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Message History</h2>
              <p className="text-gray-600">View and manage your SMS message history</p>
            </div>
          </div>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{message.recipient}</div>
                      <div className="text-sm text-gray-500">From: {message.senderId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={message.content}>
                      {message.content}
                    </div>
                    <div className="text-sm text-gray-500">{message.pages} page(s)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(message.status)}
                      <span className={`ml-2 ${getStatusBadge(message.status)}`}>
                        {message.status}
                      </span>
                    </div>
                    {message.failedReason && (
                      <div className="text-xs text-red-600 mt-1">{message.failedReason}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {message.network}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{message.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{new Date(message.sentAt).toLocaleDateString()}</div>
                    <div>{new Date(message.sentAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-red-600 hover:text-red-900 flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(startIndex + messagesPerPage, filteredMessages.length)}</span> of{' '}
                  <span className="font-medium">{filteredMessages.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-red-50 border-red-500 text-red-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageHistory;