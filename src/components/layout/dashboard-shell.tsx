"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Boxes,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  CircleDollarSign,
  Command,
  FileBarChart,
  Grid2x2,
  LayoutDashboard,
  Menu,
  Moon,
  PackageSearch,
  Plus,
  Search,
  Settings,
  ShoppingBasket,
  Sparkles,
  Sun,
  Users,
  X,
  ShieldCheck,
  BadgePercent,
  ClipboardList,
  ReceiptText,
  UserCog,
  Ticket,
  BarChart3,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useTheme } from "@/components/theme-provider";

type NavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

type MegaMenuItem = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

type MegaMenuSection = {
  title: string;
  description: string;
  items: MegaMenuItem[];
};

type DashboardShellProps = {
  children: ReactNode;
};

const navigation: NavigationItem[] = [
  { title: "داشبورد", href: "/", icon: LayoutDashboard },
  { title: "مدیریت مشتریان", href: "/crm", icon: Users },
  { title: "فروش", href: "/sales", icon: CircleDollarSign },
  { title: "خرید", href: "/purchases", icon: ShoppingBasket },
  { title: "انبار", href: "/inventory", icon: Boxes, badge: "۸" },
  { title: "حسابداری", href: "/accounting", icon: BriefcaseBusiness },
  { title: "منابع انسانی", href: "/hr", icon: Building2 },
  { title: "گزارش‌ها", href: "/reports", icon: FileBarChart },
  { title: "تنظیمات", href: "/settings", icon: Settings },
];

