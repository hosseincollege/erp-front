/**
 * @file src/components/layout/app-shell.tsx
 * @description پوسته اصلی صفحات داخلی ERP Pro
 */

'use client';

import React, { useEffect, useState } from 'react';

import { TopHeader } from './top-header';
import { Sidebar } from './sidebar';

const SIDEBAR_COLLAPSED_KEY = 'erp-sidebar-collapsed';
const SIDEBAR_LOCKED_KEY = 'erp-sidebar-locked';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  /*
   * مقدار اولیه فقط برای رندر سمت کلاینت استفاده می‌شود.
   * بعد از mount، مقدار ذخیره‌شده از localStorage خوانده خواهد شد.
   */
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);

  const [isSidebarStateLoaded, setIsSidebarStateLoaded] =
    useState(false);

  /*
   * خواندن وضعیت قبلی سایدبار
   */
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem(
        SIDEBAR_COLLAPSED_KEY
      );

      const savedLocked = localStorage.getItem(
        SIDEBAR_LOCKED_KEY
      );

      if (savedCollapsed !== null) {
        setIsCollapsed(savedCollapsed === 'true');
      }

      if (savedLocked !== null) {
        setIsSidebarLocked(savedLocked === 'true');
      }
    } catch (error) {
      console.warn(
        'امکان خواندن وضعیت سایدبار از localStorage وجود ندارد:',
        error
      );
    } finally {
      setIsSidebarStateLoaded(true);
    }
  }, []);

  /*
   * ذخیره وضعیت باز یا جمع‌بودن سایدبار
   */
  useEffect(() => {
    if (!isSidebarStateLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        SIDEBAR_COLLAPSED_KEY,
        String(isCollapsed)
      );
    } catch (error) {
      console.warn(
        'امکان ذخیره وضعیت باز/جمع سایدبار وجود ندارد:',
        error
      );
    }
  }, [isCollapsed, isSidebarStateLoaded]);

  /*
   * ذخیره وضعیت قفل سایدبار
   */
  useEffect(() => {
    if (!isSidebarStateLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        SIDEBAR_LOCKED_KEY,
        String(isSidebarLocked)
      );
    } catch (error) {
      console.warn(
        'امکان ذخیره وضعیت قفل سایدبار وجود ندارد:',
        error
      );
    }
  }, [isSidebarLocked, isSidebarStateLoaded]);

  /*
   * باز و بسته‌کردن سایدبار از طریق فلش هدر
   */
  const handleToggleSidebar = () => {
    // سایدبار باز و قفل است؛ اجازه بسته‌شدن وجود ندارد
    if (!isCollapsed && isSidebarLocked) {
      return;
    }

    setIsCollapsed((previous) => !previous);
  };

  /*
   * بستن سایدبار با کلیک بیرون
   */
  const handleCloseSidebar = () => {
    // اگر قفل فعال باشد، کلیک بیرون اثری ندارد
    if (isSidebarLocked) {
      return;
    }

    setIsCollapsed(true);
  };

  /*
   * فعال یا غیرفعال‌کردن قفل
   */
  const handleToggleSidebarLock = () => {
    setIsSidebarLocked((previousLocked) => {
      const nextLocked = !previousLocked;

      /*
       * وقتی کاربر قفل را فعال می‌کند،
       * سایدبار حتماً باز می‌ماند.
       */
      if (nextLocked) {
        setIsCollapsed(false);
      }

      return nextLocked;
    });
  };

  return (
    <div
      dir="rtl"
      className="
        flex min-h-screen flex-col
        bg-[color:var(--background)]
        text-[color:var(--foreground)]
        transition-colors duration-200
      "
    >
      <TopHeader
        isCollapsed={isCollapsed}
        isSidebarLocked={isSidebarLocked}
        onToggleSidebar={handleToggleSidebar}
        onToggleSidebarLock={handleToggleSidebarLock}
      />

      <div className="flex min-h-0 flex-1 items-stretch">
        <Sidebar
          isMainCollapsed={isCollapsed}
          isLocked={isSidebarLocked}
          onCloseSidebar={handleCloseSidebar}
        />

        <main
          className="
            min-w-0 flex-1
            overflow-y-auto
            bg-[color:var(--background)]
            p-6
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
