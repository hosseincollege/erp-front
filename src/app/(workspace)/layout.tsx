// src/app/(dashboard)/layout.tsx

import { AppShell } from "@/components/layout/app-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // اینجا فقط و فقط کانتینر جدید رو برمی‌گردونیم
  // تمام منطق هدر، سایدبار و پدینگ‌ها داخل AppShell هست
  return <AppShell>{children}</AppShell>;
}

// end of src/app/(dashboard)/layout.tsx
