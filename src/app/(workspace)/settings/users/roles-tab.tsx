// File: src/app/(workspace)/settings/users/roles-tab.tsx
// مدیریت نقش‌ها، دسترسی‌ها و بارگذاری JSON سازمان جاری

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CheckSquare,
  FileSpreadsheet,
  Key,
  Plus,
  ShieldCheck,
  Square,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';

import { getCurrentOrganizationId } from '@/lib/auth-api';
import {
  getRoles,
  saveRoles,
  type RoleItem,
} from '@/lib/settings-api';
import {
  parseRolesImportData,
  rolesImportDataToItems,
  rolesImportSample,
} from './roles-json';

type EditableRole = {
  id?: string;
  key?: string;
  name: string;
  description: string;
  permissions: string[];
  userCount?: number;
};

// لیست دسترسی‌های مجاز همراه با برچسب فارسی و کلید سیستمی
const PERMISSION_OPTIONS: { key: string; label: string }[] = [
  { key: 'dashboard.view', label: 'مشاهده داشبورد' },
  { key: 'users.read', label: 'مشاهده کاربران' },
  { key: 'users.write', label: 'مدیریت کاربران' },
  { key: 'roles.read', label: 'مشاهده نقش‌ها' },
  { key: 'roles.write', label: 'مدیریت نقش‌ها' },
  { key: 'settings.read', label: 'مشاهده تنظیمات' },
  { key: 'settings.write', label: 'مدیریت تنظیمات' },
  { key: 'accounting.read', label: 'مشاهده مالی' },
  { key: 'accounting.write', label: 'مدیریت مالی' },
  { key: 'hr.read', label: 'مشاهده منابع انسانی' },
  { key: 'hr.write', label: 'مدیریت منابع انسانی' },
  { key: 'inventory.read', label: 'مشاهده انبار' },
  { key: 'inventory.write', label: 'مدیریت انبار' },
];

function createNewRole(): EditableRole {
  return {
    id: `role-${Date.now()}`,
    name: 'نقش جدید',
    description: '',
    permissions: ['dashboard.view'],
  };
}

function normalizeRole(role: RoleItem): EditableRole {
  const value = role as RoleItem & {
    id?: string;
    key?: string;
    name?: string;
    description?: string;
    permissions?: string[];
    userCount?: number;
  };

  return {
    id: value.id,
    key: value.key,
    name: value.name ?? '',
    description: value.description ?? '',
    permissions: Array.isArray(value.permissions) ? value.permissions : [],
    userCount: value.userCount,
  };
}

