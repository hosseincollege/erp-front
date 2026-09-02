/**
 * مسیر فایل:
 * src/app/(workspace)/hr/page.tsx
 *
 * داشبورد منابع انسانی (HR) بر اساس استاندارد مینیمال ERP Pro:
 * - شروع مستقیم با ۴ کارت شاخص عملکرد (KPIs)
 * - تب‌بندی تفکیک‌شده برای پرسنل و مرخصی‌ها
 * - ابزارهای جستجو، فیلتر و دکمه به‌روزرسانی در نوار ابزار
 */

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserMinus,
  CalendarClock,
  RefreshCw,
  Search,
  Filter,
  Briefcase,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { ApiClientError, humanResourcesApi } from "@/lib/human-resources-api";
import type {
  Employee,
  EmployeeListQuery,
  EmployeeStatus,
  EmploymentType,
  HrDashboardSummary,
  LeaveRequest,
  LeaveRequestListQuery,
  LeaveRequestStatus,
  LeaveType,
} from "@/types/human-resources";

type HrTab = "employees" | "leaves";

// برچسب‌ها و متون فارسی
const employeeStatusLabels: Record<EmployeeStatus, string> = {
  ACTIVE: "فعال",
  ON_LEAVE: "در مرخصی",
  INACTIVE: "غیرفعال",
  TERMINATED: "خاتمه‌یافته",
};

const employmentTypeLabels: Record<EmploymentType, string> = {
  FULL_TIME: "تمام‌وقت",
  PART_TIME: "پاره‌وقت",
  CONTRACTOR: "قراردادی",
  INTERN: "کارآموز",
  TEMPORARY: "موقت",
};

const leaveTypeLabels: Record<LeaveType, string> = {
  ANNUAL: "استحقاقی",
  SICK: "استعلاجی",
  UNPAID: "بدون حقوق",
  HOURLY: "ساعتی",
  MATERNITY: "زایمان",
  PATERNITY: "پدری",
  OTHER: "سایر",
};

const leaveStatusLabels: Record<LeaveRequestStatus, string> = {
  DRAFT: "پیش‌نویس",
  PENDING: "در انتظار بررسی",
  APPROVED: "تأیید شده",
  REJECTED: "رد شده",
  CANCELLED: "لغو شده",
};

// توابع کمکی فرمت‌دهی
function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatDuration(minutes: number) {
  if (!minutes || minutes < 1) return "—";

  const days = Math.floor(minutes / 1440);
  const remainingMinutes = minutes % 1440;
  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} روز`);
  if (hours > 0) parts.push(`${hours} ساعت`);
  if (mins > 0 && days === 0) parts.push(`${mins} دقیقه`);

  return parts.join(" و ");
}

function getEmployeeName(employee?: Employee) {
  if (!employee) return "کارمند نامشخص";
  return `${employee.firstName} ${employee.lastName}`.trim();
}

function HrEmployeeStatusBadge({ status }: { status: EmployeeStatus }) {
  const config: Record<EmployeeStatus, { bg: string; text: string }> = {
    ACTIVE: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
    ON_LEAVE: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
    INACTIVE: { bg: "bg-muted", text: "text-muted-foreground" },
    TERMINATED: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
  };
  const c = config[status] || config.INACTIVE;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text}`}>
      {employeeStatusLabels[status]}
    </span>
  );
}

