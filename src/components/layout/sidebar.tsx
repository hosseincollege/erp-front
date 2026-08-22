/**
 * @file src/components/layout/sidebar.tsx
 * @project ERP Pro - Front-end
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  BarChart3,
  Boxes,
  BriefcaseBusiness,
  Calculator,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Ticket,
  UsersRound,
} from 'lucide-react';

type NavigationSubItem = {
  title: string;
  href: string;
};

type NavigationItem = {
  id: string;
  title: string;
  icon: React.ElementType;
  href: string;
  sub?: NavigationSubItem[];
};

const navigation: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'میزکار',
    icon: LayoutDashboard,
    href: '/',
    sub: [
      {
        title: 'خلاصه وضعیت',
        href: '/dashboard/overview',
      },
      {
        title: 'کارتابل',
        href: '/dashboard/notifications',
      },
    ],
  },
  {
    id: 'accounting',
    title: 'حسابداری',
    icon: Calculator,
    href: '/accounting',
    sub: [
      {
        title: 'دفتر کل',
        href: '/accounting/ledger',
      },
      {
        title: 'اسناد حسابداری',
        href: '/accounting/vouchers',
      },
      {
        title: 'ترازنامه',
        href: '/accounting/balance-sheet',
      },
    ],
  },
  {
    id: 'crm',
    title: 'مشتریان',
    icon: UsersRound,
    href: '/crm',
    sub: [
      {
        title: 'لیست مشتریان',
        href: '/crm/customers',
      },
      {
        title: 'فرصت‌های فروش',
        href: '/crm/opportunities',
      },
      {
        title: 'پیگیری‌ها',
        href: '/crm/follow-ups',
      },
    ],
  },
  {
    id: 'hr',
    title: 'منابع انسانی',
    icon: BriefcaseBusiness,
    href: '/hr',
    sub: [
      {
        title: 'پرونده پرسنلی',
        href: '/hr/employees',
      },
      {
        title: 'حضور و غیاب',
        href: '/hr/attendance',
      },
      {
        title: 'حقوق و دستمزد',
        href: '/hr/payroll',
      },
    ],
  },
  {
    id: 'inventory',
    title: 'انبار',
    icon: Package,
    href: '/inventory',
    sub: [
      {
        title: 'موجودی کالا',
        href: '/inventory/stock',
      },
      {
        title: 'حواله انبار',
        href: '/inventory/orders',
      },
      {
        title: 'انبارگردانی',
        href: '/inventory/audit',
      },
    ],
  },
  {
    id: 'purchases',
    title: 'خرید',
    icon: Boxes,
    href: '/purchases',
    sub: [
      {
        title: 'سفارش خرید',
        href: '/purchases/orders',
      },
      {
        title: 'تأمین‌کنندگان',
        href: '/purchases/suppliers',
      },
    ],
  },
  {
    id: 'sales',
    title: 'فروش',
    icon: ShoppingCart,
    href: '/sales',
    sub: [
      {
        title: 'پیش‌فاکتور',
        href: '/sales/quotes',
      },
      {
        title: 'فاکتورهای فروش',
        href: '/sales/invoices',
      },
      {
        title: 'گزارش فروش',
        href: '/sales/reports',
      },
    ],
  },
  {
    id: 'tickets',
    title: 'پشتیبانی',
    icon: Ticket,
    href: '/tickets',
    sub: [
      {
        title: 'همه تیکت‌ها',
        href: '/tickets',
      },
      {
        title: 'ثبت تیکت',
        href: '/tickets/new',
      },
      {
        title: 'دسته‌بندی‌ها',
        href: '/tickets/categories',
      },
    ],
  },
  {
    id: 'reports',
    title: 'گزارش‌ها',
    icon: BarChart3,
    href: '/reports',
    sub: [
      {
        title: 'گزارش مالی',
        href: '/reports/financial',
      },
      {
        title: 'گزارش عملیاتی',
        href: '/reports/operational',
      },
    ],
  },
  {
    id: 'settings',
    title: 'تنظیمات',
    icon: Settings,
    href: '/settings',
    sub: [
      {
        title: 'پیکربندی عمومی',
        href: '/settings/general',
      },
      {
        title: 'مدیریت کاربران',
        href: '/settings/users',
      },
      {
        title: 'سطوح دسترسی',
        href: '/settings/permissions',
      },
    ],
  },
];

interface SidebarProps {
  isMainCollapsed?: boolean;
  isLocked?: boolean;
  onCloseSidebar?: () => void;
}

export function Sidebar({
  isMainCollapsed = true,
  isLocked = false,
  onCloseSidebar,
}: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);

  const getActiveItemFromPath = () => {
    const matchedItem = navigation.find((item) => {
      if (item.href === '/') {
        return pathname === '/';
      }

      return (
        pathname === item.href ||
        pathname.startsWith(`${item.href}/`)
      );
    });

    return matchedItem || navigation[0];
  };

  const [activeTab, setActiveTab] = useState(
    getActiveItemFromPath().id
  );

  useEffect(() => {
    const currentItem = getActiveItemFromPath();
    setActiveTab(currentItem.id);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // اگر کلیک داخل سایدبار بود، کاری انجام نده
      if (
        sidebarRef.current &&
        sidebarRef.current.contains(target)
      ) {
        return;
      }

      // کلیک روی فلش یا قفل هدر نباید کلیک بیرون محسوب شود
      const sidebarControls =
        document.getElementById('sidebar-controls');

      if (
        sidebarControls &&
        sidebarControls.contains(target)
      ) {
        return;
      }

      // در حالت قفل، سایدبار بسته نشود
      if (!isMainCollapsed && !isLocked) {
        onCloseSidebar?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, [isMainCollapsed, isLocked, onCloseSidebar]);

  const activeGroup =
    navigation.find((item) => item.id === activeTab) ||
    navigation[0];

  return (
    <aside
      ref={sidebarRef}
      dir="rtl"
      className="
        sticky top-16 z-40
        flex h-[calc(100vh-4rem)]
        shrink-0 select-none
        transition-all duration-300
      "
    >
      {/* ستون اول: انتخاب ماژول */}
      <div
        className={`
          flex flex-col
          border-l border-[var(--border)]
          bg-[var(--surface)]
          py-3
          transition-all duration-300

          ${
            isMainCollapsed
              ? 'w-20 items-center px-2'
              : 'w-44 px-2.5'
          }
        `}
      >
        <div className="flex w-full flex-col gap-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                title={item.title}
                aria-label={item.title}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex w-full
                  items-center
                  rounded-xl
                  p-2.5
                  text-right text-sm
                  transition-all duration-200

                  ${
                    isSelected
                      ? `
                        bg-blue-600
                        font-medium
                        text-white
                        shadow-lg
                        shadow-blue-500/20
                      `
                      : `
                        text-[var(--foreground)]
                        hover:bg-slate-100/80
                        dark:hover:bg-slate-800/60
                      `
                  }

                  ${
                    isMainCollapsed
                      ? 'justify-center'
                      : 'justify-start gap-3'
                  }
                `}
              >
                <Icon size={20} className="shrink-0" />

                {!isMainCollapsed && (
                  <span className="truncate leading-none">
                    {item.title}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ستون دوم: زیرمنوها */}
      <div
        className="
          flex w-52 shrink-0
          flex-col
          border-l border-[var(--border)]
          bg-[var(--surface)]/95
          p-4
          shadow-sm
          backdrop-blur
        "
      >
        {/* عنوان ماژول فعال */}
        <div className="mb-4 border-b border-[var(--border)] pb-3">
          <Link
            href={activeGroup.href}
            title={activeGroup.title}
            className="
              flex items-center gap-2.5
              rounded-lg
              transition-opacity
              hover:opacity-80
            "
          >
            <div
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-lg
                bg-blue-600/10
                text-blue-600
                dark:bg-blue-500/10
                dark:text-blue-400
              "
            >
              {React.createElement(activeGroup.icon, {
                size: 19,
              })}
            </div>

            <span
              className="
                truncate
                text-sm font-bold
                text-[var(--foreground)]
              "
            >
              {activeGroup.title}
            </span>
          </Link>
        </div>

        {/* لینک‌های زیرمنو */}
        <div className="flex flex-col gap-1">
          {activeGroup.sub && activeGroup.sub.length > 0 ? (
            activeGroup.sub.map((subItem) => {
              const isActive =
                pathname === subItem.href ||
                pathname.startsWith(`${subItem.href}/`);

              return (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className={`
                    flex items-center gap-2.5
                    rounded-lg
                    px-3 py-2.5
                    text-sm
                    transition-colors

                    ${
                      isActive
                        ? `
                          bg-blue-600/10
                          font-semibold
                          text-blue-600
                          dark:bg-blue-600/20
                          dark:text-blue-400
                        `
                        : `
                          text-[var(--foreground)]
                          hover:bg-slate-200/60
                          dark:hover:bg-slate-800
                        `
                    }
                  `}
                >
                  <span
                    className={`
                      h-1.5 w-1.5
                      shrink-0 rounded-full

                      ${
                        isActive
                          ? 'bg-blue-600'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }
                    `}
                  />

                  <span className="truncate leading-none">
                    {subItem.title}
                  </span>
                </Link>
              );
            })
          ) : (
            <p
              className="
                px-3 py-2.5
                text-sm
                text-muted-foreground/70
              "
            >
              زیرمنویی برای این ماژول تعریف نشده است.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
