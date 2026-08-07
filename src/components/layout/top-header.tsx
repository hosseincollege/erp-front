/**
 * @file src/components/layout/top-header.tsx
 * @name top-header.tsx
 * @description اصلاح تشخیص نشست مهمان، سینک با login page، و نمایش صحیح وضعیت کاربر در هدر.
 */

'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  HelpCircle,
  History,
  LogOut,
  Moon,
  Settings,
  Sun,
  SunMoon,
  UserRound,
} from 'lucide-react';

import { ModuleSwitcher } from './module-switcher';
import { useTheme } from '@/components/theme-provider';
import {
  getCurrentUser,
  isUserAuthenticated,
  logout,
  type AuthUser,
} from '@/lib/auth-api';

const GUEST_MODE_STORAGE_KEY = 'erp-pro-guest-mode';

export function TopHeader() {
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [accountOpen, setAccountOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const accountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    refreshAuthState();

    function handleAuthStateChanged() {
      refreshAuthState();
    }

    window.addEventListener('auth-state-changed', handleAuthStateChanged);
    window.addEventListener('storage', handleAuthStateChanged);

    return () => {
      window.removeEventListener(
        'auth-state-changed',
        handleAuthStateChanged,
      );
      window.removeEventListener('storage', handleAuthStateChanged);
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        accountRef.current &&
        event.target instanceof Node &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAccountOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function isGuestModeEnabled(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return localStorage.getItem(GUEST_MODE_STORAGE_KEY) === 'true';
  }

  function refreshAuthState() {
    const user = getCurrentUser();
    const guestModeEnabled = isGuestModeEnabled();
    const normalizedRole = normalizeRoleValue(user?.role);

    /*
     * نشست مهمان باید حتی بدون user واقعی هم معتبر شناخته شود.
     * اگر login page مهمان را فعال کرده باشد، localStorage این وضعیت را نگه می‌دارد.
     */
    const isGuestSession =
      guestModeEnabled || (user !== null && normalizedRole === 'GUEST');

    const authenticated =
      user !== null ? isUserAuthenticated() || isGuestSession : isGuestSession;

    setIsAuthenticated(authenticated);
    setCurrentUser(user);

    /*
     * اگر نشست رسمی برقرار شد، حالت مهمان باید پاک شود
     * تا هدر بین Guest و User تعارض نداشته باشد.
     */
    if (authenticated && user !== null && normalizedRole !== 'GUEST') {
      localStorage.removeItem(GUEST_MODE_STORAGE_KEY);
    }
  }

  const isGuestUser = useMemo(() => {
    return (
      isAuthenticated &&
      (isGuestModeEnabled() || normalizeRoleValue(currentUser?.role) === 'GUEST')
    );
  }, [isAuthenticated, currentUser]);

  const themeMeta = useMemo(() => {
    if (theme === 'light') {
      return {
        label: 'حالت روشن؛ تغییر به حالت تیره',
        nextTheme: 'dark' as const,
        icon: Sun,
      };
    }

    if (theme === 'dark') {
      return {
        label: 'حالت تیره؛ تغییر به حالت خودکار',
        nextTheme: 'system' as const,
        icon: Moon,
      };
    }

    return {
      label:
        resolvedTheme === 'dark'
          ? 'حالت خودکار؛ اکنون تیره است'
          : 'حالت خودکار؛ اکنون روشن است',
      nextTheme: 'light' as const,
      icon: SunMoon,
    };
  }, [theme, resolvedTheme]);

  const ThemeIcon = themeMeta.icon;

  const displayName = getHeaderDisplayName(
    currentUser,
    isAuthenticated,
    isGuestUser,
  );

  const displayRole = getHeaderRole(
    currentUser,
    isAuthenticated,
    isGuestUser,
  );

  const displayStatus = getHeaderStatus(isAuthenticated, isGuestUser);

  const userIdentifier = isAuthenticated
    ? currentUser?.email || 'حساب مهمان'
    : 'برای ادامه وارد شوید';

  async function handleLogout() {
    setIsLoggingOut(true);
    setAccountOpen(false);

    try {
      logout();
      localStorage.removeItem(GUEST_MODE_STORAGE_KEY);

      setIsAuthenticated(false);
      setCurrentUser(null);

      window.dispatchEvent(new Event('auth-state-changed'));
      router.replace('/');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header
      dir="rtl"
      className="
        fixed inset-x-0 top-0 z-50 h-14
        border-b border-[var(--border)]
        bg-[var(--surface)]/95
        text-[var(--foreground)]
        shadow-sm shadow-[var(--shadow-color)]/5
        backdrop-blur-xl
      "
    >
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="
              flex items-center gap-3 rounded-2xl px-2 py-1.5
              transition-colors hover:bg-[var(--surface-hover)]
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[var(--ring)]
            "
          >
            <div
              className="
                flex h-9 w-9 items-center justify-center rounded-xl
                bg-[var(--primary)] font-bold
                text-[var(--primary-foreground)]
                shadow-lg shadow-[var(--primary)]/20
              "
            >
              ERP
            </div>

            <div className="hidden sm:block">
              <div className="text-base font-bold text-[var(--foreground)]">
                ERP Pro
              </div>

              <div className="text-xs text-[var(--muted)]">
                سیستم یکپارچه عملیات
              </div>
            </div>
          </Link>

          <ModuleSwitcher />
        </div>

        <div className="flex items-center gap-2">
          <HeaderIconButton
            href="/help"
            label="راهنما"
            icon={<HelpCircle className="h-4 w-4" />}
          />

          <HeaderIconButton
            href="/history"
            label="سوابق"
            icon={<History className="h-4 w-4" />}
          />

          <HeaderIconButton
            href="/notifications"
            label="اعلان‌ها"
            icon={<Bell className="h-4 w-4" />}
          />

          <HeaderIconButton
            href="/settings"
            label="تنظیمات"
            icon={<Settings className="h-4 w-4" />}
          />

          <button
            type="button"
            onClick={() => setTheme(themeMeta.nextTheme)}
            aria-label={themeMeta.label}
            title={themeMeta.label}
            className="
              inline-flex h-10 w-10 items-center justify-center rounded-xl
              border border-[var(--border)]
              bg-[var(--surface-muted)]
              text-[var(--muted)]
              transition-colors hover:bg-[var(--surface-hover)]
              hover:text-[var(--foreground)]
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[var(--ring)]
            "
          >
            {isMounted ? (
              <ThemeIcon className="h-4 w-4" />
            ) : (
              <SunMoon className="h-4 w-4" />
            )}
          </button>

          <div className="relative" ref={accountRef}>
            <button
              type="button"
              aria-label="حساب کاربری"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((previous) => !previous)}
              className="
                flex items-center gap-3 rounded-2xl
                border border-[var(--border)]
                bg-[var(--surface-muted)]
                px-3 py-2 text-right transition-colors
                hover:bg-[var(--surface-hover)]
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-[var(--ring)]
              "
            >
              <div className="hidden text-right md:block">
                <div className="text-sm font-bold text-[var(--foreground)]">
                  {displayName}
                </div>

                <div className="mt-0.5 text-xs text-[var(--muted)]">
                  {displayRole}
                </div>
              </div>

              <div
                className="
                  flex h-9 w-9 items-center justify-center rounded-full
                  bg-[var(--primary-soft)] text-[var(--primary)]
                "
              >
                {isAuthenticated ? (
                  <CircleUserRound className="h-5 w-5" />
                ) : (
                  <UserRound className="h-5 w-5" />
                )}
              </div>

              <ChevronDown
                className={`
                  h-4 w-4 text-[var(--muted)] transition-transform
                  ${accountOpen ? 'rotate-180' : ''}
                `}
              />
            </button>

            {accountOpen ? (
              <div
                className="
                  absolute left-0 mt-3 w-80 overflow-hidden rounded-3xl
                  border border-[var(--border)] bg-[var(--surface)]
                  text-[var(--foreground)]
                  shadow-2xl shadow-[var(--shadow-color)]/20
                "
              >
                <div
                  className="
                    border-b border-[var(--border)]
                    bg-[var(--surface-muted)] px-5 py-4
                  "
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="
                        flex h-12 w-12 items-center justify-center rounded-2xl
                        bg-[var(--primary-soft)] text-[var(--primary)]
                      "
                    >
                      {isAuthenticated ? (
                        <CircleUserRound className="h-6 w-6" />
                      ) : (
                        <UserRound className="h-6 w-6" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold">
                        {displayName}
                      </div>

                      <div className="mt-1 truncate text-xs text-[var(--muted)]">
                        {userIdentifier}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={`
                            inline-flex rounded-full px-2.5 py-1 text-xs
                            ${
                              isAuthenticated
                                ? isGuestUser
                                  ? 'border border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--warning)]'
                                  : 'border border-[var(--success)]/20 bg-[var(--success-soft)] text-[var(--success)]'
                                : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]'
                            }
                          `}
                        >
                          {displayStatus}
                        </span>

                        <span
                          className="
                            inline-flex rounded-full
                            border border-[var(--primary)]/20
                            bg-[var(--primary-soft)]
                            px-2.5 py-1 text-xs text-[var(--primary)]
                          "
                        >
                          {displayRole}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  {isAuthenticated ? (
                    <>
                      <MenuLink
                        href="/profile"
                        label="پروفایل"
                        icon={<CircleUserRound className="h-4 w-4" />}
                        onNavigate={() => setAccountOpen(false)}
                      />

                      <MenuLink
                        href="/settings"
                        label="تنظیمات حساب"
                        icon={<Settings className="h-4 w-4" />}
                        onNavigate={() => setAccountOpen(false)}
                      />

                      <MenuLink
                        href="/help"
                        label="راهنما و پشتیبانی"
                        icon={<HelpCircle className="h-4 w-4" />}
                        onNavigate={() => setAccountOpen(false)}
                      />

                      <div className="my-2 border-t border-[var(--border)]" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="
                          flex w-full items-center gap-3 rounded-2xl px-4 py-3
                          text-sm text-[var(--danger)]
                          transition-colors hover:bg-[var(--danger-soft)]
                          disabled:cursor-not-allowed disabled:opacity-60
                        "
                      >
                        <LogOut className="h-4 w-4" />

                        <span>
                          {isLoggingOut ? 'در حال خروج...' : 'خروج از حساب'}
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      <MenuLink
                        href="/login"
                        label="ورود به سیستم"
                        icon={<CircleUserRound className="h-4 w-4" />}
                        onNavigate={() => setAccountOpen(false)}
                      />

                      <MenuLink
                        href="/register"
                        label="ایجاد حساب کاربری"
                        icon={<UserRound className="h-4 w-4" />}
                        onNavigate={() => setAccountOpen(false)}
                      />
                    </>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

type HeaderIconButtonProps = {
  href: string;
  label: string;
  icon: ReactNode;
};

function HeaderIconButton({
  href,
  label,
  icon,
}: HeaderIconButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="
        inline-flex h-10 w-10 items-center justify-center rounded-xl
        border border-[var(--border)]
        bg-[var(--surface-muted)]
        text-[var(--muted)]
        transition-colors hover:bg-[var(--surface-hover)]
        hover:text-[var(--foreground)]
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-[var(--ring)]
      "
    >
      {icon}
    </Link>
  );
}

type MenuLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  onNavigate?: () => void;
};

function MenuLink({
  href,
  label,
  icon,
  onNavigate,
}: MenuLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="
        flex items-center gap-3 rounded-2xl px-4 py-3 text-sm
        text-[var(--foreground)] transition-colors
        hover:bg-[var(--surface-hover)]
      "
    >
      <span className="text-[var(--muted)]">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function getUserDisplayName(user: AuthUser): string {
  const userData = user as AuthUser & {
    name?: string | null;
    fullName?: string | null;
    username?: string | null;
    displayName?: string | null;
  };

  return (
    userData.displayName?.trim() ||
    userData.fullName?.trim() ||
    userData.name?.trim() ||
    userData.username?.trim() ||
    ''
  );
}

function getHeaderDisplayName(
  user: AuthUser | null,
  authenticated: boolean,
  guestUser: boolean,
): string {
  if (!authenticated) {
    return 'ورود به سیستم';
  }

  if (guestUser) {
    return 'کاربر مهمان';
  }

  if (user) {
    const userName = getUserDisplayName(user);

    if (userName && userName !== 'کاربر مهمان') {
      return userName;
    }

    if (user.email) {
      return user.email.split('@')[0] || 'کاربر سیستم';
    }
  }

  return 'کاربر سیستم';
}

function getHeaderRole(
  user: AuthUser | null,
  authenticated: boolean,
  guestUser: boolean,
): string {
  if (!authenticated) {
    return 'وارد نشده';
  }

  if (guestUser) {
    return 'مهمان';
  }

  return normalizeRole(user?.role);
}

function getHeaderStatus(
  authenticated: boolean,
  guestUser: boolean,
): string {
  if (!authenticated) {
    return 'وارد نشده';
  }

  if (guestUser) {
    return 'مهمان';
  }

  return 'آنلاین';
}

function normalizeRole(role: AuthUser['role'] | string | undefined): string {
  switch (normalizeRoleValue(role)) {
    case 'ADMIN':
      return 'مدیر سیستم';
    case 'MANAGER':
      return 'مدیر واحد';
    case 'SUPPORT':
      return 'پشتیبانی فنی';
    case 'TECHNICIAN':
      return 'کارشناس فنی';
    case 'CUSTOMER':
      return 'مشتری';
    case 'GUEST':
      return 'مهمان';
    case 'USER':
      return 'کاربر سیستم';
    default:
      return 'کاربر سیستم';
  }
}

function normalizeRoleValue(
  role: AuthUser['role'] | string | undefined,
): string {
  return String(role || '')
    .trim()
    .toUpperCase();
}
