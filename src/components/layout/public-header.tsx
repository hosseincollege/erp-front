/**
 * @file src/components/layout/public-header.tsx
 * @description هدر عمومی ERP Pro (لوگو در وسط، اکشن‌ها در سمت چپ)
 *
 * منطق:
 * - اگر هنوز هیچ کاربری در سیستم وجود نداشته باشد:
 *   فقط دکمه «ثبت‌نام مدیر سیستم» نمایش داده می‌شود.
 * - اگر سیستم قبلاً راه‌اندازی شده باشد:
 *   فقط دکمه «ورود» نمایش داده می‌شود.
 *
 * نکته:
 * این کنترل فقط در UI است و بک‌اند نیز باید ثبت‌نام عمومی را
 * پس از ایجاد اولین کاربر مسدود کند.
 */

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LogIn, Monitor, Moon, Sparkles, Sun, UserPlus } from 'lucide-react';

type ThemeMode = 'system' | 'light' | 'dark';

type SetupStatusResponse = {
  hasUsers: boolean;
  isFirstInstall?: boolean;
};

const THEME_STORAGE_KEY = 'erp-theme';

/**
 * اگر در آینده خواستی آدرس بک‌اند را از env بخوانی،
 * می‌توانی این ثابت را به متغیر محیطی وصل کنی.
 */
const BACKEND_BASE_URL = 'http://localhost:3006';

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

function getSavedTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(savedTheme) ? savedTheme : 'system';
}

function applyTheme(mode: ThemeMode) {
  if (typeof window === 'undefined') return;

  const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = mode === 'dark' || (mode === 'system' && systemIsDark);

  document.documentElement.classList.toggle('dark', shouldUseDark);
  document.documentElement.style.colorScheme = shouldUseDark ? 'dark' : 'light';
}

async function getSetupStatus(): Promise<SetupStatusResponse> {
  const response = await fetch(`${BACKEND_BASE_URL}/setup/status`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('دریافت وضعیت راه‌اندازی سیستم ناموفق بود.');
  }

  return response.json();
}

export function PublicHeader() {
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = getSavedTheme();
    setTheme(savedTheme);
    applyTheme(savedTheme);

    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = () => {
      const currentTheme = getSavedTheme();
      if (currentTheme === 'system') applyTheme('system');
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === null || event.key === THEME_STORAGE_KEY) {
        const currentTheme = getSavedTheme();
        setTheme(currentTheme);
        applyTheme(currentTheme);
      }
    };

    const loadSetupStatus = async () => {
      try {
        const data = await getSetupStatus();
        setHasUsers(data.hasUsers);
      } catch (error) {
        console.error('Setup status error:', error);

        /**
         * اگر وضعیت سرور نامشخص بود، ثبت‌نام را نمایش نمی‌دهیم
         * و حالت امن‌تر را انتخاب می‌کنیم.
         */
        setHasUsers(true);
      }
    };

    void loadSetupStatus();

    media.addEventListener?.('change', handleSystemThemeChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      media.removeEventListener?.('change', handleSystemThemeChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const cycleTheme = () => {
    const nextTheme: ThemeMode =
      theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';

    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  const ThemeIcon = theme === 'system' ? Monitor : theme === 'light' ? Sun : Moon;

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto grid h-20 w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8">
        {/* ستون اول (راست): خالی برای تعادل وزن گرید */}
        <div />

        {/* ستون دوم (وسط): لوگو */}
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-3xl px-3 py-2 transition-opacity hover:opacity-90"
          aria-label="رفتن به صفحه اصلی ERP Pro"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6">
            <Sparkles size={23} />
          </div>

          <div className="text-right">
            <div className="text-lg font-black tracking-tight text-foreground">
              ERP Pro
            </div>
            <div className="text-xs text-muted-foreground">
              سامانه یکپارچه سازمانی
            </div>
          </div>
        </Link>

        {/* ستون سوم (چپ): تم + اکشن پویا */}
        <nav className="flex justify-end">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={cycleTheme}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-muted"
              aria-label="تغییر تم"
            >
              <ThemeIcon size={20} />
            </button>

            {hasUsers === null ? (
              <div
                className="h-11 w-[120px] animate-pulse rounded-2xl bg-muted"
                aria-hidden="true"
              />
            ) : null}

            {hasUsers === true ? (
              <div className="min-w-[104px]">
                <Link
                  href="/login"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogIn size={17} />
                  <span>ورود</span>
                </Link>
              </div>
            ) : null}

            {hasUsers === false ? (
              <div className="min-w-[160px]">
                <Link
                  href="/register"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5"
                >
                  <UserPlus size={17} />
                  <span>ثبت‌نام مدیر سیستم</span>
                </Link>
              </div>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
