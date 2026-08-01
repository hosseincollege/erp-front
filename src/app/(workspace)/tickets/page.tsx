/* file: src/app/(workspace)/tickets/page.tsx */
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode, SVGProps } from 'react';
import type { 
  ApiTicket, 
  IncidentSeverity, 
  TicketPriority, 
  TicketRow, 
  TicketStatus 
} from '@/types/ticket';
import { statusConfig } from '@/lib/ticket-constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3006';


type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';

type IncidentSeverity =
  | 'MINOR'
  | 'DEGRADED'
  | 'PARTIAL_OUTAGE'
  | 'FULL_OUTAGE';

type TicketRow = {
  id: string;
  number: string;
  title: string;
  customer: string;
  service: string;
  status: TicketStatus;
  priority: TicketPriority;
  severity: IncidentSeverity;
  assignedTo: string;
  team: string;
  createdAt: string;
  updatedAt: string;
  slaRemaining: string;
  breached: boolean;
  tags: string[];
};

type ApiTicket = Record<string, any>;



const priorityConfig: Record<TicketPriority, { label: string; className: string }> =
  {
    LOW: {
      label: 'کم',
      className: 'bg-slate-100 text-slate-700 ring-slate-200',
    },
    MEDIUM: {
      label: 'متوسط',
      className: 'bg-blue-50 text-blue-700 ring-blue-200',
    },
    HIGH: {
      label: 'زیاد',
      className: 'bg-amber-50 text-amber-700 ring-amber-200',
    },
    URGENT: {
      label: 'فوری',
      className: 'bg-orange-50 text-orange-700 ring-orange-200',
    },
    CRITICAL: {
      label: 'بحرانی',
      className: 'bg-red-50 text-red-700 ring-red-200',
    },
  };

const severityConfig: Record<
  IncidentSeverity,
  { label: string; className: string }
> = {
  MINOR: {
    label: 'جزئی',
    className: 'bg-slate-100 text-slate-700 ring-slate-200',
  },
  DEGRADED: {
    label: 'افت کیفیت',
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  PARTIAL_OUTAGE: {
    label: 'قطعی جزئی',
    className: 'bg-orange-50 text-orange-700 ring-orange-200',
  },
  FULL_OUTAGE: {
    label: 'قطع کامل',
    className: 'bg-red-50 text-red-700 ring-red-200',
  },
};

type IconName =
  | 'plus'
  | 'search'
  | 'filter'
  | 'ticket'
  | 'alert'
  | 'clock'
  | 'check'
  | 'chevron-left'
  | 'shield'
  | 'more'
  | 'refresh';

function Icon({
  name,
  className,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName;
}) {
  const paths: Record<IconName, ReactNode> = {
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    filter: (
      <>
        <path d="M4 6h16" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </>
    ),
    ticket: (
      <>
        <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" />
        <path d="M13 7v10" />
      </>
    ),
    alert: (
      <>
        <path d="M10.3 3.8 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    'chevron-left': <path d="m15 18-6-6 6-6" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
      </>
    ),
    refresh: (
      <>
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 3v6h-6" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  tone = 'default',
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  tone?: 'default' | 'danger' | 'success' | 'warning';
}) {
  const toneClass =
    tone === 'danger'
      ? 'border-red-200 bg-red-50'
      : tone === 'success'
      ? 'border-emerald-200 bg-emerald-50'
      : tone === 'warning'
      ? 'border-amber-200 bg-amber-50'
      : 'border-[var(--border)] bg-[var(--card)]';

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[var(--muted)]">{title}</p>
          <p className="mt-2 text-2xl font-black text-[var(--foreground)]">
            {value}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p>
        </div>

        <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--foreground)]">
          {icon}
        </span>
      </div>
    </div>
  );
}

function normalizeStatus(value: any): TicketStatus {
  const normalized = String(value || '')
    .trim()
    .toUpperCase();

  const allowed: TicketStatus[] = [
    'NEW',
    'OPEN',
    'IN_PROGRESS',
    'PENDING_CUSTOMER',
    'PENDING_VENDOR',
    'PENDING_FIELD_TEAM',
    'MONITORING',
    'RESOLVED',
    'CLOSED',
    'REOPENED',
    'CANCELED',
  ];

  return allowed.includes(normalized as TicketStatus)
    ? (normalized as TicketStatus)
    : 'NEW';
}

