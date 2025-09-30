import React, { useState } from 'react';
import { Send, MessageSquare, User, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

function SendSMS() {
  const [formData, setFormData] = useState({
    recipient: '',
    message: '',
    senderId: 'SMS_PLATFORM'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [messageStats, setMessageStats] = useState({
    length: 0,
    pages: 1,
    cost: 0
  });

  // Calculate message stats
  const calculateStats = (message) => {
    const length = message.length;
    const pages = Math.ceil(length / 160) || 1;
    const cost = pages * 3.50; // ₦3.50 per page
    
    setMessageStats({ length, pages, cost });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'message') {
      calculateStats(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success response
      setSuccess(`SMS sent successfully to ${formData.recipient}! Cost: ₦${messageStats.cost.toFixed(2)}`);
      setFormData({
        recipient: '',
        message: '',
        senderId: 'SMS_PLATFORM'
      });
      setMessageStats({ length: 0, pages: 1, cost: 0 });
    } catch (err) {
      setError('Failed to send SMS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mr-4">
            <Send className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Send Single SMS</h2>
            <p className="text-gray-600">Send an SMS message to a single recipient</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SMS Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient */}
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Phone Number *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="recipient"
                    name="recipient"
                    required
                    value={formData.recipient}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., +234 801 234 5678"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter phone number with country code (e.g., +234 for Nigeria)
                </p>
              </div>

              {/* Sender ID */}
              <div>
                <label htmlFor="senderId" className="block text-sm font-medium text-gray-700 mb-2">
                  Sender ID
                </label>
                <select
                  id="senderId"
                  name="senderId"
                  value={formData.senderId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="SMS_PLATFORM">SMS_PLATFORM (Default)</option>
                  <option value="MYCOMPANY">MYCOMPANY (Pending Approval)</option>
                  <option value="MYBRAND">MYBRAND (Approved)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Custom sender IDs require admin approval
                </p>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message Content *
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Type your message here..."
                    maxLength={1000}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    {messageStats.length}/1000
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.recipient || !formData.message}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending SMS...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send SMS
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Message Preview & Stats */}
        <div className="space-y-6">
          {/* Message Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Characters:</span>
                <span className="font-semibold text-gray-900">{messageStats.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">SMS Pages:</span>
                <span className="font-semibold text-gray-900">{messageStats.pages}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated Cost:</span>
                <span className="font-semibold text-red-600">₦{messageStats.cost.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> Each SMS page contains up to 160 characters. 
                Longer messages are split into multiple pages.
              </p>
            </div>
          </div>

          {/* Message Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-xs text-gray-500">From: {formData.senderId}</span>
              </div>
              <div className="text-sm text-gray-900">
                {formData.message || (
                  <span className="text-gray-400 italic">Your message will appear here...</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Templates */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
            <div className="space-y-2">
              {[
                'Thank you for your order. We will process it shortly.',
                'Your appointment is confirmed for tomorrow at 2:00 PM.',
                'Welcome to our service! Your account has been activated.',
                'Payment received successfully. Reference: {ref}'
              ].map((template, index) => (
                <button
                  key={index}
                  onClick={() => setFormData(prev => ({ ...prev, message: template }))}
                  className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendSMS;