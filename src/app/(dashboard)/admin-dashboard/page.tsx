// 'use client';

// import { useState, useEffect } from 'react';
// import Breadcrumb from '@/components/common/Breadcrumb';
// import AdminDashboardView from './components/AdminDashboardView';
// import AdminSidebar from './components/AdminSidebar';
// import MobileSidebar from './components/MobileSidebar';
// import AuthGuard from '@/features/auth/components/AuthGuard';

// export default function AdminDashboardPage() {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;
//   return (
//     <AuthGuard requireAuth={true} requireVerification={false} allowedRoles={['admin']}>
//       <div className="min-h-screen bg-background">
//         <MobileSidebar />
//         <main className="flex">
//           <AdminSidebar />
//           <div className="flex-1 min-h-screen">
//             <div className="p-6 lg:p-8 lg:pl-8 pl-16">
//               <Breadcrumb />
//               <div className="mt-6">
//                 <AdminDashboardView />
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </AuthGuard>
//   );
// }
'use client';

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
  BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import Icon from '@/components/ui/AppIcon';

// Sample data - replace with actual API data
const revenueData = [
  { name: 'Sep', revenue: 0 },
  { name: 'Oct', revenue: 0 },
  { name: 'Nov', revenue: 0 },
  { name: 'Dec', revenue: 0 },
  { name: 'Jan', revenue: 0 },
  { name: 'Feb', revenue: 0 },
  { name: 'Mar', revenue: 0 },
  { name: 'Apr', revenue: 0 },
  { name: 'May', revenue: 0 },
  { name: 'Jun', revenue: 0 },
  { name: 'Jul', revenue: 0 },
  { name: 'Aug', revenue: 25000 },
];

const salesData = [
  { name: 'Electronics', value: 400 },
  { name: 'Furniture', value: 300 },
  { name: 'Clothing', value: 300 },
  { name: 'Accessories', value: 200 },
];

const COLORS = ['#8B5E3C', '#D4AF37', '#E8B4B8', '#9CAF88'];

const trafficData = [
  { name: 'pending', value: 2 },
];

const orderData = [
  { name: 'Sep', orders: 0, refunds: 0 },
  { name: 'Oct', orders: 0, refunds: 0 },
  { name: 'Nov', orders: 0, refunds: 0 },
  { name: 'Dec', orders: 0, refunds: 0 },
  { name: 'Jan', orders: 0, refunds: 0 },
  { name: 'Feb', orders: 0, refunds: 0 },
  { name: 'Mar', orders: 0, refunds: 0 },
  { name: 'Apr', orders: 0, refunds: 0 },
  { name: 'May', orders: 0, refunds: 0 },
  { name: 'Jun', orders: 0, refunds: 0 },
  { name: 'Jul', orders: 0, refunds: 0 },
  { name: 'Aug', orders: 2, refunds: 0 },
];

const recentOrders = [
  { id: 'VMR-002', email: 'soniakalonia2002@gmail.com', amount: 25960, status: 'pending' },
  { id: 'VMR-001', email: 'soniakalonia2002@gmail.com', amount: 25960, status: 'pending' },
];

