/**
 * @file src/app/register/page.tsx
 * @description صفحه ثبت‌نام اولیه با هدر عمومی، سازگاری کامل تم لایت/دارک و رفع تداخل Autofill.
 *
 * رفتار:
 * - فقط وقتی هیچ کاربری در سیستم وجود نداشته باشد، فرم ثبت‌نام نمایش داده می‌شود.
 * - اگر سیستم قبلاً راه‌اندازی شده باشد، کاربر به صفحه ورود هدایت می‌شود.
 *
 * نکته:
 * - این کنترل فقط در UI است.
 * - بک‌اند هم باید پس از ایجاد اولین کاربر، ثبت‌نام را مسدود کند.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth-api';
import { ApiClientError } from '@/lib/api-client';
import { PublicHeader } from '@/components/layout/public-header';

type SetupStatusResponse = {
  hasUsers: boolean;
};

type SetupState = 'checking' | 'allowed' | 'blocked';

async function getSetupStatus(): Promise<SetupStatusResponse> {
  const response = await fetch('/api/setup/status', {
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

export default function RegisterPage() {
  const router = useRouter();
  const [setupState, setSetupState] = useState<SetupState>('checking');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const verifyInitialSetup = async () => {
      try {
        const data = await getSetupStatus();

        if (data.hasUsers) {
          setSetupState('blocked');
          router.replace('/login');
          return;
        }

        setSetupState('allowed');
      } catch (err) {
        console.error('Setup status error:', err);
        setSetupState('blocked');
        setError('وضعیت راه‌اندازی سیستم قابل بررسی نیست. لطفاً اتصال سرور را بررسی کنید.');
      }
    };

    void verifyInitialSetup();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(formData);

      /**
       * اگر بک‌اند بعد از ثبت‌نام سشن می‌سازد می‌توانی اینجا
       * router.replace('/') بزنی؛ ولی حالت امن و عمومی‌تر:
       */
      router.replace('/login');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('خطایی در برقراری ارتباط با سرور رخ داد.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px var(--surface) inset !important;
          -webkit-text-fill-color: var(--foreground) !important;
          caret-color: var(--foreground) !important;
          transition: background-color 9999s ease-out 0s;
        }
      `}</style>

      <PublicHeader />

      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4">
        {setupState === 'checking' ? (
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
            <div className="space-y-5">
              <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-11 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-11 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-11 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ) : null}

        {setupState === 'allowed' ? (
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-[var(--foreground)]">
                راه‌اندازی اولیه سیستم
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                حساب مدیر اصلی ERP Pro را ایجاد کنید
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                  {error}
                </div>
              ) : null}

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-[var(--foreground)]">
                    نام و نام خانوادگی مدیر
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    autoComplete="name"
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--foreground)] outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="نام کامل"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[var(--foreground)]">
                    ایمیل مدیر
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    autoComplete="email"
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--foreground)] outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="example@domain.com"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[var(--foreground)]">
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={8}
                    value={formData.password}
                    autoComplete="new-password"
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--foreground)] outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="حداقل ۸ کاراکتر"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'در حال ساخت حساب مدیر...' : 'ساخت مدیر اصلی و تکمیل راه‌اندازی'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                پس از این مرحله، ایجاد کاربران جدید فقط از داخل پنل مدیریت انجام می‌شود.
              </p>
            </div>
          </div>
        ) : null}

        {setupState === 'blocked' ? (
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              ثبت‌نام عمومی غیرفعال است
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              این سیستم قبلاً راه‌اندازی شده است. برای ورود از صفحه ورود استفاده کنید.
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
