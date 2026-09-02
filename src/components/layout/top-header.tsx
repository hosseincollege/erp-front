/**
 * @file src/components/layout/top-header.tsx
 * @project ERP Pro - Front-end
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser, AuthUser } from '@/lib/auth-api';

import {
  ArrowLeftRight,
  Bell,
  ChevronLeft,
  Lock,
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
  isProfileActive?: boolean;
  navigateOnClick?: boolean;
  onToggleSidebar?: () => void;
  onToggleSidebarLock?: () => void;
  onToggleProfile?: () => void;
  onToggleNavigateOnClick?: () => void;
}

export function TopHeader({
  isCollapsed = true,
  isSidebarLocked = false,
  isProfileActive = false,
  navigateOnClick = false,
  onToggleSidebar,
  onToggleSidebarLock,
  onToggleProfile,
  onToggleNavigateOnClick,
}: TopHeaderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('system');

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
   * گردش بین حالت‌های تم
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

  const handleSidebarButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isCollapsed && isSidebarLocked) {
      onToggleSidebarLock?.();
      return;
    }

    if (isCollapsed) {
      onToggleSidebar?.();
      return;
    }

    onToggleSidebarLock?.();
  };

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

  const navigateModeTitle = navigateOnClick
    ? 'ناوبری خودکار: فعال (کلیک روی ماژول صفحه را باز می‌کند)'
    : 'ناوبری خودکار: غیرفعال (کلیک روی ماژول فقط منو را باز می‌کند)';

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
      {/* بخش راست: ۱. فلش کنترل سایدبار -> ۲. سوئیچ ناوبری -> ۳. کپسول حساب کاربری */}
      <div
        className="
          absolute right-5 top-1/2 z-10
          flex -translate-y-1/2
          items-center gap-3
        "
      >
        {/* ۱. دکمه کنترل سایدبار (فلش باز/بستن/قفل) */}
        {onToggleSidebar && (
          <div id="sidebar-controls">
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

        {/* ۲. دکمه فلش دوطرفه (سوئیچ حالت ناوبری) */}
        {onToggleNavigateOnClick && (
          <button
            id="navigate-on-click-toggle-btn"
            type="button"
            onClick={onToggleNavigateOnClick}
            title={navigateModeTitle}
            aria-label={navigateModeTitle}
            aria-pressed={navigateOnClick}
            className={`
              flex h-10 w-10 cursor-pointer items-center justify-center
              rounded-xl border transition-all duration-200
              ${
                navigateOnClick
                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700'
                  : 'border-[var(--border)] text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800'
              }
            `}
          >
            <ArrowLeftRight size={18} />
          </button>
        )}

        {/* ۳. بخش کپسول حساب کاربری */}
        <button
          id="user-profile-header-btn"
          type="button"
          onClick={() => onToggleProfile?.()}
          aria-label="مشاهده پروفایل در سایدبار"
          className={`
            flex cursor-pointer select-none
            items-center gap-2.5
            rounded-2xl border
            p-1.5 pl-4 pr-1.5
            transition-all
            ${
              isProfileActive
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800/80 text-[var(--foreground)]'
            }
          `}
        >
          {/* آواتار کاربر */}
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
              user.name.charAt(0).toUpperCase()
            ) : (
              <User size={20} />
            )}
          </div>

          {/* نام و نقش */}
          <div className="pointer-events-none text-right">
            <p className="text-sm font-bold leading-tight">
              {user?.name || 'admin'}
            </p>

            <p
              className="
                text-[10px] font-medium leading-normal
                text-blue-600
                dark:text-blue-400
              "
            >
              {user?.role || 'user'}
            </p>
          </div>
        </button>
      </div>

      {/* لوگو در مرکز */}
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

      {/* بخش چپ: اعلان‌ها و انتخاب تم */}
      <div
        className="
          absolute left-5 top-1/2 z-10
          flex -translate-y-1/2
          items-center gap-3
        "
      >
        {/* انتخاب تم */}
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

        {/* زنگوله اعلان‌ها */}
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
      </div>
    </header>
  );
}