export default function AdminDashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const stats = [
    { label: 'Total Sales', value: '₹51,920', icon: 'CurrencyDollarIcon', color: 'green' },
    { label: 'Total Orders', value: '2', icon: 'ShoppingBagIcon', color: 'blue' },
    { label: 'New Customers', value: '1', icon: 'UsersIcon', color: 'purple' },
    { label: 'Pending Orders', value: '2', icon: 'ClockIcon', color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button - This is the ONLY sidebar-related thing here */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-elevation-2 border border-border"
      >
        <Icon name="Bars3Icon" size={20} className="text-espresso" />
      </button>

      {/* Mobile Sidebar - Separate from desktop sidebar */}
      {isMobileMenuOpen && (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border shadow-elevation-3 z-50 transform transition-transform duration-300 lg:hidden">
          <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Icon name="BuildingStorefrontIcon" size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-espresso font-heading">Admin Panel</h2>
                  <p className="text-xs text-mocha-grey font-medium">Decor Vault Management</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-soft-linen rounded-lg transition-colors"
              >
                <Icon name="XMarkIcon" size={20} className="text-mocha-grey" />
              </button>
            </div>
          </div>

          <div className="h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
            <nav className="p-4 space-y-8">
              {/* Overview */}
              <div className="space-y-3">
                <h3 className="px-3 text-[10px] font-bold text-mocha-grey/70 tracking-widest uppercase">OVERVIEW</h3>
                <div className="space-y-1">
                  <a href="/admin-dashboard" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative bg-primary text-primary-foreground shadow-elevation-2">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full"></div>
                    <div className="p-1.5 rounded-lg transition-colors bg-primary-foreground/20">
                      <Icon name="ChartBarIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Dashboard</span>
                  </a>
                  <a href="/admin-dashboard/analytics" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="ChartPieIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Analytics</span>
                  </a>
                </div>
              </div>

              {/* Customers */}
              <div className="space-y-3">
                <h3 className="px-3 text-[10px] font-bold text-mocha-grey/70 tracking-widest uppercase">CUSTOMERS</h3>
                <div className="space-y-1">
                  <a href="/admin-dashboard/users" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="UsersIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Users</span>
                  </a>
                  <a href="/admin-dashboard/inquiries" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="ChatBubbleLeftRightIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Inquiries</span>
                  </a>
                  <a href="/admin-dashboard/notifications" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="BellIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Notifications</span>
                  </a>
                </div>
              </div>

              {/* Products */}
              <div className="space-y-3">
                <h3 className="px-3 text-[10px] font-bold text-mocha-grey/70 tracking-widest uppercase">PRODUCTS</h3>
                <div className="space-y-1">
                  <a href="/admin-dashboard/addProduct" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="PlusCircleIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Add Product</span>
                  </a>
                  <a href="/admin-dashboard/products" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="ArchiveBoxIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Products</span>
                  </a>
                  <a href="/admin-dashboard/inventory" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="RectangleStackIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Inventory</span>
                  </a>
                  <a href="/admin-dashboard/categories" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="TableCellsIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Categories</span>
                  </a>
                  <a href="/admin-dashboard/brands" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="TagIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Brands</span>
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="px-3 text-[10px] font-bold text-mocha-grey/70 tracking-widest uppercase">CONTENT</h3>
                <div className="space-y-1">
                  <a href="/admin-dashboard/blog" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="DocumentTextIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Blog</span>
                  </a>
                  <a href="/admin-dashboard/content" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="NewspaperIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Content</span>
                  </a>
                </div>
              </div>

              {/* Orders & Sales */}
              <div className="space-y-3">
                <h3 className="px-3 text-[10px] font-bold text-mocha-grey/70 tracking-widest uppercase">ORDERS &amp; SALES</h3>
                <div className="space-y-1">
                  <a href="/admin-dashboard/orders" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="ShoppingBagIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Orders</span>
                  </a>
                  <a href="/admin-dashboard/revenue" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="CurrencyDollarIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Revenue</span>
                  </a>
                  <a href="/admin-dashboard/return" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="ArrowUturnLeftIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Return</span>
                  </a>
                  <a href="/admin-dashboard/coupons" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="TicketIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Coupons</span>
                  </a>
                  <a href="/admin-dashboard/subscription" className="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1">
                    <div className="p-1.5 rounded-lg transition-colors group-hover:bg-primary/10">
                      <Icon name="CreditCardIcon" size={16} />
                    </div>
                    <span className="text-sm font-medium">Subscribe</span>
                  </a>
                </div>
              </div>
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-white">
            <button className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-elevation-1 group">
              <div className="p-1.5 rounded-lg group-hover:bg-red-100 transition-colors">
                <Icon name="ArrowLeftOnRectangleIcon" size={16} />
              </div>
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-6 lg:p-8 lg:pl-8 pl-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center space-x-2 text-sm">
              <li className="flex items-center">
                <a href="/" className="text-muted-foreground transition-smooth hover:text-primary">Home</a>
              </li>
              <li className="flex items-center">
                <Icon name="ChevronRightIcon" size={16} className="mr-2 text-muted-foreground" />
                <span className="font-medium text-foreground" aria-current="page">Admin-dashboard</span>
              </li>
            </ol>
          </nav>

          <div className="mt-6">
            <div className="space-y-8">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-espresso font-heading">Admin Overview</h1>
                  <p className="text-mocha-grey mt-1">Welcome back, Sonia! Here's what's happening today.</p>
                </div>
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-elevation-2 hover:bg-secondary transition-all duration-200 flex items-center space-x-2 hover:shadow-elevation-3 transform hover:scale-105">
                  <Icon name="PlusIcon" size={20} />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-elevation-1 border border-border flex items-center space-x-4 hover:shadow-elevation-2 transition-all duration-200 hover:transform hover:scale-[1.02]">
                    <div className={`p-4 rounded-xl bg-${stat.color}-100 text-${stat.color}-600`}>
                      <Icon name={stat.icon as any} size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-mocha-grey font-medium">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-espresso font-heading">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders & Inventory */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white p-8 rounded-2xl shadow-elevation-1 border border-border hover:shadow-elevation-2 transition-all duration-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-espresso font-heading">Recent Orders</h3>
                    <button className="text-primary font-medium hover:underline text-sm hover:text-secondary transition-colors">View All</button>
                  </div>
                  <div className="overflow-x-auto sm:overflow-visible">
                    <div className="min-w-[430px] sm:min-w-0 space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-soft-linen rounded-xl hover:bg-opacity-80 transition-all">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-border shadow-sm">
                              <Icon name="ShoppingBagIcon" size={20} className="text-mocha-grey" />
                            </div>
                            <div>
                              <h4 className="font-bold text-espresso">Order #{order.id}</h4>
                              <p className="text-xs text-mocha-grey font-medium">{order.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-espresso">₹{order.amount.toLocaleString()}</p>
                            <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-elevation-1 border border-border hover:shadow-elevation-2 transition-all duration-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-espresso font-heading">Inventory Status</h3>
                    <button className="text-primary font-medium hover:underline text-sm hover:text-secondary transition-colors">Manage</button>
                  </div>
                  <div className="space-y-6">
                    <div className="p-4 text-sm text-mocha-grey bg-soft-linen rounded-xl">No low stock products</div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="space-y-6 mt-4">
                <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Revenue Chart */}
                  <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-espresso mb-4">Revenue Trend (Line)</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                          <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => value === 0 ? '0' : value >= 1000 ? `${value/1000}K` : value} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="revenue" stroke="#8B5E3C" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Sales by Category */}
                  <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-espresso mb-4">Sales by Category (Pie)</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={salesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {salesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Traffic Sources */}
                  <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-espresso mb-4">Traffic Sources (Area)</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" stroke="#A3B18A" fill="#A3B18A" fillOpacity={0.35} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Orders vs Refunds */}
                  <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-espresso mb-4">Orders vs Refunds (Bar)</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={orderData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="orders" fill="#6A8CAF" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="refunds" fill="#E6B980" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}