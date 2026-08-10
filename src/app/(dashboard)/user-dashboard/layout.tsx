'use client';

import UserSidebar from './components/UserSidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import AuthGuard from '@/features/auth/components/AuthGuard';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard
      requireAuth={true}
      requireVerification={false}
      allowedRoles={['user', 'admin']}
    >
      <div className="min-h-screen bg-background">
        <main className="flex">
          <UserSidebar />
          <div className="flex-1 min-h-screen">
            <div className="p-6 lg:p-8">
              <Breadcrumb />
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
