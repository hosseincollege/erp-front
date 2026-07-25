"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  CircleDollarSign,
  ShoppingBasket,
  Package,
  WalletCards,
  Users,
  Headset,
  Settings,
} from "lucide-react";

const items = [
  { href: "/", label: "داشبورد", icon: LayoutGrid },
  { href: "/sales", label: "فروش", icon: CircleDollarSign },
  { href: "/purchases", label: "خرید", icon: ShoppingBasket },
  { href: "/inventory", label: "انبار", icon: Package },
  { href: "/accounting", label: "حسابداری", icon: WalletCards },
  { href: "/hr", label: "منابع انسانی", icon: Users },
  { href: "/support", label: "پشتیبانی", icon: Headset },
  { href: "/settings", label: "تنظیمات", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-l border-[var(--border)] bg-[var(--surface)] lg:flex lg:flex-col">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-lg font-bold">ERP Pro</h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          پنل یکپارچه مدیریت سازمان
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                  : "text-[var(--foreground)] hover:bg-[var(--surface-hover)]",
              ].join(" ")}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
