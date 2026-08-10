'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetAllOrdersQuery, useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '@/store/api/ordersApi';
import { config } from '@/config/env';
import Breadcrumb from '@/components/common/Breadcrumb';
import AppImage from '@/components/ui/AppImage';
import AdminSidebar from '../components/AdminSidebar';
import { X, Eye, Search } from 'lucide-react';

export default function OrdersPage() {
  const { data, isLoading } = useGetAllOrdersQuery(undefined);
  const [updateStatus] = useUpdateOrderStatusMutation();
  const orders = data?.orders || [];
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: orderData } = useGetOrderByIdQuery(selectedOrderId!, { skip: !selectedOrderId });
  const selectedOrder = orderData?.order;

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = order.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const parseStringList = (value: unknown): string[] => {
    const extracted: string[] = [];

    const collectUrls = (input: unknown) => {
      if (!input) return;
      if (Array.isArray(input)) {
        input.forEach((entry) => collectUrls(entry));
        return;
      }
      if (typeof input === 'object') {
        const maybeUrl = (input as Record<string, unknown>).url
          ?? (input as Record<string, unknown>).image
          ?? (input as Record<string, unknown>).src
          ?? (input as Record<string, unknown>).path;
        if (typeof maybeUrl === 'string' && maybeUrl.trim()) {
          extracted.push(maybeUrl.trim());
        }
        return;
      }
      if (typeof input === 'string') {
        const trimmed = input.trim();
        if (!trimmed) return;
        extracted.push(trimmed);
      }
    };

    const parseDeep = (input: unknown): unknown => {
      let current = input;
      for (let i = 0; i < 3; i += 1) {
        if (typeof current !== 'string') break;
        const trimmed = current.trim();
        if (!trimmed) break;
        const isJsonLike =
          (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
          (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
          (trimmed.startsWith('"') && trimmed.endsWith('"'));
        if (!isJsonLike) break;
        try {
          current = JSON.parse(trimmed);
        } catch {
          break;
        }
      }
      return current;
    };

    const parsed = parseDeep(value);
    collectUrls(parsed);

    if (extracted.length === 0 && typeof value === 'string' && value.includes(',')) {
      value.split(',').map((v) => v.trim()).filter(Boolean).forEach((v) => extracted.push(v));
    }

    return [...new Set(extracted)];
  };

  const toPublicImageUrl = (rawUrl: string): string => {
    if (!rawUrl) return '';
    let value = rawUrl.trim().replace(/^['"]|['"]$/g, '').replace(/\\/g, '/');
    if (!value) return '';
    if (value.startsWith('/http://') || value.startsWith('/https://')) {
      value = value.slice(1);
    }
    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('data:')
    ) {
      return value;
    }
    if (value.startsWith('//')) {
      return `https:${value}`;
    }
    const baseUrl = config.apiUrl.replace(/\/api\/?$/, '');
    return value.startsWith('/') ? `${baseUrl}${value}` : `${baseUrl}/${value}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="flex flex-col sm:flex-row">
        <AdminSidebar />
        <div className="flex-1 min-w-0 p-6">
          <Breadcrumb />
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-espresso">Orders</h1>

            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border ">
              {isLoading ? (
                <div className="p-8 text-center">Loading orders...</div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-mocha-grey">No orders found</div>
              ) : (
                <div className='overflow-x-auto '>
                  <table className=" min-w-[900px] md:min-w-full w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredOrders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">VMR-{String(order.id).padStart(3, '0')}</td>
                          <td className="px-6 py-4 text-sm">
                            <div>{order.full_name}</div>
                            <div className="text-gray-500 text-xs">{order.email}</div>
                            {order.mobile && <div className="text-gray-500 text-xs">{order.mobile}</div>}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {order.product_names ? (
                              <div className="max-w-xs">
                                {order.product_names.split(',').slice(0, 2).map((name: string, i: number) => {
                                  const slug = order.product_slugs?.split(',')[i]?.trim();
                                  const productName = name.trim();
                                  if (!slug) {
                                    return <div key={i} className="text-xs truncate">{productName}</div>;
                                  }
                                  return (
                                    <Link
                                      key={i}
                                      href={`/product/${slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs truncate text-espresso hover:underline block"
                                    >
                                      {productName}
                                    </Link>
                                  );
                                })}
                                {order.product_names.split(',').length > 2 && (
                                  <div className="text-xs text-gray-500">+{order.product_names.split(',').length - 2} more</div>
                                )}
                              </div>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 text-sm">{order.item_count}</td>
                          <td className="px-6 py-4 text-sm font-medium">₹{Number(order.total).toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 text-sm capitalize">{order.payment_method}</td>
                          <td className="px-6 py-4 text-sm">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => setSelectedOrderId(order.id)}
                              className="text-espresso hover:text-espresso/80"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedOrderId && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-espresso">Order VMR-{String(selectedOrder.id).padStart(3, '0')}</h2>
              <button onClick={() => setSelectedOrderId(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Customer Details</h3>
                  <p className="text-sm">{selectedOrder.full_name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.email}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.mobile}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Order Info</h3>
                  <p className="text-sm">Status: <span className="capitalize font-medium">{selectedOrder.status}</span></p>
                  <p className="text-sm">Payment: <span className="capitalize">{selectedOrder.payment_method}</span></p>
                  <p className="text-sm">Date: {new Date(selectedOrder.created_at).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
                {(() => {
                  const addr = typeof selectedOrder.address === 'string' ? JSON.parse(selectedOrder.address) : selectedOrder.address;
                  return (
                    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      <p>{addr.name}</p>
                      <p>{addr.phone}</p>
                      <p>{addr.addressLine1}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  );
                })()}
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Order Items</h3>
                {!selectedOrder.items || selectedOrder.items.length === 0 ? (
                  <p className="text-sm text-gray-500">No items found</p>
                ) : (
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item: any) => {
                      const images = parseStringList(item.product_images);
                      const imageUrl = images[0] ? toPublicImageUrl(images[0]) : '';
                      const productSlug = item.slug || item.product_id;
                      return (
                        <a
                          key={item.id}
                          href={`/product/${productSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex gap-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition cursor-pointer block"
                        >
                          {imageUrl ? (
                            <AppImage
                              src={imageUrl}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded"
                              fallbackSrc="/assets/images/no_image.svg"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-xs">No image</div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-espresso hover:underline">{item.name || 'Product name unavailable'}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-sm font-medium">₹{Number(item.price).toLocaleString('en-IN')} each</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{Number(selectedOrder.subtotal).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST:</span>
                    <span>₹{Number(selectedOrder.gst).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges:</span>
                    <span>₹{Number(selectedOrder.delivery_charges).toLocaleString('en-IN')}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{Number(selectedOrder.discount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{Number(selectedOrder.total).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
