import React, { useState, useEffect } from 'react';
import { FileText, Plus, CreditCard as Edit, Trash2, Copy, Search } from 'lucide-react';

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    category: 'general'
  });

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setTemplates([
        {
          id: 1,
          name: 'Order Confirmation',
          content: 'Hi {name}, your order #{orderNumber} has been confirmed and will be delivered within 24 hours. Thank you for choosing us!',
          category: 'ecommerce',
          usageCount: 45,
          variables: ['name', 'orderNumber'],
          createdAt: '2024-01-10',
          isActive: true
        },
        {
          id: 2,
          name: 'Appointment Reminder',
          content: 'Dear {name}, this is a reminder that you have an appointment scheduled for {date} at {time}. Please arrive 15 minutes early.',
          category: 'healthcare',
          usageCount: 23,
          variables: ['name', 'date', 'time'],
          createdAt: '2024-01-08',
          isActive: true
        },
        {
          id: 3,
          name: 'Payment Received',
          content: 'Payment of ₦{amount} has been received successfully. Reference: {reference}. Thank you for your business!',
          category: 'finance',
          usageCount: 67,
          variables: ['amount', 'reference'],
          createdAt: '2024-01-05',
          isActive: true
        },
        {
          id: 4,
          name: 'Welcome Message',
          content: 'Welcome to {companyName}, {name}! Your account has been activated successfully. We\'re excited to have you on board.',
          category: 'general',
          usageCount: 12,
          variables: ['companyName', 'name'],
          createdAt: '2024-01-03',
          isActive: true
        },
        {
          id: 5,
          name: 'OTP Verification',
          content: 'Your OTP is {otp}. Valid for {minutes} minutes. Do not share this code with anyone.',
          category: 'security',
          usageCount: 89,
          variables: ['otp', 'minutes'],
          createdAt: '2024-01-01',
          isActive: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'security', label: 'Security' },
    { value: 'marketing', label: 'Marketing' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Extract variables from content
    const variables = [...formData.content.matchAll(/\{(\w+)\}/g)].map(match => match[1]);
    
    if (editingTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(template => 
        template.id === editingTemplate.id 
          ? { ...template, ...formData, variables, updatedAt: new Date().toISOString().split('T')[0] }
          : template
      ));
    } else {
      // Create new template
      const newTemplate = {
        id: Date.now(),
        ...formData,
        variables,
        usageCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        isActive: true
      };
      setTemplates(prev => [newTemplate, ...prev]);
    }
    
    // Reset form
    setFormData({ name: '', content: '', category: 'general' });
    setEditingTemplate(null);
    setShowModal(false);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      content: template.content,
      category: template.category
    });
    setShowModal(true);
  };

  const handleDelete = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(template => template.id !== templateId));
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    alert('Template content copied to clipboard!');
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mr-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Message Templates</h2>
              <p className="text-gray-600">Create and manage reusable SMS templates</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingTemplate(null);
              setFormData({ name: '', content: '', category: 'general' });
              setShowModal(true);
            }}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              onChange={(e) => setSearchTerm(e.target.value === 'all' ? '' : e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {categories.find(cat => cat.value === template.category)?.label}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(template.content)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Copy content"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(template)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                  title="Edit template"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Delete template"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-3">{template.content}</p>
            </div>

            {template.variables.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Variables:</p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs font-mono bg-gray-100 text-gray-700 rounded"
                    >
                      {`{${variable}}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Used {template.usageCount} times</span>
              <span>Created {template.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Create your first template to get started.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => {
                setEditingTemplate(null);
                setFormData({ name: '', content: '', category: 'general' });
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </button>
          )}
        </div>
      )}

      {/* Template Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Order Confirmation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Content *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Enter your message template here. Use {variableName} for dynamic content."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use curly braces for variables, e.g., {`{name}`}, {`{amount}`}, {`{date}`}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Template Variables</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Variables found in your template:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[...formData.content.matchAll(/\{(\w+)\}/g)].map((match, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs font-mono bg-blue-100 text-blue-800 rounded"
                    >
                      {match[0]}
                    </span>
                  ))}
                  {[...formData.content.matchAll(/\{(\w+)\}/g)].length === 0 && (
                    <span className="text-sm text-blue-600 italic">No variables found</span>
                  )}
                </div>
              </div>

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
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Templates;