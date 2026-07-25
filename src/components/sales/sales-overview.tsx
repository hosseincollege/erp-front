"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  FileText,
  Users,
  Wallet,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";

type OrderStatus = "pending" | "completed" | "cancelled";

type Order = {
  id: string;
  customer: string;
  amount: string;
  date: string;
  status: OrderStatus;
};

const orders: Order[] = [
  {
    id: "SO-1001",
    customer: "شرکت پارس سیستم",
    amount: "125,000,000",
    date: "1403/11/20",
    status: "completed",
  },
  {
    id: "SO-1002",
    customer: "فروشگاه آریا",
    amount: "48,500,000",
    date: "1403/11/21",
    status: "pending",
  },
  {
    id: "SO-1003",
    customer: "گروه صنعتی مهر",
    amount: "210,000,000",
    date: "1403/11/22",
    status: "completed",
  },
  {
    id: "SO-1004",
    customer: "موسسه نوین تجارت",
    amount: "32,800,000",
    date: "1403/11/22",
    status: "cancelled",
  },
  {
    id: "SO-1005",
    customer: "شرکت داده پرداز",
    amount: "87,300,000",
    date: "1403/11/23",
    status: "pending",
  },
];

const filters = [
  { key: "all", label: "همه" },
  { key: "pending", label: "در انتظار" },
  { key: "completed", label: "تکمیل شده" },
  { key: "cancelled", label: "لغو شده" },
] as const;

export function SalesOverview() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]["key"]>("all");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "all" ? true : order.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="سفارش های امروز"
          value="18"
          hint="نسبت به دیروز 12٪ بیشتر"
          icon={ShoppingCart}
          trend="up"
          change="12٪"
          tone="primary"
        />

        <StatCard
          label="فاکتور صادر شده"
          value="32"
          hint="4 مورد در انتظار تایید"
          icon={FileText}
          trend="neutral"
          tone="warning"
        />

        <StatCard
          label="مشتریان فعال"
          value="146"
          hint="12 مشتری جدید این ماه"
          icon={Users}
          trend="up"
          change="8٪"
          tone="success"
        />

        <StatCard
          label="درآمد امروز"
          value="412M"
          hint="براساس سفارش های ثبت شده"
          icon={Wallet}
          trend="up"
          change="18٪"
          tone="success"
        />
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold">سفارش های فروش</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              جستجو، بررسی وضعیت و پیگیری آخرین سفارش ها
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-3 py-2">
              <Search size={16} className="text-[var(--muted)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جستجو بر اساس مشتری یا شماره سفارش"
                className="w-72 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const active = activeFilter === filter.key;

                return (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`rounded-2xl px-4 py-2 text-sm transition ${
                      active
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-right text-sm text-[var(--muted)]">
                <th className="px-4 py-3 font-medium">شماره سفارش</th>
                <th className="px-4 py-3 font-medium">مشتری</th>
                <th className="px-4 py-3 font-medium">مبلغ</th>
                <th className="px-4 py-3 font-medium">تاریخ</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="rounded-2xl bg-[var(--background)]">
                  <td className="rounded-r-2xl px-4 py-4 text-sm font-medium">
                    {order.id}
                  </td>
                  <td className="px-4 py-4 text-sm">{order.customer}</td>
                  <td className="px-4 py-4 text-sm">{order.amount}</td>
                  <td className="px-4 py-4 text-sm">{order.date}</td>
                  <td className="rounded-l-2xl px-4 py-4 text-sm">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)]">
              موردی برای نمایش پیدا نشد.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
