/**
 * مسیر فایل:
 * src/app/(workspace)/settings/users/page.tsx
 *
 * هدف:
 * صفحه مدیریت کاربران و سطوح دسترسی (شروع از تب نقش‌ها و دسترسی‌ها و سپس حساب‌های کاربری)
 */

'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

import { RolesTab } from './roles-tab';
import { UsersTab } from './users-tab';

type UsersSettingsTabId = 'roles' | 'accounts';

interface UsersSettingsTabItem {
  id: UsersSettingsTabId;
  title: string;
  description: string;
  icon: LucideIcon;
}

const usersSettingsTabs: UsersSettingsTabItem[] = [
  {
    id: 'roles',
    title: 'نقش‌ها و دسترسی‌ها',
    description: 'مدیریت نقش‌ها و سطح مجوزها',
    icon: ShieldCheck,
  },
  {
    id: 'accounts',
    title: 'حساب‌های کاربری',
    description: 'مدیریت و ایجاد کاربران سیستم',
    icon: UserRound,
  },
];

export default function UsersSettingsPage() {
  const [activeTab, setActiveTab] = useState<UsersSettingsTabId>('roles');

  return (
    <div dir="rtl" className="space-y-5">
      {/* سربرگ‌ها / تب‌های ناوبری */}
      <section className="rounded-2xl border border-border bg-card p-2.5 shadow-sm">
        <nav
          aria-label="سربرگ‌های مدیریت کاربران"
          role="tablist"
          className="flex flex-wrap items-center gap-2"
        >
          {usersSettingsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`users-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`users-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-right transition-all sm:w-auto sm:min-w-[240px] ${
                  isActive
                    ? 'border border-blue-500/30 bg-blue-500/10 text-foreground ring-1 ring-blue-500/20'
                    : 'border border-transparent text-muted-foreground hover:border-border hover:bg-accent/40 hover:text-foreground'
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon size={17} />
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none text-foreground">
                    {tab.title}
                  </span>
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    {tab.description}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </section>

      {/* محتوای تب فعال */}
      <section className="min-h-[300px]">
        {activeTab === 'roles' && (
          <div
            id="users-panel-roles"
            role="tabpanel"
            aria-labelledby="users-tab-roles"
            className="animate-in fade-in-50 duration-200"
          >
            <RolesTab />
          </div>
        )}

        {activeTab === 'accounts' && (
          <div
            id="users-panel-accounts"
            role="tabpanel"
            aria-labelledby="users-tab-accounts"
            className="animate-in fade-in-50 duration-200"
          >
            <UsersTab />
          </div>
        )}
      </section>
    </div>
  );
}
