// frontend/src/app/register/page.tsx

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  FileDown,
  FileUp,
  Loader2,
  UserPlus,
} from 'lucide-react';

import { apiClient } from '@/lib/api-client';
import { register } from '@/lib/auth-api';

interface SetupStatusResponse {
  hasUsers: boolean;
  isFirstInstall: boolean;
}

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalCode: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
}

const EMPTY_FORM: RegisterFormData = {
  username: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  fatherName: '',
  nationalCode: '',
  birthDate: '',
  phone: '',
  email: '',
  address: '',
};

const SAMPLE_JSON = {
  username: 'admin',
  password: 'ChangeMe123!',
  confirmPassword: 'ChangeMe123!',
  firstName: 'مدیر',
  lastName: 'سیستم',
  fatherName: '',
  nationalCode: '0012345678',
  birthDate: '1990-01-01',
  phone: '',
  email: 'admin@example.com',
  address: '',
};

async function getSetupStatus(): Promise<SetupStatusResponse> {
  return apiClient.get<SetupStatusResponse>('/setup/status');
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStringValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function normalizeImportedForm(data: unknown): RegisterFormData {
  if (!isObject(data)) return EMPTY_FORM;

  return {
    username: toStringValue(data.username),
    password: toStringValue(data.password),
    confirmPassword: toStringValue(
      data.confirmPassword ?? data.password,
    ),
    firstName: toStringValue(data.firstName),
    lastName: toStringValue(data.lastName),
    fatherName: toStringValue(data.fatherName),
    nationalCode: toStringValue(data.nationalCode),
    birthDate: toStringValue(data.birthDate),
    phone: toStringValue(data.phone),
    email: toStringValue(data.email),
    address: toStringValue(data.address),
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [setupAllowed, setSetupAllowed] = useState(false);
  const [loadingSetup, setLoadingSetup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>(EMPTY_FORM);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const status = await getSetupStatus();
        if (!mounted) return;
        setSetupAllowed(status.isFirstInstall);
      } catch {
        if (!mounted) return;
        setSetupAllowed(false);
        setError('دریافت وضعیت راه‌اندازی سیستم ناموفق بود.');
      } finally {
        if (!mounted) return;
        setLoadingSetup(false);
      }
    };

    void init();

    return () => {
      mounted = false;
    };
  }, []);

  const sampleJsonText = useMemo(
    () => JSON.stringify(SAMPLE_JSON, null, 2),
    [],
  );

  const updateField = (key: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const downloadSampleJson = () => {
    const blob = new Blob([sampleJsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'register-sample.json';
    a.click();

    URL.revokeObjectURL(url);
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleJsonImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const normalized = normalizeImportedForm(parsed);

      setFormData((prev) => ({
        ...prev,
        ...normalized,
      }));
      setSuccess('فایل JSON با موفقیت بارگذاری شد.');
      setError('');
    } catch {
      setError('فایل JSON معتبر نیست.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!setupAllowed) {
      setError('ثبت‌نام فقط در حالت نصب اولیه فعال است.');
      return;
    }

    if (!formData.username.trim()) {
      setError('نام کاربری الزامی است.');
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('نام و نام خانوادگی الزامی است.');
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبور و تکرار رمز عبور یکسان نیستند.');
      return;
    }

    if (formData.nationalCode && !/^\d{10}$/.test(formData.nationalCode)) {
      setError('کد ملی باید دقیقاً ۱۰ رقم باشد.');
      return;
    }

    if (formData.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(formData.birthDate)) {
      setError('تاریخ تولد باید با فرمت YYYY-MM-DD باشد.');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        fatherName: formData.fatherName.trim() || undefined,
        nationalCode: formData.nationalCode.trim() || undefined,
        birthDate: formData.birthDate.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        address: formData.address.trim() || undefined,
      });

      setSuccess('ثبت‌نام با موفقیت انجام شد.');
      router.replace('/');
    } catch (err: any) {
      setError(err?.message || 'ثبت‌نام ناموفق بود.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          در حال بررسی وضعیت راه‌اندازی...
        </div>
      </div>
    );
  }

  if (!setupAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
        <div className="w-full max-w-md border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3 text-rose-300">
            <AlertCircle className="h-5 w-5" />
            <h1 className="text-lg font-semibold">ثبت‌نام غیرفعال است</h1>
          </div>
          <p className="mt-4 text-sm text-slate-300">
            ثبت‌نام فقط برای راه‌اندازی اولیه سیستم در دسترس است.
          </p>
          <div className="mt-6 flex items-center justify-between">
            <Link className="text-sm text-sky-300 hover:text-sky-200" href="/login">
              رفتن به ورود
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">ثبت‌نام اولیه</h1>
            <p className="mt-1 text-sm text-slate-400">
              اطلاعات کاربر اصلی سیستم را وارد کنید یا از فایل JSON استفاده کنید.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadSampleJson}
              className="inline-flex items-center gap-2 border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
            >
              <FileDown className="h-4 w-4" />
              دانلود نمونه
            </button>

            <button
              type="button"
              onClick={triggerFilePicker}
              className="inline-flex items-center gap-2 border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
            >
              <FileUp className="h-4 w-4" />
              بارگذاری JSON
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleJsonImport}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="border border-slate-800 bg-slate-900 p-6">
          {error ? (
            <div className="mb-4 flex items-center gap-2 border border-rose-900/60 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mb-4 flex items-center gap-2 border border-emerald-900/60 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-200">
              <Check className="h-4 w-4" />
              {success}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="نام کاربری">
              <input value={formData.username} onChange={(e) => updateField('username', e.target.value)} className="w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </Field>
            <Field label="ایمیل">
              <input value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </Field>
            <Field label="نام">
              <input value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} className="w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </Field>
            <Field label="نام خانوادگی">
              <input value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} className="w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </Field>
            <Field label="نام پدر">
              <input value={formData.fatherName} onChange={(e) => updateField('fatherName', e.target.value)} className="w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </Field>
            <Field label="کد ملی">
              <input value={formData.nationalCode} onChange={(e) => updateField('nationalCode', e.target.value)} className="w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </Field>
            <Field label="تاریخ تولد">
              <input type="date" value={formData.birthDate} onChange={(e) => updateField('birthDate', e.target.value)} className="w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </Field>
            <Field label="شماره تلفن">
              <input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </Field>
            <Field label="رمز عبور">
              <div className="flex items-center gap-2 border border-slate-700 bg-slate-950 px-3 py-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Field label="تکرار رمز عبور">
              <div className="flex items-center gap-2 border border-slate-700 bg-slate-950 px-3 py-2">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
                <button type="button" onClick={() => setShowConfirmPassword((v) => !v)}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Field label="آدرس" className="md:col-span-2">
              <textarea value={formData.address} onChange={(e) => updateField('address', e.target.value)} rows={4} className="w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </Field>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <Link href="/login" className="text-sm text-slate-400 hover:text-slate-200">
              رفتن به ورود
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-sky-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              ثبت‌نام
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <div className="mb-2 text-sm text-slate-300">{label}</div>
      {children}
    </label>
  );
}
