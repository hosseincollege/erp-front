/**
 * @file src/components/layout/sidebar.tsx
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingCart, Ticket, Package, 
  Users, BarChart3, Settings, Pin, PinOff 
} from 'lucide-react';

const navigation = [
  { id: 'dash', title: 'میز کار مرکزی', icon: LayoutDashboard, href: '/' },
  { 
    id: 'sales', 
    title: 'بخش فروش', 
    icon: ShoppingCart, 
    sub: [
      { title: 'سفارشات جدید', href: '/sales/orders' },
      { title: 'فاکتورها', href: '/sales/invoices' },
      { title: 'گزارش فروش', href: '/sales/report' },
    ]
  },
  { 
    id: 'inventory', 
    title: 'مدیریت کالا', 
    icon: Package, 
    sub: [
      { title: 'لیست محصولات', href: '/inventory/list' },
      { title: 'موجودی انبار', href: '/inventory/stock' },
    ]
  },
  { 
    id: 'tickets', 
    title: 'تیکت‌های پشتیبانی', 
    icon: Ticket, 
    sub: [
      { title: 'همه تیکت‌ها', href: '/tickets' },
      { title: 'تیکت‌های باز', href: '/tickets/open' },
      { title: 'بایگانی', href: '/tickets/archive' },
    ]
  },
  { 
    id: 'users', 
    title: 'مشتریان و کاربران', 
    icon: Users, 
    sub: [
      { title: 'لیست کاربران', href: '/users/list' },
      { title: 'سطوح دسترسی', href: '/users/permissions' },
    ]
  },
  { 
    id: 'reports', 
    title: 'گزارشات آماری', 
    icon: BarChart3, 
    sub: [
      { title: 'نمودار رشد', href: '/reports/growth' },
      { title: 'تراز مالی', href: '/reports/balance' },
    ]
  },
  { 
    id: 'settings', 
    title: 'تنظیمات سیستم', 
    icon: Settings, 
    href: '/settings' 
  },
];

export function Sidebar({ isMainCollapsed }: { isMainCollapsed: boolean }) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const subMenuRef = useRef<HTMLDivElement>(null);

  // بستن منوی دوم با کلیک خارج (در صورت عدم پین)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isPinned && subMenuRef.current && !subMenuRef.current.contains(e.target as Node)) {
        setActiveTab(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPinned]);

  const activeGroup = navigation.find((item) => item.id === activeTab);

  return (
    <aside className="flex sticky top-16 h-[calc(100vh-4rem)] z-40 select-none shrink-0">
      {/* ستون اول: جمع‌شونده */}
      <div 
        className={`bg-slate-900 border-l border-slate-800/80 flex flex-col py-4 gap-1.5 transition-all duration-300 ${
          isMainCollapsed ? 'w-20 items-center px-2' : 'w-60 px-3'
        }`}
      >
        {navigation.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id || (!activeTab && item.href && pathname === item.href);

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.sub) {
                  setActiveTab(activeTab === item.id ? null : item.id);
                } else if (item.href) {
                  setActiveTab(null);
                }
              }}
              title={isMainCollapsed ? item.title : undefined}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-right ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-medium'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              } ${isMainCollapsed ? 'justify-center' : ''}`}
            >
              <Icon size={22} className="shrink-0" />
              {!isMainCollapsed && (
                <span className="text-sm truncate leading-none">{item.title}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ستون دوم: زیرمنوها */}
      {activeGroup?.sub && (
        <div 
          ref={subMenuRef}
          className={`bg-slate-900/95 backdrop-blur border-l border-slate-800 shadow-2xl transition-all duration-300 overflow-hidden ${
            activeTab ? 'w-56' : 'w-0'
          }`}
        >
          <div className="p-4 w-56">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="font-bold text-sm text-slate-200">{activeGroup.title}</span>
              <button 
                onClick={() => setIsPinned(!isPinned)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isPinned ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-800'
                }`}
                title={isPinned ? 'عدم پین' : 'پین ماندن'}
              >
                {isPinned ? <Pin size={14} /> : <PinOff size={14} />}
              </button>
            </div>

            <div className="space-y-1">
              {activeGroup.sub.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs transition-colors ${
                    pathname === sub.href
                      ? 'bg-blue-600/15 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${pathname === sub.href ? 'bg-blue-500' : 'bg-slate-700'}`} />
                  {sub.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
