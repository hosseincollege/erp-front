// Path: frontend/src/lib/settings-api.ts
// Frontend - Next.js
// این فایل مسئول برقراری ارتباط با APIهای بخش تنظیمات و سازمان در بک‌اند است.
//
// نکته مهم: apiClient مستقیماً به بک‌اند (NEXT_PUBLIC_API_BASE_URL یا
// http://localhost:3006) درخواست می‌زند و بک‌اند پیشوند /api ندارد؛
// بنابراین همه مسیرها باید بدون /api باشند. فقط مسیرهای پروکسی Next.js
// (زیر src/app/api/...) با پیشوند /api فراخوانی می‌شوند.

import { apiClient } from './api-client';

export interface CompanySettings {
  id?: string;
  name: string;
  slug?: string;
  legalName?: string;
  registrationNumber?: string;
  nationalId?: string;
  economicCode?: string;
  taxOffice?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  currency?: string;
  fiscalYearStart?: string;
  logoUrl?: string;
  status?: string;
}

/*
 * فقط فیلدهایی که DTO بک‌اند برای
 * PUT /settings/organization/:id
 * قبول می‌کند.
 *
 * فیلدهایی مانند id، slug، ownerId، branches و departments
 * نباید در درخواست ویرایش سازمان ارسال شوند.
 */
export interface UpdateOrganizationSettingsRequest {
  name?: string;
  legalName?: string;
  nationalId?: string;
  registrationNumber?: string;
  economicCode?: string;
  taxOffice?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  currency?: string;
  fiscalYearStart?: string;
  logoUrl?: string;
  status?: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
}

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  legalName?: string;
  nationalId?: string;
  registrationNumber?: string;
  economicCode?: string;
  taxOffice?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  currency?: string;
  fiscalYearStart?: string;
  logoUrl?: string;
}

export interface CreateOrganizationResponse {
  organization: CompanySettings;
  membership: {
    id: string;
    organizationId: string;
    userId: string;
  };
  organizationId: string;
}

export interface BranchItem {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  postalCode?: string;
  isActive: boolean;
  isHeadquarters: boolean;
  organizationId: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  branchId?: string;
  managerName?: string;
  description?: string;
  branch?: {
    id: string;
    name: string;
  };
}

export interface UserRoleItem {
  id: string;
  name: string;
  key: string;
  description?: string | null;
}

export interface UserItem {
  id: string;
  username: string;
  name: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  isSystemUser: boolean;
  role?: string | null;
  roleKey?: string | null;
  roles: UserRoleItem[];
  department?: string;
  isActive: boolean;
}

export interface RoleItem {
  id: string;
  name: string;
  key: string;
  description?: string;
  userCount: number;
  permissions: string[];
}

/*
 * Payload ایمپورت ساختار سازمانی — دقیقاً مطابق ImportOrganizationDto بک‌اند:
 * - branches: name و code اجباری
 * - departments: name و code اجباری (فیلد code در نسخه قبلی فرانت نبود
 *   و باعث خطای اعتبارسنجی/500 می‌شد)
 */
export interface OrganizationImportPayload {
  organizationId?: string;
  organization?: {
    name?: string;
    legalName?: string;
    nationalId?: string;
    registrationNumber?: string;
    economicCode?: string;
    taxOffice?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    postalCode?: string;
    currency?: string;
    fiscalYearStart?: string;
    logoUrl?: string;
  };
  branches: Array<{
    id?: string;
    name: string;
    code: string;
    address?: string;
    phone?: string;
    email?: string;
    postalCode?: string;
    isMain?: boolean;
    isActive?: boolean;
  }>;
  departments: Array<{
    id?: string;
    name: string;
    code: string;
    branchId?: string;
    branchName?: string;
    isActive?: boolean;
  }>;
}

/*
 * اعتبارسنجی organizationId قبل از هر درخواستی که به شناسه نیاز دارد.
 * اگر شناسه نامعتبر باشد، خطای معنادار پرتاب می‌شود تا به‌جای 500 مبهم،
 * پیام روشنی به UI برسد.
 */
