/**
 * @file src/app/login/page.tsx
 * @name LoginPage
 * @description صفحه ورود، ثبت‌نام، ورود مهمان و همگام‌سازی فوری وضعیت نشست با هدر در همان تب.
 */

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import {
  getCurrentUser,
  getUserDisplayName,
  isUserAuthenticated,
  login,
  logout,
  type AuthUser,
} from '@/lib/auth-api';

const GUEST_MODE_STORAGE_KEY = 'erp-pro-guest-mode';

type LoginFormState = {
  email: string;
  password: string;
};

type LoginPageStatus = 'checking' | 'ready' | 'authenticated';

export default function LoginPage() {
  const router = useRouter();

  const [pageStatus, setPageStatus] =
    useState<LoginPageStatus>('checking');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState<LoginFormState>({
    email: '',
    password: '',
  });

  useEffect(() => {
    refreshAuthState();

    function handleAuthStateChanged() {
      refreshAuthState();
    }

    window.addEventListener('storage', handleAuthStateChanged);
    window.addEventListener('auth-state-changed', handleAuthStateChanged);

    return () => {
      window.removeEventListener('storage', handleAuthStateChanged);
      window.removeEventListener('auth-state-changed', handleAuthStateChanged);
    };
  }, []);

  function notifyAuthStateChanged() {
    window.dispatchEvent(new Event('auth-state-changed'));
  }

  function refreshAuthState() {
    const authenticated = isUserAuthenticated();
    const user = getCurrentUser();

    if (authenticated && user) {
      localStorage.removeItem(GUEST_MODE_STORAGE_KEY);
      setCurrentUser(user);
      setPageStatus('authenticated');
      return;
    }

    setCurrentUser(null);
    setPageStatus('ready');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!email || !password) {
      setErrorMessage('ایمیل و رمز عبور الزامی است.');
      return;
    }

    setIsSubmitting(true);

    try {
      localStorage.removeItem(GUEST_MODE_STORAGE_KEY);
      await login({ email, password });

      const user = getCurrentUser();

      if (!user || !isUserAuthenticated()) {
        setErrorMessage(
          'ورود انجام شد، اما اطلاعات کاربر از توکن قابل خواندن نیست.',
        );
        setPageStatus('ready');
        setCurrentUser(null);
        return;
      }

      setCurrentUser(user);
      setPageStatus('authenticated');
      setForm({ email: '', password: '' });

      // هدر و سایر کامپوننت‌های همان تب را فوراً از ورود موفق مطلع می‌کند.
      notifyAuthStateChanged();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'ورود انجام نشد. لطفاً دوباره تلاش کنید.';

      setErrorMessage(message);
      setPageStatus('ready');
      setCurrentUser(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGuestLogin() {
    setIsGuestLoading(true);
    setErrorMessage(null);

    localStorage.setItem(GUEST_MODE_STORAGE_KEY, 'true');
    notifyAuthStateChanged();

    router.push('/');
  }

  function handleGoToWorkspace() {
    router.push('/tickets');
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    setErrorMessage(null);

    try {
      logout();
      localStorage.removeItem(GUEST_MODE_STORAGE_KEY);
      setCurrentUser(null);
      setPageStatus('ready');
      setForm({ email: '', password: '' });

      // هدر و تمام بخش‌های وابسته، خروج را در همان تب دریافت می‌کنند.
      notifyAuthStateChanged();
    } finally {
      setIsLoggingOut(false);
    }
  }

  const displayName = getSafeDisplayName(currentUser);
  const displayEmail = currentUser?.email || 'ایمیل ثبت نشده';
  const displayRole = normalizeRole(currentUser?.role);

  if (pageStatus === 'checking') {
    return (
      <main
        dir="rtl"
        className="
          flex h-[calc(100dvh-68px)] items-center justify-center
          overflow-hidden bg-[var(--background)] px-6 text-[var(--foreground)]
        "
      >
        <div
          className="
            w-full max-w-md rounded-3xl border border-[var(--border)]
            bg-[var(--surface)] p-8 text-center
            shadow-[0_20px_60px_var(--shadow-color)]
          "
        >
          <div
            className="
              mx-auto mb-5 h-10 w-10 animate-spin rounded-full
              border-4 border-[var(--primary)]/20 border-t-[var(--primary)]
            "
          />

          <h1 className="text-xl font-extrabold">
            در حال بررسی وضعیت ورود
          </h1>

          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            لطفاً چند لحظه صبر کنید...
          </p>
        </div>
      </main>
    );
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
              ورود امن به ERP Pro
            </div>

            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-tight tracking-tight">
              ورود امن به
              <br />
              محیط کاری ERP Pro
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              برای دسترسی به تیکت‌ها، CRM، فروش، انبار و سایر ماژول‌های عملیاتی،
              با حساب کاربری خود وارد شوید.
            </p>

            <div className="mt-7 grid max-w-xl grid-cols-2 gap-4">
              <InfoCard title="JWT Auth" description="احراز هویت مبتنی بر توکن" />
              <InfoCard title="Workspace" description="دسترسی به محیط عملیاتی" />
              <InfoCard title="CRM" description="مدیریت مشتریان و ارتباطات" />
              <InfoCard title="Tickets" description="مدیریت کامل تیکت‌ها" />
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
              {pageStatus === 'authenticated' ? (
                <AuthenticatedPanel
                  displayName={displayName}
                  displayEmail={displayEmail}
                  displayRole={displayRole}
                  isLoggingOut={isLoggingOut}
                  onWorkspace={handleGoToWorkspace}
                  onLogout={handleLogout}
                />
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
                      <LogIn className="h-5 w-5" />
                    </div>

                    <h2 className="text-2xl font-black">ورود به حساب</h2>

                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      برای دسترسی به امکانات عملیاتی، وارد حساب خود شوید.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
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
                          value={form.email}
                          onChange={(event) =>
                            setForm((previous) => ({
                              ...previous,
                              email: event.target.value,
                            }))
                          }
                          placeholder="name@example.com"
                          className="
                            h-full w-full bg-transparent text-sm
                            outline-none placeholder:text-[var(--muted)]
                          "
                          dir="ltr"
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
                          value={form.password}
                          onChange={(event) =>
                            setForm((previous) => ({
                              ...previous,
                              password: event.target.value,
                            }))
                          }
                          placeholder="••••••••"
                          className="
                            h-full w-full bg-transparent text-sm
                            outline-none placeholder:text-[var(--muted)]
                          "
                          dir="ltr"
                          autoComplete="current-password"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((previous) => !previous)
                          }
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
                      {isSubmitting ? 'در حال ورود...' : 'ورود به سیستم'}
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={isGuestLoading}
                    className="
                      mt-3 inline-flex h-12 w-full items-center
                      justify-center gap-2 rounded-2xl
                      border border-[var(--border)]
                      bg-[var(--surface-muted)] px-5
                      text-sm font-semibold text-[var(--foreground)]
                      transition hover:bg-[var(--surface-hover)]
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                  >
                    <UserRound className="h-4 w-4" />
                    {isGuestLoading
                      ? 'در حال ورود به حالت مهمان...'
                      : 'ورود به‌عنوان مهمان'}
                  </button>

                  <p className="mt-3 text-center text-xs leading-6 text-[var(--muted)]">
                    مهمان فقط امکان مشاهده و جست‌وجو دارد و نمی‌تواند اطلاعاتی
                    ثبت یا ویرایش کند.
                  </p>

                  <div className="mt-4 text-center text-sm text-[var(--muted)]">
                    حساب کاربری ندارید؟{' '}
                    <Link
                      href="/register"
                      className="font-semibold text-[var(--primary)] transition hover:opacity-80"
                    >
                      ثبت‌نام کنید
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

function AuthenticatedPanel({
  displayName,
  displayEmail,
  displayRole,
  isLoggingOut,
  onWorkspace,
  onLogout,
}: {
  displayName: string;
  displayEmail: string;
  displayRole: string;
  isLoggingOut: boolean;
  onWorkspace: () => void;
  onLogout: () => Promise<void>;
}) {
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
          <h2 className="text-xl font-extrabold">ورود با موفقیت انجام شد</h2>

          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            نشست کاربری شما فعال است. ورود به محیط کاری با انتخاب شما انجام می‌شود.
          </p>
        </div>
      </div>

      <div
        className="
          rounded-2xl border border-[var(--border)]
          bg-[var(--background)] p-4
        "
      >
        <div className="text-sm text-[var(--muted)]">کاربر فعلی</div>
        <div className="mt-2 text-base font-bold">{displayName}</div>
        <div className="mt-1 text-sm text-[var(--muted)]">{displayEmail}</div>

        <div
          className="
            mt-3 inline-flex rounded-full
            border border-[var(--primary)]/20
            bg-[var(--primary-soft)] px-3 py-1
            text-xs text-[var(--primary)]
          "
        >
          {displayRole}
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

      <button
        type="button"
        onClick={() => void onLogout()}
        disabled={isLoggingOut}
        className="
          inline-flex h-12 w-full items-center justify-center gap-2
          rounded-2xl border border-[var(--danger)]/20
          bg-[var(--danger-soft)] px-5 text-sm font-semibold
          text-[var(--danger)] transition hover:opacity-90
          disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        <LogOut className="h-4 w-4" />
        {isLoggingOut ? 'در حال خروج...' : 'خروج از حساب'}
      </button>
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

function getSafeDisplayName(user: AuthUser | null): string {
  try {
    return getUserDisplayName(user);
  } catch {
    if (user?.email) {
      return user.email.includes('@') ? user.email.split('@')[0] : user.email;
    }

    return 'کاربر سیستم';
  }
}

function normalizeRole(role: AuthUser['role'] | string | undefined): string {
  if (role === 'ADMIN') return 'مدیر سیستم';
  if (role === 'SUPPORT') return 'پشتیبانی فنی';
  if (role === 'USER') return 'کاربر سیستم';

  return 'کاربر سیستم';
}
