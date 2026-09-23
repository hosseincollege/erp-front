'use client';

import React, { useState } from 'react';
import { FolderKanban, Plus, CheckCircle2, AlertCircle, ShoppingCart, Ticket, Package, Wallet } from 'lucide-react';

interface Project {
  id: string;
  code: string;
  name: string;
  manager: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
  modules: {
    tickets: boolean;
    purchases: boolean;
    inventory: boolean;
    accounting: boolean;
  };
}

export default function ProjectsSettingsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      code: 'PRJ-101',
      name: 'پروژه احداث خط تولید فاز ۲',
      manager: 'مهندس احمدی',
      status: 'ACTIVE',
      modules: { tickets: true, purchases: true, inventory: true, accounting: true },
    },
    {
      id: '2',
      code: 'PRJ-102',
      name: 'پروژه تأمین قطعات انبار مرکزی',
      manager: 'خانم رضایی',
      status: 'ACTIVE',
      modules: { tickets: true, purchases: true, inventory: false, accounting: true },
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    code: '',
    name: '',
    manager: '',
    modules: { tickets: true, purchases: true, inventory: true, accounting: true },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.code) return;

    setProjects((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        code: newProject.code,
        name: newProject.name,
        manager: newProject.manager || 'نامشخص',
        status: 'ACTIVE',
        modules: newProject.modules,
      },
    ]);

    setNewProject({
      code: '',
      name: '',
      manager: '',
      modules: { tickets: true, purchases: true, inventory: true, accounting: true },
    });
    setIsModalOpen(false);
  };

  return (
    <div dir="rtl" className="space-y-6 p-6">
      {/* هدر صفحه */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[var(--foreground)]">
            <FolderKanban className="h-7 w-7 text-blue-500" />
            مدیریت پروژه‌ها و کارگاه‌ها
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            تعریف پروژه‌ها و مشخص‌کردن دسترسی بخش‌های تیکت، خرید، انبار و حسابداری به هر پروژه
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          تعریف پروژه جدید
        </button>
      </div>

      {/* جدول نمایش پروژه‌ها */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-[var(--border)] bg-slate-500/5 text-xs text-slate-500">
            <tr>
              <th className="p-4">کد پروژه</th>
              <th className="p-4">نام پروژه</th>
              <th className="p-4">مسئول / مدیر</th>
              <th className="p-4">ماژول‌های فعال</th>
              <th className="p-4">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {projects.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-slate-500/5">
                <td className="p-4 font-mono font-bold text-blue-500">{p.code}</td>
                <td className="p-4 font-medium text-[var(--foreground)]">{p.name}</td>
                <td className="p-4 text-slate-500">{p.manager}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {p.modules.tickets && (
                      <span className="flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-1 text-xs text-purple-600 dark:text-purple-400">
                        <Ticket className="h-3 w-3" /> تیکت
                      </span>
                    )}
                    {p.modules.purchases && (
                      <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <ShoppingCart className="h-3 w-3" /> خرید
                      </span>
                    )}
                    {p.modules.inventory && (
                      <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs text-amber-600 dark:text-amber-400">
                        <Package className="h-3 w-3" /> انبار
                      </span>
                    )}
                    {p.modules.accounting && (
                      <span className="flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-xs text-blue-600 dark:text-blue-400">
                        <Wallet className="h-3 w-3" /> حسابداری
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> فعال
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال ایجاد پروژه جدید */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">تعریف پروژه جدید</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">کد پروژه</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: PRJ-103"
                  value={newProject.code}
                  onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent p-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">نام پروژه / کارگاه</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: پروژه ساخت سوله شماره ۴"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent p-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">مسئول پروژه</label>
                <input
                  type="text"
                  placeholder="نام مسئول یا سرپرست کارگاه"
                  value={newProject.manager}
                  onChange={(e) => setNewProject({ ...newProject, manager: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent p-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-500">اتصال به ماژول‌های سیستم</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] p-2.5 cursor-pointer hover:bg-slate-500/5">
                    <input
                      type="checkbox"
                      checked={newProject.modules.tickets}
                      onChange={(e) => setNewProject({
                        ...newProject,
                        modules: { ...newProject.modules, tickets: e.target.checked }
                      })}
                      className="rounded text-blue-600"
                    />
                    <span>ثبت تیکت</span>
                  </label>

                  <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] p-2.5 cursor-pointer hover:bg-slate-500/5">
                    <input
                      type="checkbox"
                      checked={newProject.modules.purchases}
                      onChange={(e) => setNewProject({
                        ...newProject,
                        modules: { ...newProject.modules, purchases: e.target.checked }
                      })}
                      className="rounded text-blue-600"
                    />
                    <span>درخواست خرید</span>
                  </label>

                  <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] p-2.5 cursor-pointer hover:bg-slate-500/5">
                    <input
                      type="checkbox"
                      checked={newProject.modules.inventory}
                      onChange={(e) => setNewProject({
                        ...newProject,
                        modules: { ...newProject.modules, inventory: e.target.checked }
                      })}
                      className="rounded text-blue-600"
                    />
                    <span>حواله انبار</span>
                  </label>

                  <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] p-2.5 cursor-pointer hover:bg-slate-500/5">
                    <input
                      type="checkbox"
                      checked={newProject.modules.accounting}
                      onChange={(e) => setNewProject({
                        ...newProject,
                        modules: { ...newProject.modules, accounting: e.target.checked }
                      })}
                      className="rounded text-blue-600"
                    />
                    <span>اسناد حسابداری</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs text-slate-500 hover:bg-slate-500/10"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
                >
                  ذخیره پروژه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
