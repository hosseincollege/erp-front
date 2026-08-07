/**
 * @file src/app/page.tsx
 * @name page.tsx
 * @description صفحه اصلی ERP Pro با تشخیص پایدار نشست رسمی و مهمان، جلوگیری از نمایش اشتباه وضعیت ورود بعد از جابه‌جایی بین صفحات، و UI مینیمال RTL.
 */

'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Headphones,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

import {
  getCurrentUser,
  getUserDisplayName,
  isUserAuthenticated,
  type AuthUser,
} from '@/lib/auth-api';

const GUEST_MODE_STORAGE_KEY = 'erp-pro-guest-mode';

const features = [
  {
    title: 'تیکتینگ',
    description: 'پیگیری و مدیریت درخواست‌های پشتیبانی',
    icon: Headphones,
  },
  {
    title: 'مدیریت مشتریان',
    description: 'ثبت مشتریان، ارتباطات و سوابق CRM',
    icon: Users,
  },
  {
    title: 'عملیات و وظایف',
    description: 'مدیریت فرایندها و فعالیت‌های روزانه',
    icon: ClipboardList,
  },
  {
    title: 'گزارش مدیریتی',
    description: 'مشاهده شاخص‌ها و گزارش‌های لحظه‌ای',
    icon: BarChart3,
  },
];

const stats = [
  { value: '6', label: 'ماژول فعال', icon: ClipboardList },
  { value: '24', label: 'کاربر هم‌زمان', icon: Users },
  { value: '99.9%', label: 'پایداری سرویس', icon: ShieldCheck },
  { value: 'لحظه‌ای', label: 'گزارش عملیات', icon: BarChart3 },
];

type SessionState = 'loading' | 'anonymous' | 'guest' | 'official';

