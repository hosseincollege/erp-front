/**
 * @file src/components/layout/app-shell.tsx
 * @description پوسته اصلی صفحات داخلی ERP Pro
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { TopHeader } from './top-header';

const SIDEBAR_COLLAPSED_KEY = 'erp-sidebar-collapsed';
const SIDEBAR_LOCKED_KEY = 'erp-sidebar-locked';
const NAVIGATE_ON_CLICK_KEY = 'erp-navigate-on-click';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);
  const [isSidebarStateLoaded, setIsSidebarStateLoaded] = useState(false);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [navigateOnClick, setNavigateOnClick] = useState(false);

  /*
   * خواندن وضعیت ذخیره‌شده سایدبار و حالت ناوبری از localStorage در سمت کلاینت
   */
  useEffect(() => {
    try {
      const savedCollapsed = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      const savedLocked = window.localStorage.getItem(SIDEBAR_LOCKED_KEY);
      const savedNavigateOnClick = window.localStorage.getItem(NAVIGATE_ON_CLICK_KEY);

      if (savedCollapsed !== null) {
        setIsCollapsed(savedCollapsed === 'true');
      }

      if (savedLocked !== null) {
        setIsSidebarLocked(savedLocked === 'true');
      }

      if (savedNavigateOnClick !== null) {
        setNavigateOnClick(savedNavigateOnClick === 'true');
      }
    } catch (error) {
      console.warn(
        'امکان خواندن وضعیت‌ها از localStorage وجود ندارد:',
        error
      );
    } finally {
      setIsSidebarStateLoaded(true);
    }
  }, []);

  /*
   * ذخیره وضعیت جمع/باز بودن سایدبار
   */
  useEffect(() => {
    if (!isSidebarStateLoaded) return;
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
    } catch (error) {
      console.warn('امکان ذخیره وضعیت باز/جمع سایدبار وجود ندارد:', error);
    }
  }, [isCollapsed, isSidebarStateLoaded]);

  /*
   * ذخیره وضعیت قفل سایدبار
   */
  useEffect(() => {
    if (!isSidebarStateLoaded) return;
    try {
      window.localStorage.setItem(SIDEBAR_LOCKED_KEY, String(isSidebarLocked));
    } catch (error) {
      console.warn('امکان ذخیره وضعیت قفل سایدبار وجود ندارد:', error);
    }
  }, [isSidebarLocked, isSidebarStateLoaded]);

  /*
   * ذخیره وضعیت حالت ناوبری با کلیک
   */
  useEffect(() => {
    if (!isSidebarStateLoaded) return;
    try {
      window.localStorage.setItem(NAVIGATE_ON_CLICK_KEY, String(navigateOnClick));
    } catch (error) {
      console.warn('امکان ذخیره وضعیت حالت ناوبری وجود ندارد:', error);
    }
  }, [navigateOnClick, isSidebarStateLoaded]);

  const handleToggleSidebar = () => {
    if (!isCollapsed && isSidebarLocked) return;
    setIsCollapsed((previous) => !previous);
  };

  const handleCloseSidebar = () => {
    if (isSidebarLocked) return;
    setIsCollapsed(true);
    setIsProfileActive(false);
  };

  const handleToggleSidebarLock = () => {
    setIsSidebarLocked((previousLocked) => {
      const nextLocked = !previousLocked;
      if (nextLocked) {
        setIsCollapsed(false);
      }
      return nextLocked;
    });
  };

  const handleToggleProfileSidebar = () => {
    setIsProfileActive((previous) => !previous);
  };

  const handleToggleNavigateOnClick = () => {
    setNavigateOnClick((previous) => !previous);
  };

  return (
    <div
      dir="rtl"
      className="flex h-screen min-h-0 flex-col overflow-hidden bg-[color:var(--background)] text-[color:var(--foreground)] transition-colors duration-200"
    >
      <TopHeader
        isCollapsed={isCollapsed}
        isSidebarLocked={isSidebarLocked}
        isProfileActive={isProfileActive}
        navigateOnClick={navigateOnClick}
        onToggleSidebar={handleToggleSidebar}
        onToggleSidebarLock={handleToggleSidebarLock}
        onToggleProfile={handleToggleProfileSidebar}
        onToggleNavigateOnClick={handleToggleNavigateOnClick}
      />

      <div className="flex min-h-0 flex-1 items-stretch overflow-hidden">
        <Sidebar
          isMainCollapsed={isCollapsed}
          isLocked={isSidebarLocked}
          isProfileActive={isProfileActive}
          navigateOnClick={navigateOnClick}
          onSetProfileActive={setIsProfileActive}
          onCloseSidebar={handleCloseSidebar}
        />

        <main
          dir="ltr"
          className="erp-scrollbar min-h-0 min-w-0 flex-1 bg-[color:var(--background)]"
        >
          <div dir="rtl" className="min-h-full w-full p-6 text-right">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
