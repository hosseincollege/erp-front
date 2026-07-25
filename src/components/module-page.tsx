type ModulePageProps = {
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
};

export function ModulePage({ title, description, stats }: ModulePageProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <p className="text-sm text-[var(--muted)]">{item.label}</p>
            <p className="mt-3 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold">آیتم های اخیر</h3>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm">
              مورد نمونه شماره 1
            </div>
            <div className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm">
              مورد نمونه شماره 2
            </div>
            <div className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm">
              مورد نمونه شماره 3
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h3 className="text-lg font-semibold">وضعیت سریع</h3>

          <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <p>داده ها فعلا آزمایشی هستند.</p>
            <p>در مرحله بعد جدول و فرم اضافه می کنیم.</p>
            <p>این بخش آماده اتصال به API است.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
