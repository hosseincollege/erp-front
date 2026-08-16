/**
 * @file src/app/page.tsx
 * @description صفحه اصلی ERP Pro بدون حالت مهمان (Guest Mode).
 * اگر کاربر لاگین نباشد، لندینگ عمومی نمایش داده می‌شود.
 * اگر کاربر لاگین باشد، داشبورد داخل AppShell (هدر + سایدبار) نمایش داده می‌شود.
 */

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Headphones,
  ShieldCheck,
  Sparkles,
  Users,
  LayoutDashboard,
  ShoppingCart,
  Ticket,
  Package,
} from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { getCurrentUser, isUserAuthenticated, type AuthUser } from '@/lib/auth-api';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsAuthenticated(isUserAuthenticated());
    check();

    // وقتی از لاگ‌اوت برمی‌گردیم یا تب دوباره فوکوس می‌شود، وضعیت را تازه می‌کنیم
    window.addEventListener('focus', check);
    window.addEventListener('storage', check);

    return () => {
      window.removeEventListener('focus', check);
      window.removeEventListener('storage', check);
    };
  }, []);

  // حالت در حال بارگذاری
  if (isAuthenticated === null) {
    return (
      <main dir="rtl" className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-sm text-muted-foreground">در حال بارگذاری...</div>
      </main>
    );
  }

  // ۱) کاربر مهمان → لندینگ عمومی (بدون هدر پنل و سایدبار)
  if (!isAuthenticated) {
    return <PublicLanding />;
  }

  // ۲) کاربر لاگین‌شده → داشبورد داخل AppShell
  return <AuthenticatedDashboard />;
}

/* ==================== لندینگ عمومی ==================== */

function PublicLanding() {
  const features = [
    { icon: Headphones, title: 'مدیریت تیکتینگ', desc: 'ثبت و پیگیری درخواست‌های پشتیبانی در یک محیط یکپارچه.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Users, title: 'مدیریت مشتریان', desc: 'سازمان‌دهی اطلاعات مشتریان و سوابق تعاملات.', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { icon: ClipboardList, title: 'عملیات و وظایف', desc: 'مدیریت فرآیندهای سازمانی و وظایف تیم‌ها.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: BarChart3, title: 'گزارش مدیریتی', desc: 'گزارش‌های کاربردی برای تصمیم‌گیری بهتر.', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const stats = [
    { value: '۶', label: 'ماژول فعال' },
    { value: '۲۴', label: 'کاربر هم‌زمان' },
    { value: '۹۹.۹٪', label: 'پایداری سرویس' },
    { value: 'لحظه‌ای', label: 'گزارش‌دهی' },
  ];

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative isolate">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute right-[-12rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-[-14rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">ERP Pro</div>
              <div className="text-xs text-muted-foreground">سامانه یکپارچه سازمانی</div>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              ورود
            </Link>
            <Link href="/register" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5">
              ثبت‌نام
            </Link>
          </nav>
        </header>

        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-28 lg:pt-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary">
              <CheckCircle2 size={17} />
              مدیریت هوشمند و یکپارچه کسب‌وکار
            </div>

            <h1 className="text-4xl font-black leading-[1.25] tracking-tight sm:text-5xl lg:text-7xl">
              همه‌چیز سازمانت،
              <span className="block text-primary">یکجا و هوشمند</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              ERP Pro یک پلتفرم جامع برای مدیریت منابع سازمانی، مشتریان، تیکت‌ها، فروش، خرید، انبار و گزارش‌های مدیریتی است؛ ساده، سریع و متناسب با نیازهای واقعی کسب‌وکار شما.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-black text-primary-foreground shadow-xl shadow-primary/20 transition-transform hover:-translate-y-1">
                شروع رایگان
                <ArrowLeft size={18} />
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3.5 font-black transition-colors hover:bg-muted">
                ورود به سامانه
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="text-emerald-500" size={18} />امنیت سازمانی</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={18} />راه‌اندازی سریع</div>
              <div className="flex items-center gap-2"><Sparkles className="text-emerald-500" size={18} />تجربه کاربری ساده</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-primary/10 blur-2xl" />
            <div className="relative rounded-[2rem] border border-border bg-card p-5 shadow-2xl sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">نمای کلی سامانه</p>
                  <h2 className="mt-1 text-xl font-black">داشبورد سازمان</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BarChart3 size={22} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border bg-muted/40 p-4">
                    <div className="text-2xl font-black text-primary">{stat.value}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-primary p-5 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">وضعیت سرویس‌ها</p>
                    <p className="mt-1 text-lg font-black">همه سرویس‌ها فعال هستند</p>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_0_6px_rgba(110,231,183,0.18)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-black text-primary">امکانات ERP Pro</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">ابزارهایی برای رشد بهتر سازمان</h2>
            <p className="mt-4 leading-8 text-muted-foreground">ماژول‌های کاربردی را در یک محیط واحد در اختیار تیم خود قرار دهید و فرآیندهای سازمانی را با نظم بیشتری پیش ببرید.</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href ?? '#'} className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bg} ${feature.color}`}>
                    <Icon size={23} />
                  </div>
                  <h3 className="mt-5 text-lg font-black">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© تمامی حقوق برای ERP Pro محفوظ است.</p>
        <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-primary" />سامانه امن مدیریت سازمان</div>
      </footer>
    </main>
  );
}

/* ==================== داشبورد لاگین‌شده ==================== */

function AuthenticatedDashboard() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground">میز کار مرکزی</h1>
              <p className="mt-1 text-muted-foreground">به سامانه مدیریت یکپارچه ERP Pro خوش آمدید.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/sales" className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500"><ShoppingCart size={24} /></div>
            <h3 className="mt-4 text-lg font-bold">بخش فروش</h3>
            <p className="mt-2 text-sm text-muted-foreground">مدیریت فاکتورها و سفارشات مشتریان</p>
          </Link>

          <Link href="/tickets" className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500"><Ticket size={24} /></div>
            <h3 className="mt-4 text-lg font-bold">تیکت‌های پشتیبانی</h3>
            <p className="mt-2 text-sm text-muted-foreground">پیگیری درخواست‌ها و پاسخ به مشتریان</p>
          </Link>

          <Link href="/inventory" className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500"><Package size={24} /></div>
            <h3 className="mt-4 text-lg font-bold">مدیریت کالا</h3>
            <p className="mt-2 text-sm text-muted-foreground">کنترل موجودی انبار و ورود/خروج کالا</p>
          </Link>

          <Link href="/reports" className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500"><BarChart3 size={24} /></div>
            <h3 className="mt-4 text-lg font-bold">گزارشات آماری</h3>
            <p className="mt-2 text-sm text-muted-foreground">تحلیل داده‌ها و نمودارهای مدیریتی</p>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
