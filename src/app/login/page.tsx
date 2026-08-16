/**
 * @file src/app/login/page.tsx
 * @description صفحه ورود با مدیریت صحیح خطاهای اعتبارسنجی بک‌اند.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth-api';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData);
      router.push('/');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطای ناشناخته در ورود';

      if (message.includes('identifier')) {
        setError('نام کاربری یا ایمیل وارد شده یافت نشد.');
      } else {
        setError(message.replace(/\|/g, '، '));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-950 p-4"
      dir="rtl"
    >
      <div className="w-full max-w-sm bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          ورود به سیستم
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <div className="p-3 text-xs text-red-400 bg-red-950/30 border border-red-900 rounded-lg">
              {error}
            </div>
          ) : null}

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              ایمیل یا نام کاربری
            </label>
            <input
              type="text"
              required
              value={formData.email}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              رمز عبور
            </label>
            <input
              type="password"
              required
              value={formData.password}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold transition"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          حساب ندارید؟{' '}
          <Link href="/register" className="text-blue-400">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}
