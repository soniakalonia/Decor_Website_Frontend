'use client';

import { useGetUserOrdersQuery } from '@/store/api/orderApi';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function OrdersPage() {
  const { data: ordersData, isLoading } = useGetUserOrdersQuery();
  const orders = ordersData?.orders || [];

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading mb-4">My Orders</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading mb-4">My Orders</h1>
        <div className="bg-card p-12 rounded-lg shadow-elevation-1 border border-border text-center">
          <Icon name="ShoppingBagIcon" size={64} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No orders yet</p>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98]"
          >
            <span>Browse Products</span>
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground font-heading">My Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} orders</p>
      </div>
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-elevation-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Products</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Items</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-muted/50 transition-smooth">
                  <td className="px-4 py-4">
                    <p className="font-medium text-foreground">ORD-{String(order.id).padStart(3, '0')}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-foreground">{new Date(order.created_at).toLocaleDateString('en-GB')}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-foreground line-clamp-2">{order.product_names || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-foreground">{order.item_count || 1}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-primary">₹{order.total}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-success/10 text-success' :
                      order.status === 'pending' ? 'bg-warning/10 text-warning' :
                      'bg-accent/10 text-accent'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center">
                      <Link
                        href={`/order-tracking?orderId=${order.id}`}
                        className="flex items-center space-x-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98]"
                      >
                        <Icon name="TruckIcon" size={16} />
                        <span>Track</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