function HrLeaveStatusBadge({ status }: { status: LeaveRequestStatus }) {
  const config: Record<LeaveRequestStatus, { bg: string; text: string }> = {
    DRAFT: { bg: "bg-muted", text: "text-muted-foreground" },
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
    APPROVED: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
    REJECTED: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
    CANCELLED: { bg: "bg-muted", text: "text-muted-foreground line-through" },
  };
  const c = config[status] || config.DRAFT;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text}`}>
      {leaveStatusLabels[status]}
    </span>
  );
}

export default function HrPage() {
  const [activeTab, setActiveTab] = useState<HrTab>("employees");
  const [dashboard, setDashboard] = useState<HrDashboardSummary | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeStatus, setEmployeeStatus] = useState<EmployeeStatus | "ALL">("ALL");
  const [employmentType, setEmploymentType] = useState<EmploymentType | "ALL">("ALL");

  const [leaveStatus, setLeaveStatus] = useState<LeaveRequestStatus | "ALL">("PENDING");
  const [leaveType, setLeaveType] = useState<LeaveType | "ALL">("ALL");

  const [updatingLeaveId, setUpdatingLeaveId] = useState<string | null>(null);

  const employeeQuery = useMemo<EmployeeListQuery>(
    () => ({
      search: employeeSearch,
      status: employeeStatus,
      employmentType,
    }),
    [employeeSearch, employeeStatus, employmentType],
  );

  const leaveQuery = useMemo<LeaveRequestListQuery>(
    () => ({
      status: leaveStatus,
      leaveType,
    }),
    [leaveStatus, leaveType],
  );

  const loadDashboard = useCallback(async () => {
    const result = await humanResourcesApi.getDashboard();
    setDashboard(result);
  }, []);

  const loadEmployees = useCallback(async () => {
    const result = await humanResourcesApi.getEmployees(employeeQuery);
    setEmployees(result);
  }, [employeeQuery]);

  const loadLeaveRequests = useCallback(async () => {
    const result = await humanResourcesApi.getLeaveRequests(leaveQuery);
    setLeaveRequests(result);
  }, [leaveQuery]);

  const loadAllData = useCallback(
    async (showRefreshState = false) => {
      try {
        setError(null);
        if (showRefreshState) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        await Promise.all([
          loadDashboard(),
          loadEmployees(),
          loadLeaveRequests(),
        ]);
      } catch (requestError) {
        if (requestError instanceof ApiClientError) {
          setError(requestError.message);
        } else {
          setError("دریافت اطلاعات منابع انسانی با خطای غیرمنتظره مواجه شد.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loadDashboard, loadEmployees, loadLeaveRequests],
  );

  useEffect(() => {
    void loadAllData();
  }, [loadAllData]);

  async function updateLeaveStatus(
    leaveRequestId: string,
    status: "APPROVED" | "REJECTED",
  ) {
    const actionLabel = status === "APPROVED" ? "تأیید" : "رد";
    const reviewerNote = window.prompt(
      `یادداشت ${actionLabel} درخواست مرخصی را وارد کنید (اختیاری):`,
    );

    if (reviewerNote === null) return;

    try {
      setUpdatingLeaveId(leaveRequestId);
      setError(null);

      await humanResourcesApi.updateLeaveRequestStatus(leaveRequestId, {
        status,
        reviewerNote: reviewerNote.trim() || undefined,
      });

      await Promise.all([loadDashboard(), loadLeaveRequests()]);
    } catch (requestError) {
      if (requestError instanceof ApiClientError) {
        setError(requestError.message);
      } else {
        setError(`عملیات ${actionLabel} درخواست مرخصی انجام نشد.`);
      }
    } finally {
      setUpdatingLeaveId(null);
    }
  }

  return (
    <div dir="rtl" className="space-y-5">
      {/* هشدار خطا در صورت بروز */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-medium text-rose-600 dark:text-rose-400"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => void loadAllData(true)}
            className="rounded-lg border border-rose-500/30 px-3 py-1 font-bold transition-all hover:bg-rose-500/20"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {/* ۱. کارت‌های شاخص‌های کلیدی منابع انسانی (KPIs) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">کل کارکنان</p>
              <p className="mt-2 text-xl font-bold text-foreground">
                {dashboard?.employees.total ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">نیروی ثبت‌شده در سامانه</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">کارکنان فعال</p>
              <p className="mt-2 text-xl font-bold text-emerald-500">
                {dashboard?.employees.active ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">مشغول به کار</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <UserCheck size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">کارکنان در مرخصی</p>
              <p className="mt-2 text-xl font-bold text-amber-500">
                {dashboard?.employees.onLeave ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">عدم حضور امروز</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <UserMinus size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">درخواست‌های در انتظار</p>
              <p className="mt-2 text-xl font-bold text-purple-500">
                {dashboard?.leaveRequests.pending ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">نیازمند بررسی و تأیید</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <CalendarClock size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* ۲. بخش تب‌ها و جداول عملیاتی */}
      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        {/* نوار جابجایی تب‌ها و ابزار به‌روزرسانی */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-border pb-4">
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-muted/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("employees")}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "employees"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users size={14} />
              <span>فهرست کارکنان ({employees.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("leaves")}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "leaves"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarClock size={14} />
              <span>درخواست‌های مرخصی ({leaveRequests.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => void loadAllData(true)}
              disabled={refreshing || loading}
              title="به‌روزرسانی داده‌ها"
              className="inline-flex h-9.5 items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground transition-all hover:bg-muted active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{refreshing ? "در حال دریافت..." : "به‌روزرسانی"}</span>
            </button>
          </div>
        </div>

        {/* تب ۱: فهرست کارکنان */}
        {activeTab === "employees" && (
          <div className="space-y-4">
            {/* فیلترهای بخش پرسنل */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={15} />
                <input
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  placeholder="جست‌وجو با نام، کد پرسنلی، تلفن یا ایمیل..."
                  className="h-9.5 w-full rounded-xl border border-border bg-background pr-9 pl-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="relative">
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                <select
                  value={employeeStatus}
                  onChange={(e) => setEmployeeStatus(e.target.value as EmployeeStatus | "ALL")}
                  className="h-9.5 w-full appearance-none rounded-xl border border-border bg-background pr-8 pl-3 text-xs text-foreground focus:border-blue-500 focus:outline-none"
                >
                  <option value="ALL">همه وضعیت‌ها</option>
                  {Object.entries(employeeStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as EmploymentType | "ALL")}
                  className="h-9.5 w-full appearance-none rounded-xl border border-border bg-background pr-8 pl-3 text-xs text-foreground focus:border-blue-500 focus:outline-none"
                >
                  <option value="ALL">همه انواع استخدام</option>
                  {Object.entries(employmentTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* جدول پرسنل */}
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs font-bold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3.5">کد پرسنلی</th>
                      <th className="px-4 py-3.5">نام کارمند</th>
                      <th className="px-4 py-3.5">سمت شغلی</th>
                      <th className="px-4 py-3.5">نوع قرارداد</th>
                      <th className="px-4 py-3.5">شعبه / دپارتمان</th>
                      <th className="px-4 py-3.5 text-center">وضعیت</th>
                      <th className="px-4 py-3.5 text-center">تاریخ استخدام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-muted"></div></td>
                          <td className="px-4 py-4"><div className="h-4 w-32 rounded bg-muted"></div></td>
                          <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-muted"></div></td>
                          <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-muted"></div></td>
                          <td className="px-4 py-4"><div className="h-4 w-28 rounded bg-muted"></div></td>
                          <td className="px-4 py-4 text-center"><div className="mx-auto h-5 w-16 rounded bg-muted"></div></td>
                          <td className="px-4 py-4 text-center"><div className="mx-auto h-4 w-20 rounded bg-muted"></div></td>
                        </tr>
                      ))
                    ) : employees.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center">
                          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                            <AlertCircle size={20} />
                          </div>
                          <p className="mt-2 text-sm font-bold text-foreground">کارمندی یافت نشد</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            با تغییر فیلترها یا عبارت جستجو مجدداً تلاش کنید.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      employees.map((employee) => (
                        <tr key={employee.id} className="transition-colors hover:bg-muted/30">
                          <td className="px-4 py-4 font-mono text-xs font-semibold text-muted-foreground">
                            {employee.employeeCode}
                          </td>

                          <td className="px-4 py-4">
                            <div className="font-semibold text-foreground">
                              {getEmployeeName(employee)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {employee.phone || employee.email || "—"}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-foreground/80">
                            {employee.jobTitle || "—"}
                          </td>

                          <td className="px-4 py-4 text-xs text-muted-foreground">
                            {employmentTypeLabels[employee.employmentType]}
                          </td>

                          <td className="px-4 py-4">
                            <div className="text-foreground">
                              {employee.branch?.name || employee.branch?.title || "—"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {employee.department?.name || employee.department?.title || "—"}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <HrEmployeeStatusBadge status={employee.status} />
                          </td>

                          <td className="px-4 py-4 text-center text-xs text-muted-foreground">
                            {formatDate(employee.hiredAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* تب ۲: درخواست‌های مرخصی */}
        {activeTab === "leaves" && (
          <div className="space-y-4">
            {/* فیلترهای مرخصی */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                <select
                  value={leaveStatus}
                  onChange={(e) => setLeaveStatus(e.target.value as LeaveRequestStatus | "ALL")}
                  className="h-9.5 w-full appearance-none rounded-xl border border-border bg-background pr-8 pl-3 text-xs text-foreground focus:border-blue-500 focus:outline-none"
                >
                  <option value="ALL">همه وضعیت‌ها</option>
                  {Object.entries(leaveStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <CalendarClock className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType | "ALL")}
                  className="h-9.5 w-full appearance-none rounded-xl border border-border bg-background pr-8 pl-3 text-xs text-foreground focus:border-blue-500 focus:outline-none"
                >
                  <option value="ALL">همه انواع مرخصی</option>
                  {Object.entries(leaveTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* جدول مرخصی‌ها */}
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs font-bold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3.5">کارمند</th>
                      <th className="px-4 py-3.5">نوع مرخصی</th>
                      <th className="px-4 py-3.5">بازه زمانی</th>
                      <th className="px-4 py-3.5">مدت</th>
                      <th className="px-4 py-3.5 text-center">وضعیت</th>
                      <th className="px-4 py-3.5 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-4 py-4"><div className="h-4 w-32 rounded bg-muted"></div></td>
                          <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-muted"></div></td>
                          <td className="px-4 py-4"><div className="h-4 w-36 rounded bg-muted"></div></td>
                          <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-muted"></div></td>
                          <td className="px-4 py-4 text-center"><div className="mx-auto h-5 w-20 rounded bg-muted"></div></td>
                          <td className="px-4 py-4 text-center"><div className="mx-auto h-7 w-24 rounded bg-muted"></div></td>
                        </tr>
                      ))
                    ) : leaveRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center">
                          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                            <AlertCircle size={20} />
                          </div>
                          <p className="mt-2 text-sm font-bold text-foreground">درخواست مرخصی یافت نشد</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            هیچ درخواستی با فیلترهای انتخابی مطابقت ندارد.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      leaveRequests.map((leaveRequest) => {
                        const isPending = leaveRequest.status === "PENDING";
                        const isUpdating = updatingLeaveId === leaveRequest.id;

                        return (
                          <tr key={leaveRequest.id} className="transition-colors hover:bg-muted/30">
                            <td className="px-4 py-4">
                              <div className="font-semibold text-foreground">
                                {getEmployeeName(leaveRequest.employee)}
                              </div>
                              <div className="font-mono text-xs text-muted-foreground">
                                {leaveRequest.employee?.employeeCode || "—"}
                              </div>
                            </td>

                            <td className="px-4 py-4 text-foreground/80">
                              {leaveTypeLabels[leaveRequest.leaveType]}
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1.5 text-xs text-foreground">
                                <Clock size={13} className="text-muted-foreground" />
                                <span>{formatDate(leaveRequest.startAt)}</span>
                                <span className="text-muted-foreground">تا</span>
                                <span>{formatDate(leaveRequest.endAt)}</span>
                              </div>
                            </td>

                            <td className="px-4 py-4 font-semibold text-foreground">
                              {formatDuration(leaveRequest.durationMinutes)}
                            </td>

                            <td className="px-4 py-4 text-center">
                              <HrLeaveStatusBadge status={leaveRequest.status} />
                            </td>

                            <td className="px-4 py-4 text-center">
                              {isPending ? (
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() => void updateLeaveStatus(leaveRequest.id, "APPROVED")}
                                    className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-600 px-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                                  >
                                    <CheckCircle2 size={13} />
                                    <span>{isUpdating ? "..." : "تأیید"}</span>
                                  </button>

                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() => void updateLeaveStatus(leaveRequest.id, "REJECTED")}
                                    className="inline-flex h-8 items-center gap-1 rounded-lg bg-rose-600 px-2.5 text-xs font-bold text-white shadow-sm shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-50"
                                  >
                                    <XCircle size={13} />
                                    <span>رد</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