export function RolesTab() {
  const [roles, setRoles] = useState<EditableRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const organizationId = getCurrentOrganizationId();

  const loadRoles = useCallback(async () => {
    if (!organizationId) {
      setRoles([]);
      setErrorMessage('شناسه سازمان جاری پیدا نشد.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const response = await getRoles(organizationId);
      const receivedRoles = Array.isArray(response) ? response : [];

      setRoles(receivedRoles.map(normalizeRole));
    } catch (error) {
      console.error('Failed to load roles:', error);
      setRoles([]);
      setErrorMessage('دریافت نقش‌ها با خطا مواجه شد.');
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  function handleAddRole() {
    setRoles((currentRoles) => [...currentRoles, createNewRole()]);
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function handleRoleFieldChange(
    roleIndex: number,
    field: 'name' | 'description',
    value: string,
  ) {
    setRoles((currentRoles) =>
      currentRoles.map((role, index) => {
        if (index !== roleIndex) return role;
        return {
          ...role,
          [field]: value,
        };
      }),
    );

    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function handlePermissionToggle(roleIndex: number, permissionKey: string) {
    setRoles((currentRoles) =>
      currentRoles.map((role, index) => {
        if (index !== roleIndex) return role;

        const hasPermission = role.permissions.includes(permissionKey);

        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter((p) => p !== permissionKey)
            : [...role.permissions, permissionKey],
        };
      }),
    );

    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function handleDeleteRole(roleIndex: number) {
    setRoles((currentRoles) =>
      currentRoles.filter((_, index) => index !== roleIndex),
    );

    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSave() {
    if (!organizationId) {
      setErrorMessage('شناسه سازمان جاری پیدا نشد.');
      return;
    }

    const hasEmptyRoleName = roles.some(
      (role) => role.name.trim().length === 0,
    );

    if (hasEmptyRoleName) {
      setErrorMessage('نام نقش نمی‌تواند خالی باشد.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await saveRoles(roles as unknown as RoleItem[], organizationId);
      setSuccessMessage('نقش‌ها با موفقیت ذخیره شدند.');
    } catch (error) {
      console.error('Failed to save roles:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'ذخیره نقش‌ها با خطا مواجه شد.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleDownloadSample() {
    const jsonString = JSON.stringify(rolesImportSample, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'roles-sample.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!organizationId) {
      setErrorMessage('شناسه سازمان جاری پیدا نشد.');
      return;
    }

    setIsImporting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const fileText = await file.text();
      const parsedRaw = JSON.parse(fileText);
      const validatedData = parseRolesImportData(parsedRaw);
      const itemsToSave = rolesImportDataToItems(validatedData);

      // ذخیره مستقیم در بک‌اند
      await saveRoles(itemsToSave as unknown as RoleItem[], organizationId);

      // بارگذاری مجدد از بک‌اند برای همگام‌سازی کامل
      await loadRoles();
      setSuccessMessage(
        `تعداد ${itemsToSave.length} نقش با موفقیت بارگذاری و ذخیره شد.`,
      );
    } catch (error) {
      console.error('Import roles failed:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'فایل نامعتبر است. لطفاً فرمت فایل JSON را بررسی کنید.',
      );
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">
            نقش‌ها و دسترسی‌ها
          </h2>
        </div>

        <div className="rounded-lg border border-border p-8 text-center text-sm text-muted-foreground">
          در حال دریافت نقش‌ها...
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-foreground">
              نقش‌ها و دسترسی‌ها
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            نقش‌های سازمان و سطح دسترسی هر نقش را مدیریت کنید.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => void handleFileUpload(e)}
          />

          <button
            type="button"
            onClick={handleDownloadSample}
            disabled={!organizationId || isSaving || isImporting}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            دانلود نمونه JSON
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={!organizationId || isSaving || isImporting}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            {isImporting ? 'در حال بارگذاری...' : 'بارگذاری JSON'}
          </button>

          <button
            type="button"
            onClick={handleAddRole}
            disabled={!organizationId || isSaving || isImporting}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            افزودن نقش
          </button>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!organizationId || isSaving || isImporting}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Key className="h-4 w-4" aria-hidden="true" />
            {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700"
        >
          {successMessage}
        </div>
      )}

      {!organizationId ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          برای مدیریت نقش‌ها، ابتدا یک سازمان معتبر انتخاب کنید.
        </div>
      ) : roles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <ShieldCheck
            className="mx-auto h-8 w-8 text-muted-foreground"
            aria-hidden="true"
          />

          <p className="mt-3 text-sm text-muted-foreground">
            هنوز نقشی برای این سازمان ثبت نشده است.
          </p>

          <div className="mt-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={handleDownloadSample}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              دانلود نمونه نقش‌ها
            </button>

            <button
              type="button"
              onClick={handleAddRole}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              ایجاد اولین نقش
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {roles.map((role, roleIndex) => {
            const roleKey = role.id ?? `role-${roleIndex}`;

            return (
              <article
                key={roleKey}
                className="rounded-lg border border-border bg-background p-5"
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      نام نقش
                    </span>

                    <input
                      type="text"
                      value={role.name}
                      onChange={(event) =>
                        handleRoleFieldChange(
                          roleIndex,
                          'name',
                          event.target.value,
                        )
                      }
                      disabled={isSaving}
                      placeholder="مثلاً مدیر مالی"
                      className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      توضیحات
                    </span>

                    <input
                      type="text"
                      value={role.description}
                      onChange={(event) =>
                        handleRoleFieldChange(
                          roleIndex,
                          'description',
                          event.target.value,
                        )
                      }
                      disabled={isSaving}
                      placeholder="توضیح کوتاه درباره مسئولیت‌های نقش"
                      className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </label>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteRole(roleIndex)}
                      disabled={isSaving}
                      aria-label={`حذف نقش ${role.name}`}
                      title="حذف نقش"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <h3 className="text-sm font-medium text-foreground">
                        دسترسی‌ها
                      </h3>
                    </div>

                    {typeof role.userCount === 'number' && (
                      <span className="text-xs text-muted-foreground">
                        {role.userCount} کاربر فعال با این نقش
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {PERMISSION_OPTIONS.map((perm) => {
                      const isSelected = role.permissions.includes(perm.key);

                      return (
                        <button
                          key={perm.key}
                          type="button"
                          onClick={() =>
                            handlePermissionToggle(roleIndex, perm.key)
                          }
                          disabled={isSaving}
                          aria-pressed={isSelected}
                          className={`flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-right text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            isSelected
                              ? 'border-primary/40 bg-primary/10 font-medium text-primary'
                              : 'border-border bg-background text-foreground hover:bg-accent'
                          }`}
                        >
                          {isSelected ? (
                            <CheckSquare
                              className="h-4 w-4 shrink-0 text-primary"
                              aria-hidden="true"
                            />
                          ) : (
                            <Square
                              className="h-4 w-4 shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}

                          <span>{perm.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
