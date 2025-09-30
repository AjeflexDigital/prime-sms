import React from 'react';
import { Routes, Route } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Welcome to the admin panel. This section is under development and will include:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-sm text-gray-600">Manage users, approve accounts, suspend users</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">SMS Analytics</h3>
              <p className="text-sm text-gray-600">Platform-wide SMS statistics and reports</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Pricing Management</h3>
              <p className="text-sm text-gray-600">Configure pricing tiers and bonus rules</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Spam Filter</h3>
              <p className="text-sm text-gray-600">Manage spam words and content filtering</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Reseller Management</h3>
              <p className="text-sm text-gray-600">Manage reseller accounts and white-labeling</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">System Settings</h3>
              <p className="text-sm text-gray-600">Platform configuration and settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;