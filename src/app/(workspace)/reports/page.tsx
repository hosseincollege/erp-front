/**
 * مسیر فایل:
 * src/app/(workspace)/reports/page.tsx
 *
 * هدف:
 * داشبورد گزارش‌های مدیریتی، هوش تجاری (BI) و تحلیل عملکرد سازمان شامل:
 * - کارت‌های کلیدی شاخص‌های مالی، فروش، گزارش‌های زمان‌بندی‌شده و هشدارها
 * - فهرست گزارش‌های تحلیلی با قابلیت فیلتر بر اساس دسته‌بندی و دوره زمانی
 * - امکان جستجو و دانلود خروجی‌های PDF و اکسل
 */

"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Calendar,
  Search,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  Users,
  Boxes,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";

type ReportCategory = "ALL" | "FINANCIAL" | "SALES" | "HR" | "INVENTORY";
type ReportPeriod = "THIS_MONTH" | "LAST_QUARTER" | "YEAR_TO_DATE" | "CUSTOM";

interface ReportItem {
  id: string;
  code: string;
  title: string;
  description: string;
  category: "FINANCIAL" | "SALES" | "HR" | "INVENTORY";
  categoryLabel: string;
  lastGenerated: string;
  generatedBy: string;
  frequency: "روزانه" | "هفتگی" | "ماهانه" | "فصلی" | "درخواستی";
  fileFormats: Array<"PDF" | "XLSX" | "CSV">;
  status: "READY" | "PROCESSING" | "SCHEDULED";
}

const initialReports: ReportItem[] = [
  {
    id: "rep-1",
    code: "RPT-FIN-101",
    title: "صورت سود و زیان جامع (P&L)",
    description: "تحلیل تفکیکی درآمدها، بهای تمام‌شده کالای فروش‌رفته و هزینه‌های عملیاتی",
    category: "FINANCIAL",
    categoryLabel: "مالی و حسابداری",
    lastGenerated: "1403/08/28 - 10:30",
    generatedBy: "امور مالی",
    frequency: "ماهانه",
    fileFormats: ["PDF", "XLSX"],
    status: "READY",
  },
  {
    id: "rep-2",
    code: "RPT-SAL-204",
    title: "تحلیل خطوط فروش و عملکرد مشتریان سازمانی",
    description: "روند فروش محصولات، مطالبات معوق، مشتریان برتر و میزان تحقق تارگت‌ها",
    category: "SALES",
    categoryLabel: "فروش و CRM",
    lastGenerated: "1403/08/27 - 18:15",
    generatedBy: "واحد فروش",
    frequency: "هفتگی",
    fileFormats: ["PDF", "XLSX", "CSV"],
    status: "READY",
  },
  {
    id: "rep-3",
    code: "RPT-HR-302",
    title: "گزارش جامع حقوق و دستمزد، بیمه و کارکرد پرسنل",
    description: "خلاصه کارکرد ماهانه، اضافه‌کاری‌ها، کسورات قانونی و لیست بیمه تأمین اجتماعی",
    category: "HR",
    categoryLabel: "منابع انسانی",
    lastGenerated: "1403/08/25 - 14:00",
    generatedBy: "منابع انسانی",
    frequency: "ماهانه",
    fileFormats: ["PDF", "XLSX"],
    status: "READY",
  },
  {
    id: "rep-4",
    code: "RPT-INV-405",
    title: "موجودی انبار، کالاهای راکد و نقطه سفارش مجدد",
    description: "ارزش ریالی موجودی انبارها، گردش کالا و هشدارهای کسری قطعات حساس",
    category: "INVENTORY",
    categoryLabel: "انبار و لجستیک",
    lastGenerated: "1403/08/28 - 08:00",
    generatedBy: "انبار مرکزی",
    frequency: "روزانه",
    fileFormats: ["PDF", "XLSX"],
    status: "READY",
  },
  {
    id: "rep-5",
    code: "RPT-FIN-109",
    title: "جریان وجوه نقد و پیش‌بینی نقدینگی ۹۰ روزه",
    description: "تحلیل ورودی و خروجی نقدینگی، سررسید چک‌ها و تعهدات مالی آتی",
    category: "FINANCIAL",
    categoryLabel: "مالی و حسابداری",
    lastGenerated: "1403/08/26 - 11:45",
    generatedBy: "خزانه‌داری",
    frequency: "هفتگی",
    fileFormats: ["PDF", "XLSX"],
    status: "READY",
  },
  {
    id: "rep-6",
    code: "RPT-SAL-208",
    title: "گزارش قیف فروش و نرخ تبدیل سرنخ‌ها",
    description: "بررسی معاملات باز در پایپ‌لاین فروش و دلایل عدم موفقیت فرصت‌ها",
    category: "SALES",
    categoryLabel: "فروش و CRM",
    lastGenerated: "1403/08/24 - 16:30",
    generatedBy: "مدیریت فروش",
    frequency: "ماهانه",
    fileFormats: ["PDF"],
    status: "SCHEDULED",
  },
];

