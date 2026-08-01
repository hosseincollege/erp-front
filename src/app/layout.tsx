// src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TopHeader } from "@/components/layout/top-header";
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
      <body className="font-sans antialiased overflow-x-hidden">
        <ThemeProvider>
          {/* TopHeader همواره ثابت در بالای تمام صفحات */}
          <TopHeader />
          
          {/* pt-14 معادل 3.5rem یا 56px است که فضای زیر TopHeader را خالی می‌کند */}
          <main className="min-h-screen pt-14 bg-[color:var(--background)] text-[color:var(--foreground)]">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

// end of src/app/layout.tsx
