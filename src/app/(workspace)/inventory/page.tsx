// Path: frontend/src/app/(workspace)/inventory/page.tsx
// Frontend - inventory dashboard page with live summary, stock list, and recent movements

"use client";

import { useEffect, useMemo, useState } from "react";
import { ModulePage } from "@/components/module-page";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { inventoryApi } from "@/lib/inventory-api";
import type {
  InventoryBalance,
  InventoryMovement,
  InventorySummary,
} from "@/types/inventory";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowRightLeft,
  Package,
  Warehouse,
} from "lucide-react";

export default function InventoryPage() {
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [balances, setBalances] = useState<InventoryBalance[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [summaryData, balancesData, movementsData] = await Promise.all([
          inventoryApi.getSummary(),
          inventoryApi.getBalances(),
          inventoryApi.getMovements(),
        ]);

        if (!active) return;

        setSummary(summaryData);
        setBalances(balancesData);
        setMovements(movementsData);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "کالای فعال",
        value: String(summary?.activeProducts ?? 0),
        hint: "کالاهای قابل استفاده",
        tone: "primary" as const,
        icon: Package,
      },
      {
        label: "کمبود موجودی",
        value: String(summary?.lowStockCount ?? 0),
        hint: "نیازمند تأمین",
        tone: "danger" as const,
        icon: AlertTriangle,
      },
      {
        label: "ورود امروز",
        value: String(summary?.todayReceipts ?? 0),
        hint: "رسیدهای ثبت‌شده",
        tone: "success" as const,
        icon: ArrowDownToLine,
      },
      {
        label: "خروج امروز",
        value: String(summary?.todayIssues ?? 0),
        hint: "حواله‌های ثبت‌شده",
        tone: "warning" as const,
        icon: ArrowRightLeft,
      },
    ],
    [summary]
  );

  return (
    <ModulePage
      title="مدیریت انبار"
      description="کنترل موجودی کالا، گردش انبار، ورود و خروج و هشدار کمبود"
      stats={[]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <section className="rounded-lg border bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">موجودی جاری</h2>
                <p className="text-sm text-muted-foreground">
                  آخرین وضعیت کالاها در انبارها
                </p>
              </div>
              <StatusBadge status={loading ? "loading" : "active"} />
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="py-2 text-right font-medium">کد کالا</th>
                    <th className="py-2 text-right font-medium">نام کالا</th>
                    <th className="py-2 text-right font-medium">انبار</th>
                    <th className="py-2 text-right font-medium">موجودی</th>
                  </tr>
                </thead>
                <tbody>
                  {balances.map((row) => (
                    <tr key={`${row.productId}-${row.warehouseId}`} className="border-b last:border-0">
                      <td className="py-3">{row.sku}</td>
                      <td className="py-3 font-medium">{row.productName}</td>
                      <td className="py-3">{row.warehouseName}</td>
                      <td className="py-3">
                        {row.quantity} {row.unit}
                      </td>
                    </tr>
                  ))}
                  {!loading && balances.length === 0 ? (
                    <tr>
                      <td className="py-6 text-center text-muted-foreground" colSpan={4}>
                        هنوز موجودی ثبت نشده است
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border bg-background p-4">
            <div className="mb-4">
              <h2 className="text-base font-semibold">گردش‌های اخیر</h2>
              <p className="text-sm text-muted-foreground">
                آخرین ورود و خروج‌های ثبت‌شده
              </p>
            </div>

            <div className="space-y-3">
              {movements.slice(0, 8).map((move) => (
                <div key={move.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{move.productName}</div>
                      <div className="text-xs text-muted-foreground">
                        {move.warehouseName}
                      </div>
                    </div>
                    <StatusBadge status={move.type.toLowerCase()} />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {move.quantity} واحد
                  </div>
                </div>
              ))}
              {!loading && movements.length === 0 ? (
                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  هنوز گردش انبار ثبت نشده است
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </ModulePage>
  );
}
