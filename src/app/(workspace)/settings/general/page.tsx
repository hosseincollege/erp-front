/**
 * مسیر فایل:
 * src/app/(workspace)/settings/general/page.tsx
 * هدف: صفحه تنظیمات عمومی (شروع مستقیم از تب‌های مشخصات شرکت و ساختار سازمانی)
 */

'use client';

import { useState } from 'react';
import {
  Building2,
  GitBranch,
  type LucideIcon,
} from 'lucide-react';

import { CompanyTab } from './company-tab';
import { OrganizationTab } from './organization-tab';

type GeneralTabId = 'company' | 'organization';

interface GeneralTabItem {
  id: GeneralTabId;
  title: string;
  description: string;
  icon: LucideIcon;
}

const generalTabs: GeneralTabItem[] = [
  {
    id: 'company',
    title: 'اطلاعات شرکت',
    description: 'مشخصات و اطلاعات پایه شرکت',
    icon: Building2,
  },
  {
    id: 'organization',
    title: 'ساختار سازمانی',
    description: 'مدیریت شعب و دپارتمان‌ها',
    icon: GitBranch,
  },
];

export default function GeneralSettingsPage() {
  const [activeTab, setActiveTab] = useState<GeneralTabId>('company');

  return (
    <div dir="rtl" className="w-full space-y-5">
      {/* سربرگ‌ها / تب‌های ناوبری */}
      <section className="w-full rounded-2xl border border-border bg-card p-2.5 shadow-sm">
        <nav
          aria-label="سربرگ‌های تنظیمات عمومی"
          role="tablist"
          className="flex flex-wrap items-center gap-2"
        >
          {generalTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`general-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`general-panel-${tab.id}`}
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
      <section className="w-full min-h-[300px]">
        {activeTab === 'company' && (
          <div
            id="general-panel-company"
            role="tabpanel"
            aria-labelledby="general-tab-company"
            className="animate-in fade-in-50 duration-200"
          >
            <CompanyTab />
          </div>
        )}

        {activeTab === 'organization' && (
          <div
            id="general-panel-organization"
            role="tabpanel"
            aria-labelledby="general-tab-organization"
            className="animate-in fade-in-50 duration-200"
          >
            <OrganizationTab />
          </div>
        )}
      </section>
    </div>
  );
}
