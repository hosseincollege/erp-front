// File: frontend/src/app/(workspace)/settings/company-tab.tsx
// کامپوننت فرم ویرایش اطلاعات سازمان و شرکت
'use client';

import React, { useEffect, useState } from 'react';
import { CompanyData, getCompanySettings, saveCompanySettings } from '@/lib/settings-api';
import { Building2, Save, RefreshCw, CheckCircle2 } from 'lucide-react';

export function CompanyTab() {
  const [formData, setFormData] = useState<CompanyData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    getCompanySettings().then(setFormData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSaving(true);
    await saveCompanySettings(formData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!formData) {
    return <div className="p-8 text-center text-sm text-slate-500">در حال بارگذاری اطلاعات شرکت...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)]">مشخصات اصلی شرکت / سازمان</h2>
          <p className="text-xs text-muted-foreground">اطلاعات رسمی جهت درج در فاکتورها، مکاتبات و گزارشات سیستم</p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
          <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-600">
          <CheckCircle2 size={16} />
          <span>اطلاعات شرکت با موفقیت ذخیره شد.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">نام تجاری شرکت *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">نام رسمی / ثبتی</label>
          <input
            type="text"
            name="legalName"
            value={formData.legalName || ''}
            onChange={handleChange}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">شناسه ملی</label>
          <input
            type="text"
            name="nationalId"
            value={formData.nationalId || ''}
            onChange={handleChange}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">کد اقتصادی</label>
          <input
            type="text"
            name="economicCode"
            value={formData.economicCode || ''}
            onChange={handleChange}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">تلفن تماس</label>
          <input
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">ایمیل سازمانی</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-[var(--foreground)]">آدرس اقامتگاه قانونی</label>
          <textarea
            name="address"
            rows={2}
            value={formData.address || ''}
            onChange={handleChange}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>
    </form>
  );
}

