import React from 'react';
import { Routes, Route } from 'react-router-dom';

function ResellerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Reseller Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Welcome to the reseller panel. This section is under development and will include:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Customer Management</h3>
              <p className="text-sm text-gray-600">Manage your customers and sub-accounts</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">White-Label Branding</h3>
              <p className="text-sm text-gray-600">Customize your platform branding and domain</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Pricing Control</h3>
              <p className="text-sm text-gray-600">Set your own pricing for customers</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Commission Reports</h3>
              <p className="text-sm text-gray-600">Track your earnings and commissions</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Customer Analytics</h3>
              <p className="text-sm text-gray-600">View customer usage and statistics</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Support Tools</h3>
              <p className="text-sm text-gray-600">Customer support and management tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResellerDashboard;