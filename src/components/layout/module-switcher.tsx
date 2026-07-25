"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronDown,
  LayoutGrid,
  Users,
  Ticket,
  ShoppingCart,
  Boxes,
  Wallet,
  Settings,
  PhoneCall,
  BarChart3,
} from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
  description?: string;
  icon?: React.ElementType;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

type Workspace = {
  key: string;
  label: string;
  groups: MenuGroup[];
};

const workspaces: Workspace[] = [
  {
    key: "support",
    label: "پشتیبانی / کال‌سنتر",
    groups: [
      {
        title: "عملیات پشتیبانی",
        items: [
          {
            label: "تیکت‌ها",
            href: "/tickets",
            icon: Ticket,
            description: "ثبت، پیگیری و مدیریت تیکت‌ها",
          },
          {
            label: "مشتریان",
            href: "/customers",
            icon: Users,
            description: "مدیریت اطلاعات مشتریان",
          },
          {
            label: "تماس‌ها",
            href: "/calls",
            icon: PhoneCall,
            description: "ثبت و پیگیری تماس‌های پشتیبانی",
          },
        ],
      },
      {
        title: "کنترل و گزارش",
        items: [
          {
            label: "SLA",
            href: "/support/sla",
            icon: Settings,
            description: "قواعد زمان پاسخ و رسیدگی",
          },
          {
            label: "گزارش‌ها",
            href: "/support/reports",
            icon: BarChart3,
            description: "تحلیل عملکرد تیم پشتیبانی",
          },
        ],
      },
    ],
  },
  {
    key: "crm",
    label: "CRM / مشتریان",
    groups: [
      {
        title: "مدیریت ارتباط با مشتری",
        items: [
          {
            label: "مشتریان",
            href: "/crm/customers",
            icon: Users,
            description: "پرونده و اطلاعات مشتری",
          },
          {
            label: "فعالیت‌ها",
            href: "/crm/activities",
            icon: LayoutGrid,
            description: "ثبت تعاملات و پیگیری‌ها",
          },
        ],
      },
    ],
  },
  {
    key: "sales",
    label: "فروش",
    groups: [
      {
        title: "اسناد فروش",
        items: [
          {
            label: "پیش‌فاکتور",
            href: "/sales/quotes",
            icon: ShoppingCart,
            description: "ایجاد و مدیریت پیش‌فاکتورها",
          },
          {
            label: "سفارش‌ها",
            href: "/sales/orders",
            icon: LayoutGrid,
            description: "ثبت و پیگیری سفارش‌ها",
          },
          {
            label: "فاکتورها",
            href: "/sales/invoices",
            icon: Wallet,
            description: "مدیریت فاکتورهای فروش",
          },
        ],
      },
    ],
  },
  {
    key: "inventory",
    label: "انبار",
    groups: [
      {
        title: "عملیات انبار",
        items: [
          {
            label: "کالاها",
            href: "/inventory/items",
            icon: Boxes,
            description: "تعریف و مدیریت اقلام",
          },
          {
            label: "گردش موجودی",
            href: "/inventory/movements",
            icon: LayoutGrid,
            description: "ورود، خروج و انتقال کالا",
          },
        ],
      },
    ],
  },
];

export function ModuleSwitcher() {
  const [open, setOpen] = React.useState(false);
  const [activeWorkspace, setActiveWorkspace] = React.useState<Workspace>(
    workspaces[0]
  );
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      >
        <span>{activeWorkspace.label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(920px,calc(100vw-1rem))] overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--card-foreground)] shadow-2xl">
          <div className="border-b border-[color:var(--border)] px-4 py-3">
            <div className="text-sm font-semibold">ماژول‌های سیستم</div>
            <div className="mt-1 text-xs text-[color:var(--muted)]">
              مشابه workspace switcher در سیستم‌های ERP/CRM
            </div>
          </div>

          <div className="grid border-b border-[color:var(--border)] md:grid-cols-4">
            {workspaces.map((workspace) => (
              <button
                key={workspace.key}
                type="button"
                onClick={() => setActiveWorkspace(workspace)}
                className={`border-l border-[color:var(--border)] px-4 py-3 text-right transition last:border-l-0 hover:bg-[color:var(--accent)] ${
                  activeWorkspace.key === workspace.key
                    ? "bg-[color:var(--secondary)]"
                    : ""
                }`}
              >
                <div className="text-sm font-semibold">{workspace.label}</div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">
                  {workspace.groups.reduce(
                    (sum, group) => sum + group.items.length,
                    0
                  )}{" "}
                  آیتم
                </div>
              </button>
            ))}
          </div>

          <div className="grid gap-6 p-4 md:grid-cols-2 xl:grid-cols-3">
            {activeWorkspace.groups.map((group) => (
              <div key={group.title}>
                <div className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
                  {group.title}
                </div>

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon ?? LayoutGrid;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 rounded-lg px-3 py-2 transition hover:bg-[color:var(--accent)]"
                      >
                        <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--secondary)] text-[color:var(--primary)]">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="min-w-0">
                          <span className="block text-sm font-medium">
                            {item.label}
                          </span>
                          {item.description ? (
                            <span className="mt-0.5 block text-xs text-[color:var(--muted)]">
                              {item.description}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
