'use client';

import { useSearchParams } from 'next/navigation';
import { useGetOrderByIdQuery, useGetUserOrdersQuery } from '@/store/api/orderApi';
import TrackingTimeline from './TrackingTimeline';
import OrderDetails from './OrderDetails';
import DeliveryInfo from './DeliveryInfo';
import OrderActions from './OrderActions';
import RelatedOrders from './RelatedOrders';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const OrderTrackingInteractive = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { data, isLoading, error } = useGetOrderByIdQuery(orderId || '', { skip: !orderId });
  const { data: ordersData, isLoading: ordersLoading } = useGetUserOrdersQuery();

  if (!orderId) {
    if (ordersLoading) {
      return (
        <div className="rounded-md bg-card p-8">
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted mb-4" />
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-md bg-muted" />
            <div className="h-20 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      );
    }

    const recentOrders = ordersData?.orders || [];

    if (recentOrders.length === 0) {
      return (
        <div className="rounded-md bg-card p-8 text-center">
          <Icon name="ShoppingBagIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No orders found</p>
          <p className="text-muted-foreground mb-6">You haven't placed any orders yet</p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98]"
          >
            <span>Start Shopping</span>
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>
      );
    }

    return (
      <div className="rounded-md bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Select an order to track</h2>
        <div className="space-y-3">
          {recentOrders.map((order: any) => (
            <Link
              key={order.id}
              href={`/order-tracking?orderId=${order.id}`}
              className="block rounded-md border border-border p-4 transition-smooth hover:bg-muted"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-foreground">
                      ORD-{String(order.id).padStart(3, '0')}
                    </p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-success/10 text-success' :
                      order.status === 'pending' ? 'bg-warning/10 text-warning' :
                      'bg-accent/10 text-accent'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-GB')} • {order.item_count || 1} items
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-base font-semibold text-primary">
                    ₹{order.total.toLocaleString('en-IN')}
                  </p>
                  <Icon name="ChevronRightIcon" size={20} className="mt-1 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-md bg-muted" />
        <div className="h-48 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="rounded-md bg-card p-8 text-center">
        <p className="text-error">Order not found or you don't have access to this order</p>
      </div>
    );
  }

  const order = data.order;
  let address: any = {};
  try {
    address = typeof order.address === 'string' ? JSON.parse(order.address) : order.address;
  } catch (e) {
    console.error('Failed to parse address:', e);
    address = {};
  }
  
  const getTrackingStages = (status: string) => {
    const stages = [
      { id: '1', status: 'Order Confirmed', description: 'Your order has been confirmed', isCompleted: true, isCurrent: false },
      { id: '2', status: 'Order Packed', description: 'Your items have been packed', isCompleted: status !== 'pending', isCurrent: status === 'confirmed' },
      { id: '3', status: 'Shipped', description: 'Your order has been shipped', isCompleted: ['shipped', 'delivered'].includes(status), isCurrent: status === 'shipped' },
      { id: '4', status: 'Delivered', description: 'Your order has been delivered', isCompleted: status === 'delivered', isCurrent: status === 'delivered' },
    ];
    return stages.map(s => ({ ...s, timestamp: order.formatted_updated_at || order.formatted_created_at || new Date(order.created_at).toLocaleString('en-IN'), location: 'India' }));
  };

  const orderItems = order.items?.map((item: any) => {
    let images = []
    try {
      images = typeof item.product_images === 'string' ? JSON.parse(item.product_images) : item.product_images
    } catch (e) {
      images = []
    }
    return {
      id: item.id.toString(),
      name: item.name,
      image: Array.isArray(images) ? images[0] || '' : '',
      alt: item.name,
      quantity: item.quantity,
      variant: '',
      price: item.price,
    }
  }) || [];

  const relatedOrders = (ordersData?.orders || [])
    .filter((o: any) => o.id.toString() !== orderId)
    .slice(0, 3)
    .map((o: any) => ({
      id: o.id.toString(),
      orderId: `ORD-${String(o.id).padStart(3, '0')}`,
      date: new Date(o.created_at).toLocaleDateString('en-GB'),
      status: o.status === 'delivered' ? 'Delivered' : o.status === 'pending' ? 'Processing' : 'In Transit',
      total: o.total,
      itemCount: o.item_count || 1,
    }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrackingTimeline orderId={`ORD${orderId}`} stages={getTrackingStages(order.status)} />
        </div>
        <div className="space-y-6">
          <DeliveryInfo
            deliveryPartner="Standard Delivery"
            partnerContact="+91 98765 43210"
            expectedDelivery="5-7 business days"
            deliveryAddress={`${address.addressLine1 || ''}, ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}`}
            customerName={order.full_name}
            customerEmail={order.email}
            customerPhone={order.mobile}
          />
          <OrderActions
            orderId={`ORD${orderId}`}
            canCancel={order.status === 'pending'}
            canReturn={order.status === 'delivered'}
            invoiceUrl={`/invoices/${orderId}.pdf`}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrderDetails
            items={orderItems}
            subtotal={order.subtotal}
            gst={order.gst}
            deliveryCharges={order.delivery_charges}
            total={order.total}
          />
        </div>
        <div>
          <RelatedOrders orders={relatedOrders} />
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingInteractive;



