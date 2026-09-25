/**
 * @file src/components/layout/public-header.tsx
 * @description هدر صفحات عمومی سامانه با پنجره راهنمای بزرگ و خوانا برای ثبت‌نام
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LogIn,
  Monitor,
  Moon,
  ShieldAlert,
  Sparkles,
  Sun,
  UserPlus,
  X,
} from 'lucide-react';

type ThemeMode = 'system' | 'light' | 'dark';

type SetupStatusResponse = {
  hasUsers: boolean;
  isFirstInstall?: boolean;
};

const THEME_STORAGE_KEY = 'erp-theme';

function getBackendBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
    'http://localhost:3006';
  return url.replace(/\/+$/, '');
}

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

function getSavedTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'system';
  }
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(savedTheme) ? savedTheme : 'system';
}

function applyTheme(mode: ThemeMode): void {
  if (typeof window === 'undefined') {
    return;
  }
  const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = mode === 'dark' || (mode === 'system' && systemIsDark);

  document.documentElement.classList.toggle('dark', shouldUseDark);
  document.documentElement.style.colorScheme = shouldUseDark ? 'dark' : 'light';
}

async function fetchSetupStatus(): Promise<SetupStatusResponse> {
  const baseUrl = getBackendBaseUrl();
  const response = await fetch(`${baseUrl}/setup/status`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('عدم دریافت وضعیت راه‌اندازی');
  }

  return response.json() as Promise<SetupStatusResponse>;
}

export function PublicHeader() {
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);
  const [showDisabledNotice, setShowDisabledNotice] = useState(false);

  useEffect(() => {
    const savedTheme = getSavedTheme();
    setTheme(savedTheme);
    applyTheme(savedTheme);

    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = () => {
      if (getSavedTheme() === 'system') {
        applyTheme('system');
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === null || event.key === THEME_STORAGE_KEY) {
        const currentTheme = getSavedTheme();
        setTheme(currentTheme);
        applyTheme(currentTheme);
      }
    };

    const checkStatus = async () => {
      try {
        const data = await fetchSetupStatus();
        setHasUsers(data.hasUsers);
      } catch (error) {
        // در صورت عدم دسترسی به بک‌اند، برای امنیت پیش‌فرض را کاربر موجود در نظر می‌گیریم
        setHasUsers(true);
      }
    };

    void checkStatus();

    media.addEventListener?.('change', handleSystemThemeChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      media.removeEventListener?.('change', handleSystemThemeChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // بستن پنجره با دکمه Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDisabledNotice) {
        setShowDisabledNotice(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDisabledNotice]);

  const cycleTheme = () => {
    const nextTheme: ThemeMode =
      theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';

    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  const ThemeIcon =
    theme === 'system' ? Monitor : theme === 'light' ? Sun : Moon;

  return (
    <>
      <header
        dir="rtl"
        className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto grid h-20 w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8">
          {/* بخش راست: اکشن‌های ورود و ثبت‌نام */}
          <nav className="flex items-center justify-start gap-2.5">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:opacity-95 hover:shadow-lg active:scale-95"
            >
              <LogIn size={16} />
              <span>ورود</span>
            </Link>

            {hasUsers === null && (
              <div
                className="h-10 w-24 animate-pulse rounded-xl bg-muted"
                aria-hidden="true"
              />
            )}

            {/* در حالت نصب اولیه */}
            {hasUsers === false && (
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95 animate-pulse"
                title="سامانه آماده راه‌اندازی است، مالک اولیه را ثبت کنید"
              >
                <Sparkles size={16} className="text-emerald-500" />
                <span>ثبت‌نام اولیه</span>
              </Link>
            )}

            {/* در حالت سامانه مستقر شده */}
            {hasUsers === true && (
              <button
                type="button"
                onClick={() => setShowDisabledNotice(true)}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-xs sm:text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 cursor-pointer"
                title="ثبت‌نام مستقیم غیرفعال است (راهنما)"
              >
                <UserPlus size={16} className="opacity-70" />
                <span>ثبت‌نام</span>
              </button>
            )}
          </nav>

          {/* بخش میانی: برندینگ */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-2xl p-1.5 transition-opacity hover:opacity-90"
            aria-label="صفحه اصلی ERP Pro"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
              <Sparkles size={20} />
            </div>

            <div className="text-right">
              <div className="text-base sm:text-lg font-black tracking-tight text-foreground">
                ERP Pro
              </div>
              <div className="text-[11px] text-muted-foreground hidden sm:block">
                سامانه یکپارچه سازمانی
              </div>
            </div>
          </Link>

          {/* بخش چپ: تغییر پوسته */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={cycleTheme}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs transition-all hover:bg-muted active:scale-95"
              aria-label="تغییر تم"
            >
              <ThemeIcon size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* پنجره مدال راهنما (بزرگ‌تر و خواناتر) */}
      {showDisabledNotice && (
        <div
          dir="rtl"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm transition-all animate-in fade-in duration-200"
          onClick={() => setShowDisabledNotice(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* دکمه بستن پنجره */}
            <button
              type="button"
              onClick={() => setShowDisabledNotice(false)}
              className="absolute left-5 top-5 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="بستن پنجره"
            >
              <X size={22} />
            </button>

            {/* هدر مدال: آیکون بزرگ‌تر و عنوان چشم‌نواز */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 shadow-inner">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-foreground">
                  ثبت‌نام عمومی در سامانه غیرفعال است
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">
                  سیاست امنیتی و دسترسی‌های یکپارچه سازمانی
                </p>
              </div>
            </div>

            {/* باکس متن توضیحات با سایز فونت بزرگ‌تر و خوانا */}
            <div className="mt-6 space-y-3 rounded-2xl bg-muted/50 p-5 text-sm sm:text-base leading-8 text-foreground/90 border border-border/60">
              <p>
                در بستر سازمانی ERP Pro، قابلیت ثبت‌نام مستقیم صرفاً جهت ایجاد{' '}
                <strong className="text-primary font-bold">
                  اولین حساب مالک و مدیر ارشد سیستم
                </strong>{' '}
                در گام نخست راه‌اندازی فعال بوده است.
              </p>
              <p className="text-muted-foreground">
                کلیه حساب‌های کاربری، پرسنلی و دسترسی‌ها باید توسط{' '}
                <strong className="text-foreground">مدیر سیستم</strong> از بخش{' '}
                «تنظیمات و مدیریت کاربران» در داخل سامانه تعریف و صادر گردند.
              </p>
              <div className="pt-1 text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400">
                • در صورت نیاز به حساب کاربری، لطفاً با مدیر سامانه در مجموعه خود تماس بگیرید.
              </div>
            </div>

            {/* دکمه‌های پایین مدال */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDisabledNotice(false)}
                className="h-11 rounded-xl border border-border px-5 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
              >
                متوجه شدم
              </button>
              <Link
                href="/login"
                onClick={() => setShowDisabledNotice(false)}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:opacity-95 active:scale-95"
              >
                <LogIn size={16} />
                <span>ورود به سامانه</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PublicHeader;