function normalizePriority(value: any): TicketPriority {
  const normalized = String(value || '')
    .trim()
    .toUpperCase();

  if (normalized === 'NORMAL') return 'MEDIUM';

  const allowed: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL'];

  return allowed.includes(normalized as TicketPriority)
    ? (normalized as TicketPriority)
    : 'MEDIUM';
}

function normalizeSeverity(value: any, priority: TicketPriority): IncidentSeverity {
  const normalized = String(value || '')
    .trim()
    .toUpperCase();

  const allowed: IncidentSeverity[] = [
    'MINOR',
    'DEGRADED',
    'PARTIAL_OUTAGE',
    'FULL_OUTAGE',
  ];

  if (allowed.includes(normalized as IncidentSeverity)) {
    return normalized as IncidentSeverity;
  }

  if (priority === 'CRITICAL') return 'FULL_OUTAGE';
  if (priority === 'URGENT') return 'PARTIAL_OUTAGE';
  if (priority === 'HIGH') return 'DEGRADED';
  return 'MINOR';
}

function sourceLabel(source: any): string {
  const normalized = String(source || '')
    .trim()
    .toUpperCase();

  switch (normalized) {
    case 'PHONE':
      return 'تماس تلفنی';
    case 'BALE':
      return 'بله';
    case 'WHATSAPP':
      return 'واتساپ';
    case 'EMAIL':
      return 'ایمیل';
    case 'IN_PERSON':
      return 'حضوری';
    case 'SYSTEM':
      return 'سیستمی';
    default:
      return 'ثبت‌شده';
  }
}

function formatDate(value: any): string {
  if (!value) return 'نامشخص';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatRelative(value: any): string {
  if (!value) return 'نامشخص';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'لحظاتی پیش';
  if (diffMin < 60) return `${diffMin} دقیقه پیش`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} ساعت پیش`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} روز پیش`;

  return formatDate(value);
}

function extractArray(data: any): ApiTicket[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.tickets)) return data.tickets;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data?.tickets)) return data.data.tickets;
  return [];
}

function mapApiTicketToRow(ticket: ApiTicket): TicketRow {
  const priority = normalizePriority(ticket.priority);
  const status = normalizeStatus(ticket.status);

  const customer =
    ticket.customerName ||
    ticket.customer?.name ||
    ticket.customer?.title ||
    ticket.customer ||
    'مشتری نامشخص';

  const service =
    ticket.serviceName ||
    ticket.service?.name ||
    ticket.service ||
    sourceLabel(ticket.source);

  const assignedTo =
    ticket.assignedTo?.name ||
    ticket.assignedToName ||
    ticket.assignee?.name ||
    ticket.assigneeName ||
    'تعیین نشده';

  const team =
    ticket.team?.name || ticket.teamName || ticket.departmentName || 'پشتیبانی عمومی';

  const createdRaw = ticket.createdAt || ticket.created_at || ticket.dateCreated;
  const updatedRaw =
    ticket.updatedAt || ticket.updated_at || ticket.lastUpdatedAt || createdRaw;

  const severity = normalizeSeverity(ticket.severity, priority);

  const slaRemaining =
    ticket.slaRemaining ||
    ticket.sla_remaining ||
    (ticket.breached || ticket.slaBreached ? 'نقض شده' : 'نامشخص');

  const breached = Boolean(ticket.breached || ticket.slaBreached);

  const tags: string[] = [
    ticket.source ? sourceLabel(ticket.source) : '',
    ticket.customerPhone ? `تماس: ${ticket.customerPhone}` : '',
  ].filter(Boolean);

  const id = String(ticket.id ?? ticket.number ?? ticket.ticketNumber ?? crypto.randomUUID());
  const number = String(ticket.ticketNumber ?? ticket.number ?? id);

  return {
    id,
    number,
    title: ticket.title || 'بدون عنوان',
    customer: String(customer),
    service: String(service),
    status,
    priority,
    severity,
    assignedTo: String(assignedTo),
    team: String(team),
    createdAt: formatDate(createdRaw),
    updatedAt: formatRelative(updatedRaw),
    slaRemaining: String(slaRemaining),
    breached,
    tags,
  };
}

