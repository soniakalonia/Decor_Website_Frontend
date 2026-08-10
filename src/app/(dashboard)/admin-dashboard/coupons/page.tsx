'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import AdminSidebar from '../components/AdminSidebar';
import { Plus, Edit, Trash2, Percent, DollarSign, Truck, Gift } from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y';
  value: number;
  minimum_amount: number;
  maximum_discount: number;
  usage_limit: number;
  used_count: number;
  user_limit: number;
  applicable_to: 'all' | 'categories' | 'products' | 'brands';
  applicable_ids: number[];
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
}

interface CouponFormData {
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y';
  value: number;
  minimum_amount: number;
  maximum_discount: number;
  usage_limit: number;
  user_limit: number;
  applicable_to: 'all' | 'categories' | 'products' | 'brands';
  applicable_ids: number[];
  start_date: string;
  end_date: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    totalUsage: 0,
    totalDiscountGiven: 0
  });

  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    minimum_amount: 0,
    maximum_discount: 0,
    usage_limit: 0,
    user_limit: 1,
    applicable_to: 'all',
    applicable_ids: [],
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/coupons', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/coupon/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      const url = editingCoupon ? `/api/admin/coupon/${editingCoupon.id}` : '/api/admin/coupon';
      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        fetchCoupons();
        fetchStats();
        resetForm();
        alert(editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!');
      } else {
        alert(data.message || 'Error saving coupon');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Error saving coupon');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/coupon/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        fetchCoupons();
        fetchStats();
        alert('Coupon deleted successfully!');
      } else {
        alert(data.message || 'Error deleting coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Error deleting coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      minimum_amount: 0,
      maximum_discount: 0,
      usage_limit: 0,
      user_limit: 1,
      applicable_to: 'all',
      applicable_ids: [],
      start_date: '',
      end_date: ''
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      minimum_amount: coupon.minimum_amount,
      maximum_discount: coupon.maximum_discount,
      usage_limit: coupon.usage_limit,
      user_limit: coupon.user_limit,
      applicable_to: coupon.applicable_to,
      applicable_ids: coupon.applicable_ids || [],
      start_date: coupon.start_date.split('T')[0],
      end_date: coupon.end_date.split('T')[0]
    });
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="w-4 h-4" />;
      case 'fixed': return <DollarSign className="w-4 h-4" />;
      case 'free_shipping': return <Truck className="w-4 h-4" />;
      case 'buy_x_get_y': return <Gift className="w-4 h-4" />;
      default: return <Percent className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="flex">
          <AdminSidebar />
          <div className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex">
        <AdminSidebar />
        <div className="flex-1 min-w-0 p-6">
          <Breadcrumb />
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-espresso">Coupons Management</h1>
              <button
                onClick={() => setShowForm(true)}
                className="bg-espresso text-white px-4 py-2 rounded-lg hover:bg-espresso/90 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Coupon
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Total Coupons</h3>
                <p className="text-2xl font-bold text-espresso">{stats.totalCoupons}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Active</h3>
                <p className="text-2xl font-bold text-green-600">{stats.activeCoupons}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Expired</h3>
                <p className="text-2xl font-bold text-red-600">{stats.expiredCoupons}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Total Usage</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsage}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Total Discount</h3>
                <p className="text-2xl font-bold text-purple-600">₹{stats.totalDiscountGiven}</p>
              </div>
            </div>

            {/* Coupon Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-lg w-full max-w-md h-fit max-h-[80vh]">
                  <h2 className="text-lg font-bold mb-3">
                    {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                  </h2>
                  <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Coupon Code</label>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                          className="w-full p-2 border rounded-lg text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Coupon Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full p-2 border rounded-lg text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full p-2 border rounded-lg text-sm"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Type</label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            className="w-full p-2 border rounded-lg text-sm"
                          >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                            <option value="free_shipping">Free Shipping</option>
                            <option value="buy_x_get_y">Buy X Get Y</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Value {formData.type === 'percentage' ? '(%)' : '(₹)'}
                          </label>
                          <input
                            type="number"
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                            className="w-full p-2 border rounded-lg text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Min Amount (₹)</label>
                          <input
                            type="number"
                            value={formData.minimum_amount}
                            onChange={(e) => setFormData({ ...formData, minimum_amount: parseFloat(e.target.value) })}
                            className="w-full p-2 border rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Max Discount (₹)</label>
                          <input
                            type="number"
                            value={formData.maximum_discount}
                            onChange={(e) => setFormData({ ...formData, maximum_discount: parseFloat(e.target.value) })}
                            className="w-full p-2 border rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Usage Limit</label>
                          <input
                            type="number"
                            value={formData.usage_limit}
                            onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) })}
                            className="w-full p-2 border rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">User Limit</label>
                          <input
                            type="number"
                            value={formData.user_limit}
                            onChange={(e) => setFormData({ ...formData, user_limit: parseInt(e.target.value) })}
                            className="w-full p-2 border rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Start Date</label>
                          <input
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            className="w-full p-2 border rounded-lg text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">End Date</label>
                          <input
                            type="date"
                            value={formData.end_date}
                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            className="w-full p-2 border rounded-lg text-sm"
                            required
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t mt-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="px-3 py-1.5 bg-espresso text-white rounded-lg hover:bg-espresso/90 text-sm"
                    >
                      {editingCoupon ? 'Update' : 'Create'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Coupons Table */}
            <div className="bg-white rounded-lg shadow-sm border ">
              <div className="overflow-x-auto">
                <table className=" min-w-[900px] w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Code</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Value</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Usage</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Valid Until</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {coupons.map((coupon) => {
                      const isExpired = new Date(coupon.end_date) < new Date();
                      const currentStatus = isExpired ? 'expired' : coupon.status;

                      return (
                        <tr key={coupon.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-sm font-medium">{coupon.code}</td>
                          <td className="px-4 py-3 text-sm">{coupon.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(coupon.type)}
                              <span className="capitalize">{coupon.type.replace('_', ' ')}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {coupon.used_count}/{coupon.usage_limit || '∞'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
                              {currentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(coupon.end_date).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit',
                            })}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(coupon)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(coupon.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {coupons.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No coupons found. Create your first coupon to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}