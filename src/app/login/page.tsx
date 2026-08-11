/**
 * @file src/app/login/page.tsx
 * @description صفحه ورود با مدیریت صحیح خطاهای اعتبار‌سنجی بک‌اِند.
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth-api";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      // استخراج و تمیزسازی پیام خطای بک‌اِند
      const message = err.message || "خطای ناشناخته در ورود";
      // تبدیل پیام‌های پیچیده بک‌اِند به متنی قابل فهم
      if (message.includes("identifier")) {
        setError("نام کاربری یا ایمیل وارد شده یافت نشد.");
      } else {
        setError(message.replace(/\|/g, "، "));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4" dir="rtl">
      <div className="w-full max-w-sm bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">ورود به سیستم</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-400 bg-red-950/30 border border-red-900 rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">ایمیل یا نام کاربری</label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">رمز عبور</label>
            <input
              type="password"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          حساب ندارید؟ <Link href="/register" className="text-blue-400">ثبت‌نام کنید</Link>
        </p>
      </div>
    </div>
  );
}
