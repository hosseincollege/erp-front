/**
 * @file src/components/layout/top-header.tsx
 * @project ERP Pro - Front-end
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, AuthUser } from '@/lib/auth-api';

import {
  Bell,
  ChevronDown,
  ChevronLeft,
  Lock,
  LogOut,
  Monitor,
  Moon,
  ShieldCheck,
  Sun,
  Unlock,
  User,
} from 'lucide-react';

type ThemeMode = 'system' | 'light' | 'dark';

interface TopHeaderProps {
  isCollapsed?: boolean;
  isSidebarLocked?: boolean;
  onToggleSidebar?: () => void;
  onToggleSidebarLock?: () => void;
}

export function TopHeader({
  isCollapsed = true,
  isSidebarLocked = false,
  onToggleSidebar,
  onToggleSidebarLock,
}: TopHeaderProps) {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('system');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const applyTheme = (mode: ThemeMode) => {
    const isDark =
      mode === 'dark' ||
      (mode === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', isDark);

    document.documentElement.style.colorScheme = isDark
      ? 'dark'
      : 'light';
  };

  /*
   * دریافت اطلاعات کاربر و اعمال تم ذخیره‌شده
   */
  useEffect(() => {
    setUser(getCurrentUser());

    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener('auth:logout', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    const savedTheme =
      (localStorage.getItem('erp-theme') as ThemeMode | null) ||
      'system';

    setTheme(savedTheme);
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    const handleSystemThemeChange = () => {
      const currentTheme =
        (localStorage.getItem('erp-theme') as ThemeMode | null) ||
        'system';

      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener?.(
      'change',
      handleSystemThemeChange
    );

    return () => {
      window.removeEventListener(
        'auth:logout',
        handleAuthChange
      );

      window.removeEventListener(
        'storage',
        handleAuthChange
      );

      mediaQuery.removeEventListener?.(
        'change',
        handleSystemThemeChange
      );
    };
  }, []);

  /*
   * فقط منوی پروفایل با کلیک بیرون بسته می‌شود.
   *
   * مهم:
   * عمداً در TopHeader هیچ منطق کلیک بیرون برای Sidebar وجود ندارد.
   * مسئولیت باز/بسته شدن با کلیک بیرون فقط با sidebar.tsx است.
   */
  useEffect(() => {
    const handleProfileMenuClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleProfileMenuClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleProfileMenuClickOutside
      );
    };
  }, []);

  const handleLogout = async () => {
    await logout();

    setIsMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  /*
   * گردش بین تم‌ها:
   * system → light → dark → system
   */
  const cycleTheme = () => {
    const nextTheme: ThemeMode =
      theme === 'system'
        ? 'light'
        : theme === 'light'
          ? 'dark'
          : 'system';

    setTheme(nextTheme);
    localStorage.setItem('erp-theme', nextTheme);
    applyTheme(nextTheme);
  };

  /*
   * منطق دکمه‌ی یکپارچه‌ی سایدبار:
   *
   * 1) بسته:
   *    باز کردن سایدبار
   *
   * 2) باز و آزاد:
   *    قفل کردن سایدبار
   *
   * 3) باز و قفل:
   *    باز کردن قفل سایدبار، بدون بستن آن
   */
  const handleSidebarButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    /*
     * حالت سوم: سایدبار باز و قفل است.
     * با کلیک فقط قفل باز می‌شود؛ سایدبار باز می‌ماند.
     */
    if (!isCollapsed && isSidebarLocked) {
      onToggleSidebarLock?.();
      return;
    }

    /*
     * حالت اول: سایدبار بسته است.
     * با کلیک باز می‌شود.
     */
    if (isCollapsed) {
      onToggleSidebar?.();
      return;
    }

    /*
     * حالت دوم: سایدبار باز و آزاد است.
     * با کلیک قفل می‌شود.
     *
     * طبق منطق AppShell، فعال‌شدن قفل
     * سایدبار را باز نگه می‌دارد.
     */
    onToggleSidebarLock?.();
  };

  /*
   * جلوگیری از رسیدن mousedown کنترل هدر
   * به listener کلیک بیرون موجود در Sidebar
   */
  const handleSidebarButtonMouseDown = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
  };

  const sidebarButtonTitle = isCollapsed
    ? 'باز کردن سایدبار'
    : isSidebarLocked
      ? 'باز کردن قفل سایدبار'
      : 'قفل کردن سایدبار';

  const sidebarButtonIcon = isCollapsed ? (
    <ChevronLeft size={18} />
  ) : isSidebarLocked ? (
    <Lock size={18} />
  ) : (
    <Unlock size={18} />
  );

  const themeIcon =
    theme === 'system' ? (
      <Monitor size={20} />
    ) : theme === 'light' ? (
      <Sun size={20} />
    ) : (
      <Moon size={20} />
    );

  const themeTitle =
    theme === 'system'
      ? 'حالت فعلی: سیستم'
      : theme === 'light'
        ? 'حالت فعلی: روشن'
        : 'حالت فعلی: تیره';

  return (
    <header
      dir="rtl"
      className="
        sticky top-0 z-50 relative flex h-16
        items-center border-b border-[var(--border)]
        bg-[var(--surface)]/90 px-5
        backdrop-blur-md transition-colors duration-200
      "
    >
      {/* کنترل یکپارچه سه‌حالته سایدبار */}
      {onToggleSidebar && (
        <div
          id="sidebar-controls"
          className="
            absolute right-5 top-1/2 z-10
            -translate-y-1/2
          "
        >
          <button
            id="sidebar-toggle-btn"
            type="button"
            onMouseDown={handleSidebarButtonMouseDown}
            onClick={handleSidebarButtonClick}
            title={sidebarButtonTitle}
            aria-label={sidebarButtonTitle}
            aria-pressed={!isCollapsed && isSidebarLocked}
            className={`
              flex h-10 w-10 cursor-pointer
              items-center justify-center
              rounded-xl border
              transition-all duration-200

              ${
                !isCollapsed && isSidebarLocked
                  ? `
                    border-blue-600
                    bg-blue-600
                    text-white
                    shadow-lg
                    shadow-blue-500/20
                    hover:bg-blue-700
                  `
                  : `
                    border-[var(--border)]
                    text-[var(--foreground)]
                    hover:bg-slate-100
                    dark:hover:bg-slate-800
                  `
              }
            `}
          >
            <span className="pointer-events-none flex items-center justify-center">
              {sidebarButtonIcon}
            </span>
          </button>
        </div>
      )}

      {/* لوگو در مرکز واقعی هدر */}
      <div
        className="
          absolute left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2
        "
      >
        <Link
          href="/"
          aria-label="رفتن به صفحه اصلی"
          className="group flex items-center gap-2"
        >
          <div
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg bg-blue-600
              shadow-lg shadow-blue-500/20
              transition-transform duration-200
              group-hover:rotate-12
            "
          >
            <ShieldCheck size={20} className="text-white" />
          </div>

          <span
            className="
              text-xl font-black tracking-tight
              text-[var(--foreground)]
              transition-colors
              group-hover:text-blue-600
              dark:group-hover:text-blue-400
            "
          >
            ERP{' '}
            <span
              className="
                text-lg font-medium italic
                text-blue-600 dark:text-blue-500
              "
            >
              Pro
            </span>
          </span>
        </Link>
      </div>

      {/* ابزارهای سمت چپ هدر */}
      <div
        className="
          absolute left-5 top-1/2 z-10
          flex -translate-y-1/2
          items-center gap-4
        "
      >
        {/* تغییر تم */}
        <button
          type="button"
          onClick={cycleTheme}
          title={themeTitle}
          aria-label="تغییر تم"
          className="
            rounded-xl p-2
            text-[var(--foreground)]
            transition-all
            hover:bg-slate-100
            dark:hover:bg-slate-800/80
          "
        >
          {themeIcon}
        </button>

        {/* اعلان‌ها */}
        <button
          type="button"
          aria-label="اعلان‌ها"
          className="
            relative rounded-xl p-2
            text-[var(--foreground)]
            transition-all
            hover:bg-slate-100
            dark:hover:bg-slate-800/80
          "
        >
          <Bell size={20} />

          <span
            className="
              absolute right-2 top-2
              h-2 w-2 rounded-full
              border-2 border-[var(--surface)]
              bg-red-500
            "
          />
        </button>

        {/* حساب کاربری */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsMenuOpen((previous) => !previous);
            }}
            aria-expanded={isMenuOpen}
            aria-label="منوی حساب کاربری"
            className="
              flex cursor-pointer select-none
              items-center gap-3
              rounded-2xl border border-[var(--border)]
              p-1.5 pr-3
              transition-all
              hover:bg-slate-100
              dark:hover:bg-slate-800/80
            "
          >
            <div className="pointer-events-none ml-1 text-right">
              <p
                className="
                  text-sm font-bold
                  text-[var(--foreground)]
                "
              >
                {user?.name || 'کاربر سیستم'}
              </p>

              <p
                className="
                  text-[10px] font-medium
                  text-blue-600
                  dark:text-blue-400
                "
              >
                {user?.role || 'مدیر ارشد'}
              </p>
            </div>

            <div
              className="
                pointer-events-none
                flex h-9 w-9 items-center
                justify-center rounded-xl
                bg-gradient-to-br from-blue-500 to-blue-700
                font-black text-white shadow-inner
              "
            >
              {user?.name ? (
                user.name.charAt(0)
              ) : (
                <User size={20} />
              )}
            </div>

            <ChevronDown
              size={14}
              className={`
                pointer-events-none
                text-slate-400
                transition-transform duration-300
                dark:text-slate-500
                ${isMenuOpen ? 'rotate-180' : ''}
              `}
            />
          </button>

          {/* منوی حساب کاربری */}
          {isMenuOpen && (
            <div
              className="
                absolute left-0 z-50 mt-3 w-56
                overflow-hidden rounded-2xl
                border border-[var(--border)]
                bg-[var(--surface)]
                py-2 shadow-2xl
              "
            >
              <div
                className="
                  mb-1 border-b border-[var(--border)]
                  px-4 py-3
                "
              >
                <p
                  className="
                    truncate text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {user?.email || '---'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex w-full cursor-pointer
                  items-center gap-3
                  px-4 py-3 text-sm
                  text-red-600 transition-colors
                  hover:bg-red-50
                  dark:text-red-400
                  dark:hover:bg-red-500/10
                "
              >
                <LogOut size={18} />

                <span className="font-semibold">
                  خروج از حساب
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
