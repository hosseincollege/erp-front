/**
 * مسیر فایل:
 * src/app/(workspace)/settings/page.tsx
 *
 * هدف:
 * صفحه اصلی تنظیمات (شروع مستقیم از شاخص‌های وضعیت زیرساخت و دسترسی‌های سریع بدون هدر اضافه).
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  Cpu,
  Database,
  FileCode2,
  Lock,
  ShieldCheck,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'تنظیمات سیستم | ERP Pro',
  description: 'داشبورد وضعیت، پایش سرویس‌ها و سلامت پیکربندی سیستم',
};

const systemMetrics = [
  {
    title: 'وضعیت پایگاه‌داده',
    status: 'متصل و پایدار',
    detail: 'PostgreSQL / Prisma ORM',
    icon: Database,
    iconClassName: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    title: 'سیستم احراز هویت',
    status: 'RBAC فعال',
    detail: 'JWT Token + Role Guard',
    icon: Lock,
    iconClassName: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'سرویس تبادل داده',
    status: 'آماده پردازش',
    detail: 'پشتیبانی از ساختار JSON',
    icon: FileCode2,
    iconClassName: 'bg-amber-500/10 text-amber-500',
  },
  {
    title: 'وضعیت هسته سرور',
    status: 'عملیاتی (Node/NestJS)',
    detail: 'زمان پاسخ‌دهی استاندارد',
    icon: Cpu,
    iconClassName: 'bg-violet-500/10 text-violet-500',
  },
];

export default function SettingsPage() {
  return (
    <div dir="rtl" className="space-y-5">
      {/* ۱. کارت‌های شاخص وضعیت زیرساخت */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-base font-bold text-foreground">
                    {stat.status}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {stat.detail}
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconClassName}`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ۲. بخش دسترسی‌های سریع و راهنمای مدیریت */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* راهنمای مدیریت سایدبار */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Activity size={20} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-foreground">
                پیکربندی و مدیریت ماژولار
              </h2>
              <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                جهت اعمال تنظیمات مربوط به مشخصات شرکت، شعب، دپارتمان‌ها، مدیریت کاربران و سطوح دسترسی، مستقیماً از بخش تنظیمات در منوی کناری یا میان‌برهای روبه‌رو استفاده نمایید. کلیه تغییرات به صورت بلادرنگ در هسته سامانه ذخیره و همگام‌سازی می‌شوند.
              </p>
            </div>
          </div>
        </div>

        {/* میان‌بر تنظیمات کاربران و عمومی */}
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-foreground">دسترسی سریع</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              مدیریت کاربران، نقش‌ها و ساختار پایه
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/settings/general"
              className="inline-flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-accent hover:text-blue-500"
            >
              <span>تنظیمات عمومی و شرکت</span>
              <ArrowLeft size={13} />
            </Link>

            <Link
              href="/settings/users"
              className="inline-flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-accent hover:text-blue-500"
            >
              <div className="flex items-center gap-1.5">
                <Users size={14} />
                <span>کاربران و دسترسی‌ها</span>
              </div>
              <ArrowLeft size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ۳. یادداشت امنیتی */}
      <footer className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-muted-foreground">
        <ShieldCheck
          size={18}
          className="mt-0.5 shrink-0 text-amber-500"
          aria-hidden="true"
        />
        <p className="leading-5 text-amber-200/90">
          <strong className="font-bold text-amber-400">توجه امنیتی:</strong> تغییر در ساختار سازمان، تعریف شعب و مجوزهای نقش‌ها مستقیماً بر سطح دسترسی کاربران و گردش اسناد در سایر ماژول‌ها تأثیرگذار خواهد بود.
        </p>
      </footer>
    </div>
  );
}
