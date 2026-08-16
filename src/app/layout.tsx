/**
 * @file frontend/src/app/layout.tsx
 * @description فایل اصلی لایوت ریشه. 
 * هدر از اینجا حذف شده تا مدیریت آن به AppShell واگذار شود و مشکل رندر دوبار حل گردد.
 */

import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "ERP Pro",
    template: "%s | ERP Pro",
  },
  description: "پلتفرم یکپارچه ERP و CRM",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={vazirmatn.variable}
    >
      <body className="font-sans antialiased overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
        <ThemeProvider>
          {/* 
            هدر از اینجا حذف شد.
            در ساختار جدید، TopHeader داخل AppShell رندر می‌شود.
          */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
