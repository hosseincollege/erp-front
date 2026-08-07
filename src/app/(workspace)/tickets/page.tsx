/**
 * @file src/app/(workspace)/tickets/page.tsx
 * @description صفحه مدیریت تیکت‌ها با رابط RTL و سازگاری کامل با تم‌های روشن و تیره.
 */

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  Clock3,
  Filter,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Ticket,
  UserRound,
  XCircle,
} from 'lucide-react';

import { ticketApi } from '@/lib/ticket-api';

type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

type TicketSource =
  | 'PHONE'
  | 'EMAIL'
  | 'WHATSAPP'
  | 'TELEGRAM'
  | 'WEB'
  | 'IN_PERSON'
  | 'OTHER';

type CustomerSummary = {
  id?: string | null;
  name?: string | null;
  phone?: string | null;
};

type CreatorSummary = {
  id?: string | null;
  fullName?: string | null;
  email?: string | null;
};

type TicketRecord = {
  id: string;
  ticketNumber?: string | null;
  title: string;
  description?: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  source?: TicketSource | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customer?: CustomerSummary | null;
  creator?: CreatorSummary | null;
  createdAt: string;
  updatedAt?: string;
};

type SortOption =
  | 'newest'
  | 'oldest'
  | 'priority-desc'
  | 'priority-asc'
  | 'title-asc'
  | 'title-desc';

const STATUS_OPTIONS: Array<{
  value: TicketStatus | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: 'همه وضعیت‌ها' },
  { value: 'OPEN', label: 'باز' },
  { value: 'IN_PROGRESS', label: 'در حال پیگیری' },
  { value: 'RESOLVED', label: 'حل‌شده' },
  { value: 'CLOSED', label: 'بسته‌شده' },
];

const PRIORITY_OPTIONS: Array<{
  value: TicketPriority | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: 'همه اولویت‌ها' },
  { value: 'LOW', label: 'کم' },
  { value: 'MEDIUM', label: 'متوسط' },
  { value: 'HIGH', label: 'زیاد' },
  { value: 'URGENT', label: 'فوری' },
];

const SORT_OPTIONS: Array<{
  value: SortOption;
  label: string;
}> = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'oldest', label: 'قدیمی‌ترین' },
  { value: 'priority-desc', label: 'اولویت: زیاد به کم' },
  { value: 'priority-asc', label: 'اولویت: کم به زیاد' },
  { value: 'title-asc', label: 'عنوان: الف تا ی' },
  { value: 'title-desc', label: 'عنوان: ی تا الف' },
];

const PRIORITY_SCORE: Record<TicketPriority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
};

function formatDate(dateValue?: string) {
  if (!dateValue) {
    return '-';
  }

  try {
    return new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateValue));
  } catch {
    return dateValue;
  }
}

function getStatusLabel(status: TicketStatus) {
  switch (status) {
    case 'OPEN':
      return 'باز';
    case 'IN_PROGRESS':
      return 'در حال پیگیری';
    case 'RESOLVED':
      return 'حل‌شده';
    case 'CLOSED':
      return 'بسته‌شده';
    default:
      return status;
  }
}

function getPriorityLabel(priority: TicketPriority) {
  switch (priority) {
    case 'LOW':
      return 'کم';
    case 'MEDIUM':
      return 'متوسط';
    case 'HIGH':
      return 'زیاد';
    case 'URGENT':
      return 'فوری';
    default:
      return priority;
  }
}

function getSourceLabel(source?: TicketSource | null) {
  switch (source) {
    case 'PHONE':
      return 'تلفنی';
    case 'EMAIL':
      return 'ایمیل';
    case 'WHATSAPP':
      return 'واتساپ';
    case 'TELEGRAM':
      return 'تلگرام';
    case 'WEB':
      return 'وب';
    case 'IN_PERSON':
      return 'حضوری';
    case 'OTHER':
      return 'سایر';
    default:
      return '-';
  }
}

function getStatusClassName(status: TicketStatus) {
  switch (status) {
    case 'OPEN':
      return 'border-[var(--info)]/20 bg-[var(--info-soft)] text-[var(--info)]';
    case 'IN_PROGRESS':
      return 'border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--warning)]';
    case 'RESOLVED':
      return 'border-[var(--success)]/20 bg-[var(--success-soft)] text-[var(--success)]';
    case 'CLOSED':
      return 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]';
    default:
      return 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]';
  }
}

