/**
 * مسیر فایل:
 * src/app/(workspace)/accounting/page.tsx
 *
 * هدف:
 * صفحه اصلی حسابداری با پشتیبانی درست از dark mode و تم پروژه.
 *
 * نکته:
 * این نسخه از ModulePage استفاده نمی‌کند، چون wrapper فعلی
 * در dark mode surfaceهای light را نگه می‌دارد.
 * این صفحه مستقیماً از توکن‌های CSS پروژه و کلاس‌های theme-aware استفاده می‌کند.
 */

"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowDownUp,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  RefreshCw,
  Search,
  WalletCards,
  XCircle,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  accountingApi,
  ApiClientError,
} from "@/lib/accounting-api";

import type {
  AccountingDashboardSummary,
  AccountingDocumentStatus,
  AccountingListItem,
  AccountingPriority,
} from "@/types/accounting";

type StatusFilter = AccountingDocumentStatus | "ALL";
type PriorityFilter = AccountingPriority | "ALL";

type SortOption =
  | "newest"
  | "oldest"
  | "amount-desc"
  | "amount-asc"
  | "title-asc"
  | "title-desc";

const STATUS_OPTIONS: Array<{
  value: StatusFilter;
  label: string;
}> = [
  { value: "ALL", label: "همه وضعیت‌ها" },
  { value: "draft", label: "پیش‌نویس" },
  { value: "submitted", label: "ارسال‌شده" },
  { value: "pending_review", label: "در انتظار بررسی" },
  { value: "approved", label: "تأییدشده" },
  { value: "rejected", label: "ردشده" },
  { value: "in_progress", label: "در حال اجرا" },
  { value: "completed", label: "تکمیل‌شده" },
  { value: "cancelled", label: "لغوشده" },
];

const PRIORITY_OPTIONS: Array<{
  value: PriorityFilter;
  label: string;
}> = [
  { value: "ALL", label: "همه اولویت‌ها" },
  { value: "LOW", label: "کم" },
  { value: "MEDIUM", label: "متوسط" },
  { value: "HIGH", label: "زیاد" },
  { value: "URGENT", label: "فوری" },
];

const SORT_OPTIONS: Array<{
  value: SortOption;
  label: string;
}> = [
  { value: "newest", label: "جدیدترین" },
  { value: "oldest", label: "قدیمی‌ترین" },
  { value: "amount-desc", label: "مبلغ؛ زیاد به کم" },
  { value: "amount-asc", label: "مبلغ؛ کم به زیاد" },
  { value: "title-asc", label: "عنوان؛ الف تا ی" },
  { value: "title-desc", label: "عنوان؛ ی تا الف" },
];

const EMPTY_DASHBOARD: AccountingDashboardSummary = {
  totalInvoices: 0,
  pendingReview: 0,
  approved: 0,
  rejected: 0,
  paid: 0,
  overdue: 0,
};

function formatNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function formatCurrency(
  amount: number,
  currency = "IRR",
): string {
  const formattedAmount = new Intl.NumberFormat("fa-IR").format(
    amount,
  );

  const currencyLabels: Record<string, string> = {
    IRR: "ریال",
    toman: "تومان",
    تومان: "تومان",
    USD: "دلار",
    EUR: "یورو",
  };

  return `${formattedAmount} ${currencyLabels[currency] ?? currency}`;
}

function formatDate(value?: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
  }).format(date);
}

function getStatusLabel(
  status: AccountingDocumentStatus,
): string {
  const option = STATUS_OPTIONS.find(
    (item) => item.value === status,
  );

  return option?.label ?? status;
}

function getPriorityLabel(
  priority: AccountingPriority,
): string {
  const option = PRIORITY_OPTIONS.find(
    (item) => item.value === priority,
  );

  return option?.label ?? priority;
}

