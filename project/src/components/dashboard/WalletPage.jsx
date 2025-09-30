import React, { useState, useEffect } from 'react';
import { Wallet, CreditCard, Plus, Download, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function WalletPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setTransactions([
        {
          id: 1,
          type: 'credit',
          amount: 5000.00,
          balance: 8500.00,
          description: 'Paystack payment - Top up',
          reference: 'TXN_123456789',
          status: 'completed',
          createdAt: '2024-01-15 14:30:00'
        },
        {
          id: 2,
          type: 'debit',
          amount: 157.50,
          balance: 3500.00,
          description: 'Bulk SMS: 45 messages sent',
          reference: 'SMS_BULK_001',
          status: 'completed',
          createdAt: '2024-01-15 10:15:00'
        },
        {
          id: 3,
          type: 'bonus',
          amount: 250.00,
          balance: 3657.50,
          description: 'Bonus credits - 5% on purchase',
          reference: 'BONUS_001',
          status: 'completed',
          createdAt: '2024-01-15 09:30:00'
        },
        {
          id: 4,
          type: 'debit',
          amount: 21.00,
          balance: 3407.50,
          description: 'SMS to +234 801 234 5678',
          reference: 'SMS_SINGLE_001',
          status: 'completed',
          createdAt: '2024-01-14 16:45:00'
        },
        {
          id: 5,
          type: 'credit',
          amount: 2000.00,
          balance: 3428.50,
          description: 'Paystack payment - Top up',
          reference: 'TXN_987654321',
          status: 'completed',
          createdAt: '2024-01-14 12:20:00'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTopUp = () => {
    if (!topUpAmount || parseFloat(topUpAmount) < 100) {
      alert('Minimum top-up amount is ₦100');
      return;
    }

    // Simulate Paystack integration
    alert(`Redirecting to Paystack for ₦${topUpAmount} payment...`);
    setShowTopUp(false);
    setTopUpAmount('');
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'credit':
      case 'bonus':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'debit':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'credit':
      case 'bonus':
        return 'text-green-600';
      case 'debit':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
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
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Wallet</h2>
              <p className="text-gray-600">Manage your SMS credits and transactions</p>
            </div>
          </div>
          <button
            onClick={() => setShowTopUp(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Top Up
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Current Balance</p>
              <p className="text-3xl font-bold">₦{user?.credits || '0.00'}</p>
            </div>
            <Wallet className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month Spent</p>
              <p className="text-2xl font-bold text-gray-900">₦1,247.50</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-blue-600 font-medium">8 this week</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Top-Up</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1000, 2500, 5000, 10000].map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setTopUpAmount(amount.toString());
                setShowTopUp(true);
              }}
              className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-center"
            >
              <div className="text-lg font-semibold text-gray-900">₦{amount.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Quick top-up</div>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-4">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                      {new Date(transaction.createdAt).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-gray-400">Ref: {transaction.reference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'debit' ? '-' : '+'}₦{transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Balance: ₦{transaction.balance.toFixed(2)}</p>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Up Wallet</h3>
              <button
                onClick={() => setShowTopUp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter amount (min ₦100)"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Bonus Credits Available!</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>₦5,000 - ₦19,999: Get 2% bonus</li>
                      <li>₦20,000 - ₦49,999: Get 3% bonus</li>
                      <li>₦50,000+: Get 5% bonus</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTopUp(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopUp}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Pay with Paystack
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletPage;