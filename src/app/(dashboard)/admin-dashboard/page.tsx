'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import AdminDashboardView from './components/AdminDashboardView';
import AdminSidebar from './components/AdminSidebar';
import MobileSidebar from './components/MobileSidebar';
import AuthGuard from '@/features/auth/components/AuthGuard';

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <AuthGuard requireAuth={true} requireVerification={false} allowedRoles={['admin']}>
      <div className="min-h-screen bg-background">
        <MobileSidebar />
        <main className="flex">
          <AdminSidebar />
          <div className="flex-1 min-h-screen">
            <div className="p-6 lg:p-8 lg:pl-8 pl-16">
              <Breadcrumb />
              <div className="mt-6">
                <AdminDashboardView />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
