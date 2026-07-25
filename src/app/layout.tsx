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
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
            <TopHeader />
            <main className="min-h-[calc(100vh-56px)]">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
