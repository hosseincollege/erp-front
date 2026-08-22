// File: frontend/src/app/(workspace)/settings/users-tab.tsx
// کامپوننت مدیریت کاربران و اعضای سازمان

'use client';

import React, { useEffect, useState } from 'react';
import { UserItem, getUsers, saveUsers } from '@/lib/settings-api';
import { Users, Plus, Trash2, Shield, Mail } from 'lucide-react';

export function UsersTab() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserItem>>({ role: 'USER', isActive: true });

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const item: UserItem = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role || 'USER',
      department: newUser.department || 'عمومی',
      isActive: true,
    };

    const updated = [...users, item];
    setUsers(updated);
    await saveUsers(updated);
    setIsAdding(false);
    setNewUser({ role: 'USER', isActive: true });
  };

  const handleToggleActive = async (id: string) => {
    const updated = users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u));
    setUsers(updated);
    await saveUsers(updated);
  };

  const handleDelete = async (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    await saveUsers(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)]">مدیریت کاربران و دسترسی‌ها</h2>
          <p className="text-xs text-muted-foreground">تعریف و کنترل حساب‌های کاربری فعال در سیستم</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus size={16} />
          <span>افزودن کاربر جدید</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20 p-4 space-y-4">
          <h3 className="text-xs font-bold text-blue-600">مشخصات کاربر جدید</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              placeholder="نام و نام خانوادگی"
              required
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
              value={newUser.name || ''}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              placeholder="ایمیل ورود"
              type="email"
              required
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
              value={newUser.email || ''}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              placeholder="واحد سازمانی"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
              value={newUser.department || ''}
              onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
            />
            <select
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="ADMIN">مدیر سیستم</option>
              <option value="FINANCE">کارشناس مالی</option>
              <option value="SALES">کارشناس فروش</option>
              <option value="USER">کاربر عادی</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
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
              افزودن کاربر
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-[var(--border)] text-muted-foreground font-semibold">
            <tr>
              <th className="p-3.5">کاربر</th>
              <th className="p-3.5">نقش</th>
              <th className="p-3.5">دپارتمان</th>
              <th className="p-3.5">وضعیت</th>
              <th className="p-3.5 text-left">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-3.5">
                  <div className="font-bold text-[var(--foreground)]">{u.name}</div>
                  <div className="text-[11px] text-muted-foreground">{u.email}</div>
                </td>
                <td className="p-3.5">
                  <span className="rounded-lg bg-blue-50 dark:bg-blue-950/40 px-2 py-1 font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    {u.role}
                  </span>
                </td>
                <td className="p-3.5 text-muted-foreground">{u.department || '---'}</td>
                <td className="p-3.5">
                  <button
                    onClick={() => handleToggleActive(u.id)}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer transition ${
                      u.isActive
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {u.isActive ? 'فعال' : 'غیرفعال'}
                  </button>
                </td>
                <td className="p-3.5 text-left">
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
