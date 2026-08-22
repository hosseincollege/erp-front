/**
 * مسیر فایل:
 * src/types/human-resources.ts
 *
 * هدف:
 * تعریف typeها، enumهای متنی و قرارداد داده‌های ماژول منابع انسانی
 * برای ارتباط type-safe بین API و رابط کاربری.
 */

export type EmployeeStatus =
  | "ACTIVE"
  | "ON_LEAVE"
  | "INACTIVE"
  | "TERMINATED";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACTOR"
  | "INTERN"
  | "TEMPORARY";

export type LeaveType =
  | "ANNUAL"
  | "SICK"
  | "UNPAID"
  | "HOURLY"
  | "MATERNITY"
  | "PATERNITY"
  | "OTHER";

export type LeaveRequestStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

/**
 * نوع ساده برای relationهای شعبه و دپارتمان.
 * به دلیل تفاوت احتمالی نام فیلد نمایشی در backend،
 * name / title / code همگی optional در نظر گرفته شده‌اند.
 */
export interface HrOrganizationRelation {
  id: string;
  name?: string | null;
  title?: string | null;
  code?: string | null;
}

/**
 * اطلاعات پایه کاربر مرتبط با Employee یا LeaveRequest.
 */
export interface HrUserRelation {
  id: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

/**
 * مدل کارمند مطابق مدل Employee در Prisma backend.
 */
export interface Employee {
  id: string;
  organizationId: string;

  userId?: string | null;
  branchId?: string | null;
  departmentId?: string | null;

  employeeCode: string;
  firstName: string;
  lastName: string;

  nationalId?: string | null;
  phone?: string | null;
  email?: string | null;
  jobTitle?: string | null;

  employmentType: EmploymentType;
  status: EmployeeStatus;

  hiredAt: string;
  terminatedAt?: string | null;
  birthDate?: string | null;

  address?: string | null;
  emergencyPhone?: string | null;
  notes?: string | null;

  createdAt: string;
  updatedAt: string;

  user?: HrUserRelation | null;
  branch?: HrOrganizationRelation | null;
  department?: HrOrganizationRelation | null;

  leaveRequests?: LeaveRequest[];
}

/**
 * رکورد تاریخچه تغییر وضعیت یک درخواست مرخصی.
 */
export interface LeaveRequestStatusHistory {
  id: string;
  leaveRequestId: string;
  actedById: string;

  status: LeaveRequestStatus;
  note?: string | null;
  createdAt: string;

  actedBy?: HrUserRelation | null;
}

/**
 * مدل درخواست مرخصی مطابق LeaveRequest در backend.
 */
export interface LeaveRequest {
  id: string;
  organizationId: string;

  employeeId: string;
  reviewedById?: string | null;

  leaveType: LeaveType;
  status: LeaveRequestStatus;

  startAt: string;
  endAt: string;
  durationMinutes: number;

  reason?: string | null;
  reviewerNote?: string | null;
  reviewedAt?: string | null;
  cancelledAt?: string | null;

  createdAt: string;
  updatedAt: string;

  employee?: Employee;
  reviewedBy?: HrUserRelation | null;
  statusHistory?: LeaveRequestStatusHistory[];
}

/**
 * خروجی endpoint:
 * GET /human-resources/dashboard
 */
export interface HrDashboardSummary {
  employees: {
    total: number;
    active: number;
    onLeave: number;
    terminated: number;
  };

  leaveRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

/**
 * پارامترهای فیلتر endpoint:
 * GET /human-resources/employees
 */
export interface EmployeeListQuery {
  search?: string;
  status?: EmployeeStatus | "ALL";
  employmentType?: EmploymentType | "ALL";
  branchId?: string;
  departmentId?: string;
}

/**
 * پارامترهای فیلتر endpoint:
 * GET /human-resources/leave-requests
 */
export interface LeaveRequestListQuery {
  employeeId?: string;
  status?: LeaveRequestStatus | "ALL";
  leaveType?: LeaveType | "ALL";
}

/**
 * payload ایجاد کارمند:
 * POST /human-resources/employees
 */
export interface CreateEmployeePayload {
  employeeCode: string;
  firstName: string;
  lastName: string;
  hiredAt: string;

  userId?: string;
  branchId?: string;
  departmentId?: string;

  nationalId?: string;
  phone?: string;
  email?: string;
  jobTitle?: string;

  employmentType?: EmploymentType;
  status?: EmployeeStatus;

  birthDate?: string;
  address?: string;
  emergencyPhone?: string;
  notes?: string;
}

/**
 * payload ویرایش کارمند:
 * PATCH /human-resources/employees/:id
 */
export interface UpdateEmployeePayload {
  employeeCode?: string;

  userId?: string | null;
  branchId?: string | null;
  departmentId?: string | null;

  firstName?: string;
  lastName?: string;
  nationalId?: string;
  phone?: string;
  email?: string;
  jobTitle?: string;

  employmentType?: EmploymentType;
  status?: EmployeeStatus;

  hiredAt?: string;
  terminatedAt?: string | null;
  birthDate?: string | null;

  address?: string | null;
  emergencyPhone?: string;
  notes?: string | null;
}

/**
 * payload ایجاد درخواست مرخصی:
 * POST /human-resources/leave-requests
 */
export interface CreateLeaveRequestPayload {
  employeeId: string;
  leaveType: LeaveType;
  startAt: string;
  endAt: string;
}

/**
 * payload تغییر وضعیت مرخصی:
 * PATCH /human-resources/leave-requests/:id/status
 */
export interface UpdateLeaveRequestStatusPayload {
  status: LeaveRequestStatus;
  reviewerNote?: string;
}
