'use client';

import React, { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import {
  UserPlus,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Eye,
  Building2,
  UserCheck,
  Clock,
  AlertCircle,
  TrendingUp,
  Target,
  Sparkles,
} from 'lucide-react';

type LeadStatus = 'lead' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';
type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface CustomerRecord {
  id: string;
  code: string;
  name: string;
  company: string;
  type: 'LEGAL' | 'INDIVIDUAL';
  status: LeadStatus;
  priority: PriorityLevel;
  phone: string;
  dealValue: number;
  assignedTo: string;
  lastContact: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'همه وضعیت‌ها' },
  { value: 'lead', label: 'سرنخ جدید' },
  { value: 'contacted', label: 'تماس گرفته‌شده' },
  { value: 'qualified', label: 'تأیید صلاحیت' },
  { value: 'negotiation', label: 'در حال مذاکره' },
  { value: 'won', label: 'بسته شده (موفق)' },
  { value: 'lost', label: 'ناموفق / لغو' },
];

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'همه اولویت‌ها' },
  { value: 'LOW', label: 'کم' },
  { value: 'MEDIUM', label: 'متوسط' },
  { value: 'HIGH', label: 'زیاد' },
  { value: 'URGENT', label: 'فوری' },
];

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'جدیدترین تعامل' },
  { value: 'date_asc', label: 'قدیمی‌ترین تعامل' },
  { value: 'value_desc', label: 'ارزش معامله (زیاد به کم)' },
  { value: 'value_asc', label: 'ارزش معامله (کم به زیاد)' },
  { value: 'name_asc', label: 'نام مشتری (الف تا ی)' },
];

const INITIAL_DATA: CustomerRecord[] = [
  {
    id: 'crm-101',
    code: 'CUS-9801',
    name: 'مهندس رضایی',
    company: 'فولاد مبارکه اصفهان',
    type: 'LEGAL',
    status: 'negotiation',
    priority: 'HIGH',
    phone: '۰۲۱-۸۸۷۷۶۶۵۵',
    dealValue: 450000000,
    assignedTo: 'سارا احمدی',
    lastContact: '۱۴۰۳/۰۶/۱۵',
    createdAt: '۱۴۰۳/۰۵/۱۰',
  },
  {
    id: 'crm-102',
    code: 'CUS-9802',
    name: 'دکتر محمودی',
    company: 'پژوهشکده توسعه فناوری',
    type: 'LEGAL',
    status: 'qualified',
    priority: 'URGENT',
    phone: '۰۲۱-۲۲۳۳۴۴۵۵',
    dealValue: 180000000,
    assignedTo: 'علیرضا حسینی',
    lastContact: '۱۴۰۳/۰۶/۱۷',
    createdAt: '۱۴۰۳/۰۶/۰۱',
  },
  {
    id: 'crm-103',
    code: 'CUS-9803',
    name: 'حسین کاظمی',
    company: 'شخصی',
    type: 'INDIVIDUAL',
    status: 'won',
    priority: 'MEDIUM',
    phone: '۰۹۱۲-۱۱۱۲۲۳۳',
    dealValue: 65000000,
    assignedTo: 'سارا احمدی',
    lastContact: '۱۴۰۳/۰۶/۱۶',
    createdAt: '۱۴۰۳/۰۴/۱۲',
  },
  {
    id: 'crm-104',
    code: 'CUS-9804',
    name: 'شرکت پترو صنعت نوین',
    company: 'پترو صنعت',
    type: 'LEGAL',
    status: 'lead',
    priority: 'LOW',
    phone: '۰۲۱-۴۴۵۵۶۶۷۷',
    dealValue: 850000000,
    assignedTo: 'محمد کریمی',
    lastContact: '۱۴۰۳/۰۶/۱۸',
    createdAt: '۱۴۰۳/۰۶/۱۸',
  },
  {
    id: 'crm-105',
    code: 'CUS-9805',
    name: 'مریم توکلی',
    company: 'بازرگانی پارس',
    type: 'INDIVIDUAL',
    status: 'contacted',
    priority: 'MEDIUM',
    phone: '۰۹۳۵-۳۳۴۴۵۵۶',
    dealValue: 120000000,
    assignedTo: 'علیرضا حسینی',
    lastContact: '۱۴۰۳/۰۶/۱۲',
    createdAt: '۱۴۰۳/۰۶/۰۸',
  },
];

