// src/components/layout/app-shell.tsx
// حذف رنگ‌های هاردکدشده و هماهنگ‌سازی پوسته اصلی برنامه با سیستم تم Light/Dark

'use client';

import { TopHeader } from '@/components/layout/top-header';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      dir="rtl"
      className="
        flex
        h-screen
        w-full
        flex-col
        overflow-hidden
        bg-[var(--background)]
        text-[var(--foreground)]
        transition-colors
        duration-200
      "
    >
      <TopHeader />

      <div className="flex flex-1 overflow-hidden pt-14">
        <main className="flex h-full w-full flex-1 flex-col overflow-y-auto">
          <div className="relative mx-auto h-full w-full max-w-[1600px] p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
