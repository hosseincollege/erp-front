// File: frontend/src/app/(workspace)/settings/branches-tab.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { BranchItem, getBranches, saveBranches } from '@/lib/settings-api';
import { Building, Plus, Trash2, MapPin, Phone } from 'lucide-react';

export function BranchesTab() {
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newBranch, setNewBranch] = useState<Partial<BranchItem>>({ isHeadquarters: false });

  useEffect(() => {
    getBranches().then(setBranches);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.name || !newBranch.code) return;

    const item: BranchItem = {
      id: Date.now().toString(),
      name: newBranch.name,
      code: newBranch.code,
      phone: newBranch.phone || '',
      address: newBranch.address || '',
      isHeadquarters: !!newBranch.isHeadquarters,
    };

    const updated = [...branches, item];
    setBranches(updated);
    await saveBranches(updated);
    setIsAdding(false);
    setNewBranch({ isHeadquarters: false });
  };

  const handleDelete = async (id: string) => {
    const updated = branches.filter((b) => b.id !== id);
    setBranches(updated);
    await saveBranches(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)]">مدیریت شعبه‌ها و دفاتر</h2>
          <p className="text-xs text-muted-foreground">تعریف شعب مختلف سازمان برای دسته‌بندی انبارها و کاربران</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus size={16} />
          <span>افزودن شعبه جدید</span>
        </button>
      </div>

      {/* فرم افزودن */}
      {isAdding && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20 p-4 space-y-4">
          <h3 className="text-xs font-bold text-blue-600">مشخصات شعبه جدید</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              placeholder="نام شعبه (مثال: شعبه مشهد)"
              required
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
              value={newBranch.name || ''}
              onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
            />
            <input
              placeholder="کد شعبه (مثال: BR-03)"
              required
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
              value={newBranch.code || ''}
              onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
            />
            <input
              placeholder="شماره تماس"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
              value={newBranch.phone || ''}
              onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={newBranch.isHeadquarters || false}
                onChange={(e) => setNewBranch({ ...newBranch, isHeadquarters: e.target.checked })}
              />
              <span>دفتر مرکزی است</span>
            </label>
            <div className="flex gap-2">
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
                ثبت شعبه
              </button>
            </div>
          </div>
        </form>
      )}

      {/* لیست شعبه‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building size={16} className="text-blue-600" />
                <span className="text-sm font-bold text-[var(--foreground)]">{b.name}</span>
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-400">{b.code}</span>
                {b.isHeadquarters && (
                  <span className="rounded-md bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">مرکزی</span>
                )}
              </div>
              {b.phone && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone size={12} />
                  <span>{b.phone}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => handleDelete(b.id)}
              className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
