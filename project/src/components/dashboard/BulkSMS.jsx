import React, { useState } from 'react';
import { Upload, Download, Users, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

function BulkSMS() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [senderId, setSenderId] = useState('SMS_PLATFORM');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);
  const [messageStats, setMessageStats] = useState({
    length: 0,
    pages: 1,
    estimatedCost: 0,
    recipients: 0
  });

  // Handle file upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.type !== 'text/csv') {
        setError('Please upload a CSV file only');
        return;
      }
      
      if (uploadedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }

      setFile(uploadedFile);
      setError('');
      
      // Parse CSV for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        // Sample first 5 rows for preview
        const sampleData = lines.slice(1, 6).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim() || '';
            return obj;
          }, {});
        }).filter(row => Object.values(row).some(val => val)); // Remove empty rows

        setPreview(sampleData);
        
        // Calculate total recipients
        const totalRecipients = lines.length - 1; // Exclude header
        updateMessageStats(message, totalRecipients);
      };
      reader.readAsText(uploadedFile);
    }
  };

  // Update message statistics
  const updateMessageStats = (msg, recipients = preview.length) => {
    const length = msg.length;
    const pages = Math.ceil(length / 160) || 1;
    const costPerMessage = pages * 3.50;
    const estimatedCost = costPerMessage * recipients;
    
    setMessageStats({
      length,
      pages,
      estimatedCost,
      recipients
    });
  };

  const handleMessageChange = (e) => {
    const msg = e.target.value;
    setMessage(msg);
    updateMessageStats(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !message) {
      setError('Please upload a CSV file and enter a message');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setSuccess(`Bulk SMS job started! Processing ${messageStats.recipients} messages. Estimated cost: ₦${messageStats.estimatedCost.toFixed(2)}`);
      
      // Reset form
      setFile(null);
      setMessage('');
      setPreview([]);
      setMessageStats({ length: 0, pages: 1, estimatedCost: 0, recipients: 0 });
      
      // Reset file input
      const fileInput = document.getElementById('csvFile');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError('Failed to start bulk SMS job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview([]);
    setMessageStats(prev => ({ ...prev, recipients: 0, estimatedCost: 0 }));
    const fileInput = document.getElementById('csvFile');
    if (fileInput) fileInput.value = '';
  };

  const downloadSampleCSV = () => {
    const csvContent = "name,phone,email\nJohn Doe,+234 801 234 5678,john@example.com\nJane Smith,+234 802 345 6789,jane@example.com\nBob Johnson,+234 803 456 7890,bob@example.com";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_contacts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bulk SMS</h2>
              <p className="text-gray-600">Send SMS messages to multiple recipients via CSV upload</p>
            </div>
          </div>
          <button
            onClick={downloadSampleCSV}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Sample CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* File Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Upload CSV File</h3>
            
            {!file ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">Upload your CSV file</p>
                  <p className="text-sm text-gray-500">
                    CSV file should contain columns: name, phone, email (optional)
                  </p>
                  <p className="text-xs text-gray-400">Maximum file size: 5MB</p>
                </div>
                <label className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                  <input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB • {messageStats.recipients} recipients
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Message Composition */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Compose Message</h3>
            
            <div className="space-y-4">
              {/* Sender ID */}
              <div>
                <label htmlFor="senderId" className="block text-sm font-medium text-gray-700 mb-2">
                  Sender ID
                </label>
                <select
                  id="senderId"
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="SMS_PLATFORM">SMS_PLATFORM (Default)</option>
                  <option value="MYCOMPANY">MYCOMPANY (Pending Approval)</option>
                  <option value="MYBRAND">MYBRAND (Approved)</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message Content *
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    rows={6}
                    value={message}
                    onChange={handleMessageChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Hi {name}, your order has been confirmed..."
                    maxLength={1000}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    {messageStats.length}/1000
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use {'{name}'} to personalize messages with recipient names
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Send Bulk SMS</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Important:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Messages will be sent immediately after confirmation</li>
                    <li>Credits will be deducted from your account</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !file || !message}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Bulk SMS...
                </>
              ) : (
                <>
                  <Users className="h-5 w-5 mr-2" />
                  Send Bulk SMS
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview & Stats */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Recipients:</span>
                <span className="font-semibold text-gray-900">{messageStats.recipients}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Message Length:</span>
                <span className="font-semibold text-gray-900">{messageStats.length} chars</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">SMS Pages:</span>
                <span className="font-semibold text-gray-900">{messageStats.pages}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-sm font-medium text-gray-900">Estimated Cost:</span>
                <span className="font-bold text-red-600 text-lg">₦{messageStats.estimatedCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* CSV Preview */}
          {preview.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CSV Preview</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0] || {}).map((header) => (
                        <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Showing first 5 rows. Total: {messageStats.recipients} recipients
              </p>
            </div>
          )}

          {/* Message Preview */}
          {message && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-xs text-gray-500">From: {senderId}</span>
                </div>
                <div className="text-sm text-gray-900">
                  {message.replace('{name}', preview[0]?.name || 'John Doe')}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Preview shows personalized message for first recipient
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BulkSMS;