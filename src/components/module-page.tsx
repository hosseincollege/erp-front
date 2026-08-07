// src/components/module-page.tsx
// بهبود ظاهر ماژول‌ها در حالت Light/Dark با استفاده از CSS Variables و کارت‌های تعاملی

type ModulePageProps = {
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
};

const recentItems = [
  'مورد نمونه شماره ۱',
  'مورد نمونه شماره ۲',
  'مورد نمونه شماره ۳',
];

export function ModulePage({
  title,
  description,
  stats,
}: ModulePageProps) {
  return (
    <section
      dir="rtl"
      className="space-y-6 text-[var(--foreground)]"
    >
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
            {recentItems.map((item) => (
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
    </section>
  );
}