export default function HomePage() {
  const [sessionState, setSessionState] = useState<SessionState>('loading');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const refreshAuthState = useCallback(() => {
    try {
      const user = getCurrentUser();
      const guestMode =
        typeof window !== 'undefined' &&
        window.localStorage.getItem(GUEST_MODE_STORAGE_KEY) === 'true';

      const officialSession = isUserAuthenticated() && user !== null;

      setCurrentUser(user);

      if (officialSession) {
        setSessionState('official');
        return;
      }

      if (guestMode) {
        setSessionState('guest');
        return;
      }

      setSessionState('anonymous');
    } catch {
      setCurrentUser(null);
      setSessionState('anonymous');
    }
  }, []);

  useEffect(() => {
    refreshAuthState();

    const handleAuthStateChanged = () => {
      refreshAuthState();
    };

    const handleStorageChanged = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === GUEST_MODE_STORAGE_KEY
      ) {
        refreshAuthState();
      }
    };

    const handleWindowFocus = () => {
      refreshAuthState();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshAuthState();
      }
    };

    window.addEventListener('auth-state-changed', handleAuthStateChanged);
    window.addEventListener('storage', handleStorageChanged);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthStateChanged);
      window.removeEventListener('storage', handleStorageChanged);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshAuthState]);

  const currentUserDisplayName = useMemo(() => {
    if (sessionState === 'official') {
      return getUserDisplayName(currentUser);
    }

    if (sessionState === 'guest') {
      return 'کاربر مهمان';
    }

    return '';
  }, [currentUser, sessionState]);

  const isLoggedIn = sessionState === 'official' || sessionState === 'guest';

  return (
    <main
      dir="rtl"
      className="
        relative h-[calc(100dvh-68px)] min-h-0 w-full overflow-hidden
        bg-[var(--background)] text-[var(--foreground)]
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 opacity-40
          bg-[radial-gradient(circle_at_80%_30%,var(--primary),transparent_36%),radial-gradient(circle_at_18%_78%,var(--info),transparent_32%)]
        "
      />

      <div
        className="
          relative mx-auto grid h-full min-h-0 w-full max-w-[1480px]
          grid-cols-1 items-center gap-8 px-6 py-6
          lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:px-10
          xl:gap-14 xl:px-14
          [@media(max-height:760px)]:py-4
        "
      >
        <section className="flex min-h-0 flex-col justify-center">
          <div
            className="
              mb-5 inline-flex w-fit items-center gap-2 rounded-full
              border border-[var(--primary)]/20 bg-[var(--primary-soft)]
              px-4 py-2 text-sm font-medium text-[var(--primary)]
              [@media(max-height:700px)]:mb-3
            "
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            سامانه یکپارچه مدیریت عملیات سازمانی
          </div>

          <h1
            className="
              max-w-4xl text-4xl font-black leading-[1.35] tracking-normal
              text-[var(--foreground)] md:text-5xl xl:text-6xl
              [@media(max-height:700px)]:text-4xl
            "
          >
            مدیریت کسب‌وکار،
            <span className="block text-[var(--primary)]">
              منظم، سریع و یکپارچه
            </span>
          </h1>

          <p
            className="
              mt-5 max-w-3xl text-base leading-8 text-[var(--muted)]
              md:text-lg [@media(max-height:700px)]:mt-3
              [@media(max-height:700px)]:text-base
              [@media(max-height:700px)]:leading-7
            "
          >
            فروش، مشتریان، تیکت‌ها، عملیات و گزارش‌های مدیریتی را در یک محیط
            متمرکز و قابل اتکا مدیریت کنید.
          </p>

          <div
            className="
              mt-7 flex min-h-12 flex-wrap items-center gap-3
              [@media(max-height:700px)]:mt-4
            "
          >
            {sessionState === 'loading' ? (
              <div
                className="
                  inline-flex h-12 items-center justify-center rounded-lg
                  border border-[var(--border)] bg-[var(--surface-muted)]
                  px-6 text-sm font-bold text-[var(--muted)]
                "
              >
                در حال بررسی نشست...
              </div>
            ) : null}

            {sessionState !== 'loading' && isLoggedIn ? (
              <Link
                href="/tickets"
                className="
                  inline-flex h-12 items-center justify-center gap-2 rounded-lg
                  bg-[var(--primary)] px-6 text-sm font-bold
                  text-[var(--primary-foreground)] shadow-lg transition-colors
                  hover:bg-[var(--primary-hover)]
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-[var(--ring)]
                "
              >
                ورود به محیط کار
                <ArrowLeft className="h-4 w-4" />
              </Link>
            ) : null}

            {sessionState === 'anonymous' ? (
              <>
                <Link
                  href="/login"
                  className="
                    inline-flex h-12 items-center justify-center gap-2 rounded-lg
                    bg-[var(--primary)] px-6 text-sm font-bold
                    text-[var(--primary-foreground)] shadow-lg transition-colors
                    hover:bg-[var(--primary-hover)]
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-[var(--ring)]
                  "
                >
                  ورود به سیستم
                  <ArrowLeft className="h-4 w-4" />
                </Link>

                <Link
                  href="/register"
                  className="
                    inline-flex h-12 items-center justify-center rounded-lg
                    border border-[var(--border)] bg-[var(--surface-muted)]
                    px-6 text-sm font-bold text-[var(--foreground)]
                    transition-colors hover:bg-[var(--surface-hover)]
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-[var(--ring)]
                  "
                >
                  ثبت‌نام
                </Link>
              </>
            ) : null}
          </div>

          <div
            className="
              mt-8 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4
              [@media(max-height:760px)]:mt-5
              [@media(max-height:650px)]:hidden
            "
          >
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="
                    flex min-h-24 items-center gap-3 rounded-lg
                    border border-[var(--border)] bg-[var(--surface-muted)]
                    px-4 py-3
                  "
                >
                  <div
                    className="
                      flex h-10 w-10 shrink-0 items-center justify-center
                      rounded-lg bg-[var(--primary-soft)]
                      text-[var(--primary)]
                    "
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xl font-black text-[var(--foreground)]">
                      {stat.value}
                    </div>

                    <div className="mt-1 truncate text-xs text-[var(--muted)]">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside
          className="
            hidden min-h-0 w-full max-w-lg justify-self-end
            border-r border-[var(--border)] pr-8 lg:block
            [@media(max-height:620px)]:hidden
          "
        >
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-12 w-12 shrink-0 items-center justify-center
                  rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]
                "
              >
                <ClipboardList className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-extrabold text-[var(--foreground)]">
                  پنل عملیاتی ERP Pro
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  دسترسی سریع به بخش‌های اصلی سامانه
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.title} className="flex min-w-0 gap-3">
                  <div
                    className="
                      flex h-9 w-9 shrink-0 items-center justify-center
                      rounded-lg bg-[var(--surface-muted)]
                      text-[var(--primary)]
                    "
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[var(--foreground)]">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-7 border-t border-[var(--border)] pt-5">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className={`
                  mt-0.5 h-5 w-5 shrink-0
                  ${
                    isLoggedIn
                      ? 'text-[var(--success)]'
                      : 'text-[var(--muted)]'
                  }
                `}
              />

              <div>
                <p
                  className={`
                    text-sm font-bold
                    ${
                      isLoggedIn
                        ? 'text-[var(--success)]'
                        : 'text-[var(--foreground)]'
                    }
                  `}
                >
                  {sessionState === 'loading'
                    ? 'در حال بررسی وضعیت نشست'
                    : sessionState === 'official'
                      ? `نشست ${currentUserDisplayName} فعال است`
                      : sessionState === 'guest'
                        ? 'نشست کاربر مهمان فعال است'
                        : 'هنوز وارد سیستم نشده‌اید'}
                </p>

                <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                  {sessionState === 'loading'
                    ? 'در حال همگام‌سازی وضعیت ورود شما با سامانه...'
                    : sessionState === 'official'
                      ? 'برای ادامه فعالیت وارد محیط کاری شوید.'
                      : sessionState === 'guest'
                        ? 'شما با سطح دسترسی محدود وارد سامانه شده‌اید.'
                        : 'برای دسترسی کامل وارد حساب شوید یا ثبت‌نام کنید.'}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
