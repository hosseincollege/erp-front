/**
 * @file src/components/layout/top-header.tsx
 * @project ERP Pro - Front-end
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  getCurrentOrganizationId,
  getCurrentUser,
  logout,
  AuthUser,
} from '@/lib/api/shared/auth-api';
import {
  resolveOrganizationLogoUrl,
  settingsApi,
  type OrganizationBranding,
} from '@/lib/api/settings/settings-api';

import {
  ArrowLeftRight,
  ChevronLeft,
  LogOut,
  Lock,
  Menu,
  Monitor,
  Moon,
  ShieldCheck,
  Sun,
  Unlock,
  User,
  X,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { getLocaleDirection, usePreferences } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';
import { HeaderAccountSwitcher } from './header-account-switcher';

interface TopHeaderProps {
  isCollapsed?: boolean;
  isMobileMenuOpen?: boolean;
  isSidebarLocked?: boolean;
  navigateOnClick?: boolean;
  onToggleSidebar?: () => void;
  onToggleMobileMenu?: () => void;
  onToggleSidebarLock?: () => void;
  onToggleNavigateOnClick?: () => void;
}

export function TopHeader({
  isCollapsed = true,
  isMobileMenuOpen = false,
  isSidebarLocked = false,
  navigateOnClick = false,
  onToggleSidebar,
  onToggleMobileMenu,
  onToggleSidebarLock,
  onToggleNavigateOnClick,
}: TopHeaderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [organizationBranding, setOrganizationBranding] =
    useState<OrganizationBranding | null>(null);
  const { theme, setTheme } = useTheme();
  const { locale } = usePreferences();
  const direction = getLocaleDirection(locale);
  const english = locale !== 'fa';
  const message = (key: Parameters<typeof uiMessage>[1]) => uiMessage(locale, key);

  useEffect(() => {
    if (!isAccountMenuOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAccountMenuOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isAccountMenuOpen]);

  const handleSignOut = async () => {
    setIsAccountMenuOpen(false);
    await logout();
    router.push('/login');
  };

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
      {/* در موبایل کنترل‌ها کنار هم در سمت شروع و کپسول حساب در سمت مقابل می‌ماند. */}
      <div
        dir={direction}
        className="
          pointer-events-none absolute inset-x-2 top-1/2 z-10 w-[calc(100%-1rem)] -translate-y-1/2
          flex items-center justify-between gap-2
          md:inset-x-auto md:start-5 md:w-auto md:justify-start
        "
      >
        <div className="order-1 flex shrink-0 items-center gap-1.5">
        {/* ۱. دکمه کنترل سایدبار (فلش باز/بستن/قفل) */}
        {onToggleSidebar && (
          <div id="sidebar-controls">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              title={message(isMobileMenuOpen ? 'closeSidebar' : 'openSidebar')}
              aria-label={message(isMobileMenuOpen ? 'closeSidebar' : 'openSidebar')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="erp-mobile-navigation"
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)] md:hidden"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button
              id="sidebar-toggle-btn"
              type="button"
              onMouseDown={handleSidebarButtonMouseDown}
              onClick={handleSidebarButtonClick}
              title={sidebarButtonTitle}
              aria-label={sidebarButtonTitle}
              aria-pressed={!isCollapsed && isSidebarLocked}
              className={`pointer-events-auto hidden md:flex
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
            className={`pointer-events-auto flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center
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
          className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)] transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
        >
          {themeIcon}
        </button>
        </div>

        {/* کپسول حساب کاربری در سوی مقابل کنترل‌ها */}
        <div className="pointer-events-none order-2 flex shrink-0 items-center gap-1.5">
        <div ref={accountMenuRef} className="pointer-events-none relative shrink-0">
          <button
            id="user-profile-header-btn"
            type="button"
            onClick={() => setIsAccountMenuOpen((open) => !open)}
            aria-label={message('viewProfile')}
            aria-haspopup="menu"
            aria-expanded={isAccountMenuOpen}
            className={`
              pointer-events-auto flex cursor-pointer select-none items-center gap-2.5
              rounded-2xl border p-1.5 pe-4 ps-1.5 transition-all
              ${isAccountMenuOpen ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]' : 'border-[var(--border)] text-[var(--foreground)]'}
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
          <div className="pointer-events-none hidden text-start sm:block">
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
          {isAccountMenuOpen && (
            <div role="menu" className="pointer-events-auto absolute end-0 top-full z-[60] mt-2 min-w-44 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-lg md:start-full md:top-1/2 md:mt-0 md:ms-2 md:end-auto md:-translate-y-1/2">
              <HeaderAccountSwitcher userId={user?.id} embedded />
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <LogOut size={16} />
                {message('sidebarSignOut')}
              </button>
            </div>
          )}
        </div>
        <div className="hidden md:block">
          <HeaderAccountSwitcher userId={user?.id} />
        </div>
        </div>
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
          className="pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-xl"
        >
          <span
            className="absolute right-[calc(100%+0.0625rem)] top-1/2 hidden w-max max-w-[min(24vw,15rem)] -translate-y-1/2 truncate text-left font-black tracking-tight text-[var(--foreground)] sm:block"
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

          <span className="absolute left-[calc(100%+0.0625rem)] top-1/2 hidden -translate-y-1/2 text-[11px] font-bold tracking-wide text-primary sm:block">
            ERP
          </span>
        </Link>
      </div>

    </header>
  );
}