export default function ReportsPage() {
  const [reports] = useState<ReportItem[]>(initialReports);
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>("ALL");
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("THIS_MONTH");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchesCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.generatedBy.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [reports, selectedCategory, searchQuery]);

  return (
    <div dir="rtl" className="space-y-5">
      {/* شاخص‌های کلیدی (KPIs) */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">حاشیه سود ناخالص فصل</p>
              <p className="mt-2 text-xl font-bold text-foreground">۲۸.۴٪</p>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={13} />
                <span>+۲.۱٪ بالاتر از بودجه مصوب</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">تحقق تارگت فروش ماه</p>
              <p className="mt-2 text-xl font-bold text-blue-500">۹۱.۸٪</p>
              <p className="mt-1 text-[11px] text-muted-foreground">۵.۵۷ میلیارد از ۶.۰ میلیارد</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <BarChart3 size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">گزارش‌های زمان‌بندی‌شده</p>
              <p className="mt-2 text-xl font-bold text-foreground">۷ مورد</p>
              <p className="mt-1 text-[11px] text-muted-foreground">ارسال خودکار به هیئت‌مدیره</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Clock size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">هشدارهای تحلیلی و انحراف</p>
              <p className="mt-2 text-xl font-bold text-amber-500">۳ هشدار</p>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                <AlertTriangle size={13} />
                <span>نیاز به بررسی در انبار و فروش</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* بخش فیلترها و فهرست گزارش‌ها */}
      <section className="space-y-4">
        {/* نوار فیلتر و تب‌ها */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          {/* تب‌های دسته‌بندی */}
          <div className="flex flex-wrap items-center gap-1 rounded-xl bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "ALL"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>همه گزارش‌ها</span>
              <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px]">{reports.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("FINANCIAL")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "FINANCIAL"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <DollarSign size={13} />
              <span>مالی و بودجه</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("SALES")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "SALES"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp size={13} />
              <span>فروش و مشتریان</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("HR")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "HR"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users size={13} />
              <span>منابع انسانی</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("INVENTORY")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "INVENTORY"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Boxes size={13} />
              <span>انبار و تدارکات</span>
            </button>
          </div>

          {/* ابزار فیلتر و جستجو */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative w-full sm:w-48">
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as ReportPeriod)}
                className="h-9.5 w-full appearance-none rounded-xl border border-border bg-background pr-8 pl-3 text-xs text-foreground focus:border-blue-500 focus:outline-none"
              >
                <option value="THIS_MONTH">ماه جاری (آبان ۱۴۰۳)</option>
                <option value="LAST_QUARTER">فصل گذشته (تابستان)</option>
                <option value="YEAR_TO_DATE">از ابتدای سال مالی</option>
                <option value="CUSTOM">بازه زمانی سفارشی...</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={15} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جست‌وجو در عناوین یا کد گزارش..."
                className="h-9.5 w-full rounded-xl border border-border bg-background pr-9 pl-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* فهرست کارت‌های گزارش */}
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {filteredReports.length === 0 ? (
            <div className="col-span-full rounded-xl border border-border py-12 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <FileText size={20} />
              </div>
              <p className="mt-2 text-sm font-bold text-foreground">گزارشی با این مشخصات یافت نشد</p>
              <p className="mt-1 text-xs text-muted-foreground">عبارت جست‌وجو یا فیلتر دسته‌بندی را تغییر دهید.</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-blue-500/40 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground">
                        {report.code}
                      </span>
                      <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                        {report.categoryLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={11} />
                        <span>تناوب: {report.frequency}</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-2.5 text-sm font-bold text-foreground group-hover:text-blue-500 transition-colors">
                    {report.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border pt-3">
                  <div className="text-[11px] text-muted-foreground">
                    <span>آخرین خروجی: </span>
                    <span className="font-medium text-foreground">{report.lastGenerated}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {report.fileFormats.includes("PDF") && (
                      <button
                        type="button"
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-[11px] font-semibold text-foreground transition-all hover:bg-muted active:scale-95"
                        title="دریافت نسخه PDF"
                      >
                        <Download size={12} />
                        <span>PDF</span>
                      </button>
                    )}

                    {report.fileFormats.includes("XLSX") && (
                      <button
                        type="button"
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-[11px] font-semibold text-foreground transition-all hover:bg-muted active:scale-95"
                        title="دریافت نسخه اکسل"
                      >
                        <FileSpreadsheet size={12} />
                        <span>Excel</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="inline-flex h-8 items-center gap-1 rounded-lg bg-muted px-2.5 text-[11px] font-semibold text-foreground transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
                    >
                      <span>مشاهده زنده</span>
                      <ChevronLeft size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
