import { CartItem } from '@/store/slices/cart';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface OrderReviewSectionProps {
  cartItems: CartItem[];
  subtotal: number;
  gst: number;
  deliveryCharges: number;
  discount: number;
}

const OrderReviewSection = ({ cartItems, subtotal, gst, deliveryCharges, discount }: OrderReviewSectionProps) => {
  const total = subtotal + gst + deliveryCharges - discount;

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-semibold text-foreground">
        Order Review
      </h2>

      <div className="space-y-3">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 rounded-md bg-card p-3">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
              <AppImage
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
              {item.variant && <p className="caption text-muted-foreground">{item.variant}</p>}
              <p className="caption text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="data-text text-sm font-semibold text-foreground">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-border bg-card p-4">
        <h3 className="mb-3 font-medium text-foreground">Price Details</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
            <span className="data-text text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">GST (18%)</span>
            <span className="data-text text-foreground">₹{gst.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Delivery Charges</span>
            <span className="data-text text-foreground">₹{deliveryCharges.toLocaleString('en-IN')}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-success">Discount</span>
              <span className="data-text text-success">-₹{discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="border-t border-border pt-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Total Amount</span>
              <span className="data-text text-lg font-bold text-primary">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-success/10 p-4">
        <div className="flex items-start space-x-3">
          <Icon name="TruckIcon" size={20} className="flex-shrink-0 text-success" />
          <div>
            <p className="text-sm font-medium text-success">Estimated Delivery</p>
            <p className="caption mt-1 text-success/80">
              Your order will be delivered within 5-7 business days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReviewSection;



