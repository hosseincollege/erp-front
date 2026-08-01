import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileBarChart,
  FileText,
  Package,
  ReceiptText,
  ShoppingBasket,
  TrendingUp,
  UserRoundCheck,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/ui/stat-card";

type ModuleItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
  background: string;
  meta: string;
};

const stats = [
  {
    label: "سفارش‌های امروز",
    value: "۲۴",
    hint: "میانگین تکمیل سفارش: ۲ ساعت و ۱۸ دقیقه",
    change: "۸٪",
    trend: "up" as const,
    tone: "primary" as const,
    icon: ShoppingBasket,
  },
  {
    label: "فاکتورهای باز",
    value: "۱۱",
    hint: "۳ فاکتور نیازمند پیگیری فوری هستند",
    change: "۳ مورد",
    trend: "neutral" as const,
    tone: "warning" as const,
    icon: ReceiptText,
  },
  {
    label: "هشدار موجودی",
    value: "۸",
    hint: "۲ قلم کالا به وضعیت بحرانی رسیده‌اند",
    change: "۲ بحرانی",
    trend: "down" as const,
    tone: "danger" as const,
    icon: Boxes,
  },
  {
    label: "کاربران فعال",
    value: "۱۷",
    hint: "۵ ورود جدید از ابتدای امروز ثبت شده است",
    change: "۱۲٪",
    trend: "up" as const,
    tone: "success" as const,
    icon: UserRoundCheck,
  },
];

const modules: ModuleItem[] = [
  {
    title: "مدیریت فروش",
    description: "مشتریان، فرصت‌ها، سفارش‌ها و فاکتورهای فروش",
    href: "/sales",
    icon: CircleDollarSign,
    color: "text-blue-600 dark:text-blue-400",
    background: "bg-blue-50 dark:bg-blue-500/10",
    meta: "۱۲ سفارش باز",
  },
  {
    title: "خرید و تأمین",
    description: "تأمین‌کنندگان، درخواست خرید و سفارش‌های ورودی",
    href: "/purchases",
    icon: ShoppingBasket,
    color: "text-violet-600 dark:text-violet-400",
    background: "bg-violet-50 dark:bg-violet-500/10",
    meta: "۵ درخواست جدید",
  },
  {
    title: "مدیریت انبار",
    description: "موجودی، گردش کالا، انتقال و انبارگردانی",
    href: "/inventory",
    icon: Package,
    color: "text-orange-600 dark:text-orange-400",
    background: "bg-orange-50 dark:bg-orange-500/10",
    meta: "۸ هشدار موجودی",
  },
  {
    title: "مالی و حسابداری",
    description: "اسناد، دریافت‌ها، پرداخت‌ها و مدیریت خزانه",
    href: "/accounting",
    icon: WalletCards,
    color: "text-emerald-600 dark:text-emerald-400",
    background: "bg-emerald-50 dark:bg-emerald-500/10",
    meta: "۳ تأیید در انتظار",
  },
  {
    title: "منابع انسانی",
    description: "پرسنل، حضور و غیاب، مرخصی و ارزیابی",
    href: "/hr",
    icon: Users,
    color: "text-cyan-600 dark:text-cyan-400",
    background: "bg-cyan-50 dark:bg-cyan-500/10",
    meta: "۱۷ کاربر فعال",
  },
  {
    title: "گزارش و تحلیل",
    description: "داشبوردهای مدیریتی و گزارش عملکرد واحدها",
    href: "/reports",
    icon: FileBarChart,
    color: "text-pink-600 dark:text-pink-400",
    background: "bg-pink-50 dark:bg-pink-500/10",
    meta: "به‌روزرسانی امروز",
  },
];

const activities = [
  {
    title: "سفارش فروش جدید ثبت شد",
    description: "سفارش شماره ۱۰۲۴ برای شرکت سپهر",
    time: "۱۰ دقیقه پیش",
    icon: ShoppingBasket,
    iconClass: "text-[var(--primary)] bg-[var(--primary-soft)]",
  },
  {
    title: "پرداخت فاکتور تأیید شد",
    description: "پرداخت مبلغ ۴۸,۵۰۰,۰۰۰ تومان",
    time: "۳۵ دقیقه پیش",
    icon: CheckCircle2,
    iconClass: "text-[var(--success)] bg-[var(--success-soft)]",
  },
  {
    title: "هشدار کاهش موجودی",
    description: "موجودی دو قلم کالا کمتر از حد سفارش است",
    time: "۱ ساعت پیش",
    icon: AlertTriangle,
    iconClass: "text-[var(--warning)] bg-[var(--warning-soft)]",
  },
  {
    title: "پیش‌فاکتور جدید ایجاد شد",
    description: "پیش‌فاکتور شماره ۸۷۶ در انتظار بررسی",
    time: "۲ ساعت پیش",
    icon: FileText,
    iconClass: "text-violet-600 bg-violet-50 dark:bg-violet-500/10",
  },
];

