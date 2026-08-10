import type { Metadata } from 'next';
import OrderTrackingInteractive from './components/OrderTrackingInteractive';

export const metadata: Metadata = {
  title: 'Order Tracking - DecorVault',
  description: 'Track your DecorVault orders in real-time. Enter your order ID to check delivery status.',
};

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <OrderTrackingInteractive />
      </div>
    </div>
  );
}