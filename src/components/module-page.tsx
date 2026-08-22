// File: frontend/src/components/module-page.tsx
// کامپوننت پایه ماژول‌های ERP با پشتیبانی از استایل‌های تم و کارت‌های تعاملی ساختار سازمانی

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export interface ModuleSection {
  title: string;
  description: string;
  icon?: LucideIcon;
  href?: string;
  badge?: string;
  stats?: Array<{
    label: string;
    value: string;
  }>;
}

type ModulePageProps = {
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
  sections?: ModuleSection[];
  children?: React.ReactNode;
};

const defaultRecentItems = [
  "مورد نمونه شماره ۱",
  "مورد نمونه شماره ۲",
  "مورد نمونه شماره ۳",
];

export function ModulePage({
  title,
  description,
  stats,
  sections = [],
  children,
}: ModulePageProps) {
  return (
    <section dir="rtl" className="space-y-6 text-[var(--foreground)]">
      {/* سربرگ ماژول */}
      <div
        className="
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          p-6
          shadow-[var(--shadow-sm)]
          transition-colors
        "
      >
        <h2 className="text-2xl font-bold text-[var(--card-foreground)]">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>

      {/* آمارهای بالا */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--card)]
              p-5
              shadow-[var(--shadow-xs)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-[var(--primary)]
              hover:shadow-[var(--shadow-md)]
            "
          >
            <p className="text-sm text-[var(--muted-foreground)]">
              {item.label}
            </p>

            <p className="mt-3 text-3xl font-bold tracking-tight text-[var(--card-foreground)]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* بخش‌های فرعی و ساب‌ماژول‌ها (در صورت وجود) */}
      {sections.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;
            const CardInner = (
              <div
                className="
                  flex
                  h-full
                  flex-col
                  justify-between
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--card)]
                  p-5
                  shadow-[var(--shadow-xs)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[var(--primary)]
                  hover:shadow-[var(--shadow-md)]
                "
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-2.5 text-[var(--primary)]">
                          <Icon className="h-5 w-5" />
                        </div>
                      )}
                      <h3 className="font-semibold text-[var(--card-foreground)]">
                        {section.title}
                      </h3>
                    </div>

                    {section.badge && (
                      <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-0.5 text-xs text-[var(--muted-foreground)]">
                        {section.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs leading-6 text-[var(--muted-foreground)]">
                    {section.description}
                  </p>
                </div>

                {section.stats && section.stats.length > 0 && (
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs">
                    {section.stats.map((s, idx) => (
                      <div key={idx} className="flex flex-col gap-0.5">
                        <span className="text-[11px] text-[var(--muted-foreground)]">
                          {s.label}
                        </span>
                        <span className="font-semibold text-[var(--card-foreground)]">
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );

            return section.href ? (
              <Link key={section.title} href={section.href} className="block h-full">
                {CardInner}
              </Link>
            ) : (
              <div key={section.title} className="h-full">
                {CardInner}
              </div>
            );
          })}
        </div>
      )}

      {/* محتوای اختصاصی فرستاده شده */}
      {children}

      {/* پنل‌های پیش‌فرض فقط زمانی که بخش‌های فرعی وجود ندارند */}
      {sections.length === 0 && !children && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div
            className="
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--card)]
              p-6
              shadow-[var(--shadow-sm)]
            "
          >
            <h3 className="text-lg font-semibold text-[var(--card-foreground)]">
              آیتم‌های اخیر
            </h3>

            <div className="mt-4 space-y-3">
              {defaultRecentItems.map((item) => (
                <div
                  key={item}
                  className="
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface-muted)]
                    px-4
                    py-3
                    text-sm
                    text-[var(--foreground)]
                    transition-colors
                    hover:bg-[var(--surface-hover)]
                  "
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--card)]
              p-6
              shadow-[var(--shadow-sm)]
              lg:col-span-1
            "
          >
            <h3 className="text-lg font-semibold text-[var(--card-foreground)]">
              وضعیت سریع
            </h3>

            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
              <p>داده‌ها فعلاً آزمایشی هستند.</p>
              <p>در مرحله بعد جدول و فرم اضافه می‌کنیم.</p>
              <p>این بخش آماده اتصال به API است.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
