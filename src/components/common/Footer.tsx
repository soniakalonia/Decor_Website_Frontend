'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useSubscribeMutation } from '@/store/api/subscriptionApi';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [subscribe, { isLoading }] = useSubscribeMutation();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscribe({ email }).unwrap();
      alert('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error: any) {
      alert(error?.data?.message || 'Subscription failed. Please try again.');
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="mx-auto w-full px-4 py-12 sm:px-6" data-aos="fade-up">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
          
          {/* Brand Section */}
          <div className="lg:col-span-2" data-aos="fade-right">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/assets/images/logo.png" alt="DecorVault" width={40} height={40} className="rounded-lg" />
              <span className="font-heading text-xl font-bold text-[#1A2A3A]">DecorVault</span>
            </div>
            <p className="text-sm text-[#6B7280] mb-4">
              Premium home decor, candles, clocks, photo frames, and curated gift items for every occasion.
            </p>
            <p className="text-sm font-medium text-[#FF6B8A] mb-6">
              ✦ Curated with love for your home ✦
            </p>
            
            <div>
              <h4 className="font-semibold text-[#1A2A3A] mb-3">Stay Inspired</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email" 
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md bg-[#F5F5F7] text-[#1A2A3A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#FF6B8A]" 
                  required 
                />
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="px-4 py-2 bg-[#FF6B8A] text-white text-sm font-medium rounded-md hover:scale-[0.97] transition-smooth disabled:opacity-50"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              <p className="text-xs text-[#6B7280] mt-2">No spam, unsubscribe anytime</p>
            </div>
          </div>

          {/* Mobile Accordion Sections */}
          <div className="lg:hidden">
            <button
              onClick={() => toggleSection('quickLinks')}
              className="flex w-full items-center justify-between py-2 font-semibold text-[#1A2A3A]"
            >
              Quick Links
              <Icon name={openSection === 'quickLinks' ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
            </button>
            {openSection === 'quickLinks' && (
              <ul className="mt-2 space-y-2 text-sm">
                <li><Link href="/" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Home</Link></li>
                <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Shop</Link></li>
                <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Categories</Link></li>
                <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">About Us</Link></li>
                <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Contact Us</Link></li>
                <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Bulk Orders</Link></li>
              </ul>
            )}
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => toggleSection('categories')}
              className="flex w-full items-center justify-between py-2 font-semibold text-[#1A2A3A]"
            >
              Categories
              <Icon name={openSection === 'categories' ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
            </button>
            {openSection === 'categories' && (
              <ul className="mt-2 space-y-2 text-sm">
                <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Candles</Link></li>
                <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Clocks</Link></li>
                <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Photo Frames</Link></li>
                <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Gift Items</Link></li>
                <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Home Decor</Link></li>
              </ul>
            )}
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => toggleSection('support')}
              className="flex w-full items-center justify-between py-2 font-semibold text-[#1A2A3A]"
            >
              Support
              <Icon name={openSection === 'support' ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
            </button>
            {openSection === 'support' && (
              <ul className="mt-2 space-y-2 text-sm">
                <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">FAQs</Link></li>
                <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Shipping & Delivery</Link></li>
                <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Return Policy</Link></li>
                <li><Link href="/order-tracking" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Order Tracking</Link></li>
                <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Privacy Policy</Link></li>
                <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Terms & Conditions</Link></li>
              </ul>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block" data-aos="fade-up">
            <h4 className="font-semibold text-[#1A2A3A] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Home</Link></li>
              <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Shop</Link></li>
              <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Categories</Link></li>
              <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">About Us</Link></li>
              <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Contact Us</Link></li>
              <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Bulk Orders</Link></li>
            </ul>
          </div>

          <div className="hidden lg:block" data-aos="fade-up">
            <h4 className="font-semibold text-[#1A2A3A] mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Candles</Link></li>
              <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Clocks</Link></li>
              <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Photo Frames</Link></li>
              <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Gift Items</Link></li>
              <li><Link href="/products" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Home Decor</Link></li>
            </ul>
          </div>

          <div className="hidden lg:block" data-aos="fade-up">
            <h4 className="font-semibold text-[#1A2A3A] mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">FAQs</Link></li>
              <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Shipping & Delivery</Link></li>
              <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Return Policy</Link></li>
              <li><Link href="/order-tracking" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Order Tracking</Link></li>
              <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Privacy Policy</Link></li>
              <li><Link href="#" className="text-[#6B7280] hover:text-[#FF6B8A] transition-smooth">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div data-aos="fade-left">
            <h4 className="font-semibold text-[#1A2A3A] mb-4">Contact & Follow</h4>
            <div className="space-y-2 text-sm text-[#6B7280] mb-4">
              <p className="flex items-center gap-2"><Icon name="PhoneIcon" size={16} />+91 98765 43210</p>
              <p className="flex items-center gap-2"><Icon name="EnvelopeIcon" size={16} />hello@decorvault.in</p>
              <p className="flex items-center gap-2"><Icon name="ClockIcon" size={16} />Mon-Sat: 10 AM - 7 PM</p>
            </div>
            <div className="flex space-x-2">
              <a href="#" className="p-2 bg-[#F5F5F7] rounded-md hover:bg-[#FF6B8A] hover:text-white transition-smooth"><Icon name="ShareIcon" size={16} /></a>
              <a href="#" className="p-2 bg-[#F5F5F7] rounded-md hover:bg-[#FF6B8A] hover:text-white transition-smooth"><Icon name="CameraIcon" size={16} /></a>
              <a href="#" className="p-2 bg-[#F5F5F7] rounded-md hover:bg-[#FF6B8A] hover:text-white transition-smooth"><Icon name="ChatBubbleLeftRightIcon" size={16} /></a>
              <a href="#" className="p-2 bg-[#F5F5F7] rounded-md hover:bg-[#FF6B8A] hover:text-white transition-smooth"><Icon name="BuildingOfficeIcon" size={16} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-[#F5F5F7]">
        <div className="mx-auto w-full px-4 py-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-[#6B7280]">© {new Date().getFullYear()} DecorVault. All Rights Reserved.</p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-[#6B7280]">We Accept:</span>
              <div className="flex items-center space-x-2">
                <div className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-[#1A2A3A]">VISA</div>
                <div className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-[#1A2A3A]">MC</div>
                <div className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-[#1A2A3A]">UPI</div>
                <div className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-[#1A2A3A]">Paytm</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;