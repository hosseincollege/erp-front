// File: frontend/src/app/(workspace)/settings/departments-tab.tsx
// کامپوننت مدیریت واحدها و دپارتمان‌های سازمانی

'use client';

import React, { useEffect, useState } from 'react';
import { DepartmentItem, getDepartments, saveDepartments } from '@/lib/settings-api';
import { Layers, Plus, Trash2, User } from 'lucide-react';

export function DepartmentsTab() {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDept, setNewDept] = useState<Partial<DepartmentItem>>({});

  useEffect(() => {
    getDepartments().then(setDepartments);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name || !newDept.code) return;

    const item: DepartmentItem = {
      id: Date.now().toString(),
      name: newDept.name,
      code: newDept.code,
      managerName: newDept.managerName || '',
    };

    const updated = [...departments, item];
    setDepartments(updated);
    await saveDepartments(updated);
    setIsAdding(false);
    setNewDept({});
  };

  const handleDelete = async (id: string) => {
    const updated = departments.filter((d) => d.id !== id);
    setDepartments(updated);
    await saveDepartments(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)]">دپارتمان‌ها و واحدهای سازمانی</h2>
          <p className="text-xs text-muted-foreground">ساختار سازمانی، واحدهای کاری و مسئولین هر بخش</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus size={16} />
          <span>افزودن دپارتمان</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20 p-4 space-y-4">
          <h3 className="text-xs font-bold text-blue-600">مشخصات واحد سازمانی</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              placeholder="نام دپارتمان (مثال: واحد IT)"
              required
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
              value={newDept.name || ''}
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            />
            <input
              placeholder="کد واحد (مثال: IT-DEP)"
              required
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
              value={newDept.code || ''}
              onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
            />
            <input
              placeholder="نام مدیر واحد"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
              value={newDept.managerName || ''}
              onChange={(e) => setNewDept({ ...newDept, managerName: e.target.value })}
            />
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
              ثبت دپارتمان
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departments.map((d) => (
          <div key={d.id} className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-blue-600" />
                  <span className="text-sm font-bold text-[var(--foreground)]">{d.name}</span>
                </div>
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-400">{d.code}</span>
              </div>
              {d.managerName && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                  <User size={12} />
                  <span>مدیر: {d.managerName}</span>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4 pt-2 border-t border-[var(--border)]">
              <button
                onClick={() => handleDelete(d.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
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
