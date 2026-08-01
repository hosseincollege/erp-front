// src/components/layout/top-header.tsx

"use client";

import Link from "next/link";
import { Bell, HelpCircle, History, Search, Settings } from "lucide-react";
import { ModuleSwitcher } from "./module-switcher";

export function TopHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-black/10 bg-[color:var(--primary)] text-white shadow-sm">
      <div className="flex h-full items-center gap-3 px-3 sm:px-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-white/10"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/15 text-xs font-bold">
            ERP
          </div>
          <span className="hidden text-sm font-semibold sm:inline">
            ERP Pro
          </span>
        </Link>

        <div className="hidden h-6 w-px bg-white/20 md:block" />

        <ModuleSwitcher />

        <div className="mx-auto hidden w-full max-w-xl md:block">
          <label className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-white/80" />
            <input
              type="text"
              placeholder="جستجو در سیستم..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/65"
            />
          </label>
        </div>

        <div className="mr-auto flex items-center gap-1">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-white/10"
            aria-label="راهنما"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-white/10"
            aria-label="سوابق"
          >
            <History className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-white/10"
            aria-label="اعلان‌ها"
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-white/10"
            aria-label="تنظیمات"
          >
            <Settings className="h-4 w-4" />
          </button>

          <div className="mr-1 hidden items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 sm:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[11px] font-semibold">
              HM
            </div>
            <div className="leading-tight">
              <div className="text-sm font-medium">حسین</div>
              <div className="text-[11px] text-white/70">ERP Pro</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// end of src/components/layout/top-header.tsx
