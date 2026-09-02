// File: src/app/(workspace)/settings/users/roles-tab.tsx
// مدیریت نقش‌ها و سطح دسترسی کاربران سازمان جاری

'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CheckSquare,
  Key,
  Plus,
  ShieldCheck,
  Square,
  Trash2,
  Users,
} from 'lucide-react';

import { getCurrentOrganizationId } from '@/lib/auth-api';
import {
  getRoles,
  saveRoles,
  type RoleItem,
} from '@/lib/settings-api';

type EditableRole = {
  id?: string;
  name: string;
  description: string;
  permissions: string[];
  userCount?: number;
};

const PERMISSIONS = [
  'مشاهده داشبورد',
  'مدیریت کاربران',
  'مدیریت نقش‌ها',
  'مدیریت تنظیمات',
];

function createNewRole(): EditableRole {
  return {
    id: `role-${Date.now()}`,
    name: 'نقش جدید',
    description: '',
    permissions: [],
  };
}

function normalizeRole(role: RoleItem): EditableRole {
  const value = role as RoleItem & {
    id?: string;
    name?: string;
    description?: string;
    permissions?: string[];
    userCount?: number;
  };

  return {
    id: value.id,
    name: value.name ?? '',
    description: value.description ?? '',
    permissions: Array.isArray(value.permissions)
      ? value.permissions
      : [],
    userCount: value.userCount,
  };
}

export function RolesTab() {
  const [roles, setRoles] = useState<EditableRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    setRoles((currentRoles) => [
      ...currentRoles,
      createNewRole(),
    ]);

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
        if (index !== roleIndex) {
          return role;
        }

        return {
          ...role,
          [field]: value,
        };
      }),
    );

    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function handlePermissionToggle(
    roleIndex: number,
    permission: string,
  ) {
    setRoles((currentRoles) =>
      currentRoles.map((role, index) => {
        if (index !== roleIndex) {
          return role;
        }

        const hasPermission =
          role.permissions.includes(permission);

        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(
                (currentPermission) =>
                  currentPermission !== permission,
              )
            : [...role.permissions, permission],
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

      await saveRoles(
        roles as unknown as RoleItem[],
        organizationId,
      );

      setSuccessMessage('نقش‌ها با موفقیت ذخیره شدند.');
    } catch (error) {
      console.error('Failed to save roles:', error);
      setErrorMessage('ذخیره نقش‌ها با خطا مواجه شد.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className="h-5 w-5 text-primary"
            aria-hidden="true"
          />

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
            <ShieldCheck
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />

            <h2 className="text-lg font-semibold text-foreground">
              نقش‌ها و دسترسی‌ها
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            نقش‌های سازمان و سطح دسترسی هر نقش را مدیریت کنید.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddRole}
            disabled={!organizationId || isSaving}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus
              className="h-4 w-4"
              aria-hidden="true"
            />

            افزودن نقش
          </button>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!organizationId || isSaving}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Key
              className="h-4 w-4"
              aria-hidden="true"
            />

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

          <button
            type="button"
            onClick={handleAddRole}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus
              className="h-4 w-4"
              aria-hidden="true"
            />

            ایجاد اولین نقش
          </button>
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
                      placeholder="مثلاً مدیر فروش"
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
                      placeholder="توضیح کوتاه درباره نقش"
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
                      <Trash2
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Users
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />

                    <h3 className="text-sm font-medium text-foreground">
                      دسترسی‌ها
                    </h3>

                    {typeof role.userCount === 'number' && (
                      <span className="text-xs text-muted-foreground">
                        {role.userCount} کاربر
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {PERMISSIONS.map((permission) => {
                      const isSelected =
                        role.permissions.includes(permission);

                      return (
                        <button
                          key={permission}
                          type="button"
                          onClick={() =>
                            handlePermissionToggle(
                              roleIndex,
                              permission,
                            )
                          }
                          disabled={isSaving}
                          aria-pressed={isSelected}
                          className="flex min-h-10 items-center gap-2 rounded-md border border-border px-3 py-2 text-right text-sm text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
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

                          <span>{permission}</span>
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
