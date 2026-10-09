/**
 * @file src/components/layout/sidebar.tsx
 * @project ERP Pro - Front-end
 * @description نوار ناوبری دو ستونه ERP Pro با هدایت خودکار ماژول‌ها و پنل‌های اختصاصی پروفایل و صفحه اصلی
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, logout, AuthUser } from '@/lib/api/shared/auth-api';
import { getLocaleDirection, usePreferences } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';
import type { UiMessage } from '@/lib/languages/types';
import { projectsApi, type SupportProjectItem } from '@/lib/api/shared/projects-api';
import { humanResourcesApi } from '@/lib/api/hr/human-resources-api';
import type { HrAccess } from '@/types/human-resources';
import { accountingApi } from '@/lib/api/accounting/accounting-api';
import type { AccountingAccess } from '@/types/accounting';

import {
  Activity,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Calculator,
  CheckCircle2,
  ExternalLink,
  LogOut,
  Package,
  Radio,
  Settings,
  Ticket,
  User,
  UsersRound,
} from 'lucide-react';

type NavigationSubItem = {
  titleKey?: UiMessage;
  title?: string;
  href: string;
};

type NavigationItem = {
  id: string;
  titleKey: UiMessage;
  icon: React.ElementType;
  href: string;
  sub?: NavigationSubItem[];
};

// فهرست ماژول‌های اصلی سیستم
const navigation: NavigationItem[] = [
  {
    id: 'accounting',
    titleKey: 'sidebarAccounting',
    icon: Calculator,
    href: '/accounting',
    sub: [
      { titleKey: 'accountingChartOfAccounts', href: '/accounting/accounts' },
      { titleKey: 'accountingEntriesLedger', href: '/accounting/vouchers' },
      { titleKey: 'accountingInvoices', href: '/accounting/invoices' },
      { titleKey: 'accountingReceiptsPayments', href: '/accounting/payments' },
      { titleKey: 'sidebarFinancialReports', href: '/accounting/reports' },
    ],
  },
  {
    id: 'commerce',
    titleKey: 'sidebarCommercial',
    icon: UsersRound,
    href: '/commerce',
    sub: [
      { titleKey: 'sidebarCustomers', href: '/commerce/customers' },
      { titleKey: 'sidebarSales', href: '/commerce/sales' },
    ],
  },
  {
    id: 'human-resources',
    titleKey: 'sidebarHumanResources',
    icon: BriefcaseBusiness,
    href: '/human-resources',
    sub: [
      { titleKey: 'sidebarEmployeeRecords', href: '/human-resources/employees' },
      { titleKey: 'sidebarAttendance', href: '/human-resources/attendance' },
      { titleKey: 'sidebarLeaveRequests', href: '/human-resources/leaves' },
      { titleKey: 'sidebarPayroll', href: '/human-resources/payroll' },
    ],
  },
  {
    id: 'supply-chain',
    titleKey: 'sidebarSupplyChain',
    icon: Package,
    href: '/supply',
    sub: [
      { titleKey: 'sidebarInventory', href: '/supply/inventory' },
      { titleKey: 'sidebarPurchases', href: '/supply/purchasing' },
    ],
  },
  {
    id: 'reports',
    titleKey: 'sidebarReports',
    icon: BarChart3,
    href: '/reports',
    sub: [
      { titleKey: 'sidebarFinancialReports', href: '/reports/financial' },
      { titleKey: 'sidebarSalesReports', href: '/reports/sales' },
      { titleKey: 'sidebarHrReports', href: '/reports/hr' },
      { titleKey: 'sidebarInventoryReports', href: '/reports/inventory' },
    ],
  },
  {
    id: 'settings',
    titleKey: 'sidebarSettings',
    icon: Settings,
    href: '/settings',
    sub: [
      { titleKey: 'sidebarGeneral', href: '/settings/general' },
      { titleKey: 'sidebarAnnouncementManagement', href: '/settings/announcements' },
      { titleKey: 'sidebarCompanyInformation', href: '/settings/company' },
      { titleKey: 'sidebarOrganizationStructure', href: '/settings/organization' },
      { titleKey: 'sidebarRolesPermissions', href: '/settings/roles' },
      { titleKey: 'sidebarUserAccounts', href: '/settings/accounts' },
      { titleKey: 'sidebarProjectManagement', href: '/settings/projects' },
      { titleKey: 'sidebarDatabase', href: '/settings/database' },
    ],
  },
  {
    id: 'support',
    titleKey: 'sidebarSupport',
    icon: Ticket,
    href: '/support',
    sub: [],
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
  const message = (key: UiMessage) => uiMessage(locale, key);
  const router = useRouter();
  const sidebarRef = useRef<HTMLElement>(null);
  const supportProjectsRequest = useRef(0);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [supportProjects, setSupportProjects] = useState<SupportProjectItem[]>([]);
  const [hrAccess, setHrAccess] = useState<HrAccess | null>(null);
  const [accountingAccess, setAccountingAccess] = useState<AccountingAccess | null>(null);

  const isProfileRoute = pathname === '/profile' || pathname.startsWith('/profile/');
  const isHomeRoute = pathname === '/' || pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  useEffect(() => {
    const refreshUser = () => {
      const requestId = ++supportProjectsRequest.current;
      const currentUser = getCurrentUser();
      setUser(currentUser);
      if (!currentUser) {
        setSupportProjects([]);
        setHrAccess(null);
        setAccountingAccess(null);
        return;
      }
      projectsApi.getSupportProjects()
        .then((items) => { if (requestId === supportProjectsRequest.current) setSupportProjects(items); })
        .catch(() => { if (requestId === supportProjectsRequest.current) setSupportProjects([]); });
      humanResourcesApi.getAccess()
        .then((access) => { if (requestId === supportProjectsRequest.current) setHrAccess(access); })
        .catch(() => { if (requestId === supportProjectsRequest.current) setHrAccess(null); });
      accountingApi.getAccess()
        .then((access) => { if (requestId === supportProjectsRequest.current) setAccountingAccess(access); })
        .catch(() => { if (requestId === supportProjectsRequest.current) setAccountingAccess(null); });
    };
    refreshUser();
    window.addEventListener('auth:logout', refreshUser);
    window.addEventListener('auth:login', refreshUser);
    window.addEventListener('storage', refreshUser);
    return () => {
      window.removeEventListener('auth:logout', refreshUser);
      window.removeEventListener('auth:login', refreshUser);
      window.removeEventListener('storage', refreshUser);
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

  const localizedNavigation = navigation
    .filter((item) => item.id !== 'accounting' || Boolean(accountingAccess?.canView))
    .filter((item) => item.id !== 'human-resources' || Boolean(hrAccess?.canViewEmployees || hrAccess?.canViewLeaves || hrAccess?.canViewAttendance || hrAccess?.canViewPayroll || hrAccess?.canRequestLeave || hrAccess?.employeeId))
    .map((item) => ({
    ...item,
    title: message(item.titleKey),
    sub: item.id === 'support'
      ? supportProjects.map((project) => ({ title: project.name, href: `/support/projects/${encodeURIComponent(project.id)}` }))
      : item.id === 'human-resources'
        ? item.sub?.filter((subItem) => subItem.href === '/human-resources/employees'
          ? Boolean(hrAccess?.canViewEmployees || hrAccess?.employeeId)
          : subItem.href === '/human-resources/leaves'
            ? Boolean(hrAccess?.canViewLeaves || hrAccess?.canRequestLeave)
            : subItem.href === '/human-resources/attendance'
              ? Boolean(hrAccess?.canViewAttendance || hrAccess?.employeeId)
              : Boolean(hrAccess?.canViewPayroll || hrAccess?.employeeId))
          .map((subItem) => ({ ...subItem, title: subItem.titleKey ? message(subItem.titleKey) : subItem.title }))
        : item.sub?.map((subItem) => ({ ...subItem, title: subItem.titleKey ? message(subItem.titleKey) : subItem.title })),
  }));
  const activeGroup = localizedNavigation.find((item) => item.id === activeTab);
  const isGroupHome = Boolean(activeGroup && pathname === activeGroup.href);
  const activeSubItemPath = activeGroup?.sub
    ?.map((subItem) => subItem.href.split('?')[0])
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((left, right) => right.length - left.length)[0];

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
          border-e border-[var(--border)]
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
                  flex w-full items-center rounded-xl p-2.5 text-start transition-all duration-200 cursor-pointer
                  ${
                    isSelected
                      ? 'bg-[var(--primary)] font-medium text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/20'
                      : 'text-[var(--foreground)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]'
                  }
                  text-sm
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
          border-e border-[var(--border)]
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
                {message('sidebarViewProfile')}
              </span>
              <ExternalLink size={14} />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 px-3.5 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              {message('sidebarSignOut')}
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
                  className="absolute bottom-0 end-0 h-3.5 w-3.5 rounded-full border-2 border-[var(--surface)] bg-emerald-500"
                  title={message('sidebarOnlineStatus')}
                />
              </div>

              <p className="text-sm font-bold text-[var(--foreground)]">
                {user?.name || message('sidebarSystemUser')}
              </p>
              <span className="mt-1 rounded-md bg-[var(--primary-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--primary)]">
                {user?.role || message('user')}
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
                <span className={`truncate text-start text-sm font-bold transition-colors ${isGroupHome ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                  {activeGroup.title}
                </span>
              </Link>
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto">
              {activeGroup.sub && activeGroup.sub.length > 0 ? (
                activeGroup.sub.map((subItem) => {
                  const isActive = activeSubItemPath === subItem.href.split('?')[0];

                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`
                        flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors
                        ${
                          isActive
                            ? 'bg-[var(--primary-soft)] font-bold text-[var(--primary)] ring-1 ring-[var(--primary)]/20'
                            : 'text-[var(--foreground)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]'
                        }
                        text-sm text-start
                      `}
                      style={isActive ? { color: 'var(--primary)' } : undefined}
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
                  {activeGroup.id === 'support' ? message('supportNoProjects') : message('sidebarNoSubmenu')}
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
                    {message('sidebarDashboardEvents')}
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {message('sidebarSystemAnnouncements')}
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
                    {message('sidebarAnnouncementBoard')}
                  </span>
                </div>
              </a>

              <a
                href="#system-status"
                className="flex items-center justify-between rounded-xl border border-[var(--border)]/50 bg-slate-50/50 p-2.5 text-xs transition-colors hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-2">
                  <Radio size={15} className="text-emerald-500 shrink-0" />
                  <span className="font-medium text-[var(--foreground)]">
                    {message('sidebarServiceStatus')}
                  </span>
                </div>
              </a>

              <a
                href="#activity-summary"
                className="flex items-center justify-between rounded-xl border border-[var(--border)]/50 bg-slate-50/50 p-2.5 text-xs transition-colors hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="shrink-0 text-[var(--primary)]" />
                  <span className="font-medium text-[var(--foreground)]">
                    {message('sidebarActivitySummary')}
                  </span>
                </div>
              </a>
              <Link
                href="/notifications"
                className="flex items-center gap-2 rounded-xl border border-[var(--border)]/50 bg-slate-50/50 p-2.5 text-xs transition-colors hover:bg-[var(--primary-soft)] dark:bg-slate-900/30"
              >
                <Bell size={15} className="shrink-0 text-[var(--primary)]" />
                <span className="font-medium text-[var(--foreground)]">{message('notificationsTitle')}</span>
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </aside>
  );
}
