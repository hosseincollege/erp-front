/**
 * @file src/components/home/public-landing.tsx
 * @description صفحه لندینگ عمومی ERP Pro برای کاربرانی که وارد سیستم نشده‌اند.
 */

'use client';

import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Headphones,
  Layers3,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

import { PublicHeader } from '@/components/layout/public-header';

export function PublicLanding() {
  const features = [
    {
      icon: Headphones,
      title: 'مدیریت تیکت و پشتیبانی',
      desc: 'درخواست‌ها، پیگیری‌ها و پاسخ‌گویی به مشتریان را در یک محیط منظم و متمرکز مدیریت کنید.',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Users,
      title: 'مدیریت مشتریان و ارتباطات',
      desc: 'اطلاعات مشتریان، سوابق ارتباطی و وضعیت تعاملات را یکجا در اختیار داشته باشید.',
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
    {
      icon: ClipboardList,
      title: 'مدیریت فرآیندها و وظایف',
      desc: 'وظایف تیم‌ها، گردش کار و فعالیت‌های سازمانی را دقیق‌تر و هماهنگ‌تر پیش ببرید.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: BarChart3,
      title: 'گزارش‌گیری و تحلیل مدیریتی',
      desc: 'با گزارش‌های روشن و هدفمند، وضعیت کسب‌وکار را بهتر تحلیل کرده و تصمیم دقیق‌تری بگیرید.',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ];

  const highlights = [
    {
      icon: Layers3,
      title: 'یکپارچگی بین بخش‌ها',
      desc: 'اطلاعات واحدهای مختلف سازمان در یک سامانه متمرکز می‌شود.',
    },
    {
      icon: PackageCheck,
      title: 'کاهش کارهای تکراری',
      desc: 'فرآیندهای روزمره با نظم بیشتر و اتلاف زمان کمتر انجام می‌شوند.',
    },
    {
      icon: ShieldCheck,
      title: 'امنیت و کنترل بهتر',
      desc: 'دسترسی‌ها، داده‌ها و فرآیندهای سازمانی با ساختاری امن‌تر مدیریت می‌شوند.',
    },
  ];

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <section className="relative isolate">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute right-[-12rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-[-14rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pb-28 lg:pt-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary">
              <CheckCircle2 size={17} />
              سامانه یکپارچه مدیریت سازمان
            </div>

            <h1 className="text-4xl font-black leading-[1.3] tracking-tight sm:text-5xl lg:text-7xl">
              مدیریت بخش‌های مختلف کسب‌وکار،
              <span className="block text-primary">در یک بستر منظم و هوشمند</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              ERP Pro به سازمان‌ها کمک می‌کند فرآیندهای کلیدی مثل مدیریت مشتریان،
              تیکت‌های پشتیبانی، عملیات داخلی، وظایف تیمی و گزارش‌های مدیریتی را در
              یک سامانه واحد مدیریت کنند؛ ساده‌تر، شفاف‌تر و هماهنگ‌تر.
            </p>

            <div className="mt-10 flex flex-wrap gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={18} />
                ساختار امن و قابل اتکا
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={18} />
                مناسب برای تیم‌های در حال رشد
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="text-emerald-500" size={18} />
                تجربه کاربری ساده و متمرکز
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-primary/10 blur-2xl" />

            <div className="relative rounded-[2rem] border border-border bg-card p-5 shadow-2xl sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ERP Pro چه کمکی می‌کند؟</p>
                  <h2 className="mt-1 text-xl font-black">نمایی از ارزش سامانه</h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles size={22} />
                </div>
              </div>

              <div className="space-y-3">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border bg-muted/40 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon size={20} />
                        </div>

                        <div>
                          <h3 className="text-sm font-black text-foreground sm:text-base">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-sm font-bold text-primary">مناسب برای سازمان‌های خدماتی، فروش، پشتیبانی و تیم‌های عملیاتی</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  اگر به‌دنبال یک محیط منسجم برای کنترل بهتر فرآیندها، اطلاعات و ارتباطات داخلی و خارجی هستید، ERP Pro می‌تواند هسته مرکزی مدیریت سازمان شما باشد.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-black text-primary">امکانات ERP Pro</p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              ابزارهایی برای مدیریت بهتر سازمان
            </h2>

            <p className="mt-4 leading-8 text-muted-foreground">
              ماژول‌های کاربردی ERP Pro کمک می‌کنند اطلاعات، ارتباطات و فرآیندهای کاری
              در یک مسیر روشن‌تر و هماهنگ‌تر مدیریت شوند.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bg} ${feature.color}`}
                  >
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-black">{feature.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© تمامی حقوق برای ERP Pro محفوظ است.</p>

        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          سامانه امن مدیریت سازمان
        </div>
      </footer>
    </main>
  );
}
