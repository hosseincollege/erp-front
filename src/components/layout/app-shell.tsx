/**
 * @file src/components/layout/app-shell.tsx
 */
'use client';

import React, { useState } from 'react';
import { TopHeader } from './top-header';
import { Sidebar } from './sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col" dir="rtl">
      {/* هدر بالایی */}
      <TopHeader onToggleSidebar={() => setIsCollapsed((prev) => !prev)} />

      {/* بخش بدنه: سایدبار + محتوای اصلی */}
      <div className="flex flex-1 items-start">
        <Sidebar isMainCollapsed={isCollapsed} />
        
        <main className="flex-1 min-w-0 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
