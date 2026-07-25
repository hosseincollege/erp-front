"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "داشبورد",
    subtitle: "نمای کلی از عملکرد سیستم و شاخص های کلیدی",
  },
  "/sales": {
    title: "فروش",
    subtitle: "مدیریت سفارش ها، فاکتورها و مشتریان",
  },
  "/purchases": {
    title: "خرید",
    subtitle: "مدیریت تامین کنندگان و سفارش های خرید",
  },
  "/inventory": {
    title: "انبار",
    subtitle: "کنترل موجودی و گردش کالا",
  },
  "/accounting": {
    title: "حسابداری",
    subtitle: "مدیریت دریافت ها، پرداخت ها و اسناد مالی",
  },
  "/tickets": {
    title: "تیکت ها",
    subtitle: "مدیریت درخواست ها، پیگیری ها و پشتیبانی مشتریان",
  },
  "/hr": {
    title: "منابع انسانی",
    subtitle: "مدیریت پرسنل و اطلاعات سازمانی",
  },
  "/reports": {
    title: "گزارش ها",
    subtitle: "تحلیل داده ها و گزارش های مدیریتی",
  },
  "/settings": {
    title: "تنظیمات",
    subtitle: "پیکربندی بخش های مختلف سیستم",
  },
};

export function Header() {
  const pathname = usePathname();
  const currentPage = pageTitles[pathname] ?? pageTitles["/"];

  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            {currentPage.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {currentPage.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-3 py-2">
            <Search size={16} className="text-[var(--muted)]" />
            <input
              className="w-48 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
              placeholder="جستجو در سیستم..."
            />
          </div>

          <ThemeToggle />

          <button className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2.5 text-[var(--foreground)] transition hover:bg-black/5 dark:hover:bg-white/5">
            <Bell size={18} />
          </button>

          <button className="rounded-2xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] shadow-sm">
            عملیات جدید
          </button>
        </div>
      </div>
    </header>
  );
}
