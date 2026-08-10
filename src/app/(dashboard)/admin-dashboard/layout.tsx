import AuthGuard from '@/features/auth/components/AuthGuard';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true} requireVerification={false} allowedRoles={['admin']}>
      {children}
    </AuthGuard>
  );
}
