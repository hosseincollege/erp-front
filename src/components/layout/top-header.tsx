/**
 * @file src/components/layout/top-header.tsx
 * @project ERP Pro - Front-end
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getCurrentOrganizationId,
  getCurrentUser,
  AuthUser,
} from '@/lib/api/shared/auth-api';
import {
  resolveOrganizationLogoUrl,
  settingsApi,
  type OrganizationBranding,
} from '@/lib/api/settings/settings-api';

import {
  ArrowLeftRight,
  Bell,
  CircleHelp,
  ChevronLeft,
  History,
  Lock,
  Monitor,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  Unlock,
  User,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { getLocaleDirection, usePreferences } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';
import { isAuthenticated } from '@/lib/api-client';
import { notificationsApi } from '@/lib/api/shared/notifications-api';

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
  const [organizationBranding, setOrganizationBranding] =
    useState<OrganizationBranding | null>(null);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const { theme, setTheme } = useTheme();
  const { locale } = usePreferences();
  const direction = getLocaleDirection(locale);
  const english = locale !== 'fa';
  const message = (key: Parameters<typeof uiMessage>[1]) => uiMessage(locale, key);

  useEffect(() => {
    let isCurrent = true;

    const refreshUnreadCount = () => {
      if (!isAuthenticated()) {
        setUnreadNotificationCount(0);
        return;
      }
      void notificationsApi
        .getSummary()
        .then((summary) => {
          if (isCurrent) setUnreadNotificationCount(summary.unreadCount);
        })
        .catch(() => {
          if (isCurrent) setUnreadNotificationCount(0);
        });
    };

    refreshUnreadCount();
    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') refreshUnreadCount();
    };
    const refreshTimer = window.setInterval(refreshUnreadCount, 60_000);
    window.addEventListener('notifications-updated', refreshUnreadCount);
    window.addEventListener('auth:login', refreshUnreadCount);
    window.addEventListener('auth:logout', refreshUnreadCount);
    window.addEventListener('storage', refreshUnreadCount);
    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnFocus);

    return () => {
      isCurrent = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener('notifications-updated', refreshUnreadCount);
      window.removeEventListener('auth:login', refreshUnreadCount);
      window.removeEventListener('auth:logout', refreshUnreadCount);
      window.removeEventListener('storage', refreshUnreadCount);
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnFocus);
    };
  }, []);

  /*
   * دریافت اطلاعات کاربر و اعمال تم ذخیره‌شده
   */
  useEffect(() => {
    setUser(getCurrentUser());
    let isCurrent = true;

    const refreshOrganizationBranding = () => {
      const organizationId = getCurrentOrganizationId();
      if (!organizationId) {
        setOrganizationBranding(null);
        return;
      }
      void settingsApi
        .getOrganizationBranding(organizationId)
        .then((branding) => {
          if (isCurrent) setOrganizationBranding(branding);
        })
        .catch(() => {
          if (isCurrent) setOrganizationBranding(null);
        });
    };

    refreshOrganizationBranding();

    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener('auth:logout', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener(
      'organization-branding-changed',
      refreshOrganizationBranding,
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
      window.removeEventListener(
        'organization-branding-changed',
        refreshOrganizationBranding,
      );
      isCurrent = false;
    };
  }, []);

  /*
   * گردش بین حالت‌های تم
   */
  const cycleTheme = () => {
    const nextTheme =
      theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';

    setTheme(nextTheme);
  };

  const handleSidebarButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    // اگر سایدبار باز است و قفل است -> قفل را باز کن
    if (!isCollapsed && isSidebarLocked) {
      onToggleSidebarLock?.();
      return;
    }

    // اگر سایدبار بسته است -> بازش کن
    if (isCollapsed) {
      onToggleSidebar?.();
      return;
    }

    // اگر سایدبار باز است و هنوز قفل نیست -> قفلش کن
    onToggleSidebarLock?.();
  };

  const handleSidebarButtonMouseDown = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
  };

  const sidebarButtonTitle = isCollapsed
    ? message('openSidebar')
    : isSidebarLocked
      ? message('unlockSidebar')
      : message('lockSidebar');

  const sidebarButtonIcon = isCollapsed ? (
    <ChevronLeft size={18} />
  ) : isSidebarLocked ? (
    <Lock size={18} />
  ) : (
    <Unlock size={18} />
  );

  const themeIcon =
    theme === 'system' ? (
      <Monitor size={18} />
    ) : theme === 'light' ? (
      <Sun size={18} />
    ) : (
      <Moon size={18} />
    );

  const themeTitle =
    theme === 'system'
    ? message('themeSystem')
      : theme === 'light'
      ? message('themeLight')
      : message('themeDark');

  const navigateModeTitle = navigateOnClick
    ? message('navigateOn')
    : message('navigateOff');
  const logoShadow = organizationBranding?.logoBackground ?? 'NONE';
  const logoShadowClassName =
    logoShadow === 'DARK'
      ? 'drop-shadow-[0_0_5px_rgba(0,0,0,0.9)]'
      : logoShadow === 'LIGHT'
        ? 'drop-shadow-[0_0_5px_rgba(255,255,255,0.95)]'
        : 'drop-shadow-none';

  return (
    <header
      dir={direction}
      className="
        sticky top-0 z-50 relative flex h-16
        items-center border-b border-[var(--border)]
        bg-[var(--surface)]/90 px-5
        backdrop-blur-md transition-colors duration-200
      "
    >
      {/* کنترل‌های سایدبار، زنگوله و تم، سپس کپسول حساب کاربری */}
      <div
        dir={direction}
        className="
          absolute start-5 top-1/2 z-10
          flex -translate-y-1/2
          items-center gap-2
        "
      >
        {/* ۱. دکمه کنترل سایدبار (فلش باز/بستن/قفل) */}
        {onToggleSidebar && (
          <div id="sidebar-controls" className="order-1">
            <button
              id="sidebar-toggle-btn"
              type="button"
              onMouseDown={handleSidebarButtonMouseDown}
              onClick={handleSidebarButtonClick}
              title={sidebarButtonTitle}
              aria-label={sidebarButtonTitle}
              aria-pressed={!isCollapsed && isSidebarLocked}
              className={`
                flex h-9 w-9 cursor-pointer
                items-center justify-center
                rounded-xl transition-all duration-200
                ${
                  !isCollapsed && isSidebarLocked
                    ? 'border-2 border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] shadow-sm shadow-[var(--primary)]/20'
                    : 'border border-[var(--border)] text-[var(--foreground)]'
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
              flex h-9 w-9 cursor-pointer items-center justify-center
              order-2
              rounded-xl transition-all duration-200
              ${
                navigateOnClick
                  ? 'border-2 border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] shadow-sm shadow-[var(--primary)]/20'
                  : 'border border-[var(--border)] text-[var(--foreground)]'
              }
            `}
          >
            <ArrowLeftRight size={18} />
          </button>
        )}

        <button
          type="button"
          onClick={cycleTheme}
          title={themeTitle}
          aria-label={message('changeTheme')}
          className="order-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)] transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
        >
          {themeIcon}
        </button>

        <Link
          href="/notifications"
          aria-label={message('notifications')}
          title={message('notificationsTitle')}
          className="order-5 relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)] transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
        >
          <Bell size={18} />
          {unreadNotificationCount > 0 && (
            <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-[var(--surface)]">
              {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
            </span>
          )}
        </Link>

        <Link
          href="/dashboard#activity-summary"
          aria-label={message('dashboardActivityTitle')}
          title={message('dashboardActivityTitle')}
          className="order-6 flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)]"
        >
          <History size={18} />
        </Link>

        <Link
          href="/support"
          aria-label={message('sidebarSupport')}
          title={message('sidebarSupport')}
          className="order-7 flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)]"
        >
          <CircleHelp size={18} />
        </Link>

        {/* ۳. بخش کپسول حساب کاربری */}
        <button
          id="user-profile-header-btn"
          type="button"
          onClick={() => onToggleProfile?.()}
          aria-label={message('viewProfile')}
          className={`
            order-3 flex cursor-pointer select-none
            items-center gap-2.5
            rounded-2xl border
            p-1.5 pe-4 ps-1.5
            transition-all
            ${
              isProfileActive
                ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                : 'border-[var(--border)] text-[var(--foreground)]'
            }
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40
          `}
        >
          {/* آواتار کاربر */}
          <div
            className="
              pointer-events-none
              flex h-7 w-7 items-center
              justify-center rounded-xl
              font-black text-white shadow-inner text-xs
            "
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <User size={16} />
            )}
          </div>

          {/* نام و نقش */}
          <div className="pointer-events-none text-start">
            <p className="text-xs font-bold leading-tight">
              {user?.name || message('admin')}
            </p>

            <p
              className="
                text-[10px] font-medium leading-normal
                text-primary
              "
            >
              {user?.role || message('user')}
            </p>
          </div>
        </button>
      </div>

      {/* نام شرکت در چپ، لوگوی دقیقاً وسط و ERP در راست؛ کل نشان به داشبورد می‌رود */}
      <div
        className="
          absolute left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2
        "
      >
        <Link
          href="/dashboard"
          aria-label={message('dashboard')}
          dir="ltr"
          className="relative flex h-12 w-12 items-center justify-center rounded-xl"
        >
          <span
            className="absolute right-[calc(100%+0.0625rem)] top-1/2 w-max max-w-[min(24vw,15rem)] -translate-y-1/2 truncate text-left font-black tracking-tight text-[var(--foreground)]"
            style={{ fontSize: english ? '0.8rem' : '0.95rem' }}
          >
            {organizationBranding?.name || 'ERP Pro'}
          </span>

          <div
            className={`
              flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden
              rounded-xl
              ${logoShadowClassName}
            `}
          >
            {organizationBranding?.logoUrl ? (
              <Image
                src={
                  resolveOrganizationLogoUrl(organizationBranding.logoUrl) || ''
                }
                alt={message('organizationLogo')}
                width={32}
                height={32}
                unoptimized
                className="h-full w-full object-contain"
                onError={() =>
                  setOrganizationBranding((current) =>
                    current ? { ...current, logoUrl: null } : current,
                  )
                }
              />
            ) : (
              <ShieldCheck size={23} className="text-primary" />
            )}
          </div>

          <span className="absolute left-[calc(100%+0.0625rem)] top-1/2 -translate-y-1/2 text-[11px] font-bold tracking-wide text-primary">
            ERP
          </span>
        </Link>
      </div>

      <label
        dir={direction}
        className="absolute end-5 top-1/2 z-10 flex w-36 -translate-y-1/2 items-center sm:w-44 md:w-52"
      >
        <Search
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute start-3 text-[var(--muted-foreground)]"
        />
        <input
          type="search"
          aria-label={message('headerSearch')}
          placeholder={message('headerSearch')}
          className="h-9 w-full rounded-xl border border-[var(--border)] bg-transparent ps-9 pe-3 text-sm text-[var(--foreground)] outline-none transition-colors duration-150 placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)]"
        />
      </label>
    </header>
  );
}
