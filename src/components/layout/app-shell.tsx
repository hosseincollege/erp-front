// src/components/layout/app-shell.tsx
// مدیریت پوسته اصلی برنامه، ساختار RTL، اسکرول محتوای صفحات و پشتیبانی از تم Light/Dark

'use client';

import type { ReactNode } from 'react';

import { TopHeader } from '@/components/layout/top-header';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      dir="rtl"
      className="
        isolate
        flex
        h-dvh
        min-h-0
        w-full
        flex-col
        overflow-hidden
        bg-[var(--background)]
        text-[var(--foreground)]
        transition-colors
        duration-200
      "
    >
      {/* نوار بالایی برنامه */}
      <div className="shrink-0">
        <TopHeader />
      </div>

      {/* فضای اصلی برنامه */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <main
          id="main-content"
          className="
            min-h-0
            w-full
            flex-1
            overflow-y-auto
            overscroll-contain
            bg-[var(--background)]
            transition-colors
            duration-200
          "
        >
          <div
            className="
              mx-auto
              min-h-full
              w-full
              max-w-[1600px]
              px-4
              py-5
              sm:px-6
              sm:py-6
              lg:px-8
            "
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