export default function CrmPage() {
  const [, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال';
  };

  const stats = useMemo(() => {
    const totalCustomers = INITIAL_DATA.length;
    const activeDeals = INITIAL_DATA.filter((i) =>
      ['lead', 'contacted', 'qualified', 'negotiation'].includes(i.status)
    ).length;
    const wonDeals = INITIAL_DATA.filter((i) => i.status === 'won').length;
    const totalPipelineValue = INITIAL_DATA.reduce((acc, curr) => acc + curr.dealValue, 0);

    return { totalCustomers, activeDeals, wonDeals, totalPipelineValue };
  }, []);

  const filteredRecords = useMemo(() => {
    return INITIAL_DATA.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm);

      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchPriority = priorityFilter === 'all' || item.priority === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    }).sort((a, b) => {
      if (sortBy === 'value_desc') return b.dealValue - a.dealValue;
      if (sortBy === 'value_asc') return a.dealValue - b.dealValue;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name, 'fa');
      if (sortBy === 'date_asc') return a.lastContact.localeCompare(b.lastContact, 'fa');
      return b.lastContact.localeCompare(a.lastContact, 'fa');
    });
  }, [searchTerm, statusFilter, priorityFilter, sortBy]);

  const renderStatusBadge = (status: LeadStatus) => {
    const config: Record<LeadStatus, { label: string; bg: string; text: string }> = {
      lead: { label: 'سرنخ جدید', bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
      contacted: { label: 'تماس اولیه', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
      qualified: { label: 'تأیید صلاحیت', bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400' },
      negotiation: { label: 'مذاکره', bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400' },
      won: { label: 'بسته شده (موفق)', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
      lost: { label: 'ناموفق', bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400' },
    };
    const c = config[status] || config.lead;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  const renderPriorityBadge = (priority: PriorityLevel) => {
    const config: Record<PriorityLevel, { label: string; color: string }> = {
      LOW: { label: 'کم', color: 'text-muted-foreground bg-muted' },
      MEDIUM: { label: 'متوسط', color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' },
      HIGH: { label: 'زیاد', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10' },
      URGENT: { label: 'فوری', color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10' },
    };
    const c = config[priority] || config.LOW;
    return (
      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${c.color}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div dir="rtl" className="space-y-5">
      {/* کارت‌های آماری (KPIs) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">کل مخاطبان و شرکت‌ها</p>
              <p className="mt-2 text-xl font-bold text-foreground">{stats.totalCustomers}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">پرونده فعال در سامانه</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Building2 size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">مذاکرات و سرنخ‌های فعال</p>
              <p className="mt-2 text-xl font-bold text-amber-500">{stats.activeDeals}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">در جریان پیگیری</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Target size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">معاملات نهایی‌شده</p>
              <p className="mt-2 text-xl font-bold text-emerald-500">{stats.wonDeals}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">موفقیت‌آمیز</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <UserCheck size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">ارزش کل پایپ‌لاین</p>
              <p className="mt-2 text-xl font-bold text-foreground">
                {new Intl.NumberFormat('fa-IR').format(stats.totalPipelineValue / 1000000)} م ریال
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">برآورد کل فرصت‌ها</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* فیلترها، جستجو و دکمه‌های عملیاتی */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
              <input
                type="text"
                placeholder="جستجوی نام، شرکت، کد یا تلفن..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background pr-9 pl-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
              <select
                value={statusFilter}
                onChange={(e) => startTransition(() => setStatusFilter(e.target.value))}
                className="h-10 w-full appearance-none rounded-xl border border-border bg-background pr-9 pl-3 text-xs text-foreground focus:border-blue-500 focus:outline-none"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
              <select
                value={priorityFilter}
                onChange={(e) => startTransition(() => setPriorityFilter(e.target.value))}
                className="h-10 w-full appearance-none rounded-xl border border-border bg-background pr-9 pl-3 text-xs text-foreground focus:border-blue-500 focus:outline-none"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-border bg-background pr-9 pl-3 text-xs text-foreground focus:border-blue-500 focus:outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground transition-all hover:bg-muted active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span>به‌روزرسانی</span>
            </button>

            <Link
              href="/crm/customers/new"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
            >
              <UserPlus size={15} />
              <span>مشتری جدید</span>
            </Link>
          </div>
        </div>
      </section>

      {/* جدول مشتریان و پرونده‌ها */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                <th className="px-4 py-3.5 font-medium">مخاطب / نام تجاری</th>
                <th className="px-4 py-3.5 font-medium">شرکت / زمینه</th>
                <th className="px-4 py-3.5 font-medium">وضعیت پیگیری</th>
                <th className="px-4 py-3.5 font-medium">اولویت</th>
                <th className="px-4 py-3.5 font-medium">ارزش تخمینی معامله</th>
                <th className="px-4 py-3.5 font-medium">مسئول پرونده</th>
                <th className="px-4 py-3.5 font-medium">آخرین تعامل</th>
                <th className="px-4 py-3.5 text-center font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 w-28 rounded bg-muted"></div></td>
                    <td className="px-4 py-4"><div className="h-4 w-32 rounded bg-muted"></div></td>
                    <td className="px-4 py-4"><div className="h-5 w-20 rounded bg-muted"></div></td>
                    <td className="px-4 py-4"><div className="h-5 w-14 rounded bg-muted"></div></td>
                    <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-muted"></div></td>
                    <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-muted"></div></td>
                    <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-muted"></div></td>
                    <td className="px-4 py-4 text-center"><div className="mx-auto h-8 w-8 rounded bg-muted"></div></td>
                  </tr>
                ))
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                      <AlertCircle size={24} />
                    </div>
                    <p className="mt-3 text-sm font-bold text-foreground">موردی یافت نشد</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      با فیلترها یا عبارت جستجوی دیگری تلاش کنید.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-muted/30">
                    {/* مخاطب و کد */}
                    <td className="px-4 py-4">
                      <div className="font-semibold text-foreground">{item.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">{item.code}</div>
                    </td>

                    {/* شرکت و نوع */}
                    <td className="px-4 py-4">
                      <div className="text-foreground">{item.company}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.type === 'LEGAL' ? 'حقوقی' : 'حقیقی'}
                      </div>
                    </td>

                    {/* وضعیت */}
                    <td className="px-4 py-4">{renderStatusBadge(item.status)}</td>

                    {/* اولویت */}
                    <td className="px-4 py-4">{renderPriorityBadge(item.priority)}</td>

                    {/* مبلغ معامله */}
                    <td className="px-4 py-4 font-semibold text-foreground">
                      {formatCurrency(item.dealValue)}
                    </td>

                    {/* کارشناس */}
                    <td className="px-4 py-4 text-foreground/80">{item.assignedTo}</td>

                    {/* تاریخ تماس */}
                    <td className="px-4 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Clock size={13} className="text-muted-foreground" />
                        <span>{item.lastContact}</span>
                      </div>
                    </td>

                    {/* دکمه عملیات */}
                    <td className="px-4 py-4 text-center">
                      <Link
                        href={`/crm/${item.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-500"
                        title="مشاهده پرونده"
                      >
                        <Eye size={15} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
