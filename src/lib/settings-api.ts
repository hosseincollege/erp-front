/**
 * @file frontend/src/lib/settings-api.ts
 * @description کلاینت ارتباط با اندپوینت‌های تنظیمات سامانه ERP
 */

export interface CompanyData {
  name: string;
  legalName?: string;
  economicCode?: string;
  nationalId?: string;
  registrationNumber?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  currency?: string;
  fiscalYearStart?: string;
}

export interface BranchItem {
  id: string;
  name: string;
  code: string;
  phone?: string;
  address?: string;
  isHeadquarters: boolean;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  branchId?: string;
  branchCode?: string;
  managerName?: string;
}

export interface UserItem {
  id: string;
  name?: string;
  fullName?: string;
  email: string;
  phone?: string;
  role: string;
  roleSlug?: string;
  department?: string;
  departmentCode?: string;
  branchCode?: string;
  isActive: boolean;
}

export interface RoleItem {
  id: string;
  name: string;
  key: string;
  slug?: string;
  description: string;
  userCount: number;
  permissions: string[];
}

const STORAGE_PREFIX = 'erp_settings_';

function getLocal<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  const saved = localStorage.getItem(STORAGE_PREFIX + key);
  return saved ? JSON.parse(saved) : defaultVal;
}

function setLocal<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
}

// ================== شرکت ==================
export async function getCompanySettings(): Promise<CompanyData> {
  const emptyCompany: CompanyData = {
    name: '',
    legalName: '',
    economicCode: '',
    nationalId: '',
    registrationNumber: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    postalCode: '',
    currency: 'IRR',
    fiscalYearStart: '',
  };
  return getLocal<CompanyData>('company', emptyCompany);
}

export async function saveCompanySettings(data: CompanyData): Promise<boolean> {
  setLocal('company', data);
  return true;
}

// ================== شعبه‌ها ==================
export async function getBranches(): Promise<BranchItem[]> {
  return getLocal<BranchItem[]>('branches', []);
}

export async function saveBranches(branches: BranchItem[]): Promise<boolean> {
  setLocal('branches', branches);
  return true;
}

// ================== دپارتمان‌ها ==================
export async function getDepartments(): Promise<DepartmentItem[]> {
  return getLocal<DepartmentItem[]>('departments', []);
}

export async function saveDepartments(departments: DepartmentItem[]): Promise<boolean> {
  setLocal('departments', departments);
  return true;
}

// ================== کاربران ==================
export async function getUsers(): Promise<UserItem[]> {
  return getLocal<UserItem[]>('users', []);
}

export async function saveUsers(users: UserItem[]): Promise<boolean> {
  setLocal('users', users);
  return true;
}

// ================== نقش‌ها ==================
export async function getRoles(): Promise<RoleItem[]> {
  return getLocal<RoleItem[]>('roles', []);
}

export async function saveRoles(roles: RoleItem[]): Promise<boolean> {
  setLocal('roles', roles);
  return true;
}

// ================== سرویس درون‌ریزی (Data Import) ==================
export const settingsApi = {
  getCompany: getCompanySettings,
  updateCompany: saveCompanySettings,
  getBranches,
  updateBranches: saveBranches,
  getDepartments,
  updateDepartments: saveDepartments,
  getUsers,
  updateUsers: saveUsers,
  getRoles,
  updateRoles: saveRoles,

  importOrganization: async (payload: {
    company?: CompanyData;
    branches?: BranchItem[];
    departments?: DepartmentItem[];
  }) => {
    if (payload.company) {
      await saveCompanySettings(payload.company);
    }
    if (payload.branches && Array.isArray(payload.branches)) {
      const branches: BranchItem[] = payload.branches.map((b, idx) => ({
        id: b.id || String(Date.now() + idx),
        name: b.name,
        code: b.code,
        phone: b.phone || '',
        address: b.address || '',
        isHeadquarters: b.isHeadquarters ?? idx === 0,
      }));
      await saveBranches(branches);
    }
    if (payload.departments && Array.isArray(payload.departments)) {
      const departments: DepartmentItem[] = payload.departments.map((d, idx) => ({
        id: d.id || String(Date.now() + idx + 10),
        name: d.name,
        code: d.code,
        branchCode: d.branchCode || '',
        managerName: d.managerName || '',
      }));
      await saveDepartments(departments);
    }
    return { data: { message: 'اطلاعات سازمان، شعب و دپارتمان‌ها با موفقیت ثبت شد.' } };
  },

  importUsersAndRoles: async (payload: {
    roles?: RoleItem[];
    users?: UserItem[];
  }) => {
    if (payload.roles && Array.isArray(payload.roles)) {
      const roles: RoleItem[] = payload.roles.map((r, idx) => ({
        id: r.id || String(Date.now() + idx),
        name: r.name,
        key: r.key || r.slug || 'ROLE',
        slug: r.slug || r.key,
        description: r.description || '',
        userCount: payload.users ? payload.users.filter((u) => (u.roleSlug || u.role) === (r.slug || r.key)).length : 0,
        permissions: r.permissions || [],
      }));
      await saveRoles(roles);
    }
    if (payload.users && Array.isArray(payload.users)) {
      const users: UserItem[] = payload.users.map((u, idx) => ({
        id: u.id || String(Date.now() + idx + 20),
        name: u.fullName || u.name || '',
        fullName: u.fullName || u.name || '',
        email: u.email,
        phone: u.phone || '',
        role: u.roleSlug || u.role || 'USER',
        roleSlug: u.roleSlug || u.role,
        department: u.departmentCode || u.department || '',
        departmentCode: u.departmentCode || u.department,
        branchCode: u.branchCode || '',
        isActive: u.isActive ?? true,
      }));
      await saveUsers(users);
    }
    return { data: { message: 'اطلاعات کاربران و سطوح دسترسی با موفقیت ثبت شد.' } };
  },
};