const tasks = [
  {
    title: "تأیید پرداخت فاکتور ۱۰۲۱",
    department: "مالی",
    time: "تا ساعت ۱۲:۳۰",
    priority: "فوری",
    priorityClass: "bg-[var(--danger-soft)] text-[var(--danger)]",
  },
  {
    title: "بررسی موجودی انبار مرکزی",
    department: "انبار",
    time: "تا پایان امروز",
    priority: "مهم",
    priorityClass: "bg-[var(--warning-soft)] text-[var(--warning)]",
  },
  {
    title: "پیگیری پیشنهاد فروش شرکت سپهر",
    department: "فروش",
    time: "فردا، ساعت ۹",
    priority: "عادی",
    priorityClass: "bg-[var(--primary-soft)] text-[var(--primary)]",
  },
];

export default function HomePage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <header className="animate-fade-in flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-end sm:justify-between md:p-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)]">
              <Clock3 size={14} />
              آخرین به‌روزرسانی: امروز، ساعت ۱۹:۰۰
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              سلام حسین، روز بخیر
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
              خلاصه وضعیت سازمان و موارد نیازمند توجه را در یک نگاه ببین و سریع
              وارد ماژول‌های اصلی شو.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
            >
              <ShoppingBasket size={17} />
              ثبت سفارش
            </button>

            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]"
            >
              <FileBarChart size={17} />
              گزارش سریع
            </button>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              hint={item.hint}
              change={item.change}
              trend={item.trend}
              tone={item.tone}
              icon={item.icon}
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.75fr)]">
          <section className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 md:px-6">
              <div>
                <h3 className="font-bold">عملکرد فروش</h3>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  روند درآمد در هفت روز گذشته
                </p>
              </div>

              <button
                type="button"
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-semibold transition hover:bg-[var(--surface-hover)]"
              >
                ۷ روز اخیر
              </button>
            </div>

            <div className="p-5 md:p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-[var(--muted)]">
                    فروش خالص این دوره
                  </p>
                  <p className="mt-2 text-2xl font-bold md:text-3xl">
                    ۱۸۶,۴۵۰,۰۰۰
                    <span className="mr-2 text-sm font-normal text-[var(--muted)]">
                      تومان
                    </span>
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--success-soft)] px-3 py-2 text-xs font-bold text-[var(--success)]">
                  <TrendingUp size={16} />
                  ۱۲.۸٪ رشد
                </div>
              </div>

              <SalesChart />
            </div>
          </section>

          <section className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <h3 className="font-bold">کارهای امروز</h3>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  موارد در انتظار اقدام شما
                </p>
              </div>

              <span className="rounded-lg bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-bold text-[var(--primary)]">
                ۳ مورد
              </span>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {tasks.map((task) => (
                <button
                  key={task.title}
                  type="button"
                  className="flex w-full gap-3 p-4 text-right transition hover:bg-[var(--surface-hover)]"
                >
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2 border-[var(--border-strong)]" />

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {task.title}
                    </span>

                    <span className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[var(--muted)]">
                      <span>{task.department}</span>
                      <span className="size-1 rounded-full bg-[var(--border-strong)]" />
                      <span>{task.time}</span>
                    </span>
                  </span>

                  <span
                    className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${task.priorityClass}`}
                  >
                    {task.priority}
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t border-[var(--border)] p-3">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-soft)]"
              >
                مشاهده همه وظایف
                <ArrowLeft size={15} />
              </button>
            </div>
          </section>
        </div>

        <section className="surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 md:px-6">
            <div>
              <h3 className="font-bold">ماژول‌های سیستم</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                دسترسی سریع به بخش‌های اصلی سازمان
              </p>
            </div>

            <button
              type="button"
              className="hidden items-center gap-1.5 text-xs font-semibold text-[var(--primary)] sm:flex"
            >
              مدیریت ماژول‌ها
              <ArrowLeft size={15} />
            </button>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 md:p-6">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--card)] hover:shadow-[var(--shadow-md)]"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`grid size-11 shrink-0 place-items-center rounded-xl ${module.background} ${module.color}`}
                    >
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold">{module.title}</h4>

                        <ArrowLeft
                          className="shrink-0 text-[var(--muted)] transition group-hover:-translate-x-1 group-hover:text-[var(--primary)]"
                          size={17}
                        />
                      </div>

                      <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
                        {module.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[var(--border)] pt-3 text-[11px] font-medium text-[var(--muted)]">
                    {module.meta}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <h3 className="font-bold">فعالیت‌های اخیر</h3>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  آخرین رویدادهای ثبت‌شده در سیستم
                </p>
              </div>

              <button
                type="button"
                className="text-xs font-semibold text-[var(--primary)]"
              >
                مشاهده همه
              </button>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {activities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div
                    key={activity.title}
                    className="flex items-start gap-3 p-4 transition hover:bg-[var(--surface-hover)]"
                  >
                    <div
                      className={`grid size-10 shrink-0 place-items-center rounded-xl ${activity.iconClass}`}
                    >
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {activity.title}
                      </p>
                      <p className="mt-1 truncate text-xs text-[var(--muted)]">
                        {activity.description}
                      </p>
                    </div>

                    <time className="shrink-0 text-[10px] text-[var(--muted)]">
                      {activity.time}
                    </time>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <h3 className="font-bold">وضعیت مالی</h3>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  خلاصه دریافت‌ها و پرداخت‌های جاری
                </p>
              </div>

              <Link href="/accounting" className="text-xs font-semibold text-[var(--primary)]">
                جزئیات
              </Link>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <FinancialItem
                label="مطالبات دریافتنی"
                value="۱۲۸,۰۰۰,۰۰۰"
                unit="تومان"
                status="۸ فاکتور"
                tone="success"
              />

              <FinancialItem
                label="بدهی پرداختنی"
                value="۷۴,۵۰۰,۰۰۰"
                unit="تومان"
                status="۵ فاکتور"
                tone="warning"
              />
            </div>

            <div className="mx-5 mb-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-[var(--muted)]">مانده خالص تخمینی</p>
                  <p className="mt-1 text-lg font-bold">۵۳,۵۰۰,۰۰۰ تومان</p>
                </div>

                <div className="grid size-11 place-items-center rounded-xl bg-[var(--success-soft)] text-[var(--success)]">
                  <TrendingUp size={21} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </AppShell>
  );
}

function SalesChart() {
  const bars = [
    { day: "شنبه", height: "42%" },
    { day: "یکشنبه", height: "58%" },
    { day: "دوشنبه", height: "47%" },
    { day: "سه‌شنبه", height: "76%" },
    { day: "چهارشنبه", height: "65%" },
    { day: "پنجشنبه", height: "91%" },
    { day: "جمعه", height: "70%" },
  ];

  return (
    <div className="mt-8">
      <div className="flex h-52 items-end gap-2 border-b border-[var(--border)] sm:gap-4">
        {bars.map((bar, index) => (
          <div
            key={bar.day}
            className="group flex h-full flex-1 items-end justify-center"
          >
            <div
              title={`${bar.day}: عملکرد فروش`}
              className="relative w-full max-w-12 rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400 transition duration-200 group-hover:brightness-110"
              style={{
                height: bar.height,
                animationDelay: `${index * 55}ms`,
              }}
            >
              <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] text-white shadow-lg group-hover:block">
                {bar.height}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2 sm:gap-4">
        {bars.map((bar) => (
          <span
            key={bar.day}
            className="flex-1 truncate text-center text-[10px] text-[var(--muted)] sm:text-xs"
          >
            {bar.day}
          </span>
        ))}
      </div>
    </div>
  );
}

function FinancialItem({
  label,
  value,
  unit,
  status,
  tone,
}: {
  label: string;
  value: string;
  unit: string;
  status: string;
  tone: "success" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "bg-[var(--success-soft)] text-[var(--success)]"
      : "bg-[var(--warning-soft)] text-[var(--warning)]";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
      <p className="text-xs text-[var(--muted)]">{label}</p>

      <p className="mt-2 text-lg font-bold">
        {value}
        <span className="mr-1 text-[10px] font-normal text-[var(--muted)]">
          {unit}
        </span>
      </p>

      <span className={`mt-3 inline-flex rounded-lg px-2 py-1 text-[10px] font-bold ${toneClass}`}>
        {status}
      </span>
    </div>
  );
}