export default function TicketsPage() {
  const [allTickets, setAllTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [slaFilter, setSlaFilter] = useState('ALL');

  const fetchTickets = async (isRefresh = false) => {
    try {
      setError('');
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'دریافت لیست تیکت‌ها با خطا مواجه شد.');
      }

      const rawTickets = extractArray(data);
      const mapped = rawTickets.map(mapApiTicketToRow);

      setAllTickets(mapped);
    } catch (err: any) {
      setError(err?.message || 'خطای ناشناخته‌ای در دریافت تیکت‌ها رخ داد.');
      setAllTickets([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return allTickets.filter((ticket) => {
      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        ticket.number.toLowerCase().includes(q) ||
        ticket.title.toLowerCase().includes(q) ||
        ticket.customer.toLowerCase().includes(q) ||
        ticket.service.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'ALL' || ticket.priority === priorityFilter;

      const matchesSla =
        slaFilter === 'ALL' ||
        (slaFilter === 'BREACHED' && ticket.breached) ||
        (slaFilter === 'OK' && !ticket.breached);

      return matchesSearch && matchesStatus && matchesPriority && matchesSla;
    });
  }, [allTickets, search, statusFilter, priorityFilter, slaFilter]);

  const totalTickets = allTickets.length;
  const criticalTickets = allTickets.filter(
    (ticket) => ticket.priority === 'CRITICAL' || ticket.priority === 'URGENT'
  ).length;
  const breachedTickets = allTickets.filter((ticket) => ticket.breached).length;
  const resolvedTickets = allTickets.filter(
    (ticket) => ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
  ).length;

  return (
    <div className="space-y-6 p-6" dir="rtl">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">تیکت‌ها</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            فهرست تیکت‌های ثبت‌شده، در حال پیگیری و نهایی‌شده
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fetchTickets(true)}
            disabled={refreshing}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--card-foreground)] transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="refresh" className="size-4" />
            {refreshing ? 'در حال بروزرسانی...' : 'بروزرسانی'}
          </button>

          <Link
            href="/tickets/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
          >
            <Icon name="plus" className="size-4" />
            ثبت تیکت جدید
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="کل تیکت‌ها"
          value={String(totalTickets)}
          subtitle="همه موارد دریافتی از سرور"
          icon={<Icon name="ticket" className="size-5" />}
        />

        <StatCard
          title="فوری / بحرانی"
          value={String(criticalTickets)}
          subtitle="نیازمند رسیدگی سریع"
          icon={<Icon name="alert" className="size-5" />}
          tone="danger"
        />

        <StatCard
          title="نقض SLA"
          value={String(breachedTickets)}
          subtitle="خارج از سطح خدمت"
          icon={<Icon name="clock" className="size-5" />}
          tone="warning"
        />

        <StatCard
          title="رفع‌شده / بسته"
          value={String(resolvedTickets)}
          subtitle="پرونده‌های نهایی‌شده"
          icon={<Icon name="check" className="size-5" />}
          tone="success"
        />
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-4">
          <div className="relative xl:col-span-1">
            <Icon
              name="search"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جست‌وجو بر اساس شماره، عنوان، مشتری یا سرویس..."
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pr-10 pl-4 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
          >
            <option value="ALL">همه وضعیت‌ها</option>
            <option value="NEW">جدید</option>
            <option value="OPEN">باز</option>
            <option value="IN_PROGRESS">در حال بررسی</option>
            <option value="PENDING_CUSTOMER">در انتظار مشتری</option>
            <option value="PENDING_VENDOR">در انتظار تأمین‌کننده</option>
            <option value="PENDING_FIELD_TEAM">در انتظار تیم میدانی</option>
            <option value="MONITORING">تحت پایش</option>
            <option value="RESOLVED">رفع‌شده</option>
            <option value="CLOSED">بسته‌شده</option>
            <option value="REOPENED">بازگشایی‌شده</option>
            <option value="CANCELED">لغوشده</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
          >
            <option value="ALL">همه اولویت‌ها</option>
            <option value="LOW">کم</option>
            <option value="MEDIUM">متوسط</option>
            <option value="HIGH">زیاد</option>
            <option value="URGENT">فوری</option>
            <option value="CRITICAL">بحرانی</option>
          </select>

          <select
            value={slaFilter}
            onChange={(e) => setSlaFilter(e.target.value)}
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
          >
            <option value="ALL">وضعیت SLA</option>
            <option value="OK">در محدوده مجاز</option>
            <option value="BREACHED">نقض شده</option>
          </select>
        </div>
      </section>

      {error ? (
        <section className="rounded-2xl border border-[color:var(--danger)]/30 bg-[color:var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </section>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--card-foreground)]">
              لیست تیکت‌ها
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {loading
                ? 'در حال دریافت اطلاعات...'
                : `${filteredTickets.length} مورد از ${allTickets.length} تیکت نمایش داده می‌شود`}
            </p>
          </div>

          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--muted)] transition hover:bg-[var(--accent)]"
          >
            <Icon name="more" className="size-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[var(--muted)]">
            در حال بارگذاری تیکت‌ها...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--muted)]">
              <Icon name="ticket" className="size-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-[var(--foreground)]">
              تیکتی برای نمایش پیدا نشد
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              اگر همین الآن تیکت ثبت کرده‌ای، روی «بروزرسانی» بزن یا یک تیکت جدید ایجاد کن.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fetchTickets(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--accent)]"
              >
                <Icon name="refresh" className="size-4" />
                بروزرسانی
              </button>

              <Link
                href="/tickets/new"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
              >
                <Icon name="plus" className="size-4" />
                ثبت تیکت جدید
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[var(--background)]">
                    <th className="border-b border-[var(--border)] px-5 py-3 text-right text-xs font-bold text-[var(--muted)]">
                      تیکت
                    </th>
                    <th className="border-b border-[var(--border)] px-5 py-3 text-right text-xs font-bold text-[var(--muted)]">
                      مشتری / سرویس
                    </th>
                    <th className="border-b border-[var(--border)] px-5 py-3 text-right text-xs font-bold text-[var(--muted)]">
                      وضعیت
                    </th>
                    <th className="border-b border-[var(--border)] px-5 py-3 text-right text-xs font-bold text-[var(--muted)]">
                      اولویت / شدت
                    </th>
                    <th className="border-b border-[var(--border)] px-5 py-3 text-right text-xs font-bold text-[var(--muted)]">
                      مسئول
                    </th>
                    <th className="border-b border-[var(--border)] px-5 py-3 text-right text-xs font-bold text-[var(--muted)]">
                      SLA
                    </th>
                    <th className="border-b border-[var(--border)] px-5 py-3 text-right text-xs font-bold text-[var(--muted)]">
                      آخرین بروزرسانی
                    </th>
                    <th className="border-b border-[var(--border)] px-5 py-3 text-right text-xs font-bold text-[var(--muted)]">
                      عملیات
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((ticket) => {
                    const status = statusConfig[ticket.status];
                    const priority = priorityConfig[ticket.priority];
                    const severity = severityConfig[ticket.severity];

                    return (
                      <tr
                        key={ticket.id}
                        className="transition hover:bg-[var(--background)]"
                      >
                        <td className="border-b border-[var(--border)] px-5 py-4 align-top">
                          <div className="min-w-[250px]">
                            <Link
                              href={`/tickets/${ticket.id}`}
                              className="font-mono text-xs font-bold text-[var(--primary)] hover:underline"
                              dir="ltr"
                            >
                              {ticket.number}
                            </Link>

                            <h3 className="mt-2 text-sm font-bold text-[var(--card-foreground)]">
                              <Link
                                href={`/tickets/${ticket.id}`}
                                className="hover:text-[var(--primary)]"
                              >
                                {ticket.title}
                              </Link>
                            </h3>

                            {ticket.tags.length > 0 ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {ticket.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-lg bg-[var(--accent)] px-2 py-1 text-[11px] font-medium text-[var(--muted)]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </td>

                        <td className="border-b border-[var(--border)] px-5 py-4 align-top">
                          <div className="min-w-[180px]">
                            <p className="text-sm font-semibold text-[var(--card-foreground)]">
                              {ticket.customer}
                            </p>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                              {ticket.service}
                            </p>
                          </div>
                        </td>

                        <td className="border-b border-[var(--border)] px-5 py-4 align-top">
                          <Badge className={status.className}>{status.label}</Badge>
                        </td>

                        <td className="border-b border-[var(--border)] px-5 py-4 align-top">
                          <div className="flex min-w-[160px] flex-wrap gap-2">
                            <Badge className={priority.className}>
                              {priority.label}
                            </Badge>
                            <Badge className={severity.className}>
                              {severity.label}
                            </Badge>
                          </div>
                        </td>

                        <td className="border-b border-[var(--border)] px-5 py-4 align-top">
                          <div className="min-w-[150px]">
                            <p className="text-sm font-medium text-[var(--card-foreground)]">
                              {ticket.assignedTo}
                            </p>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                              {ticket.team}
                            </p>
                          </div>
                        </td>

                        <td className="border-b border-[var(--border)] px-5 py-4 align-top">
                          {ticket.breached ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700">
                              <Icon name="alert" className="size-3.5" />
                              نقض شده
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                              <Icon name="shield" className="size-3.5" />
                              {ticket.slaRemaining}
                            </span>
                          )}
                        </td>

                        <td className="border-b border-[var(--border)] px-5 py-4 align-top">
                          <div className="min-w-[130px]">
                            <p className="text-sm font-medium text-[var(--card-foreground)]">
                              {ticket.updatedAt}
                            </p>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                              ثبت: {ticket.createdAt}
                            </p>
                          </div>
                        </td>

                        <td className="border-b border-[var(--border)] px-5 py-4 align-top">
                          <Link
                            href={`/tickets/${ticket.id}`}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-[var(--primary)] hover:bg-blue-50"
                          >
                            مشاهده
                            <Icon name="chevron-left" className="size-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden">
              <div className="divide-y divide-[var(--border)]">
                {filteredTickets.map((ticket) => {
                  const status = statusConfig[ticket.status];
                  const priority = priorityConfig[ticket.priority];
                  const severity = severityConfig[ticket.severity];

                  return (
                    <article key={ticket.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/tickets/${ticket.id}`}
                            className="font-mono text-xs font-bold text-[var(--primary)]"
                            dir="ltr"
                          >
                            {ticket.number}
                          </Link>

                          <h3 className="mt-2 text-sm font-bold text-[var(--card-foreground)]">
                            {ticket.title}
                          </h3>

                          <p className="mt-2 text-xs text-[var(--muted)]">
                            {ticket.customer} — {ticket.service}
                          </p>
                        </div>

                        <Link
                          href={`/tickets/${ticket.id}`}
                          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--primary)]"
                        >
                          مشاهده
                          <Icon name="chevron-left" className="size-4" />
                        </Link>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge className={status.className}>{status.label}</Badge>
                        <Badge className={priority.className}>
                          {priority.label}
                        </Badge>
                        <Badge className={severity.className}>
                          {severity.label}
                        </Badge>
                      </div>

                      <div className="mt-3 grid gap-2 text-xs text-[var(--muted)] sm:grid-cols-2">
                        <p>مسئول: {ticket.assignedTo}</p>
                        <p>تیم: {ticket.team}</p>
                        <p>آخرین بروزرسانی: {ticket.updatedAt}</p>
                        <p>
                          SLA: {ticket.breached ? 'نقض شده' : ticket.slaRemaining}
                        </p>
                      </div>

                      {ticket.tags.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {ticket.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-lg bg-[var(--accent)] px-2 py-1 text-[11px] font-medium text-[var(--muted)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