function assertOrgId(orgId: string | undefined | null): string {
  const id = (orgId ?? '').trim();
  if (!id) {
    throw new Error(
      'شناسه سازمان در دسترس نیست. کاربر به هیچ سازمانی متصل نیست یا توکن معتبر ندارد.',
    );
  }
  return encodeURIComponent(id);
}

export const settingsApi = {
  /*
   * GET /settings/organization/:id
   * خطا دیگر پنهان نمی‌شود؛ caller تصمیم می‌گیرد با خطا چه کند.
   */
  async getCompanySettings(orgId: string): Promise<CompanySettings> {
    const id = assertOrgId(orgId);
    return apiClient.get<CompanySettings>(`/settings/organization/${id}`);
  },

  async saveCompanySettings(
    data: CompanySettings,
    orgId: string,
  ): Promise<CompanySettings> {
    /*
     * DTO بک‌اند برای PUT فقط این فیلدها را قبول می‌کند؛ پس یک payload
     * تمیز ایجاد می‌کنیم و کل data را مستقیماً ارسال نمی‌کنیم
     * (ValidationPipe بک‌اند فیلدهای خارج از DTO را رد می‌کند).
     */
    const payload: UpdateOrganizationSettingsRequest = {
      name: data.name,
      legalName: data.legalName,
      nationalId: data.nationalId,
      registrationNumber: data.registrationNumber,
      economicCode: data.economicCode,
      taxOffice: data.taxOffice,
      phone: data.phone,
      email: data.email,
      website: data.website,
      address: data.address,
      postalCode: data.postalCode,
      currency: data.currency,
      fiscalYearStart: data.fiscalYearStart,
      logoUrl: data.logoUrl,
      status:
        data.status === 'ACTIVE' ||
        data.status === 'SUSPENDED' ||
        data.status === 'ARCHIVED'
          ? (data.status as 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED')
          : undefined,
    };

    const id = assertOrgId(orgId);
    return apiClient.put<CompanySettings>(
      `/settings/organization/${id}`,
      payload,
    );
  },

  /*
   * POST /settings/organization
   * پاسخ شامل membership است تا organizationId کاربر بلافاصله در دسترس باشد.
   */
  async createCompany(
    data: CreateOrganizationRequest,
  ): Promise<CreateOrganizationResponse> {
    return apiClient.post<
      CreateOrganizationResponse,
      CreateOrganizationRequest
    >('/settings/organization', data);
  },

  async getBranches(orgId: string): Promise<BranchItem[]> {
    const id = assertOrgId(orgId);
    return apiClient.get<BranchItem[]>(`/settings/branches/${id}`);
  },

  /*
   * POST /settings/branches
   * CreateBranchDto بک‌اند organizationId را در body اجباری کرده است.
   */
  async createBranch(data: Omit<BranchItem, 'id'>): Promise<BranchItem> {
    assertOrgId(data.organizationId);
    return apiClient.post<BranchItem, Omit<BranchItem, 'id'>>(
      '/settings/branches',
      data,
    );
  },

  /*
   * PUT /settings/branches/:id
   * UpdateBranchDto بک‌اند organizationId ندارد؛ آن را از payload حذف می‌کنیم.
   */
  async updateBranch(
    id: string,
    data: Partial<BranchItem>,
  ): Promise<BranchItem> {
    const { organizationId: _ignored, ...payload } = data;
    return apiClient.put<BranchItem, Partial<BranchItem>>(
      `/settings/branches/${encodeURIComponent(id)}`,
      payload,
    );
  },

  async deleteBranch(id: string): Promise<void> {
    await apiClient.delete<void>(`/settings/branches/${encodeURIComponent(id)}`);
  },

  async getDepartments(orgId: string): Promise<DepartmentItem[]> {
    const id = assertOrgId(orgId);
    return apiClient.get<DepartmentItem[]>(`/settings/departments/${id}`);
  },

  /*
   * POST /settings/departments
   * CreateDepartmentDto بک‌اند organizationId را در body اجباری کرده است.
   */
  async createDepartment(
    data: Omit<DepartmentItem, 'id'> & { organizationId: string },
  ): Promise<DepartmentItem> {
    assertOrgId(data.organizationId);
    return apiClient.post<
      DepartmentItem,
      Omit<DepartmentItem, 'id'> & { organizationId: string }
    >('/settings/departments', data);
  },

  /*
   * PUT /settings/departments/:id
   * UpdateDepartmentDto بک‌اند organizationId ندارد.
   */
  async updateDepartment(
    id: string,
    data: Partial<DepartmentItem>,
  ): Promise<DepartmentItem> {
    return apiClient.put<DepartmentItem, Partial<DepartmentItem>>(
      `/settings/departments/${encodeURIComponent(id)}`,
      data,
    );
  },

  async deleteDepartment(id: string): Promise<void> {
    await apiClient.delete<void>(
      `/settings/departments/${encodeURIComponent(id)}`,
    );
  },

  async getUsers(orgId: string): Promise<UserItem[]> {
    const id = assertOrgId(orgId);
    return apiClient.get<UserItem[]>(`/settings/users/${id}`);
  },

  async saveUsers(
    users: UserItem[],
    orgId: string,
  ): Promise<UserItem[]> {
    const id = assertOrgId(orgId);
    return apiClient.put<UserItem[], UserItem[]>(
      `/settings/users/${id}`,
      users,
    );
  },

  async getRoles(orgId: string): Promise<RoleItem[]> {
    const id = assertOrgId(orgId);
    return apiClient.get<RoleItem[]>(`/settings/roles/${id}`);
  },

  /*
   * PUT /settings/roles/:organizationId
   * کنترلر بک‌اند آرایه خام SaveRoleDto[] می‌گیرد (بدون wrapper مثل { roles }).
   */
  async saveRoles(
    roles: RoleItem[],
    orgId: string,
  ): Promise<RoleItem[]> {
    const id = assertOrgId(orgId);
    return apiClient.put<RoleItem[], RoleItem[]>(`/settings/roles/${id}`, roles);
  },

  async exportOrganization(orgId: string): Promise<unknown> {
    const id = assertOrgId(orgId);
    return apiClient.get<unknown>(`/settings/export/${id}`);
  },

  /*
   * POST /settings/import/:organizationId
   * ایمپورت کامل داده سازمان با شناسه در URL.
   */
  async importOrganization(
    orgId: string,
    data: OrganizationImportPayload,
  ): Promise<CompanySettings> {
    const id = assertOrgId(orgId);
    return apiClient.post<CompanySettings, OrganizationImportPayload>(
      `/settings/import/${id}`,
      data,
    );
  },

  /*
   * ایمپورت ساختار سازمانی برای organization-tab.tsx
   * از پروکسی Next.js استفاده می‌کند که مسیر و بدنه را مطابق
   * ImportOrganizationDto بک‌اند نرمال‌سازی می‌کند.
   */
  async importOrganizationStructure(
    data: OrganizationImportPayload,
  ): Promise<unknown> {
    return apiClient.post<unknown, OrganizationImportPayload>(
      '/api/settings/import/organization-structure',
      data,
    );
  },

  /*
   * Aliasهای سازگاری برای company-tab.tsx
   */
  async getOrganization(orgId?: string): Promise<CompanySettings> {
    if (!orgId?.trim()) {
      throw new Error('شناسه سازمان برای دریافت اطلاعات الزامی است.');
    }
    return this.getCompanySettings(orgId);
  },

  async updateOrganization(
    data: CompanySettings,
    orgId?: string,
  ): Promise<CompanySettings> {
    if (!orgId?.trim()) {
      throw new Error('شناسه سازمان برای ذخیره‌سازی الزامی است.');
    }
    return this.saveCompanySettings(data, orgId);
  },
};

export const getUsers = (orgId: string): Promise<UserItem[]> =>
  settingsApi.getUsers(orgId);

export const saveUsers = (
  users: UserItem[],
  orgId: string,
): Promise<UserItem[]> => settingsApi.saveUsers(users, orgId);

export const getRoles = (orgId: string): Promise<RoleItem[]> =>
  settingsApi.getRoles(orgId);

export const saveRoles = (
  roles: RoleItem[],
  orgId: string,
): Promise<RoleItem[]> => settingsApi.saveRoles(roles, orgId);
