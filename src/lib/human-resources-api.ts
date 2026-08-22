/**
 * مسیر فایل:
 * src/lib/human-resources-api.ts
 *
 * هدف:
 * لایه اختصاصی ارتباط فرانت‌اند با API ماژول منابع انسانی.
 * تمام درخواست‌ها از apiClient عبور می‌کنند تا توکن JWT،
 * headerها و مدیریت خطاها یکپارچه باقی بماند.
 */

import { apiClient, ApiClientError } from "./api-client";

import type {
  CreateEmployeePayload,
  CreateLeaveRequestPayload,
  Employee,
  EmployeeListQuery,
  HrDashboardSummary,
  LeaveRequest,
  LeaveRequestListQuery,
  UpdateEmployeePayload,
  UpdateLeaveRequestStatusPayload,
} from "../types/human-resources";

/**
 * سازگاری با پاسخ‌های احتمالی backend:
 * - داده مستقیم
 * - { success, data, message }
 */
type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

function normalizeResponse<T>(response: unknown): T {
  const envelope = response as ApiEnvelope<T>;

  if (
    envelope &&
    typeof envelope === "object" &&
    "data" in envelope
  ) {
    return envelope.data as T;
  }

  return response as T;
}

/**
 * تبدیل فیلترهای کارکنان به query string.
 */
function buildEmployeeQueryString(
  query: EmployeeListQuery = {},
): string {
  const params = new URLSearchParams();

  if (query.search?.trim()) {
    params.set("search", query.search.trim());
  }

  if (query.status && query.status !== "ALL") {
    params.set("status", query.status);
  }

  if (
    query.employmentType &&
    query.employmentType !== "ALL"
  ) {
    params.set("employmentType", query.employmentType);
  }

  if (query.branchId) {
    params.set("branchId", query.branchId);
  }

  if (query.departmentId) {
    params.set("departmentId", query.departmentId);
  }

  const serialized = params.toString();

  return serialized ? `?${serialized}` : "";
}

/**
 * تبدیل فیلترهای درخواست مرخصی به query string.
 */
function buildLeaveRequestQueryString(
  query: LeaveRequestListQuery = {},
): string {
  const params = new URLSearchParams();

  if (query.employeeId) {
    params.set("employeeId", query.employeeId);
  }

  if (query.status && query.status !== "ALL") {
    params.set("status", query.status);
  }

  if (query.leaveType && query.leaveType !== "ALL") {
    params.set("leaveType", query.leaveType);
  }

  const serialized = params.toString();

  return serialized ? `?${serialized}` : "";
}

export const humanResourcesApi = {
  /**
   * دریافت آمار داشبورد منابع انسانی.
   * GET /human-resources/dashboard
   */
  async getDashboard(): Promise<HrDashboardSummary> {
    const response = await apiClient.get<unknown>(
      "/human-resources/dashboard",
    );

    return normalizeResponse<HrDashboardSummary>(response);
  },

  /**
   * دریافت فهرست کارکنان به همراه فیلترهای اختیاری.
   * GET /human-resources/employees
   */
  async getEmployees(
    query: EmployeeListQuery = {},
  ): Promise<Employee[]> {
    const queryString = buildEmployeeQueryString(query);

    const response = await apiClient.get<unknown>(
      `/human-resources/employees${queryString}`,
    );

    return normalizeResponse<Employee[]>(response);
  },

  /**
   * دریافت جزئیات یک کارمند.
   * GET /human-resources/employees/:id
   */
  async getEmployeeById(id: string): Promise<Employee> {
    const response = await apiClient.get<unknown>(
      `/human-resources/employees/${id}`,
    );

    return normalizeResponse<Employee>(response);
  },

  /**
   * ایجاد کارمند جدید.
   * POST /human-resources/employees
   */
  async createEmployee(
    payload: CreateEmployeePayload,
  ): Promise<Employee> {
    const response = await apiClient.post<unknown>(
      "/human-resources/employees",
      payload,
    );

    return normalizeResponse<Employee>(response);
  },

  /**
   * ویرایش اطلاعات کارمند.
   * PATCH /human-resources/employees/:id
   */
  async updateEmployee(
    id: string,
    payload: UpdateEmployeePayload,
  ): Promise<Employee> {
    const response = await apiClient.patch<unknown>(
      `/human-resources/employees/${id}`,
      payload,
    );

    return normalizeResponse<Employee>(response);
  },

  /**
   * دریافت فهرست درخواست‌های مرخصی.
   * GET /human-resources/leave-requests
   */
  async getLeaveRequests(
    query: LeaveRequestListQuery = {},
  ): Promise<LeaveRequest[]> {
    const queryString = buildLeaveRequestQueryString(query);

    const response = await apiClient.get<unknown>(
      `/human-resources/leave-requests${queryString}`,
    );

    return normalizeResponse<LeaveRequest[]>(response);
  },

  /**
   * دریافت جزئیات یک درخواست مرخصی.
   * GET /human-resources/leave-requests/:id
   */
  async getLeaveRequestById(
    id: string,
  ): Promise<LeaveRequest> {
    const response = await apiClient.get<unknown>(
      `/human-resources/leave-requests/${id}`,
    );

    return normalizeResponse<LeaveRequest>(response);
  },

  /**
   * ثبت درخواست مرخصی جدید.
   * POST /human-resources/leave-requests
   */
  async createLeaveRequest(
    payload: CreateLeaveRequestPayload,
  ): Promise<LeaveRequest> {
    const response = await apiClient.post<unknown>(
      "/human-resources/leave-requests",
      payload,
    );

    return normalizeResponse<LeaveRequest>(response);
  },

  /**
   * تأیید، رد، لغو یا تغییر وضعیت درخواست مرخصی.
   * PATCH /human-resources/leave-requests/:id/status
   */
  async updateLeaveRequestStatus(
    id: string,
    payload: UpdateLeaveRequestStatusPayload,
  ): Promise<LeaveRequest> {
    const response = await apiClient.patch<unknown>(
      `/human-resources/leave-requests/${id}/status`,
      payload,
    );

    return normalizeResponse<LeaveRequest>(response);
  },
};

export { ApiClientError };
