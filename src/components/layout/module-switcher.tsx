/**
 * @file src/components/layout/module-switcher.tsx
 * @description مگامنو و سوییچر ماژول‌های موجود در ورک‌اسپیس ERP Pro با مسیرهای واقعی پروژه.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Boxes,
  ChevronDown,
  FileText,
  Headphones,
  LayoutGrid,
  Settings,
  ShoppingCart,
  Ticket,
  Users,
  WalletCards,
} from 'lucide-react';

type MenuItem = {
  label: string;
  href: string;
  description: string;
  icon: React.ElementType;
};

type Workspace = {
  key: string;
  label: string;
  href: string;
  description: string;
  icon: React.ElementType;
  items: MenuItem[];
};

const workspaces: Workspace[] = [
  {
    key: 'accounting',
    label: 'حسابداری',
    href: '/accounting',
    description: 'مدیریت امور مالی و حسابداری',
    icon: WalletCards,
    items: [
      {
        label: 'حسابداری',
        href: '/accounting',
        description: 'ورود به ماژول حسابداری',
        icon: WalletCards,
      },
    ],
  },
  {
    key: 'crm',
    label: 'CRM',
    href: '/crm',
    description: 'مدیریت ارتباط با مشتریان',
    icon: Users,
    items: [
      {
        label: 'CRM',
        href: '/crm',
        description: 'ورود به مدیریت مشتریان',
        icon: Users,
      },
    ],
  },
  {
    key: 'hr',
    label: 'منابع انسانی',
    href: '/hr',
    description: 'مدیریت کارکنان و منابع انسانی',
    icon: Headphones,
    items: [
      {
        label: 'منابع انسانی',
        href: '/hr',
        description: 'ورود به ماژول منابع انسانی',
        icon: Headphones,
      },
    ],
  },
  {
    key: 'inventory',
    label: 'انبار',
    href: '/inventory',
    description: 'مدیریت کالا و موجودی انبار',
    icon: Boxes,
    items: [
      {
        label: 'انبار',
        href: '/inventory',
        description: 'ورود به مدیریت انبار',
        icon: Boxes,
      },
    ],
  },
  {
    key: 'purchases',
    label: 'خرید',
    href: '/purchases',
    description: 'مدیریت خرید و تأمین‌کنندگان',
    icon: ShoppingCart,
    items: [
      {
        label: 'خرید',
        href: '/purchases',
        description: 'ورود به ماژول خرید',
        icon: ShoppingCart,
      },
    ],
  },
  {
    key: 'reports',
    label: 'گزارش‌ها',
    href: '/reports',
    description: 'گزارش‌گیری و تحلیل اطلاعات',
    icon: BarChart3,
    items: [
      {
        label: 'گزارش‌ها',
        href: '/reports',
        description: 'مشاهده گزارش‌های سیستم',
        icon: BarChart3,
      },
    ],
  },
  {
    key: 'sales',
    label: 'فروش',
    href: '/sales',
    description: 'مدیریت فرآیند فروش',
    icon: ShoppingCart,
    items: [
      {
        label: 'فروش',
        href: '/sales',
        description: 'ورود به ماژول فروش',
        icon: ShoppingCart,
      },
    ],
  },
  {
    key: 'settings',
    label: 'تنظیمات',
    href: '/settings',
    description: 'تنظیمات و پیکربندی سیستم',
    icon: Settings,
    items: [
      {
        label: 'تنظیمات',
        href: '/settings',
        description: 'مدیریت تنظیمات سیستم',
        icon: Settings,
      },
    ],
  },
  {
    key: 'tickets',
    label: 'تیکت‌ها',
    href: '/tickets',
    description: 'مدیریت درخواست‌های پشتیبانی',
    icon: Ticket,
    items: [
      {
        label: 'تیکت‌ها',
        href: '/tickets',
        description: 'مشاهده و مدیریت تیکت‌ها',
        icon: Ticket,
      },
    ],
  },
];

function getWorkspaceKeyFromPathname(pathname: string | null): string {
  if (!pathname) {
    return 'crm';
  }

  const firstSegment = pathname.split('/')[1];

  return (
    workspaces.find((workspace) => workspace.key === firstSegment)?.key ??
    'crm'
  );
}

export function ModuleSwitcher() {
  const pathname = usePathname();

  const [open, setOpen] = React.useState(false);
  const [activeWorkspaceKey, setActiveWorkspaceKey] = React.useState(
    getWorkspaceKeyFromPathname(pathname),
  );

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const activeWorkspace = React.useMemo(
    () =>
      workspaces.find(
        (workspace) => workspace.key === activeWorkspaceKey,
      ) ?? workspaces[0],
    [activeWorkspaceKey],
  );

  React.useEffect(() => {
    setActiveWorkspaceKey(getWorkspaceKeyFromPathname(pathname));
  }, [pathname]);

  React.useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleWorkspaceChange(workspaceKey: string) {
    setActiveWorkspaceKey(workspaceKey);
  }

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="relative"
    >
      <button
        type="button"
        aria-label="انتخاب ماژول"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className="
          flex items-center gap-2 rounded-2xl
          border border-[var(--border)]
          bg-[var(--surface-muted)]
          px-4 py-2
          text-[var(--foreground)]
          transition-colors
          hover:border-[var(--primary)]/30
          hover:bg-[var(--surface-hover)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--ring)]
        "
      >
        <activeWorkspace.icon className="h-4 w-4 text-[var(--primary)]" />

        <span className="text-sm font-bold">
          {activeWorkspace.label}
        </span>

        <ChevronDown
          className={`
            h-4 w-4 text-[var(--muted)]
            transition-transform duration-200
            ${open ? 'rotate-180' : ''}
          `}
        />
      </button>

      {open ? (
        <div
          className="
            fixed inset-x-0 top-14 z-[60] w-full
            border-b border-[var(--border)]
            bg-[var(--surface)]/95
            text-[var(--foreground)]
            shadow-2xl shadow-[var(--shadow-color)]/20
            backdrop-blur-2xl
          "
        >
          <div className="mx-auto flex max-w-screen-2xl">
            <aside
              className="
                hidden w-72 shrink-0 border-l border-[var(--border)]
                bg-[var(--surface-muted)] p-4 md:block
              "
            >
              <div className="mb-4 px-2 text-xs font-bold tracking-wide text-[var(--muted)]">
                ماژول‌های ورک‌اسپیس
              </div>

              <div className="flex flex-col gap-1">
                {workspaces.map((workspace) => {
                  const WorkspaceIcon = workspace.icon;
                  const isActive =
                    activeWorkspaceKey === workspace.key;

                  return (
                    <button
                      key={workspace.key}
                      type="button"
                      onClick={() =>
                        handleWorkspaceChange(workspace.key)
                      }
                      className={`
                        flex items-center gap-3 rounded-xl px-3 py-3
                        text-right transition-colors
                        ${
                          isActive
                            ? 'bg-[var(--primary-soft)] text-[var(--primary)] ring-1 ring-[var(--primary)]/20'
                            : 'text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
                        }
                      `}
                    >
                      <WorkspaceIcon className="h-4 w-4 shrink-0" />

                      <span className="flex-1 text-sm font-medium">
                        {workspace.label}
                      </span>

                      {isActive ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="min-w-0 flex-1">
              <div className="border-b border-[var(--border)] px-5 py-5 md:px-8">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-11 w-11 items-center justify-center rounded-2xl
                      bg-[var(--primary-soft)]
                      text-[var(--primary)]
                    "
                  >
                    <activeWorkspace.icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[var(--foreground)]">
                      {activeWorkspace.label}
                    </h2>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {activeWorkspace.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-h-[360px] overflow-y-auto p-5 md:p-8">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activeWorkspace.items.map((item) => {
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="
                          group flex items-center gap-4 rounded-2xl
                          border border-transparent p-3
                          transition-colors
                          hover:border-[var(--border)]
                          hover:bg-[var(--surface-hover)]
                        "
                      >
                        <div
                          className="
                            flex h-10 w-10 shrink-0 items-center justify-center
                            rounded-xl
                            bg-[var(--surface-muted)]
                            text-[var(--muted)]
                            transition-colors
                            group-hover:bg-[var(--primary-soft)]
                            group-hover:text-[var(--primary)]
                          "
                        >
                          <ItemIcon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-[var(--foreground)]">
                            {item.label}
                          </div>

                          <div className="mt-1 truncate text-xs text-[var(--muted)]">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div
                className="
                  flex flex-col gap-3 border-t border-[var(--border)]
                  bg-[var(--surface-muted)] px-5 py-4
                  sm:flex-row sm:items-center sm:justify-between
                  md:px-8
                "
              >
                <p className="text-xs text-[var(--muted)]">
                  مسیرهای این منو مطابق پوشه‌های فعلی ورک‌اسپیس تنظیم شده‌اند.
                </p>

                <Link
                  href={activeWorkspace.href}
                  onClick={() => setOpen(false)}
                  className="
                    inline-flex items-center gap-2
                    text-xs font-bold text-[var(--primary)]
                    transition-opacity hover:opacity-80
                  "
                >
                  <LayoutGrid className="h-4 w-4" />
                  ورود به ماژول
                </Link>
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  );
}