function getStatusClassName(
  status: AccountingDocumentStatus,
): string {
  switch (status) {
    case "approved":
      return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20";

    case "completed":
      return "bg-sky-500/10 text-sky-400 ring-sky-500/20";

    case "rejected":
    case "cancelled":
      return "bg-rose-500/10 text-rose-400 ring-rose-500/20";

    case "pending_review":
    case "submitted":
      return "bg-amber-500/10 text-amber-400 ring-amber-500/20";

    case "in_progress":
      return "bg-violet-500/10 text-violet-400 ring-violet-500/20";

    case "draft":
    default:
      return "bg-slate-500/10 text-slate-300 ring-slate-500/20";
  }
}

function getPriorityClassName(
  priority: AccountingPriority,
): string {
  switch (priority) {
    case "URGENT":
      return "bg-rose-500/10 text-rose-400 ring-rose-500/20";

    case "HIGH":
      return "bg-orange-500/10 text-orange-400 ring-orange-500/20";

    case "LOW":
      return "bg-slate-500/10 text-slate-300 ring-slate-500/20";

    case "MEDIUM":
    default:
      return "bg-sky-500/10 text-sky-400 ring-sky-500/20";
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "دریافت اطلاعات حسابداری با خطا مواجه شد.";
}

export default function AccountingPage() {
  const [invoices, setInvoices] = useState<AccountingListItem[]>([]);
  const [dashboard, setDashboard] = useState<AccountingDashboardSummary>(
    EMPTY_DASHBOARD,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const loadAccountingData = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      const [dashboardResult, invoicesResult] = await Promise.all([
        accountingApi.getDashboard(),
        accountingApi.getInvoices(),
      ]);

      setDashboard(dashboardResult);
      setInvoices(invoicesResult);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadAccountingData();
  }, [loadAccountingData]);

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("fa-IR");

    const result = invoices.filter((invoice) => {
      const searchableText = [
        invoice.documentNumber,
        invoice.title,
        invoice.description ?? "",
        invoice.vendorName ?? "",
        invoice.branchName ?? "",
        invoice.departmentName ?? "",
      ]
        .join(" ")
        .toLocaleLowerCase("fa-IR");

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || invoice.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || invoice.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    return result.sort((first, second) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(first.createdAt).getTime() -
            new Date(second.createdAt).getTime()
          );

        case "amount-desc":
          return second.totalAmount - first.totalAmount;

        case "amount-asc":
          return first.totalAmount - second.totalAmount;

        case "title-asc":
          return first.title.localeCompare(second.title, "fa");

        case "title-desc":
          return second.title.localeCompare(first.title, "fa");

        case "newest":
        default:
          return (
            new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime()
          );
      }
    });
  }, [invoices, priorityFilter, search, sortBy, statusFilter]);

  const hasActiveFilters =
    Boolean(search.trim()) ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL";

  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setSortBy("newest");
  }

  const stats = [
    {
      label: "کل فاکتورها",
      value: dashboard.totalInvoices,
      icon: FileText,
      iconClassName:
        "bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/15",
    },
    {
      label: "در انتظار بررسی",
      value: dashboard.pendingReview,
      icon: Clock3,
      iconClassName:
        "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/15",
    },
    {
      label: "تأییدشده",
      value: dashboard.approved,
      icon: CheckCircle2,
      iconClassName:
        "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/15",
    },
    {
      label: "معوق",
      value: dashboard.overdue,
      icon: XCircle,
      iconClassName:
        "bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/15",
    },
  ];

  return (
    <main
      dir="rtl"
      className="min-h-full bg-[var(--background)] px-4 py-4 text-[var(--foreground)] md:px-6 md:py-6"
    >
      <section className="surface-card mb-6 rounded-[var(--radius-card)] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-500 ring-1 ring-inset ring-blue-500/15">
              <WalletCards size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">
                مدیریت حسابداری
              </h1>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                مدیریت فاکتورها، درخواست‌های پرداخت و گردش تأیید مالی
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void loadAccountingData(true)}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={isRefreshing ? "animate-spin" : undefined}
              />
              به‌روزرسانی
            </button>

            <Link
              href="/accounting/new"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              ثبت فاکتور جدید
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="surface-card rounded-[var(--radius-card)] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                    {isLoading ? "—" : formatNumber(stat.value)}
                  </p>
                </div>

                <div className={`rounded-2xl p-3 ${stat.iconClassName}`}>
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="surface-card rounded-[var(--radius-card)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
        <div className="border-b border-[var(--border)] p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                فاکتورها و اسناد مالی
              </h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                فهرست اسناد مالی سازمان جاری
              </p>
            </div>

            <div className="text-sm text-[var(--muted-foreground)]">
              تعداد نتایج:{" "}
              <span className="font-bold text-[var(--foreground)]">
                {formatNumber(filteredInvoices.length)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(240px,1fr)_180px_180px_180px]">
            <div className="relative">
              <Search
                size={17}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جست‌وجو در شماره، عنوان یا تأمین‌کننده..."
                className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] pe-10 ps-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as PriorityFilter)
              }
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="relative">
              <ArrowDownUp
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
              />
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] pe-9 ps-3 text-sm text-[var(--foreground)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-[var(--muted-foreground)]">
            <RefreshCw size={24} className="animate-spin text-blue-500" />
            <p className="text-sm">در حال دریافت اطلاعات حسابداری...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="rounded-full bg-rose-500/10 p-3 text-rose-400 ring-1 ring-inset ring-rose-500/15">
              <AlertCircle size={24} />
            </div>

            <div>
              <h3 className="font-bold text-[var(--foreground)]">
                دریافت اطلاعات ناموفق بود
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadAccountingData()}
              className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              تلاش مجدد
            </button>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="rounded-full bg-[var(--surface-muted)] p-3 text-[var(--muted-foreground)] ring-1 ring-inset ring-[var(--border)]">
              <FileText size={24} />
            </div>

            <div>
              <h3 className="font-bold text-[var(--foreground)]">
                {hasActiveFilters
                  ? "نتیجه‌ای با فیلترهای فعلی پیدا نشد"
                  : "هنوز فاکتوری ثبت نشده است"}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {hasActiveFilters
                  ? "فیلترها را تغییر دهید یا آن‌ها را پاک کنید."
                  : "برای شروع، اولین فاکتور خرید را ثبت کنید."}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]"
                >
                  پاک‌کردن فیلترها
                </button>
              )}

              <Link
                href="/accounting/new"
                className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                ثبت فاکتور جدید
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full text-right">
              <thead className="bg-[var(--surface-muted)]">
                <tr className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                  <th className="px-5 py-4 font-medium">شماره سند</th>
                  <th className="px-5 py-4 font-medium">عنوان</th>
                  <th className="px-5 py-4 font-medium">تأمین‌کننده</th>
                  <th className="px-5 py-4 font-medium">مبلغ</th>
                  <th className="px-5 py-4 font-medium">وضعیت</th>
                  <th className="px-5 py-4 font-medium">اولویت</th>
                  <th className="px-5 py-4 font-medium">سررسید</th>
                  <th className="px-5 py-4 font-medium">عملیات</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--border)]">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="transition hover:bg-[var(--surface-hover)]"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <Link
                        href={`/accounting/${invoice.id}`}
                        className="font-semibold text-blue-500 hover:text-blue-400 hover:underline"
                      >
                        {invoice.documentNumber}
                      </Link>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        {formatDate(invoice.createdAt)}
                      </p>
                    </td>

                    <td className="max-w-[240px] px-5 py-4">
                      <Link
                        href={`/accounting/${invoice.id}`}
                        className="line-clamp-2 font-medium text-[var(--foreground)] hover:text-blue-400"
                      >
                        {invoice.title}
                      </Link>

                      {invoice.description && (
                        <p className="mt-1 line-clamp-1 text-xs text-[var(--muted-foreground)]">
                          {invoice.description}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                      {invoice.vendorName || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                      {formatCurrency(invoice.totalAmount, invoice.currency)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClassName(
                          invoice.status,
                        )}`}
                      >
                        {getStatusLabel(invoice.status)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityClassName(
                          invoice.priority,
                        )}`}
                      >
                        {getPriorityLabel(invoice.priority)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--foreground)]">
                      {formatDate(invoice.dueDate)}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/accounting/${invoice.id}`}
                        className="whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]"
                      >
                        مشاهده جزئیات
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
