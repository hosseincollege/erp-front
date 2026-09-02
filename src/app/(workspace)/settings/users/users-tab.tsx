// File: frontend/src/app/(workspace)/settings/users/users-tab.tsx

'use client';

import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileUp,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getCurrentOrganizationId } from '@/lib/auth-api';
import { settingsApi, type UserItem } from '@/lib/settings-api';

import {
  parseUsersToItems,
  usersImportSample,
  usersToExportData,
} from './users-json';

type UserFormData = {
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
};

const emptyFormData: UserFormData = {
  name: '',
  email: '',
  role: 'USER',
  department: '',
  isActive: true,
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function createUserId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getNameParts(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
}

export function UsersTab() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserFormData>(emptyFormData);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const userModalRef = useRef<HTMLDivElement>(null);
  const importModalRef = useRef<HTMLDivElement>(null);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const organizationId = getCurrentOrganizationId();
      if (!organizationId) {
        setErrorMessage('شناسه سازمان یافت نشد. لطفاً مجدداً وارد سیستم شوید.');
        setUsers([]);
        return;
      }

      const response = await settingsApi.getUsers(organizationId);

      setUsers(response ?? []);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'بارگذاری فهرست کاربران با خطا مواجه شد.'),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const closeUserModal = useCallback(() => {
    if (isSaving) {
      return;
    }

    setIsUserModalOpen(false);
    setEditingUserId(null);
    setFormData(emptyFormData);
  }, [isSaving]);

  const closeImportModal = useCallback(() => {
    if (isSaving) {
      return;
    }

    setIsImportModalOpen(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [isSaving]);

  const handleModalKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    closeModal: () => void,
  ) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  const openCreateUserModal = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setEditingUserId(null);
    setFormData(emptyFormData);
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user: UserItem) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setEditingUserId(user.id);

    setFormData({
      name: user.name ?? '',
      email: user.email ?? '',
      role: user.role ?? user.roleKey ?? 'USER',
      department: user.department ?? '',
      isActive: user.isActive ?? user.status === 'ACTIVE',
    });

    setIsUserModalOpen(true);
  };

  const handleExportUsers = () => {
    try {
      setErrorMessage(null);

      const exportData = usersToExportData(users);
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json;charset=utf-8',
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');

      anchor.href = url;
      anchor.download = `users-${new Date().toISOString().slice(0, 10)}.json`;

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      URL.revokeObjectURL(url);

      setSuccessMessage('فایل کاربران با موفقیت آماده و دانلود شد.');
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'ساخت فایل خروجی کاربران با خطا مواجه شد.'),
      );
    }
  };

  const handleDownloadImportSample = () => {
    const blob = new Blob([JSON.stringify(usersImportSample, null, 2)], {
      type: 'application/json;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'users-import-sample.json';

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  };

  const handleImportFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.json')) {
      setErrorMessage('لطفاً فقط یک فایل با فرمت JSON انتخاب کنید.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        setIsSaving(true);
        setErrorMessage(null);

        const organizationId = getCurrentOrganizationId();
        if (!organizationId) {
          throw new Error('شناسه سازمان یافت نشد. لطفاً مجدداً وارد سیستم شوید.');
        }

        const fileContent = reader.result;

        if (typeof fileContent !== 'string') {
          throw new Error('خواندن محتوای فایل ممکن نشد.');
        }

        const rawData: unknown = JSON.parse(fileContent);
        const { users: rawImportedUsers } = parseUsersToItems(rawData);

        if (!rawImportedUsers || rawImportedUsers.length === 0) {
          throw new Error('هیچ کاربر معتبری در فایل انتخاب‌شده پیدا نشد.');
        }

        const sanitizedImportedUsers: UserItem[] = rawImportedUsers.map((item) => {
          const name = item.name?.trim() || 'کاربر جدید';
          const email = item.email?.trim().toLowerCase() || '';
          const { firstName, lastName } = getNameParts(name);
          const role = item.role || 'USER';
          const isActive = item.isActive ?? true;

          return {
            id: item.id || createUserId(),
            username: item.username || (email ? email.split('@')[0] : `user_${Date.now()}`),
            name,
            firstName: item.firstName || firstName,
            lastName: item.lastName || lastName,
            email: email || null,
            phone: item.phone ?? null,
            status: isActive ? 'ACTIVE' : 'INACTIVE',
            isSystemUser: Boolean(item.isSystemUser),
            role,
            roleKey: item.roleKey || role,
            roles: Array.isArray(item.roles) ? item.roles : [],
            department: item.department || 'عمومی',
            isActive,
          };
        });

        const importedIds = new Set(sanitizedImportedUsers.map((user) => user.id));
        const importedEmails = new Set(
          sanitizedImportedUsers
            .map((user) => user.email?.trim().toLowerCase())
            .filter((email): email is string => Boolean(email)),
        );

        const remainingUsers = users.filter((user) => {
          const normalizedEmail = user.email?.trim().toLowerCase();
          return (
            !importedIds.has(user.id) &&
            (!normalizedEmail || !importedEmails.has(normalizedEmail))
          );
        });

        const updatedUsers = [...sanitizedImportedUsers, ...remainingUsers];
        const savedUsers = await settingsApi.saveUsers(updatedUsers, organizationId);

        setUsers(savedUsers ?? updatedUsers);
        setSuccessMessage(
          `${sanitizedImportedUsers.length} کاربر با موفقیت درون‌ریزی شد.`,
        );
        closeImportModal();
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error, 'درون‌ریزی فایل کاربران با خطا مواجه شد.'),
        );
      } finally {
        setIsSaving(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.onerror = () => {
      setErrorMessage('خواندن فایل انتخاب‌شده با خطا مواجه شد.');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file, 'utf-8');
  };

  const handleSaveUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const role = formData.role.trim() || 'USER';
    const department = formData.department.trim();
    const { firstName, lastName } = getNameParts(name);

    if (!name || !email) {
      setErrorMessage('نام و ایمیل کاربر الزامی است.');
      return;
    }

    const emailAlreadyExists = users.some(
      (user) =>
        user.id !== editingUserId &&
        user.email?.trim().toLowerCase() === email,
    );

    if (emailAlreadyExists) {
      setErrorMessage('کاربری با این ایمیل قبلاً ثبت شده است.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);

      const organizationId = getCurrentOrganizationId();
      if (!organizationId) {
        setErrorMessage('شناسه سازمان یافت نشد. لطفاً مجدداً وارد شوید.');
        return;
      }

      let updatedUsers: UserItem[];

      if (editingUserId) {
        updatedUsers = users.map((user) => {
          if (user.id !== editingUserId) {
            return user;
          }

          return {
            ...user,
            name,
            firstName,
            lastName,
            email,
            username: user.username || email.split('@')[0],
            role,
            roleKey: role,
            department: department || undefined,
            isActive: formData.isActive,
            status: formData.isActive ? 'ACTIVE' : 'INACTIVE',
          };
        });
      } else {
        const newUser: UserItem = {
          id: createUserId(),
          username: email.split('@')[0],
          name,
          firstName,
          lastName,
          email,
          phone: null,
          status: formData.isActive ? 'ACTIVE' : 'INACTIVE',
          isSystemUser: false,
          role,
          roleKey: role,
          roles: [],
          department: department || undefined,
          isActive: formData.isActive,
        };

        updatedUsers = [newUser, ...users];
      }

      const savedUsers = await settingsApi.saveUsers(updatedUsers, organizationId);

      setUsers(savedUsers ?? updatedUsers);
      setSuccessMessage(
        editingUserId
          ? 'اطلاعات کاربر با موفقیت به‌روزرسانی شد.'
          : 'کاربر جدید با موفقیت ایجاد شد.',
      );

      closeUserModal();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'ذخیره اطلاعات کاربر با خطا مواجه شد.'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (user.isSystemUser) {
      setErrorMessage('حذف کاربر سیستمی مجاز نیست.');
      return;
    }

    const confirmed = window.confirm(
      `آیا از حذف کاربر «${user.name || user.username}» مطمئن هستید؟`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);

      const organizationId = getCurrentOrganizationId();
      if (!organizationId) {
        setErrorMessage('شناسه سازمان یافت نشد. لطفاً مجدداً وارد شوید.');
        return;
      }

      const updatedUsers = users.filter((item) => item.id !== user.id);
      const savedUsers = await settingsApi.saveUsers(updatedUsers, organizationId);

      setUsers(savedUsers ?? updatedUsers);
      setSuccessMessage('کاربر با موفقیت حذف شد.');
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'حذف کاربر با خطا مواجه شد.'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-6" dir="rtl">
      {errorMessage ? (
        <div
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <p className="flex-1 text-sm">{errorMessage}</p>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="rounded p-1 transition hover:bg-red-100 dark:hover:bg-red-900/40"
            aria-label="بستن پیام خطا"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      {successMessage ? (
        <div
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <p className="flex-1 text-sm">{successMessage}</p>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="rounded p-1 transition hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
            aria-label="بستن پیام موفقیت"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Users className="size-5 text-primary" />
            مدیریت کاربران
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ایجاد، ویرایش، حذف و درون‌ریزی اطلاعات کاربران سازمان
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openCreateUserModal}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
          >
            <Plus className="size-4" />
            افزودن کاربر
          </button>

          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setIsImportModalOpen(true);
            }}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-60"
          >
            <Upload className="size-4" />
            درون‌ریزی JSON
          </button>

          <button
            type="button"
            onClick={handleExportUsers}
            disabled={isSaving || users.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-60"
          >
            <Download className="size-4" />
            برون‌بری JSON
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            در حال دریافت فهرست کاربران...
          </div>
        ) : users.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
            <Users className="mb-3 size-10 text-muted-foreground/50" />
            <h3 className="font-medium">هنوز کاربری ثبت نشده است</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              می‌توانید کاربر جدید ایجاد کنید یا اطلاعات کاربران را درون‌ریزی کنید.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right text-sm">
              <thead className="border-b bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">کاربر</th>
                  <th className="px-5 py-4 font-medium">ایمیل</th>
                  <th className="px-5 py-4 font-medium">نقش</th>
                  <th className="px-5 py-4 font-medium">بخش</th>
                  <th className="px-5 py-4 font-medium">وضعیت</th>
                  <th className="px-5 py-4 text-left font-medium">عملیات</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((user) => {
                  const isActive =
                    user.isActive ?? user.status?.toUpperCase() === 'ACTIVE';

                  return (
                    <tr key={user.id} className="transition hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="font-medium">
                          {user.name || user.username}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {user.username}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-muted-foreground" dir="ltr">
                        {user.email || '—'}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {user.role || user.roleKey || 'بدون نقش'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {user.department || '—'}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                          }`}
                        >
                          {isActive ? 'فعال' : 'غیرفعال'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditUserModal(user)}
                            disabled={isSaving}
                            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                            title="ویرایش کاربر"
                            aria-label={`ویرایش ${user.name || user.username}`}
                          >
                            <Pencil className="size-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDeleteUser(user)}
                            disabled={isSaving || user.isSystemUser}
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-red-950/30"
                            title={
                              user.isSystemUser
                                ? 'حذف کاربر سیستمی مجاز نیست'
                                : 'حذف کاربر'
                            }
                            aria-label={`حذف ${user.name || user.username}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isUserModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeUserModal();
            }
          }}
          onKeyDown={(event) => handleModalKeyDown(event, closeUserModal)}
        >
          <div
            ref={userModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
            tabIndex={-1}
            className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl outline-none"
          >
            <div className="mb-5 flex items-center justify-between border-b pb-4">
              <div>
                <h3 id="user-modal-title" className="text-lg font-semibold">
                  {editingUserId ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  اطلاعات کاربر و وضعیت دسترسی او را ثبت کنید.
                </p>
              </div>

              <button
                type="button"
                onClick={closeUserModal}
                disabled={isSaving}
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                aria-label="بستن پنجره"
              >
                <X className="size-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSaveUser}>
              <div>
                <label
                  htmlFor="user-name"
                  className="mb-1.5 block text-sm font-medium"
                >
                  نام و نام خانوادگی
                </label>
                <input
                  id="user-name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                  autoFocus
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label
                  htmlFor="user-email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  ایمیل
                </label>
                <input
                  id="user-email"
                  type="email"
                  dir="ltr"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="user-role"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    نقش
                  </label>
                  <input
                    id="user-role"
                    value={formData.role}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        role: event.target.value,
                      }))
                    }
                    placeholder="USER"
                    required
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="user-department"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    بخش سازمانی
                  </label>
                  <input
                    id="user-department"
                    value={formData.department}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        department: event.target.value,
                      }))
                    }
                    placeholder="اختیاری"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                  className="size-4 rounded border"
                />
                <span>
                  <span className="block text-sm font-medium">کاربر فعال باشد</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    کاربران غیرفعال امکان استفاده از حساب را نخواهند داشت.
                  </span>
                </span>
              </label>

              <div className="flex justify-end gap-2 border-t pt-5">
                <button
                  type="button"
                  onClick={closeUserModal}
                  disabled={isSaving}
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                >
                  {isSaving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  {editingUserId ? 'ذخیره تغییرات' : 'ایجاد کاربر'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isImportModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeImportModal();
            }
          }}
          onKeyDown={(event) => handleModalKeyDown(event, closeImportModal)}
        >
          <div
            ref={importModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-modal-title"
            tabIndex={-1}
            className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl outline-none"
          >
            <div className="mb-5 flex items-center justify-between border-b pb-4">
              <div>
                <h3 id="import-modal-title" className="text-lg font-semibold">
                  درون‌ریزی کاربران از JSON
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  کاربران جدید افزوده می‌شوند و رکوردهای دارای ایمیل یا شناسه یکسان
                  جایگزین خواهند شد.
                </p>
              </div>

              <button
                type="button"
                onClick={closeImportModal}
                disabled={isSaving}
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                aria-label="بستن پنجره"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleDownloadImportSample}
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
              >
                <Download className="size-4" />
                دانلود فایل نمونه
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <FileUp className="size-4" />
                )}
                {isSaving ? 'در حال پردازش فایل...' : 'انتخاب فایل JSON'}
              </button>

              <p className="rounded-lg bg-muted p-3 text-xs leading-6 text-muted-foreground">
                ساختار فایل باید شامل کلید <code>users</code> باشد. هر کاربر باید
                حداقل دارای <code>name</code>، <code>email</code> و{' '}
                <code>role</code> باشد.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
