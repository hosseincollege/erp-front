/**
 * @file src/components/layout/sidebar.tsx
 * @project ERP Pro - Front-end
 * @description نوار ناوبری دو ستونه ERP Pro با هدایت خودکار ماژول‌ها و پنل‌های اختصاصی پروفایل و صفحه اصلی
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, logout, AuthUser } from '@/lib/auth-api';
import { getLocaleDirection, usePreferences } from '@/components/preferences-provider';

import {
  Activity,
  BarChart3,
  Bell,
  Boxes,
  BriefcaseBusiness,
  Calculator,
  CheckCircle2,
  ExternalLink,
  LogOut,
  Package,
  Radio,
  Settings,
  ShoppingCart,
  Ticket,
  User,
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

// لیست ۹ ماژول اصلی سیستم
const navigation: NavigationItem[] = [
  {
    id: 'accounting',
    title: 'حسابداری',
    icon: Calculator,
    href: '/accounting',
    sub: [
      { title: 'دفتر کل', href: '/accounting/ledger' },
      { title: 'اسناد حسابداری', href: '/accounting/vouchers' },
      { title: 'ترازنامه', href: '/accounting/balance-sheet' },
    ],
  },
  {
    id: 'crm',
    title: 'مشتریان',
    icon: UsersRound,
    href: '/crm',
    sub: [
      { title: 'لیست مشتریان', href: '/crm/customers' },
      { title: 'فرصت‌های فروش', href: '/crm/opportunities' },
      { title: 'پیگیری‌ها', href: '/crm/follow-ups' },
    ],
  },
  {
    id: 'hr',
    title: 'منابع انسانی',
    icon: BriefcaseBusiness,
    href: '/hr',
    sub: [
      { title: 'پرونده پرسنلی', href: '/hr/employees' },
      { title: 'حضور و غیاب', href: '/hr/attendance' },
      { title: 'حقوق و دستمزد', href: '/hr/payroll' },
    ],
  },
  {
    id: 'inventory',
    title: 'انبار',
    icon: Package,
    href: '/inventory',
    sub: [
      { title: 'موجودی کالا', href: '/inventory/stock' },
      { title: 'حواله انبار', href: '/inventory/orders' },
      { title: 'انبارگردانی', href: '/inventory/audit' },
    ],
  },
  {
    id: 'purchases',
    title: 'خرید',
    icon: Boxes,
    href: '/purchases',
    sub: [
      { title: 'سفارش خرید', href: '/purchases/orders' },
      { title: 'تأمین‌کنندگان', href: '/purchases/suppliers' },
    ],
  },
  {
    id: 'reports',
    title: 'گزارش‌ها',
    icon: BarChart3,
    href: '/reports',
    sub: [
      { title: 'گزارش مالی', href: '/reports/financial' },
      { title: 'گزارش عملیاتی', href: '/reports/operational' },
    ],
  },
  {
    id: 'sales',
    title: 'فروش',
    icon: ShoppingCart,
    href: '/sales',
    sub: [
      { title: 'پیش‌فاکتور', href: '/sales/quotes' },
      { title: 'فاکتورهای فروش', href: '/sales/invoices' },
      { title: 'گزارش فروش', href: '/sales/reports' },
    ],
  },
  {
    id: 'settings',
    title: 'تنظیمات',
    icon: Settings,
    href: '/settings',
    sub: [
      { title: 'عمومی', href: '/settings/general' },
      { title: 'اطلاعات شرکت', href: '/settings/company' },
      { title: 'ساختار سازمانی', href: '/settings/organization' },
      { title: 'نقش‌ها و دسترسی‌ها', href: '/settings/roles' },
      { title: 'حساب‌های کاربری', href: '/settings/accounts' },
      { title: 'مدیریت پروژه‌ها', href: '/settings/projects' },
    ],
  },
  {
    id: 'tickets',
    title: 'پشتیبانی',
    icon: Ticket,
    href: '/tickets',
    sub: [
      { title: 'همه تیکت‌ها', href: '/tickets' },
      { title: 'ثبت تیکت', href: '/tickets/new' },
      { title: 'دسته‌بندی‌ها', href: '/tickets/categories' },
    ],
  },
];

interface SidebarProps {
  isMainCollapsed?: boolean;
  isLocked?: boolean;
  isProfileActive?: boolean;
  navigateOnClick?: boolean;
  onCloseSidebar?: () => void;
  onSetProfileActive?: (active: boolean) => void;
}

export function Sidebar({
  isMainCollapsed = true,
  isLocked = false,
  isProfileActive = false,
  navigateOnClick = false,
  onCloseSidebar,
  onSetProfileActive,
}: SidebarProps) {
  const pathname = usePathname();
  const { locale } = usePreferences();
  const english = locale !== 'fa';
  const router = useRouter();
  const sidebarRef = useRef<HTMLElement>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const isProfileRoute = pathname === '/profile' || pathname.startsWith('/profile/');
  const isHomeRoute = pathname === '/' || pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  useEffect(() => {
    setUser(getCurrentUser());
    const handleAuth = () => setUser(getCurrentUser());
    window.addEventListener('auth:logout', handleAuth);
    window.addEventListener('storage', handleAuth);
    return () => {
      window.removeEventListener('auth:logout', handleAuth);
      window.removeEventListener('storage', handleAuth);
    };
  }, []);

  // یافتن ماژول مطابق با مسیر فعلی
  const getMatchedModuleId = () => {
    const matched = navigation.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    return matched?.id || null;
  };

  const [activeTab, setActiveTab] = useState<string | null>(getMatchedModuleId());

  // همگام‌سازی تب فعال هنگام تغییر مسیر (Navigation)
  useEffect(() => {
    if (isHomeRoute) {
      setActiveTab(null);
      onSetProfileActive?.(false);
    } else if (isProfileRoute) {
      setActiveTab(null);
      onSetProfileActive?.(true);
    } else {
      setActiveTab(getMatchedModuleId());
      onSetProfileActive?.(false);
    }
  }, [pathname, isHomeRoute, isProfileRoute, onSetProfileActive]);

  // رویداد Click-Outside جهت بستن و ریست سایدبار به پنل پیش‌فرض صفحه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (sidebarRef.current && sidebarRef.current.contains(target)) {
        return;
      }

      const sidebarControls = document.getElementById('sidebar-controls');
      const userProfileBtn = document.getElementById('user-profile-header-btn');
      const navigateToggleBtn = document.getElementById('navigate-on-click-toggle-btn');

      if (
        (sidebarControls && sidebarControls.contains(target)) ||
        (userProfileBtn && userProfileBtn.contains(target)) ||
        (navigateToggleBtn && navigateToggleBtn.contains(target))
      ) {
        return;
      }

      // ریست وضعیت موقت تب به حالت متناظر با صفحه جاری
      if (isHomeRoute) {
        setActiveTab(null);
        onSetProfileActive?.(false);
      } else if (isProfileRoute) {
        setActiveTab(null);
        onSetProfileActive?.(true);
      } else {
        setActiveTab(getMatchedModuleId());
        if (isProfileActive) {
          onSetProfileActive?.(false);
        }
      }

      // بستن ستون‌ها در صورت عدم قفل بودن
      if (!isMainCollapsed && !isLocked) {
        onCloseSidebar?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    isMainCollapsed,
    isLocked,
    isProfileActive,
    isProfileRoute,
    isHomeRoute,
    pathname,
    onCloseSidebar,
    onSetProfileActive,
  ]);

  // انتخاب ماژول: تغییر ستون دوم و هدایت اختیاری در صورت روشن بودن Navigation Mode
  const handleSelectModule = (item: NavigationItem) => {
    onSetProfileActive?.(false);
    setActiveTab(item.id);

    if (navigateOnClick && item.href) {
      router.push(item.href);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const englishLabels: Record<string, string> = {
    accounting: 'Accounting', crm: 'Customers', hr: 'Human Resources',
    inventory: 'Inventory', purchases: 'Purchases', reports: 'Reports',
    sales: 'Sales', settings: 'Settings', tickets: 'Support',
    '/accounting/ledger': 'General ledger', '/accounting/vouchers': 'Accounting entries',
    '/accounting/balance-sheet': 'Balance sheet', '/crm/customers': 'Customer list',
    '/crm/opportunities': 'Sales opportunities', '/crm/follow-ups': 'Follow-ups',
    '/hr/employees': 'Employee records', '/hr/attendance': 'Attendance',
    '/hr/payroll': 'Payroll', '/inventory/stock': 'Stock',
    '/inventory/orders': 'Stock issues', '/inventory/audit': 'Stock audit',
    '/purchases/orders': 'Purchase orders', '/purchases/suppliers': 'Suppliers',
    '/reports/financial': 'Financial reports', '/reports/operational': 'Operational reports',
    '/sales/quotes': 'Quotes', '/sales/invoices': 'Sales invoices',
    '/sales/reports': 'Sales reports', '/settings/general': 'General',
    '/settings/company': 'Company information', '/settings/organization': 'Organization structure',
    '/settings/roles': 'Roles and permissions', '/settings/accounts': 'User accounts',
    '/settings/projects': 'Project management', '/tickets': 'All tickets',
    '/tickets/new': 'Create ticket', '/tickets/categories': 'Categories',
  };
  const localizedNavigation = english
    ? navigation.map((item) => ({
        ...item,
        title: englishLabels[item.id] || item.title,
        sub: item.sub?.map((subItem) => ({
          ...subItem,
          title: englishLabels[subItem.href] || subItem.title,
        })),
      }))
    : navigation;
  const activeGroup = localizedNavigation.find((item) => item.id === activeTab);

  return (
    <aside
      ref={sidebarRef}
      dir={getLocaleDirection(locale)}
      className="
        sticky top-16 z-40
        flex h-[calc(100vh-4rem)]
        shrink-0 select-none
        transition-all duration-300
      "
    >
      {/* ستون اول: لیست آیکون‌های ماژول‌ها */}
      <div
        className={`
          flex flex-col
          border-l border-[var(--border)]
          bg-[var(--surface)]
          py-3
          transition-all duration-300
          ${isMainCollapsed ? 'w-14 items-center px-2' : 'w-38 px-1.5'}
        `}
      >
        <div className="flex w-full flex-col gap-1.5 overflow-y-auto no-scrollbar">
          {localizedNavigation.map((item) => {
            const Icon = item.icon;
            const isSelected = !isProfileActive && activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                title={item.title}
                aria-label={item.title}
                onClick={() => handleSelectModule(item)}
                className={`
                  flex w-full items-center rounded-xl p-2.5 text-right transition-all duration-200 cursor-pointer
                  ${
                    isSelected
                      ? 'bg-[var(--primary)] font-medium text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/20'
                      : 'text-[var(--foreground)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]'
                  }
                  ${english ? 'text-xs' : 'text-sm'}
                  ${isMainCollapsed ? 'justify-center' : 'justify-start gap-3'}
                `}
              >
                <Icon size={20} className="shrink-0" />
                {!isMainCollapsed && (
                  <span className="truncate leading-none">{item.title}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ستون دوم: اولویت رندر: پنل پروفایل | زیرمنوی ماژول فعال | پیشخوان خانه */}
      <div
        className="
          flex w-50 shrink-0 flex-col
          border-l border-[var(--border)]
          bg-[var(--surface)]/95
          p-4 shadow-sm backdrop-blur
        "
      >
        {isProfileActive || (isProfileRoute && !activeTab) ? (
          /* حالت اول: پنل پروفایل کاربر */
          <div className="flex flex-col gap-3">
            <Link
              href="/profile"
              onClick={() => onSetProfileActive?.(true)}
              className="flex items-center justify-between rounded-xl bg-[var(--primary)] px-3.5 py-2.5 text-xs font-semibold text-[var(--primary-foreground)] shadow-md shadow-[var(--primary)]/20 transition-colors hover:bg-[var(--primary-hover)]"
            >
              <span className="flex items-center gap-2">
                <User size={16} />
                {english ? 'View profile' : 'مشاهده پروفایل فردی'}
              </span>
              <ExternalLink size={14} />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 px-3.5 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              {english ? 'Sign out' : 'خروج از حساب کاربری'}
            </button>

            <div className="mt-1 flex flex-col items-center rounded-xl border border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/40 p-4 text-center">
              <div className="relative mb-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] font-bold text-[var(--primary-foreground)] shadow-md text-xl">
                  {user?.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <span
                  className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[var(--surface)] bg-emerald-500"
                  title={english ? 'Status: online' : 'وضعیت: آنلاین'}
                />
              </div>

              <p className="text-sm font-bold text-[var(--foreground)]">
                {user?.name || (english ? 'System user' : 'کاربر سیستم')}
              </p>
              <span className="mt-1 rounded-md bg-[var(--primary-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--primary)]">
                {user?.role || (english ? 'User' : 'کاربر')}
              </span>
              <p className="mt-1.5 text-xs text-muted-foreground truncate w-full">
                {user?.email || ''}
              </p>
            </div>
          </div>
        ) : activeGroup ? (
          /* حالت دوم: زیرمنوهای ماژول انتخاب شده */
          <>
            <div className="mb-4 border-b border-[var(--border)] pb-3">
              <Link
                href={activeGroup.href}
                title={activeGroup.title}
                className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                  {React.createElement(activeGroup.icon, { size: 19 })}
                </div>
                <span className={`truncate font-bold text-[var(--foreground)] ${english ? 'text-xs' : 'text-sm'}`}>
                  {activeGroup.title}
                </span>
              </Link>
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto">
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
                        flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors
                        ${
                          isActive
                            ? 'bg-[var(--primary-soft)] font-semibold text-[var(--primary)]'
                            : 'text-[var(--foreground)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]'
                        }
                        ${english ? 'text-xs' : 'text-sm'}
                      `}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          isActive
                            ? 'bg-[var(--primary)]'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      />
                      <span className="truncate leading-none">
                        {subItem.title}
                      </span>
                    </Link>
                  );
                })
              ) : (
                <p className="px-3 py-2.5 text-sm text-muted-foreground/70">
                  {english ? 'No submenu is available for this section.' : 'زیرمنویی برای این بخش تعریف نشده است.'}
                </p>
              )}
            </div>
          </>
        ) : isHomeRoute ? (
          /* حالت سوم: پنل اختصاصی صفحه اصلی / پیشخوان */
          <>
            <div className="mb-4 border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)] leading-none">
                    {english ? 'Dashboard and events' : 'پیشخوان و رویدادها'}
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {english ? 'System status and announcements' : 'وضعیت سیستم و اعلانات'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto">
              <a
                href="#announcements"
                className="flex items-center justify-between rounded-xl border border-[var(--border)]/50 bg-slate-50/50 p-2.5 text-xs transition-colors hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-2">
                  <Bell size={15} className="text-amber-500 shrink-0" />
                  <span className="font-medium text-[var(--foreground)]">
                    {english ? 'Announcement board' : 'تابلو اعلانات'}
                  </span>
                </div>
                <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  {english ? 'Announcements' : 'اعلانات'}
                </span>
              </a>

              <a
                href="#system-status"
                className="flex items-center justify-between rounded-xl border border-[var(--border)]/50 bg-slate-50/50 p-2.5 text-xs transition-colors hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-2">
                  <Radio size={15} className="text-emerald-500 shrink-0" />
                  <span className="font-medium text-[var(--foreground)]">
                    {english ? 'Service status' : 'وضعیت سرویس‌ها'}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {english ? 'Online' : 'برقرار'}
                </span>
              </a>

              <a
                href="#activity-summary"
                className="flex items-center justify-between rounded-xl border border-[var(--border)]/50 bg-slate-50/50 p-2.5 text-xs transition-colors hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="shrink-0 text-[var(--primary)]" />
                  <span className="font-medium text-[var(--foreground)]">
                    {english ? 'Activity summary' : 'خلاصه فعالیت‌ها'}
                  </span>
                </div>
              </a>
            </div>
          </>
        ) : null}
      </div>
    </aside>
  );
}
