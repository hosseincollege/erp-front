// File: frontend/src/app/(workspace)/settings/users/users-json.ts
// Frontend - منطق JSON حساب‌های کاربری: نمونه، اعتبارسنجی و تبدیل داده‌ها

import type { UserItem } from '@/lib/settings-api';

/**
 * ساختار هر کاربر در فایل JSON ورودی و خروجی.
 *
 * شناسهٔ `id` اختیاری است؛ اگر هنگام Import ارائه نشده باشد،
 * در زمان تبدیل به UserItem یک شناسهٔ جدید ساخته می‌شود.
 */
export interface UserImportData {
  id?: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  isActive?: boolean;
}

/**
 * ساختار کامل فایل JSON کاربران.
 */
export interface UsersImportData {
  users: UserImportData[];
}

/**
 * نتیجهٔ تبدیل اطلاعات ورودی به مدل داخلی تنظیمات.
 */
export interface UsersImportResult {
  users: UserItem[];
}

/**
 * فایل نمونه برای دانلود از رابط کاربری.
 */
export const usersImportSample: UsersImportData = {
  users: [
    {
      name: 'علی رضایی',
      email: 'ali.rezaei@example.com',
      role: 'ADMIN',
      department: 'مدیریت',
      isActive: true,
    },
    {
      name: 'مریم احمدی',
      email: 'maryam.ahmadi@example.com',
      role: 'ACCOUNTANT',
      department: 'امور مالی',
      isActive: true,
    },
    {
      name: 'سارا کریمی',
      email: 'sara.karimi@example.com',
      role: 'HR_MANAGER',
      department: 'منابع انسانی',
      isActive: true,
    },
    {
      name: 'رضا محمدی',
      email: 'reza.mohammadi@example.com',
      role: 'USER',
      department: 'فروش',
      isActive: false,
    },
  ],
};

/**
 * یک مقدار ناشناخته را به رشتهٔ تمیزشده تبدیل می‌کند.
 *
 * اگر مقدار رشته نباشد یا پس از trim خالی شود،
 * مقدار undefined برگردانده خواهد شد.
 */
function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedValue = value.trim();

  return normalizedValue || undefined;
}

/**
 * یک مقدار الزامی را به رشتهٔ تمیزشده تبدیل می‌کند.
 */
function normalizeRequiredString(value: unknown): string {
  return normalizeOptionalString(value) ?? '';
}

/**
 * ایمیل را برای اعتبارسنجی و تشخیص مقدار تکراری نرمال می‌کند.
 */
function normalizeEmail(value: unknown): string {
  return normalizeRequiredString(value).toLowerCase();
}

/**
 * معتبر بودن قالب اولیهٔ ایمیل را بررسی می‌کند.
 *
 * این اعتبارسنجی عمداً ساده نگه داشته شده است و بررسی تحویل‌پذیری
 * ایمیل باید در سمت سرور انجام شود.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * یک ردیف کاربر را اعتبارسنجی و نرمال می‌کند.
 */
function parseUser(
  item: unknown,
  index: number,
  errors: string[],
): UserImportData | null {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    errors.push(`کاربر ردیف ${index + 1}: ساختار داده نامعتبر است.`);
    return null;
  }

  const record = item as Record<string, unknown>;

  const id = normalizeOptionalString(record.id);
  const name = normalizeRequiredString(record.name);
  const email = normalizeEmail(record.email);
  const role = normalizeRequiredString(record.role);
  const department = normalizeOptionalString(record.department);

  if (!name) {
    errors.push(`کاربر ردیف ${index + 1}: فیلد «name» الزامی است.`);
  }

  if (!email) {
    errors.push(`کاربر ردیف ${index + 1}: فیلد «email» الزامی است.`);
  } else if (!isValidEmail(email)) {
    errors.push(
      `کاربر ردیف ${index + 1}: ایمیل «${email}» معتبر نیست.`,
    );
  }

  if (!role) {
    errors.push(`کاربر ردیف ${index + 1}: فیلد «role» الزامی است.`);
  }

  if (
    record.isActive !== undefined &&
    typeof record.isActive !== 'boolean'
  ) {
    errors.push(
      `کاربر ردیف ${index + 1}: فیلد «isActive» باید مقدار boolean داشته باشد.`,
    );
  }

  if (!name || !email || !isValidEmail(email) || !role) {
    return null;
  }

  return {
    id,
    name,
    email,
    role,
    department,
    isActive:
      typeof record.isActive === 'boolean'
        ? record.isActive
        : true,
  };
}

/**
 * ساختار JSON کاربران را اعتبارسنجی و نرمال می‌کند.
 *
 * ساختار ورودی مورد انتظار:
 *
 * {
 *   "users": [...]
 * }
 */
export function parseUsersImportData(rawData: unknown): UsersImportData {
  if (!rawData || typeof rawData !== 'object' || Array.isArray(rawData)) {
    throw new Error(
      'ساختار فایل نامعتبر است. فایل باید یک شیء JSON شامل آرایهٔ «users» باشد.',
    );
  }

  const data = rawData as Record<string, unknown>;
  const rawUsers = data.users;
  const errors: string[] = [];

  if (!Array.isArray(rawUsers)) {
    throw new Error('بخش «users» باید یک آرایه باشد.');
  }

  if (rawUsers.length === 0) {
    throw new Error('حداقل یک کاربر باید در بخش «users» ثبت شده باشد.');
  }

  const users: UserImportData[] = [];
  const normalizedEmails = new Set<string>();
  const normalizedIds = new Set<string>();

  rawUsers.forEach((item, index) => {
    const parsedUser = parseUser(item, index, errors);

    if (!parsedUser) {
      return;
    }

    const emailKey = parsedUser.email.toLowerCase();

    if (normalizedEmails.has(emailKey)) {
      errors.push(`ایمیل تکراری در فایل: «${parsedUser.email}»`);
    } else {
      normalizedEmails.add(emailKey);
    }

    if (parsedUser.id) {
      const idKey = parsedUser.id.toLowerCase();

      if (normalizedIds.has(idKey)) {
        errors.push(`شناسهٔ تکراری در فایل: «${parsedUser.id}»`);
      } else {
        normalizedIds.add(idKey);
      }
    }

    users.push(parsedUser);
  });

  if (errors.length > 0) {
    throw new Error(errors.slice(0, 10).join('\n'));
  }

  return { users };
}

/**
 * داده‌های اعتبارسنجی‌شدهٔ JSON را به مدل مورد استفادهٔ
 * settings-api تبدیل می‌کند.
 */
export function usersImportDataToItems(
  data: UsersImportData,
): UsersImportResult {
  return {
    users: data.users.map((user) => ({
      id: user.id || crypto.randomUUID(),
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || 'عمومی',
      isActive: user.isActive ?? true,
    })),
  };
}

/**
 * عملیات Parse و تبدیل را در یک فراخوانی انجام می‌دهد.
 */
export function parseUsersToItems(rawData: unknown): UsersImportResult {
  const parsedData = parseUsersImportData(rawData);

  return usersImportDataToItems(parsedData);
}

/**
 * فهرست کاربران داخلی را برای دانلود یا Export به ساختار مستقل
 * و قابل‌انتقال JSON تبدیل می‌کند.
 *
 * شناسهٔ داخلی عمداً در خروجی قرار نمی‌گیرد تا فایل به داده‌های
 * داخلی یک نصب مشخص وابسته نباشد.
 */
export function usersToExportData(users: UserItem[]): UsersImportData {
  return {
    users: users.map((user) => ({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || undefined,
      isActive: user.isActive,
    })),
  };
}
