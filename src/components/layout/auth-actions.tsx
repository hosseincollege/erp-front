/**
 * =====================================================
 *  فایل: auth-actions.tsx
 *  هدف: مدیریت جداگانه‌ی احراز هویت و اکانت کاربر
 *  توضیح: تمام منطق لاگین، لاگ‌اوت، نمایش نام کاربر و
 *         ریدایرکت بعد از خروج فقط در این فایل است.
 *  نکته: این کامپوننت مستقل از TopHeader است تا منطق
 *        اکانت در هدر قاطی نشود.
 * =====================================================
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, UserCircle2 } from 'lucide-react';
import { logout } from '@/lib/auth-api';

/**
 * تعریف نوع پراپ‌های این کامپوننت
 */
type AuthActionsProps = {
  userName?: string | null;
};

/**
 * کامپوننت اصلی مدیریت اکانت
 */
export function AuthActions({ userName }: AuthActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  /**
   * هندلر خروج از حساب کاربری
   * ۱) پاک کردن سشن/توکن
   * ۲) رفتن به صفحه اصلی
   * ۳) ریفرش کامل تا UI به‌روز شود
   */
  const handleLogout = async () => {
    try {
      setLoading(true);

      // پاک کردن سشن/توکن از بک‌اند یا localStorage
      await logout();

      // رفتن به صفحه عمومی و ریفرش واقعی
      router.replace('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* نمایش نام کاربر */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <UserCircle2 size={18} />
        <span>{userName || 'کاربر مهمان'}</span>
      </div>

      {/* دکمه خروج */}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-destructive px-3 py-2 text-sm text-destructive-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        <LogOut size={16} />
        {loading ? 'درحال خروج...' : 'خروج'}
      </button>
    </div>
  );
}
