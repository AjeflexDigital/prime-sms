import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, CreditCard as Edit, Search } from 'lucide-react';

function SpamManagement() {
  const [spamWords, setSpamWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    word: '',
    severity: 'medium',
    action: 'block',
    replacement: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setSpamWords([
        {
          id: 1,
          word: 'viagra',
          severity: 'high',
          action: 'block',
          replacement: null,
          created_by_email: 'admin@smsplatform.com',
          created_at: '2024-01-10'
        },
        {
          id: 2,
          word: 'casino',
          severity: 'high',
          action: 'block',
          replacement: null,
          created_by_email: 'admin@smsplatform.com',
          created_at: '2024-01-10'
        },
        {
          id: 3,
          word: 'lottery',
          severity: 'high',
          action: 'block',
          replacement: null,
          created_by_email: 'admin@smsplatform.com',
          created_at: '2024-01-10'
        },
        {
          id: 4,
          word: 'winner',
          severity: 'medium',
          action: 'flag',
          replacement: null,
          created_by_email: 'admin@smsplatform.com',
          created_at: '2024-01-10'
        },
        {
          id: 5,
          word: 'urgent',
          severity: 'low',
          action: 'flag',
          replacement: null,
          created_by_email: 'admin@smsplatform.com',
          created_at: '2024-01-10'
        },
        {
          id: 6,
          word: 'free',
          severity: 'low',
          action: 'replace',
          replacement: 'complimentary',
          created_by_email: 'admin@smsplatform.com',
          created_at: '2024-01-10'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingWord) {
      // Update existing word
      setSpamWords(prev => prev.map(word => 
        word.id === editingWord.id 
          ? { ...word, ...formData, updated_at: new Date().toISOString().split('T')[0] }
          : word
      ));
    } else {
      // Create new word
      const newWord = {
        id: Date.now(),
        ...formData,
        created_by_email: 'admin@smsplatform.com',
        created_at: new Date().toISOString().split('T')[0]
      };
      setSpamWords(prev => [newWord, ...prev]);
    }
    
    // Reset form
    setFormData({ word: '', severity: 'medium', action: 'block', replacement: '' });
    setEditingWord(null);
    setShowModal(false);
  };

  const handleEdit = (word) => {
    setEditingWord(word);
    setFormData({
      word: word.word,
      severity: word.severity,
      action: word.action,
      replacement: word.replacement || ''
    });
    setShowModal(true);
  };

  const handleDelete = (wordId) => {
    if (window.confirm('Are you sure you want to delete this spam word?')) {
      setSpamWords(prev => prev.filter(word => word.id !== wordId));
    }
  };

  const getSeverityBadge = (severity) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
    switch (severity) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getActionBadge = (action) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
    switch (action) {
      case 'block':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'flag':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'replace':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredWords = spamWords.filter(word =>
    word.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mr-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Spam Filter Management</h2>
              <p className="text-gray-600">Manage spam words and content filtering rules</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingWord(null);
              setFormData({ word: '', severity: 'medium', action: 'block', replacement: '' });
              setShowModal(true);
            }}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Spam Word
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{spamWords.length}</div>
              <div className="text-sm text-gray-500">Total Words</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">H</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {spamWords.filter(w => w.severity === 'high').length}
              </div>
              <div className="text-sm text-gray-500">High Severity</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-sm">M</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {spamWords.filter(w => w.severity === 'medium').length}
              </div>
              <div className="text-sm text-gray-500">Medium Severity</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">L</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {spamWords.filter(w => w.severity === 'low').length}
              </div>
              <div className="text-sm text-gray-500">Low Severity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search spam words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Spam Words Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Word
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Replacement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
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
              {filteredWords.map((word) => (
                <tr key={word.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{word.word}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getSeverityBadge(word.severity)}>
                      {word.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getActionBadge(word.action)}>
                      {word.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {word.replacement || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {word.created_by_email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(word.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(word)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(word.id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingWord ? 'Edit Spam Word' : 'Add New Spam Word'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Word *
                </label>
                <input
                  type="text"
                  required
                  value={formData.word}
                  onChange={(e) => setFormData(prev => ({ ...prev, word: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter spam word"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action
                </label>
                <select
                  value={formData.action}
                  onChange={(e) => setFormData(prev => ({ ...prev, action: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="block">Block Message</option>
                  <option value="flag">Flag for Review</option>
                  <option value="replace">Replace Word</option>
                </select>
              </div>

              {formData.action === 'replace' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Replacement Word
                  </label>
                  <input
                    type="text"
                    value={formData.replacement}
                    onChange={(e) => setFormData(prev => ({ ...prev, replacement: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter replacement word"
                  />
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {editingWord ? 'Update Word' : 'Add Word'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpamManagement;