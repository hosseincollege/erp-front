// File: frontend/src/app/(workspace)/settings/roles-tab.tsx
// کامپوننت مدیریت نقش‌ها و سطوح دسترسی (RBAC)

'use client';

import React, { useEffect, useState } from 'react';
import { RoleItem, getRoles, saveRoles } from '@/lib/settings-api';
import { ShieldCheck, Plus, Trash2, Key, Users, CheckSquare, Square } from 'lucide-react';

const AVAILABLE_PERMISSIONS = [
  { key: '*', label: 'دسترسی نامحدود به کل سیستم (Super Admin)' },
  { key: 'accounting:read', label: 'مشاهده اسناد و دفاتر مالی' },
  { key: 'accounting:write', label: 'ثبت و ویرایش اسناد حسابداری' },
  { key: 'sales:read', label: 'مشاهده پیش‌فاکتورها و سفارشات فروش' },
  { key: 'sales:write', label: 'صدور فاکتور و مدیریت مشتریان' },
  { key: 'warehouse:read', label: 'مشاهده موجودی و کاردکس کالا' },
  { key: 'warehouse:write', label: 'ثبت حواله و رسید انبار' },
  { key: 'settings:manage', label: 'مدیریت تنظیمات و ساختار سازمان' },
];

export function RolesTab() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRole, setNewRole] = useState<{
    name: string;
    key: string;
    description: string;
    permissions: string[];
  }>({
    name: '',
    key: '',
    description: '',
    permissions: [],
  });

  useEffect(() => {
    getRoles().then(setRoles);
  }, []);

  const togglePermission = (permKey: string) => {
    setNewRole((prev) => {
      const exists = prev.permissions.includes(permKey);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter((p) => p !== permKey) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permKey] };
      }
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name || !newRole.key) return;

    const item: RoleItem = {
      id: Date.now().toString(),
      name: newRole.name,
      key: newRole.key.toUpperCase(),
      description: newRole.description || 'بدون توضیح',
      userCount: 0,
      permissions: newRole.permissions.length > 0 ? newRole.permissions : ['accounting:read'],
    };

    const updated = [...roles, item];
    setRoles(updated);
    await saveRoles(updated);
    setIsAdding(false);
    setNewRole({ name: '', key: '', description: '', permissions: [] });
  };

  const handleDelete = async (id: string) => {
    const updated = roles.filter((r) => r.id !== id);
    setRoles(updated);
    await saveRoles(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)]">نقش‌ها و سطوح دسترسی (RBAC)</h2>
          <p className="text-xs text-muted-foreground">تعریف نقش‌های کاربری و تخصیص مجوزهای دسترسی به بخش‌های مختلف ERP</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus size={16} />
          <span>افزودن نقش جدید</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20 p-5 space-y-4">
          <h3 className="text-xs font-bold text-blue-600">تعریف نقش جدید</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">عنوان نمایشی نقش *</label>
              <input
                placeholder="مثال: مدیر انبار"
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">شناسه سیستمی (انگلیسی) *</label>
              <input
                placeholder="مثال: WAREHOUSE_HEAD"
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs uppercase"
                value={newRole.key}
                onChange={(e) => setNewRole({ ...newRole, key: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">شرح وظایف / توضیحات</label>
              <input
                placeholder="توضیح کوتاه درباره دسترسی‌ها"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-bold text-[var(--foreground)]">انتخاب مجوزهای دسترسی:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {AVAILABLE_PERMISSIONS.map((perm) => {
                const isChecked = newRole.permissions.includes(perm.key);
                return (
                  <div
                    key={perm.key}
                    onClick={() => togglePermission(perm.key)}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs cursor-pointer transition select-none ${
                      isChecked
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600 font-semibold'
                        : 'border-[var(--border)] bg-[var(--surface)] text-muted-foreground hover:border-slate-400'
                    }`}
                  >
                    {isChecked ? <CheckSquare size={16} className="text-blue-600 shrink-0" /> : <Square size={16} className="shrink-0" />}
                    <span>{perm.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs rounded-lg bg-blue-600 text-white font-semibold"
            >
              ثبت و ذخیره نقش
            </button>
          </div>
        </form>
      )}

      {/* نمایش لیست نقش‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => (
          <div key={r.id} className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-blue-600" />
                  <span className="text-sm font-bold text-[var(--foreground)]">{r.name}</span>
                </div>
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  {r.key}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{r.description}</p>
              
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.permissions?.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[10px] font-mono text-blue-600 dark:text-blue-400">
                    <Key size={10} />
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Users size={14} />
                <span>{r.userCount} کاربر منتسب</span>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
