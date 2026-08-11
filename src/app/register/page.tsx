/**
 * @file src/app/register/page.tsx
 * @description صفحه ثبت‌نام ERP Pro با رعایت اصول RTL و مدیریت خطاهای API.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth-api';
import { ApiClientError } from '@/lib/api-client';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ارسال درخواست بدون فیلد role
      await register(formData);
      router.push('/');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiClientError) {
        // نمایش خطاهای اعتبارسنجی بک‌اِند
        setError(err.message);
      } else {
        setError('خطایی در برقراری ارتباط با سرور رخ داد.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4" dir="rtl">
      <div className="w-full max-w-md space-y-8 bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">ساخت حساب جدید</h1>
          <p className="text-slate-400 text-sm">برای ورود به ERP Pro ثبت‌نام کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-xs leading-relaxed">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">نام و نام خانوادگی</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="حسین مهزادی‌منش"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">ایمیل</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">رمز عبور</label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left"
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-[10px] text-slate-500">حداقل ۸ کاراکتر وارد کنید.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'تکمیل ثبت‌نام'
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
