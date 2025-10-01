import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard as Edit, Save, X } from 'lucide-react';

function PricingManagement() {
  const [pricingTiers, setPricingTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTier, setEditingTier] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setPricingTiers([
        {
          id: 1,
          min_volume: 1,
          max_volume: 4999,
          price_per_unit: 3.50,
          network: 'all',
          country_code: 'NG',
          bonus_percentage: 0.00,
          is_active: true,
          created_at: '2024-01-01'
        },
        {
          id: 2,
          min_volume: 5000,
          max_volume: 19999,
          price_per_unit: 3.20,
          network: 'all',
          country_code: 'NG',
          bonus_percentage: 2.00,
          is_active: true,
          created_at: '2024-01-01'
        },
        {
          id: 3,
          min_volume: 20000,
          max_volume: 49999,
          price_per_unit: 3.00,
          network: 'all',
          country_code: 'NG',
          bonus_percentage: 3.00,
          is_active: true,
          created_at: '2024-01-01'
        },
        {
          id: 4,
          min_volume: 50000,
          max_volume: 99999,
          price_per_unit: 2.80,
          network: 'all',
          country_code: 'NG',
          bonus_percentage: 5.00,
          is_active: true,
          created_at: '2024-01-01'
        },
        {
          id: 5,
          min_volume: 100000,
          max_volume: null,
          price_per_unit: 2.50,
          network: 'all',
          country_code: 'NG',
          bonus_percentage: 10.00,
          is_active: true,
          created_at: '2024-01-01'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEdit = (tier) => {
    setEditingTier({ ...tier });
  };

  const handleSave = () => {
    setPricingTiers(prev => prev.map(tier => 
      tier.id === editingTier.id ? editingTier : tier
    ));
    setEditingTier(null);
  };

  const handleCancel = () => {
    setEditingTier(null);
  };

  const handleInputChange = (field, value) => {
    setEditingTier(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pricing Management</h2>
            <p className="text-gray-600">Configure volume-based pricing tiers and bonus rules</p>
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Pricing Rules</h3>
        <ul className="text-blue-700 space-y-1 text-sm">
          <li>• Pricing is calculated per SMS page (160 characters = 1 page)</li>
          <li>• Volume discounts apply based on total purchase amount</li>
          <li>• Bonus credits are automatically added to user accounts</li>
          <li>• Changes take effect immediately for new purchases</li>
        </ul>
      </div>

      {/* Pricing Tiers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Volume-Based Pricing Tiers</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price per SMS (₦)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bonus %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network
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
              {pricingTiers.map((tier) => (
                <tr key={tier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTier && editingTier.id === tier.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editingTier.min_volume}
                          onChange={(e) => handleInputChange('min_volume', parseInt(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          value={editingTier.max_volume || ''}
                          onChange={(e) => handleInputChange('max_volume', e.target.value ? parseInt(e.target.value) : null)}
                          placeholder="∞"
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900">
                        {tier.min_volume.toLocaleString()} - {tier.max_volume ? tier.max_volume.toLocaleString() : '∞'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTier && editingTier.id === tier.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editingTier.price_per_unit}
                        onChange={(e) => handleInputChange('price_per_unit', parseFloat(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        ₦{tier.price_per_unit.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTier && editingTier.id === tier.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editingTier.bonus_percentage}
                        onChange={(e) => handleInputChange('bonus_percentage', parseFloat(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">
                        {tier.bonus_percentage}%
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTier && editingTier.id === tier.id ? (
                      <select
                        value={editingTier.network}
                        onChange={(e) => handleInputChange('network', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="all">All Networks</option>
                        <option value="MTN">MTN</option>
                        <option value="AIRTEL">Airtel</option>
                        <option value="GLO">Glo</option>
                        <option value="ETISALAT">9mobile</option>
                      </select>
                    ) : (
                      <div className="text-sm text-gray-900">
                        {tier.network === 'all' ? 'All Networks' : tier.network}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      tier.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tier.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingTier && editingTier.id === tier.id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-gray-900 flex items-center"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(tier)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pricingTiers.slice(0, 3).map((tier, index) => (
            <div key={tier.id} className="border border-gray-200 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  ₦{tier.price_per_unit.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 mb-2">per SMS</div>
                <div className="text-xs text-gray-500">
                  {tier.min_volume.toLocaleString()} - {tier.max_volume ? tier.max_volume.toLocaleString() : '∞'} SMS
                </div>
                {tier.bonus_percentage > 0 && (
                  <div className="mt-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      +{tier.bonus_percentage}% Bonus
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PricingManagement;