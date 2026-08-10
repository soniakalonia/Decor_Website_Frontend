import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | VMR Solutions',
  description: 'Secure login and registration for VMR Solutions',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-soft-linen">{children}</div>;
}
