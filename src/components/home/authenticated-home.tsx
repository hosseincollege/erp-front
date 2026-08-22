/**
 * @file src/components/home/authenticated-home.tsx
 * @description صفحه اصلی کاربر لاگین‌شده داخل AppShell.
 */

'use client';

import Link from 'next/link';
import {
  BarChart3,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Ticket,
} from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';

export function AuthenticatedHome() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
              <LayoutDashboard size={32} />
            </div>

            <div>
              <h1 className="text-3xl font-black text-foreground">
                میز کار مرکزی
              </h1>

              <p className="mt-1 text-muted-foreground">
                به سامانه مدیریت یکپارچه ERP Pro خوش آمدید.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/sales"
            className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <ShoppingCart size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold">بخش فروش</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              مدیریت فاکتورها و سفارشات مشتریان
            </p>
          </Link>

          <Link
            href="/tickets"
            className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
              <Ticket size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold">تیکت‌های پشتیبانی</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              پیگیری درخواست‌ها و پاسخ به مشتریان
            </p>
          </Link>

          <Link
            href="/inventory"
            className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Package size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold">مدیریت کالا</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              کنترل موجودی انبار و ورود/خروج کالا
            </p>
          </Link>

          <Link
            href="/reports"
            className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <BarChart3 size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold">گزارشات آماری</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              تحلیل داده‌ها و نمودارهای مدیریتی
            </p>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
