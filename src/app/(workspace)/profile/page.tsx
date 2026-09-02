/**
 * مسیر فایل:
 * src/app/(workspace)/profile/page.tsx
 *
 * هدف:
 * صفحه پروفایل کاربری (منطبق بر قالب و استاندارد طراحی ماژول‌های ERP Pro).
 */

'use client';

import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock3,
  KeyRound,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  UserCheck,
  UserRound,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

type UserProfile = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  roleTitle: string;
  departmentName: string;
  employeeCode: string;
  createdAt: string;
  lastLoginAt: string;
  status: 'active' | 'inactive' | 'suspended';
  twoFactorEnabled: boolean;
};

const MOCK_PROFILE: UserProfile = {
  id: 'usr-90812',
  username: 'admin_user',
  fullName: 'علی محمدی',
  email: 'a.mohammadi@company.ir',
  phoneNumber: '۰۹۱۲۳۴۵۶۷۸۹',
  roleTitle: 'مدیر ارشد سیستم',
  departmentName: 'فناوری اطلاعات و ارتباطات',
  employeeCode: 'EMP-1402-089',
  createdAt: '2023-04-10T08:30:00Z',
  lastLoginAt: '2026-08-28T10:15:00Z',
  status: 'active',
  twoFactorEnabled: true,
};

function formatNumber(value: number): string {
  return new Intl.NumberFormat('fa-IR').format(value);
}

function formatDate(value?: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
  }).format(date);
}

function formatDateTime(value?: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfileData = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      // در صورت اتصال به بک‌اند واقعی، فراخوانی authApi / settingsApi در اینجا قرار می‌گیرد
      await new Promise((resolve) => setTimeout(resolve, 350));

      setProfile(MOCK_PROFILE);
    } catch (loadError) {
      if (loadError instanceof Error) {
        setError(loadError.message);
      } else {
        setError('دریافت اطلاعات پروفایل کاربری با خطا مواجه شد.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadProfileData();
  }, [loadProfileData]);

  const stats = [
    {
      label: 'وضعیت حساب',
      value: profile?.status === 'active' ? 'فعال' : 'غیرفعال',
      icon: UserCheck,
      iconClassName: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      label: 'نقش سازمانی',
      value: profile?.roleTitle ?? '—',
      icon: ShieldCheck,
      iconClassName: 'bg-blue-500/10 text-blue-500',
    },
    {
      label: 'واحد سازمانی',
      value: profile?.departmentName ?? '—',
      icon: Building2,
      iconClassName: 'bg-indigo-500/10 text-indigo-500',
    },
    {
      label: 'تأیید دو مرحله‌ای',
      value: profile?.twoFactorEnabled ? 'فعال' : 'غیرفعال',
      icon: KeyRound,
      iconClassName: 'bg-amber-500/10 text-amber-500',
    },
  ];

  return (
    <div dir="rtl" className="space-y-5">
      {/* ۱. هدر استاندارد، ساده و متناسب با ابعاد حسابداری */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <UserRound size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-foreground">
                پروفایل کاربری
              </h1>

              <p className="mt-0.5 text-xs text-muted-foreground">
                مدیریت اطلاعات فردی، سازمانی و تنظیمات امنیتی حساب کاربری
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => void loadProfileData(true)}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? 'animate-spin' : undefined}
              />
              به‌روزرسانی
            </button>
          </div>
        </div>
      </section>

      {/* ۲. کارت‌های خلاصه وضعیت */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 truncate text-base font-bold text-foreground">
                    {isLoading ? '—' : stat.value}
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

      {/* ۳. بخش اطلاعات و جزئیات پروفایل */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                اطلاعات فردی و سازمانی
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                مشخصات ثبت‌شده شما در سامانه سازمانی ERP Pro
              </p>
            </div>

            <div className="text-xs text-muted-foreground">
              شناسه کاربری:{' '}
              <span className="font-bold text-foreground">
                {profile?.id ?? '—'}
              </span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
            <RefreshCw size={22} className="animate-spin text-blue-500" />
            <p className="text-xs">در حال دریافت اطلاعات پروفایل...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="rounded-full bg-rose-500/10 p-2.5 text-rose-400 ring-1 ring-inset ring-rose-500/15">
              <AlertCircle size={22} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-foreground">
                دریافت اطلاعات ناموفق بود
              </h3>
              <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadProfileData()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              تلاش مجدد
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-right">
              <thead className="bg-muted/40">
                <tr className="border-b border-border text-[11px] font-bold text-muted-foreground">
                  <th className="px-5 py-3">عنوان فیلد</th>
                  <th className="px-5 py-3">مقدار</th>
                  <th className="px-5 py-3">دسته‌بندی</th>
                  <th className="px-5 py-3">وضعیت</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                <tr className="transition hover:bg-accent/40 text-xs">
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <UserRound size={15} className="text-muted-foreground" />
                      نام و نام خانوادگی
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-foreground">
                    {profile?.fullName}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">اطلاعات هویتی</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                      <CheckCircle2 size={12} />
                      تأییدشده
                    </span>
                  </td>
                </tr>

                <tr className="transition hover:bg-accent/40 text-xs">
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <Mail size={15} className="text-muted-foreground" />
                      پست الکترونیک (ایمیل)
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-foreground dir-ltr text-right font-medium">
                    {profile?.email}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">اطلاعات ارتباطی</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                      <CheckCircle2 size={12} />
                      تأییدشده
                    </span>
                  </td>
                </tr>

                <tr className="transition hover:bg-accent/40 text-xs">
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <Smartphone size={15} className="text-muted-foreground" />
                      شماره تلفن همراه
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-foreground font-medium">
                    {profile?.phoneNumber}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">اطلاعات ارتباطی</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                      <CheckCircle2 size={12} />
                      تأییدشده
                    </span>
                  </td>
                </tr>

                <tr className="transition hover:bg-accent/40 text-xs">
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <Building2 size={15} className="text-muted-foreground" />
                      کد پرسنلی و واحد
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-foreground font-medium">
                    {profile?.employeeCode} ({profile?.departmentName})
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">اطلاعات سازمانی</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 ring-1 ring-inset ring-blue-500/20">
                      {profile?.roleTitle}
                    </span>
                  </td>
                </tr>

                <tr className="transition hover:bg-accent/40 text-xs">
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <Calendar size={15} className="text-muted-foreground" />
                      تاریخ ایجاد حساب
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-foreground font-medium">
                    {formatDate(profile?.createdAt)}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">حساب کاربری</td>
                  <td className="px-5 py-3.5 text-muted-foreground">—</td>
                </tr>

                <tr className="transition hover:bg-accent/40 text-xs">
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      <Clock3 size={15} className="text-muted-foreground" />
                      آخرین ورود به سامانه
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-foreground font-medium">
                    {formatDateTime(profile?.lastLoginAt)}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">امنیت و نشست‌ها</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-0.5 text-[11px] font-bold text-slate-300 ring-1 ring-inset ring-slate-500/20">
                      موفق
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