const megaMenuSections: MegaMenuSection[] = [
  {
    title: "CRM / مشتریان",
    description: "مدیریت ارتباط با مشتری، سرنخ‌ها و تعاملات",
    items: [
      {
        title: "مشتریان",
        href: "/crm/customers",
        description: "پرونده مشتریان و سوابق ارتباطی",
        icon: Users,
      },
      {
        title: "سرنخ‌ها",
        href: "/crm/leads",
        description: "فرصت‌های جدید و پیگیری‌های فروش",
        icon: BadgePercent,
      },
      {
        title: "فعالیت‌ها",
        href: "/crm/activities",
        description: "تماس‌ها، جلسات و پیگیری‌ها",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "فروش",
    description: "مدیریت سفارش‌ها، فاکتورها و سیاست فروش",
    items: [
      {
        title: "سفارش‌های فروش",
        href: "/sales/orders",
        description: "ثبت و پیگیری سفارش‌های مشتری",
        icon: CircleDollarSign,
      },
      {
        title: "فاکتورهای فروش",
        href: "/sales/invoices",
        description: "صدور، وضعیت و تسویه فاکتورها",
        icon: ReceiptText,
      },
      {
        title: "قیمت‌گذاری و تخفیف",
        href: "/sales/pricing",
        description: "قواعد قیمت و کمپین‌های فروش",
        icon: BadgePercent,
      },
    ],
  },
  {
    title: "خرید و تأمین",
    description: "درخواست خرید، سفارش‌ها و تأمین‌کنندگان",
    items: [
      {
        title: "درخواست خرید",
        href: "/purchases/requests",
        description: "نیازهای داخلی و روال تصویب",
        icon: ClipboardList,
      },
      {
        title: "سفارش‌های خرید",
        href: "/purchases/orders",
        description: "ثبت سفارش به تأمین‌کنندگان",
        icon: ShoppingBasket,
      },
      {
        title: "تأمین‌کنندگان",
        href: "/purchases/vendors",
        description: "پرونده و ارزیابی تأمین‌کنندگان",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    title: "انبار و موجودی",
    description: "کالاها، گردش‌ها و هشدارهای موجودی",
    items: [
      {
        title: "کالاها",
        href: "/inventory/items",
        description: "ثبت، دسته‌بندی و مشخصات کالا",
        icon: Warehouse,
      },
      {
        title: "گردش موجودی",
        href: "/inventory/movements",
        description: "ورود، خروج و انتقال بین انبارها",
        icon: Boxes,
      },
      {
        title: "هشدار موجودی",
        href: "/inventory/alerts",
        description: "کالاهای کم‌موجودی و بحرانی",
        icon: PackageSearch,
      },
    ],
  },
  {
    title: "حسابداری",
    description: "اسناد مالی، پرداخت‌ها و مراکز هزینه",
    items: [
      {
        title: "اسناد حسابداری",
        href: "/accounting/documents",
        description: "ثبت و مرور اسناد مالی",
        icon: BriefcaseBusiness,
      },
      {
        title: "دریافت و پرداخت",
        href: "/accounting/payments",
        description: "مدیریت جریان‌های نقدی",
        icon: ReceiptText,
      },
      {
        title: "مرکز هزینه",
        href: "/accounting/cost-centers",
        description: "کنترل تحلیلی هزینه‌ها",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "منابع انسانی",
    description: "پرسنل، ساختار سازمانی و حضور و غیاب",
    items: [
      {
        title: "پرسنل",
        href: "/hr/employees",
        description: "پرونده، وضعیت و اطلاعات کارکنان",
        icon: UserCog,
      },
      {
        title: "چارت سازمانی",
        href: "/hr/organization",
        description: "واحدها، نقش‌ها و مسئولیت‌ها",
        icon: Building2,
      },
      {
        title: "حضور و غیاب",
        href: "/hr/attendance",
        description: "شیفت، ورود و خروج و تاخیرها",
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "پشتیبانی و تیکتینگ",
    description: "تیکت‌ها، SLA و عملکرد تیم پشتیبانی",
    items: [
      {
        title: "تیکت‌ها",
        href: "/support/tickets",
        description: "ثبت و پیگیری درخواست‌های پشتیبانی",
        icon: Ticket,
      },
      {
        title: "SLA",
        href: "/support/sla",
        description: "سطوح خدمات و زمان پاسخ",
        icon: ShieldCheck,
      },
      {
        title: "گزارش عملکرد",
        href: "/support/reports",
        description: "تحلیل کیفیت و سرعت پاسخ‌گویی",
        icon: FileBarChart,
      },
    ],
  },
  {
    title: "گزارش‌ها و تنظیمات",
    description: "تحلیل مدیریتی و پیکربندی سامانه",
    items: [
      {
        title: "گزارش‌های مدیریتی",
        href: "/reports/management",
        description: "شاخص‌ها، روندها و داشبوردها",
        icon: BarChart3,
      },
      {
        title: "تنظیمات سیستم",
        href: "/settings/system",
        description: "پیکربندی هسته سیستم",
        icon: Settings,
      },
      {
        title: "کاربران و دسترسی‌ها",
        href: "/settings/access",
        description: "نقش‌ها، مجوزها و امنیت",
        icon: UserCog,
      },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getPageMeta(pathname: string) {
  const pageMap: Record<
    string,
    { title: string; description: string; breadcrumb: string[] }
  > = {
    "/": {
      title: "داشبورد",
      description: "نمای کلی عملکرد، شاخص‌ها و وضعیت جاری سازمان",
      breadcrumb: ["ERP Pro", "داشبورد"],
    },
    "/crm": {
      title: "مدیریت مشتریان",
      description: "مدیریت مشتریان، سرنخ‌ها و تعاملات فروش",
      breadcrumb: ["ERP Pro", "CRM", "مدیریت مشتریان"],
    },
    "/sales": {
      title: "فروش",
      description: "سفارش‌ها، فاکتورها و عملکرد فروش",
      breadcrumb: ["ERP Pro", "فروش"],
    },
    "/purchases": {
      title: "خرید",
      description: "درخواست‌ها، سفارش‌ها و تأمین‌کنندگان",
      breadcrumb: ["ERP Pro", "خرید"],
    },
    "/inventory": {
      title: "انبار",
      description: "کالاها، موجودی و گردش بین انبارها",
      breadcrumb: ["ERP Pro", "انبار"],
    },
    "/accounting": {
      title: "حسابداری",
      description: "اسناد مالی و جریان‌های دریافت و پرداخت",
      breadcrumb: ["ERP Pro", "حسابداری"],
    },
    "/hr": {
      title: "منابع انسانی",
      description: "کارکنان، ساختار سازمانی و حضور و غیاب",
      breadcrumb: ["ERP Pro", "منابع انسانی"],
    },
    "/reports": {
      title: "گزارش‌ها",
      description: "گزارش‌های تحلیلی و مدیریتی",
      breadcrumb: ["ERP Pro", "گزارش‌ها"],
    },
    "/settings": {
      title: "تنظیمات",
      description: "پیکربندی سیستم و دسترسی کاربران",
      breadcrumb: ["ERP Pro", "تنظیمات"],
    },
  };

  const matched = Object.keys(pageMap)
    .sort((a, b) => b.length - a.length)
    .find((route) => (route === "/" ? pathname === "/" : pathname.startsWith(route)));

  return (
    (matched && pageMap[matched]) || {
      title: "ERP Pro",
      description: "مدیریت یکپارچه فرایندها و عملیات سازمان",
      breadcrumb: ["ERP Pro"],
    }
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const pageMeta = useMemo(() => getPageMeta(pathname), [pathname]);
  const shellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setMegaMenuOpen(false);
        setNotificationsOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!shellRef.current) return;
      if (!shellRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={shellRef}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"
    >
      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="بستن منوی موبایل"
          className="fixed inset-0 z-40 bg-[var(--overlay)] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-[284px] flex-col border-l border-[var(--sidebar-border)]",
          "bg-[var(--sidebar)] text-[var(--sidebar-foreground)] shadow-2xl transition-transform duration-200",
          "lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-[76px] items-center gap-3 border-b border-[var(--sidebar-border)] px-5">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--sidebar-active)] text-white shadow-lg shadow-blue-500/20">
            <Sparkles size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-lg font-bold">ERP Pro</p>
              <span className="rounded-md bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-bold text-blue-300">
                BETA
              </span>
            </div>
            <p className="truncate text-xs text-[var(--sidebar-muted)]">
              مدیریت یکپارچه سازمان
            </p>
          </div>

          <button
            type="button"
            className="grid size-9 place-items-center rounded-xl text-[var(--sidebar-muted)] transition hover:bg-[var(--sidebar-hover)] hover:text-white lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="erp-scrollbar flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wide text-[var(--sidebar-muted)]">
            فضای کاری
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-[var(--sidebar-active)] text-white shadow-lg shadow-blue-950/20"
                      : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-foreground)]",
                  ].join(" ")}
                >
                  <Icon size={19} strokeWidth={active ? 2.25 : 1.9} />
                  <span className="flex-1">{item.title}</span>

                  {item.badge ? (
                    <span
                      className={[
                        "grid min-w-6 place-items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                        active
                          ? "bg-white/15 text-white"
                          : "bg-orange-500/15 text-orange-300",
                      ].join(" ")}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[var(--sidebar-border)] p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-right transition hover:bg-[var(--sidebar-hover)]"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
              ح
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--sidebar-foreground)]">
                حسین مهزادی‌منش
              </p>
              <p className="truncate text-[11px] text-[var(--sidebar-muted)]">
                مدیر سیستم
              </p>
            </div>

            <ChevronDown size={16} className="text-[var(--sidebar-muted)]" />
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pr-[284px]">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur-xl">
          <div className="mx-auto flex min-h-[76px] w-full max-w-[1680px] items-center gap-3 px-4 md:px-6 xl:px-8">
            <button
              type="button"
              aria-label="باز کردن منوی کناری"
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--card)] transition hover:bg-[var(--surface-hover)] lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div className="hidden min-w-0 md:block">
              <div className="mb-1 flex items-center gap-2 text-[11px] text-[var(--muted)]">
                {pageMeta.breadcrumb.map((item, index) => (
                  <span key={`${item}-${index}`} className="flex items-center gap-2">
                    {index > 0 ? <span className="text-[var(--border-strong)]">/</span> : null}
                    <span>{item}</span>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-bold md:text-xl">
                  {pageMeta.title}
                </h1>

                <button
                  type="button"
                  aria-expanded={megaMenuOpen}
                  onClick={() => setMegaMenuOpen((prev) => !prev)}
                  className={[
                    "flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition",
                    "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface-hover)]",
                    megaMenuOpen ? "border-[var(--primary)] ring-4 ring-[var(--ring)]" : "",
                  ].join(" ")}
                >
                  <Grid2x2 size={16} />
                  <span>ماژول‌ها</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              <p className="mt-1 truncate text-xs text-[var(--muted)]">
                {pageMeta.description}
              </p>
            </div>

            <div className="mx-auto hidden w-full max-w-xl md:block">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />

                <input
                  type="search"
                  placeholder="جست‌وجوی مشتری، کالا، فاکتور یا فرمان..."
                  className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] pr-11 pl-24 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]"
                />

                <span className="pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[10px] text-[var(--muted)] xl:flex">
                  <Command size={11} />
                  K
                </span>
              </div>
            </div>

            <div className="mr-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="تغییر تم"
                onClick={toggleTheme}
                className="grid size-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              >
                {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="relative">
                <button
                  type="button"
                  aria-label="اعلان‌ها"
                  aria-expanded={notificationsOpen}
                  onClick={() => setNotificationsOpen((prev) => !prev)}
                  className="relative grid size-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                >
                  <Bell size={18} />
                  <span className="absolute left-2 top-2 size-2 rounded-full bg-[var(--danger)] ring-2 ring-[var(--card)]" />
                </button>

                {notificationsOpen ? (
                  <div className="animate-slide-up absolute left-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-2 shadow-[var(--shadow-lg)]">
                    <div className="flex items-center justify-between px-3 py-2">
                      <div>
                        <p className="text-sm font-bold">اعلان‌ها</p>
                        <p className="text-[11px] text-[var(--muted)]">
                          ۳ اعلان خوانده‌نشده
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-semibold text-[var(--primary)]"
                      >
                        خواندن همه
                      </button>
                    </div>

                    <div className="space-y-1">
                      <NotificationItem
                        title="موجودی کالا رو به اتمام است"
                        description="موجودی مودم مدل X به کمتر از حد مجاز رسید."
                        tone="warning"
                      />
                      <NotificationItem
                        title="فاکتور جدید ثبت شد"
                        description="فاکتور فروش شماره ۱۰۲۴ ایجاد شد."
                        tone="success"
                      />
                      <NotificationItem
                        title="درخواست تأیید پرداخت"
                        description="یک پرداخت در انتظار تأیید شما قرار دارد."
                        tone="primary"
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                className="hidden h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)] sm:flex"
              >
                <Plus size={17} />
                عملیات جدید
              </button>
            </div>
          </div>

          {megaMenuOpen ? (
            <div className="border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-elevated)_94%,transparent)] backdrop-blur-xl">
              <div className="mx-auto w-full max-w-[1680px] px-4 py-5 md:px-6 xl:px-8">
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-bold">مرکز ماژول‌ها</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      دسترسی سریع به زیرسیستم‌ها، عملیات و صفحات کلیدی
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <span className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1">
                      {megaMenuSections.length} دسته
                    </span>
                    <span className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1">
                      {megaMenuSections.reduce((sum, section) => sum + section.items.length, 0)} میانبر
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                  {megaMenuSections.map((section) => (
                    <section
                      key={section.title}
                      className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)] transition hover:border-[color-mix(in_srgb,var(--primary)_30%,var(--border))] hover:bg-[var(--surface-hover)]"
                    >
                      <div className="mb-4">
                        <h2 className="text-sm font-bold">{section.title}</h2>
                        <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                          {section.description}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(pathname, item.href);

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={[
                                "flex items-start gap-3 rounded-2xl border p-3 transition",
                                active
                                  ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                                  : "border-transparent hover:border-[var(--border)] hover:bg-[var(--surface)]",
                              ].join(" ")}
                            >
                              <div
                                className={[
                                  "mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl",
                                  active
                                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                    : "bg-[var(--surface-muted)] text-[var(--primary)]",
                                ].join(" ")}
                              >
                                <Icon size={18} />
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-semibold">{item.title}</p>
                                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </header>

        <main className="mx-auto w-full max-w-[1680px] p-4 md:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function NotificationItem({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: "primary" | "success" | "warning";
}) {
  const toneClass =
    tone === "primary"
      ? "bg-[var(--primary)]"
      : tone === "success"
        ? "bg-[var(--success)]"
        : "bg-[var(--warning)]";

  return (
    <button
      type="button"
      className="flex w-full gap-3 rounded-xl p-3 text-right transition hover:bg-[var(--surface-hover)]"
    >
      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${toneClass}`} />
      <span className="min-w-0">
        <span className="block text-xs font-semibold">{title}</span>
        <span className="mt-1 block text-[11px] leading-5 text-[var(--muted)]">
          {description}
        </span>
      </span>
    </button>
  );
}
