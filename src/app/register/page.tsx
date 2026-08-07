/**
 * @file src/app/register/page.tsx
 * @name RegisterPage
 * @description صفحه ثبت‌نام RTL با تم پویا، نقش پیش‌فرض USER و فعال‌سازی نشست پس از ثبت‌نام.
 */

'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import {
  ApiClientError,
  setAccessToken,
  API_BASE_URL,
} from '@/lib/api-client';

const GUEST_MODE_STORAGE_KEY = 'erp-pro-guest-mode';

type AuthResponse = {
  access_token: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const apiUrl = useMemo(() => `${API_BASE_URL}/auth/register`, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorMessage('نام و نام خانوادگی الزامی است.');
      return;
    }

    if (!cleanEmail) {
      setErrorMessage('ایمیل الزامی است.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let message = 'ثبت‌نام با خطا مواجه شد.';

        if (data?.message) {
          message = Array.isArray(data.message)
            ? data.message.join(' | ')
            : data.message;
        }

        throw new ApiClientError(message, response.status, data);
      }

      const authData = data as AuthResponse;

      if (!authData.access_token) {
        throw new ApiClientError(
          'ثبت‌نام انجام شد، اما توکن ورود از سرور دریافت نشد.',
          response.status,
          data,
        );
      }

      localStorage.removeItem(GUEST_MODE_STORAGE_KEY);
      setAccessToken(authData.access_token);
      window.dispatchEvent(new Event('auth-state-changed'));

      setIsRegistered(true);
      setSuccessMessage(
        'حساب کاربری ساخته شد و نشست شما فعال است. برای ورود به محیط کار از دکمه زیر استفاده کنید.',
      );

      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'خطای غیرمنتظره در ثبت‌نام رخ داد.';

      setErrorMessage(message);
      setIsRegistered(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoToWorkspace() {
    router.push('/tickets');
  }

  return (
    <main
      dir="rtl"
      className="
        min-h-[calc(100dvh-68px)] overflow-hidden
        bg-[var(--background)] text-[var(--foreground)]
      "
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute right-[-10rem] top-[-10rem] h-96 w-96 rounded-full bg-[var(--primary-soft)] blur-3xl" />
        <div className="absolute bottom-[-12rem] left-[-8rem] h-96 w-96 rounded-full bg-[var(--info-soft)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100dvh-68px)] w-full max-w-7xl items-center px-6 py-8 lg:px-10">
        <section className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="hidden flex-col justify-center lg:flex">
            <div
              className="
                inline-flex w-fit items-center gap-2 rounded-full
                border border-[var(--primary)]/20
                bg-[var(--primary-soft)] px-4 py-2
                text-sm text-[var(--primary)]
              "
            >
              <ShieldCheck className="h-4 w-4" />
              ساخت حساب امن
            </div>

            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-tight tracking-tight">
              ساخت حساب جدید
              <br />
              برای ورود به ERP Pro
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              حساب کاربری خود را ایجاد کنید تا پس از تأیید دسترسی، به ماژول‌های
              عملیاتی، تیکت‌ها، CRM، فروش و گزارش‌ها دسترسی داشته باشید.
            </p>

            <div className="mt-7 grid max-w-xl grid-cols-2 gap-4">
              <InfoCard title="JWT Auth" description="ورود امن با توکن" />
              <InfoCard title="Workspace" description="دسترسی به محیط کاری" />
              <InfoCard title="CRM" description="مدیریت مشتریان" />
              <InfoCard title="Tickets" description="مدیریت درخواست‌ها" />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div
              className="
                w-full max-w-md rounded-[2rem]
                border border-[var(--border)] bg-[var(--surface)]
                p-6 shadow-[0_20px_60px_var(--shadow-color)]
              "
            >
              {isRegistered ? (
                <RegisteredPanel onWorkspace={handleGoToWorkspace} />
              ) : (
                <>
                  <div className="mb-5">
                    <div
                      className="
                        mb-4 flex h-12 w-12 items-center justify-center
                        rounded-2xl bg-[var(--primary-soft)]
                        text-[var(--primary)]
                      "
                    >
                      <UserRound className="h-5 w-5" />
                    </div>

                    <h2 className="text-2xl font-black">
                      ایجاد حساب کاربری
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      اطلاعات خود را وارد کنید تا حساب شما ساخته شود.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">
                        نام و نام خانوادگی
                      </span>

                      <div
                        className="
                          flex h-12 items-center gap-3 rounded-2xl
                          border border-[var(--border)]
                          bg-[var(--background)] px-4
                          transition focus-within:border-[var(--primary)]
                        "
                      >
                        <UserRound className="h-4 w-4 text-[var(--muted)]" />

                        <input
                          type="text"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="مثال: حسین مهزادی‌منش"
                          className="
                            h-full w-full bg-transparent text-sm
                            outline-none placeholder:text-[var(--muted)]
                          "
                          autoComplete="name"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">
                        ایمیل
                      </span>

                      <div
                        className="
                          flex h-12 items-center gap-3 rounded-2xl
                          border border-[var(--border)]
                          bg-[var(--background)] px-4
                          transition focus-within:border-[var(--primary)]
                        "
                      >
                        <Mail className="h-4 w-4 text-[var(--muted)]" />

                        <input
                          type="email"
                          dir="ltr"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="user@example.com"
                          className="
                            h-full w-full bg-transparent text-sm
                            outline-none placeholder:text-[var(--muted)]
                          "
                          autoComplete="email"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">
                        رمز عبور
                      </span>

                      <div
                        className="
                          flex h-12 items-center gap-3 rounded-2xl
                          border border-[var(--border)]
                          bg-[var(--background)] px-4
                          transition focus-within:border-[var(--primary)]
                        "
                      >
                        <LockKeyhole className="h-4 w-4 text-[var(--muted)]" />

                        <input
                          type={showPassword ? 'text' : 'password'}
                          dir="ltr"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="••••••••"
                          className="
                            h-full w-full bg-transparent text-sm
                            outline-none placeholder:text-[var(--muted)]
                          "
                          autoComplete="new-password"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((previous) => !previous)}
                          className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
                          aria-label={
                            showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </label>

                    <div
                      className="
                        rounded-2xl border border-[var(--info)]/20
                        bg-[var(--info-soft)] px-4 py-3
                        text-sm leading-7 text-[var(--info)]
                      "
                    >
                      نقش اولیه حساب توسط سیستم تعیین می‌شود. دسترسی‌های
                      مدیریتی و پشتیبانی فقط توسط مدیر سیستم اختصاص داده می‌شوند.
                    </div>

                    {errorMessage ? (
                      <div
                        className="
                          rounded-2xl border border-[var(--danger)]/20
                          bg-[var(--danger-soft)] px-4 py-3
                          text-sm leading-7 text-[var(--danger)]
                        "
                      >
                        {errorMessage}
                      </div>
                    ) : null}

                    {successMessage ? (
                      <div
                        className="
                          rounded-2xl border border-[var(--success)]/20
                          bg-[var(--success-soft)] px-4 py-3
                          text-sm leading-7 text-[var(--success)]
                        "
                      >
                        {successMessage}
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="
                        inline-flex h-12 w-full items-center justify-center
                        gap-2 rounded-2xl bg-[var(--primary)] px-5
                        text-sm font-bold text-[var(--primary-foreground)]
                        shadow-lg shadow-[var(--primary)]/20 transition
                        hover:opacity-90 disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {isSubmitting ? 'در حال ثبت‌نام...' : 'تکمیل ثبت‌نام'}
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  </form>

                  <div className="mt-4 text-center text-sm text-[var(--muted)]">
                    قبلاً ثبت‌نام کرده‌اید؟{' '}
                    <Link
                      href="/login"
                      className="font-semibold text-[var(--primary)] transition hover:opacity-80"
                    >
                      ورود به سیستم
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function RegisteredPanel({ onWorkspace }: { onWorkspace: () => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div
          className="
            flex h-12 w-12 items-center justify-center
            rounded-2xl bg-[var(--success-soft)] text-[var(--success)]
          "
        >
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold">
            ثبت‌نام با موفقیت انجام شد
          </h2>

          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            نشست شما فعال است. انتقال به محیط کاری فقط با انتخاب خودتان انجام
            می‌شود.
          </p>
        </div>
      </div>

      <div
        className="
          rounded-2xl border border-[var(--border)]
          bg-[var(--background)] p-4
        "
      >
        <div className="text-sm text-[var(--muted)]">وضعیت</div>

        <div className="mt-2 text-base font-bold">حساب فعال شد</div>

        <div className="mt-1 text-sm text-[var(--muted)]">
          اکنون می‌توانید وارد محیط کار شوید.
        </div>
      </div>

      <button
        type="button"
        onClick={onWorkspace}
        className="
          inline-flex h-12 w-full items-center justify-center gap-2
          rounded-2xl bg-[var(--primary)] px-5 text-sm font-bold
          text-[var(--primary-foreground)] shadow-lg
          shadow-[var(--primary)]/20 transition hover:opacity-90
        "
      >
        ورود به محیط کار
        <ArrowLeft className="h-4 w-4" />
      </button>

      <Link
        href="/login"
        className="
          inline-flex h-12 w-full items-center justify-center rounded-2xl
          border border-[var(--border)] bg-[var(--surface-muted)]
          px-5 text-sm font-semibold text-[var(--foreground)]
          transition hover:bg-[var(--surface-hover)]
        "
      >
        رفتن به صفحه ورود
      </Link>
    </div>
  );
}

type InfoCardProps = {
  title: string;
  description: string;
};

function InfoCard({ title, description }: InfoCardProps) {
  return (
    <div
      className="
        rounded-3xl border border-[var(--border)]
        bg-[var(--surface)] p-4
      "
    >
      <div className="text-base font-black">{title}</div>

      <div className="mt-2 text-sm leading-6 text-[var(--muted)]">
        {description}
      </div>
    </div>
  );
}
