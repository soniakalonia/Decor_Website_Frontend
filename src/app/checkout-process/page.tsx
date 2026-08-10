import type { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import CheckoutInteractive from './components/CheckoutInteractive';

export const metadata: Metadata = {
  title: 'Checkout - VMR Solution',
  description: 'Complete your purchase securely with multiple payment options including UPI, Net Banking, Cards, and Cash on Delivery. Fast delivery across India with order tracking.',
};

export default function CheckoutProcessPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="w-full px-2 py-6 sm:px-4">
        <Breadcrumb />
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Secure Checkout
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete your order in just a few simple steps
          </p>
        </div>
        <CheckoutInteractive />
      </div>
    </main>
  );
}