function getPriorityClassName(priority: TicketPriority) {
  switch (priority) {
    case 'LOW':
      return 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]';
    case 'MEDIUM':
      return 'border-[var(--primary)]/20 bg-[var(--primary-soft)] text-[var(--primary)]';
    case 'HIGH':
      return 'border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--warning)]';
    case 'URGENT':
      return 'border-[var(--danger)]/20 bg-[var(--danger-soft)] text-[var(--danger)]';
    default:
      return 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]';
  }
}

function normalizeText(value?: string | null) {
  return value?.trim().toLowerCase() || '';
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>(
    'ALL',
  );
  const [priorityFilter, setPriorityFilter] = useState<
    TicketPriority | 'ALL'
  >('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  async function loadTickets(refresh = false) {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      const result = await ticketApi.getTickets();
      setTickets((result || []) as TicketRecord[]);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'دریافت اطلاعات تیکت‌ها با خطا مواجه شد.',
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    void loadTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    const query = normalizeText(search);

    const nextItems = tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === 'ALL' ? true : ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'ALL'
          ? true
          : ticket.priority === priorityFilter;

      const haystack = [
        ticket.ticketNumber,
        ticket.title,
        ticket.description,
        ticket.customerName,
        ticket.customerPhone,
        ticket.customer?.name,
        ticket.customer?.phone,
        ticket.creator?.fullName,
        ticket.creator?.email,
      ]
        .map((value) => normalizeText(value))
        .join(' ');

      const matchesSearch = query ? haystack.includes(query) : true;

      return matchesStatus && matchesPriority && matchesSearch;
    });

    nextItems.sort((a, b) => {
      if (sortBy === 'newest') {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }

      if (sortBy === 'oldest') {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (sortBy === 'priority-desc') {
        return PRIORITY_SCORE[b.priority] - PRIORITY_SCORE[a.priority];
      }

      if (sortBy === 'priority-asc') {
        return PRIORITY_SCORE[a.priority] - PRIORITY_SCORE[b.priority];
      }

      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title, 'fa');
      }

      return b.title.localeCompare(a.title, 'fa');
    });

    return nextItems;
  }, [tickets, search, statusFilter, priorityFilter, sortBy]);

  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((item) => item.status === 'OPEN').length,
      inProgress: tickets.filter(
        (item) => item.status === 'IN_PROGRESS',
      ).length,
      urgent: tickets.filter((item) => item.priority === 'URGENT').length,
      resolved: tickets.filter((item) => item.status === 'RESOLVED').length,
    }),
    [tickets],
  );

  return (
    <div dir="rtl" className="space-y-6 text-[var(--foreground)]">
      <section
        className="
          rounded-2xl border border-[var(--border)]
          bg-[var(--surface)] p-6
          shadow-[0_20px_60px_var(--shadow-color)]
          backdrop-blur
        "
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div
              className="
                inline-flex items-center gap-2 rounded-full
                border border-[var(--warning)]/20
                bg-[var(--warning-soft)]
                px-3 py-1 text-xs font-medium
                text-[var(--warning)]
              "
            >
              <Ticket className="h-4 w-4" />
              ماژول تیکت و پشتیبانی
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)]">
                مدیریت تیکت‌ها
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                ثبت، پایش و پیگیری درخواست‌های مشتریان در یک نمای یکپارچه عملیاتی.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void loadTickets(true)}
              disabled={isRefreshing || isLoading}
              className="
                inline-flex h-11 items-center justify-center gap-2 rounded-xl
                border border-[var(--border)]
                bg-[var(--surface-muted)]
                px-4 text-sm font-medium
                text-[var(--foreground)]
                transition-colors
                hover:bg-[var(--surface-hover)]
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              بروزرسانی
            </button>

            <Link
              href="/tickets/new"
              className="
                inline-flex h-11 items-center justify-center gap-2 rounded-xl
                bg-[var(--primary)]
                px-4 text-sm font-semibold
                text-[var(--primary-foreground)]
                transition-opacity hover:opacity-90
              "
            >
              <Plus className="h-4 w-4" />
              ثبت تیکت جدید
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="کل تیکت‌ها"
          value={stats.total}
          icon={<Ticket className="h-5 w-5" />}
          tone="primary"
        />

        <StatCard
          title="باز"
          value={stats.open}
          icon={<Clock3 className="h-5 w-5" />}
          tone="info"
        />

        <StatCard
          title="در حال پیگیری"
          value={stats.inProgress}
          icon={<RefreshCcw className="h-5 w-5" />}
          tone="warning"
        />

        <StatCard
          title="فوری"
          value={stats.urgent}
          icon={<AlertCircle className="h-5 w-5" />}
          tone="danger"
        />

        <StatCard
          title="حل‌شده"
          value={stats.resolved}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tone="success"
        />
      </section>

      <section
        className="
          rounded-2xl border border-[var(--border)]
          bg-[var(--surface)]
          shadow-[0_20px_60px_var(--shadow-color)]
        "
      >
        <div className="border-b border-[var(--border)] p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2 text-[var(--foreground)]">
              <Filter className="h-4 w-4 text-[var(--muted)]" />
              <span className="text-sm font-medium">فیلتر و جستجو</span>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="relative min-w-[220px]">
                <Search
                  className="
                    pointer-events-none absolute right-3 top-1/2
                    h-4 w-4 -translate-y-1/2 text-[var(--muted)]
                  "
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="جستجو در عنوان، شماره، مشتری..."
                  className="
                    h-11 w-full rounded-xl
                    border border-[var(--border)]
                    bg-[var(--background)]
                    pr-10 pl-3 text-sm
                    text-[var(--foreground)]
                    outline-none transition-colors
                    placeholder:text-[var(--muted)]
                    focus:border-[var(--primary)]/50
                    focus:ring-2 focus:ring-[var(--ring)]/20
                  "
                />
              </div>

              <FilterSelect
                value={statusFilter}
                onChange={(value) =>
                  setStatusFilter(value as TicketStatus | 'ALL')
                }
                options={STATUS_OPTIONS}
              />

              <FilterSelect
                value={priorityFilter}
                onChange={(value) =>
                  setPriorityFilter(value as TicketPriority | 'ALL')
                }
                options={PRIORITY_OPTIONS}
              />

              <FilterSelect
                value={sortBy}
                onChange={(value) => setSortBy(value as SortOption)}
                options={SORT_OPTIONS}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div
              className="
                flex items-center gap-3 rounded-xl
                border border-[var(--border)]
                bg-[var(--surface-muted)]
                px-4 py-3 text-sm text-[var(--foreground)]
              "
            >
              <Loader2 className="h-5 w-5 animate-spin text-[var(--primary)]" />
              در حال دریافت اطلاعات تیکت‌ها...
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[320px] items-center justify-center p-6">
            <div
              className="
                w-full max-w-xl rounded-2xl
                border border-[var(--danger)]/20
                bg-[var(--danger-soft)]
                p-6 text-center
              "
            >
              <div
                className="
                  mx-auto mb-4 flex h-12 w-12 items-center justify-center
                  rounded-full bg-[var(--danger-soft)]
                  text-[var(--danger)]
                "
              >
                <XCircle className="h-6 w-6" />
              </div>

              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                خطا در دریافت تیکت‌ها
              </h2>

              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void loadTickets(true)}
                className="
                  mt-5 inline-flex h-11 items-center justify-center gap-2
                  rounded-xl bg-[var(--primary)]
                  px-4 text-sm font-semibold
                  text-[var(--primary-foreground)]
                  transition-opacity hover:opacity-90
                "
              >
                <RefreshCcw className="h-4 w-4" />
                تلاش مجدد
              </button>
            </div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center p-6">
            <div
              className="
                w-full max-w-xl rounded-2xl
                border border-[var(--border)]
                bg-[var(--surface-muted)]
                p-6 text-center
              "
            >
              <div
                className="
                  mx-auto mb-4 flex h-12 w-12 items-center justify-center
                  rounded-full bg-[var(--primary-soft)]
                  text-[var(--primary)]
                "
              >
                <Ticket className="h-6 w-6" />
              </div>

              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                تیکتی پیدا نشد
              </h2>

              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                با فیلترهای فعلی موردی برای نمایش وجود ندارد. می‌توانی فیلترها را تغییر دهی
                یا یک تیکت جدید ثبت کنی.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('ALL');
                    setPriorityFilter('ALL');
                    setSortBy('newest');
                  }}
                  className="
                    inline-flex h-11 items-center justify-center rounded-xl
                    border border-[var(--border)]
                    bg-[var(--surface)]
                    px-4 text-sm font-medium
                    text-[var(--foreground)]
                    transition-colors hover:bg-[var(--surface-hover)]
                  "
                >
                  پاک کردن فیلترها
                </button>

                <Link
                  href="/tickets/new"
                  className="
                    inline-flex h-11 items-center justify-center gap-2 rounded-xl
                    bg-[var(--primary)]
                    px-4 text-sm font-semibold
                    text-[var(--primary-foreground)]
                    transition-opacity hover:opacity-90
                  "
                >
                  <Plus className="h-4 w-4" />
                  ثبت تیکت
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className="
                flex items-center justify-between
                border-b border-[var(--border)]
                px-5 py-4 text-sm text-[var(--muted)]
              "
            >
              <span>{filteredTickets.length} تیکت نمایش داده می‌شود</span>

              <span className="inline-flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                مرتب‌سازی:{' '}
                {SORT_OPTIONS.find((item) => item.value === sortBy)?.label}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--border)]">
                <thead className="bg-[var(--surface-muted)]">
                  <tr className="text-right text-xs font-semibold text-[var(--muted)]">
                    <th className="px-5 py-4">تیکت</th>
                    <th className="px-5 py-4">مشتری</th>
                    <th className="px-5 py-4">وضعیت</th>
                    <th className="px-5 py-4">اولویت</th>
                    <th className="px-5 py-4">منبع</th>
                    <th className="px-5 py-4">ثبت‌کننده</th>
                    <th className="px-5 py-4">تاریخ ثبت</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--border)]">
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="transition-colors hover:bg-[var(--surface-hover)]"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/tickets/${ticket.id}`}
                          className="block"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[var(--foreground)]">
                                {ticket.title}
                              </span>

                              {ticket.ticketNumber ? (
                                <span
                                  className="
                                    rounded-full border border-[var(--border)]
                                    bg-[var(--surface-muted)]
                                    px-2 py-0.5 text-[11px]
                                    text-[var(--muted)]
                                  "
                                >
                                  {ticket.ticketNumber}
                                </span>
                              ) : null}
                            </div>

                            <p
                              className="
                                line-clamp-2 max-w-[360px]
                                text-xs leading-6 text-[var(--muted)]
                              "
                            >
                              {ticket.description || 'بدون توضیحات تکمیلی'}
                            </p>
                          </div>
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 text-sm text-[var(--foreground)]">
                          <span>
                            {ticket.customer?.name ||
                              ticket.customerName ||
                              '-'}
                          </span>

                          <span className="text-xs text-[var(--muted)]">
                            {ticket.customer?.phone ||
                              ticket.customerPhone ||
                              '-'}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex items-center rounded-full border
                            px-2.5 py-1 text-xs font-medium
                            ${getStatusClassName(ticket.status)}
                          `}
                        >
                          {getStatusLabel(ticket.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex items-center rounded-full border
                            px-2.5 py-1 text-xs font-medium
                            ${getPriorityClassName(ticket.priority)}
                          `}
                        >
                          {getPriorityLabel(ticket.priority)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-[var(--muted)]">
                        {getSourceLabel(ticket.source)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
                          <UserRound className="h-4 w-4 opacity-70" />
                          <span>
                            {ticket.creator?.fullName ||
                              ticket.creator?.email ||
                              '-'}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[var(--muted)]">
                        {formatDate(ticket.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="
        h-11 rounded-xl
        border border-[var(--border)]
        bg-[var(--background)]
        px-3 text-sm
        text-[var(--foreground)]
        outline-none transition-colors
        focus:border-[var(--primary)]/50
        focus:ring-2 focus:ring-[var(--ring)]/20
      "
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-[var(--surface)] text-[var(--foreground)]"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

function StatCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  tone: 'primary' | 'info' | 'warning' | 'danger' | 'success';
}) {
  const toneClass =
    tone === 'primary'
      ? 'bg-[var(--primary-soft)] text-[var(--primary)] border-[var(--primary)]/20'
      : tone === 'info'
        ? 'bg-[var(--info-soft)] text-[var(--info)] border-[var(--info)]/20'
        : tone === 'warning'
          ? 'bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning)]/20'
          : tone === 'danger'
            ? 'bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/20'
            : 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]/20';

  return (
    <div
      className="
        rounded-2xl border border-[var(--border)]
        bg-[var(--surface)]
        p-5
        shadow-[0_20px_60px_var(--shadow-color)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">{title}</p>
          <p className="mt-3 text-3xl font-bold text-[var(--foreground)]">
            {value}
          </p>
        </div>

        <div className={`rounded-xl border p-3 ${toneClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
