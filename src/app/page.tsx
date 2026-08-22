/**
 * @file src/app/page.tsx
 * @description صفحه اصلی ERP Pro.
 * اگر کاربر لاگین نباشد، لندینگ عمومی نمایش داده می‌شود.
 * اگر کاربر لاگین باشد، داشبورد داخل AppShell نمایش داده می‌شود.
 */

'use client';

import { useEffect, useState } from 'react';

import { PublicLanding } from '@/components/home/public-landing';
import { AuthenticatedHome } from '@/components/home/authenticated-home';
import { isUserAuthenticated } from '@/lib/auth-api';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      setIsAuthenticated(isUserAuthenticated());
    };

    check();

    window.addEventListener('focus', check);
    window.addEventListener('storage', check);
    window.addEventListener('auth:login', check);
    window.addEventListener('auth:logout', check);

    return () => {
      window.removeEventListener('focus', check);
      window.removeEventListener('storage', check);
      window.removeEventListener('auth:login', check);
      window.removeEventListener('auth:logout', check);
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-background"
      >
        <div className="animate-pulse text-sm text-muted-foreground">
          در حال بارگذاری...
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <PublicLanding />;
  }

  return <AuthenticatedHome />;
}
