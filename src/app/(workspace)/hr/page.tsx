/**
 * مسیر فایل:
 * src/app/(workspace)/hr/page.tsx
 *
 * هدف:
 * صفحه داشبورد منابع انسانی شامل:
 * - آمار کارکنان و درخواست‌های مرخصی
 * - جست‌وجو و فیلتر کارکنان
 * - مشاهده درخواست‌های مرخصی
 * - تأیید یا رد درخواست‌های در انتظار بررسی
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ModulePage } from "@/components/module-page";
import {
  ApiClientError,
  humanResourcesApi,
} from "@/lib/human-resources-api";
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

const employeeStatusClasses: Record<EmployeeStatus, string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  ON_LEAVE:
    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  INACTIVE:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  TERMINATED:
    "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
};

const leaveStatusClasses: Record<LeaveRequestStatus, string> = {
  DRAFT:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  PENDING:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  APPROVED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  REJECTED:
    "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  CANCELLED:
    "bg-slate-100 text-slate-600 line-through dark:bg-slate-800 dark:text-slate-400",
};

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatDuration(minutes: number) {
  if (!minutes || minutes < 1) {
    return "—";
  }

  const days = Math.floor(minutes / 1440);
  const remainingMinutes = minutes % 1440;
  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} روز`);
  }

  if (hours > 0) {
    parts.push(`${hours} ساعت`);
  }

  if (mins > 0 && days === 0) {
    parts.push(`${mins} دقیقه`);
  }

  return parts.join(" و ");
}

function getEmployeeName(employee?: Employee) {
  if (!employee) {
    return "کارمند نامشخص";
  }

  return `${employee.firstName} ${employee.lastName}`.trim();
}

function HrEmployeeStatusBadge({
  status,
}: {
  status: EmployeeStatus;
}) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        employeeStatusClasses[status],
      ].join(" ")}
    >
      {employeeStatusLabels[status]}
    </span>
  );
}

function HrLeaveStatusBadge({
  status,
}: {
  status: LeaveRequestStatus;
}) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        leaveStatusClasses[status],
      ].join(" ")}
    >
      {leaveStatusLabels[status]}
    </span>
  );
}

export default function HrPage() {
  const [dashboard, setDashboard] =
    useState<HrDashboardSummary | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<
    LeaveRequest[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeStatus, setEmployeeStatus] = useState<
    EmployeeStatus | "ALL"
  >("ALL");

  const [employmentType, setEmploymentType] = useState<
    EmploymentType | "ALL"
  >("ALL");

  const [leaveStatus, setLeaveStatus] = useState<
    LeaveRequestStatus | "ALL"
  >("PENDING");

  const [leaveType, setLeaveType] = useState<
    LeaveType | "ALL"
  >("ALL");

  const [updatingLeaveId, setUpdatingLeaveId] = useState<
    string | null
  >(null);

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
    const result = await humanResourcesApi.getEmployees(
      employeeQuery,
    );

    setEmployees(result);
  }, [employeeQuery]);

  const loadLeaveRequests = useCallback(async () => {
    const result = await humanResourcesApi.getLeaveRequests(
      leaveQuery,
    );

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
          setError(
            "دریافت اطلاعات منابع انسانی با خطای غیرمنتظره مواجه شد.",
          );
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
    const actionLabel =
      status === "APPROVED" ? "تأیید" : "رد";

    const reviewerNote = window.prompt(
      `یادداشت ${actionLabel} درخواست مرخصی را وارد کنید (اختیاری):`,
    );

    if (reviewerNote === null) {
      return;
    }

    try {
      setUpdatingLeaveId(leaveRequestId);
      setError(null);

      await humanResourcesApi.updateLeaveRequestStatus(
        leaveRequestId,
        {
          status,
          reviewerNote: reviewerNote.trim() || undefined,
        },
      );

      await Promise.all([
        loadDashboard(),
        loadLeaveRequests(),
      ]);
    } catch (requestError) {
      if (requestError instanceof ApiClientError) {
        setError(requestError.message);
      } else {
        setError(
          `عملیات ${actionLabel} درخواست مرخصی انجام نشد.`,
        );
      }
    } finally {
      setUpdatingLeaveId(null);
    }
  }

  const stats = [
    {
      label: "کل کارکنان",
      value: String(dashboard?.employees.total ?? 0),
    },
    {
      label: "کارکنان فعال",
      value: String(dashboard?.employees.active ?? 0),
    },
    {
      label: "کارکنان در مرخصی",
      value: String(dashboard?.employees.onLeave ?? 0),
    },
    {
      label: "درخواست‌های در انتظار",
      value: String(dashboard?.leaveRequests.pending ?? 0),
    },
  ];

  return (
    <ModulePage
      title="منابع انسانی"
      description="مدیریت کارکنان و درخواست‌های مرخصی سازمان"
      stats={stats}
    >
      <div className="space-y-6">
        {error ? (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => void loadAllData(true)}
              className="rounded-lg border border-rose-300 px-3 py-1.5 font-semibold transition hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900"
            >
              تلاش مجدد
            </button>
          </div>
        ) : null}

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                کارکنان
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                فهرست کارکنان سازمان بر اساس فیلترهای انتخاب‌شده
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadAllData(true)}
              disabled={refreshing}
              className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing
                ? "در حال به‌روزرسانی..."
                : "به‌روزرسانی"}
            </button>
          </div>

          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <input
              value={employeeSearch}
              onChange={(event) =>
                setEmployeeSearch(event.target.value)
              }
              placeholder="جست‌وجو با نام، کد پرسنلی، تلفن یا ایمیل"
              className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)]"
            />

            <select
              value={employeeStatus}
              onChange={(event) =>
                setEmployeeStatus(
                  event.target.value as EmployeeStatus | "ALL",
                )
              }
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            >
              <option value="ALL">همه وضعیت‌ها</option>

              {Object.entries(employeeStatusLabels).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>

            <select
              value={employmentType}
              onChange={(event) =>
                setEmploymentType(
                  event.target.value as EmploymentType | "ALL",
                )
              }
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            >
              <option value="ALL">همه انواع استخدام</option>

              {Object.entries(employmentTypeLabels).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="min-w-[920px] w-full text-right text-sm">
              <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">
                    کد پرسنلی
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    نام کارمند
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    سمت
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    نوع استخدام
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    شعبه / دپارتمان
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    وضعیت
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    تاریخ استخدام
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-[var(--muted-foreground)]"
                    >
                      در حال دریافت فهرست کارکنان...
                    </td>
                  </tr>
                ) : null}

                {!loading && employees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-[var(--muted-foreground)]"
                    >
                      هیچ کارمندی با این فیلترها پیدا نشد.
                    </td>
                  </tr>
                ) : null}

                {!loading
                  ? employees.map((employee) => (
                      <tr
                        key={employee.id}
                        className="border-t border-[var(--border)] transition hover:bg-[var(--muted)]/50"
                      >
                        <td className="px-4 py-3 font-medium">
                          {employee.employeeCode}
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-semibold text-[var(--foreground)]">
                            {getEmployeeName(employee)}
                          </div>

                          <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                            {employee.phone ||
                              employee.email ||
                              "—"}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          {employee.jobTitle || "—"}
                        </td>

                        <td className="px-4 py-3">
                          {
                            employmentTypeLabels[
                              employee.employmentType
                            ]
                          }
                        </td>

                        <td className="px-4 py-3">
                          <div>
                            {employee.branch?.name ||
                              employee.branch?.title ||
                              "—"}
                          </div>

                          <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                            {employee.department?.name ||
                              employee.department?.title ||
                              "—"}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <HrEmployeeStatusBadge
                            status={employee.status}
                          />
                        </td>

                        <td className="px-4 py-3">
                          {formatDate(employee.hiredAt)}
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              درخواست‌های مرخصی
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              بررسی و مدیریت درخواست‌های ثبت‌شده کارکنان
            </p>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <select
              value={leaveStatus}
              onChange={(event) =>
                setLeaveStatus(
                  event.target.value as LeaveRequestStatus | "ALL",
                )
              }
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            >
              <option value="ALL">همه وضعیت‌ها</option>

              {Object.entries(leaveStatusLabels).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>

            <select
              value={leaveType}
              onChange={(event) =>
                setLeaveType(
                  event.target.value as LeaveType | "ALL",
                )
              }
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            >
              <option value="ALL">همه انواع مرخصی</option>

              {Object.entries(leaveTypeLabels).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="min-w-[980px] w-full text-right text-sm">
              <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">
                    کارمند
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    نوع مرخصی
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    بازه زمانی
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    مدت
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    وضعیت
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-[var(--muted-foreground)]"
                    >
                      در حال دریافت درخواست‌های مرخصی...
                    </td>
                  </tr>
                ) : null}

                {!loading && leaveRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-[var(--muted-foreground)]"
                    >
                      درخواست مرخصی با این فیلترها وجود ندارد.
                    </td>
                  </tr>
                ) : null}

                {!loading
                  ? leaveRequests.map((leaveRequest) => {
                      const isPending =
                        leaveRequest.status === "PENDING";

                      const isUpdating =
                        updatingLeaveId === leaveRequest.id;

                      return (
                        <tr
                          key={leaveRequest.id}
                          className="border-t border-[var(--border)] transition hover:bg-[var(--muted)]/50"
                        >
                          <td className="px-4 py-3">
                            <div className="font-semibold text-[var(--foreground)]">
                              {getEmployeeName(
                                leaveRequest.employee,
                              )}
                            </div>

                            <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                              {leaveRequest.employee?.employeeCode ||
                                "—"}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            {
                              leaveTypeLabels[
                                leaveRequest.leaveType
                              ]
                            }
                          </td>

                          <td className="px-4 py-3">
                            <div>
                              {formatDate(leaveRequest.startAt)}
                            </div>

                            <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                              تا {formatDate(leaveRequest.endAt)}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            {formatDuration(
                              leaveRequest.durationMinutes,
                            )}
                          </td>

                          <td className="px-4 py-3">
                            <HrLeaveStatusBadge
                              status={leaveRequest.status}
                            />
                          </td>

                          <td className="px-4 py-3">
                            {isPending ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    void updateLeaveStatus(
                                      leaveRequest.id,
                                      "APPROVED",
                                    )
                                  }
                                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {isUpdating
                                    ? "..."
                                    : "تأیید"}
                                </button>

                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    void updateLeaveStatus(
                                      leaveRequest.id,
                                      "REJECTED",
                                    )
                                  }
                                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  رد
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-[var(--muted-foreground)]">
                                عملیات دیگری ندارد
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </ModulePage>
  );
}
