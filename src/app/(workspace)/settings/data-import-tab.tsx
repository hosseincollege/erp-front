// File: frontend/src/app/(workspace)/settings/data-import-tab.tsx
"use client";

import { useState } from "react";
import { Download, Upload, FileJson, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { settingsApi } from "@/lib/settings-api";

// تمپلیت پیش‌فرض ساختار سازمان
const organizationTemplate = {
  company: {
    name: "شرکت نمونه پیشگامان عصر داده",
    economicCode: "14009876543",
    nationalId: "10101234567",
    phone: "021-88776655",
    email: "info@example.com",
    address: "تهران، خیابان آزادی، برج فناوری، طبقه ۴"
  },
  branches: [
    {
      name: "دفتر مرکزی تهران",
      code: "THR-01",
      phone: "021-88776650",
      address: "تهران، خیابان آزادی، برج فناوری"
    },
    {
      name: "شعبه اصفهان",
      code: "ISF-01",
      phone: "031-33445566",
      address: "اصفهان، خیابان چهارباغ بالا، ساختمان نگین"
    }
  ],
  departments: [
    {
      name: "واحد فناوری اطلاعات و زیرساخت",
      code: "DEP-IT",
      branchCode: "THR-01"
    },
    {
      name: "واحد مالی و حسابداری",
      code: "DEP-FIN",
      branchCode: "THR-01"
    },
    {
      name: "واحد فروش و بازاریابی",
      code: "DEP-SALES",
      branchCode: "ISF-01"
    }
  ]
};

// تمپلیت پیش‌فرض کاربران و نقش‌ها
const usersRolesTemplate = {
  roles: [
    {
      name: "مدیر ارشد سیستم",
      slug: "system_admin",
      description: "دسترسی کامل به تمامی ماژول‌ها و تنظیمات سیستمی",
      permissions: ["settings:manage", "users:manage", "branches:manage", "reports:view"]
    },
    {
      name: "مدیر مالی و اداری",
      slug: "finance_manager",
      description: "دسترسی به ماژول‌های حسابداری و دریافت گزارشات",
      permissions: ["finance:manage", "reports:view"]
    }
  ],
  users: [
    {
      email: "admin@example.com",
      fullName: "محمد احمدی",
      phone: "09121112233",
      roleSlug: "system_admin",
      branchCode: "THR-01",
      departmentCode: "DEP-IT"
    },
    {
      email: "finance.lead@example.com",
      fullName: "سارا کریمی",
      phone: "09123334455",
      roleSlug: "finance_manager",
      branchCode: "THR-01",
      departmentCode: "DEP-FIN"
    }
  ]
};

export function DataImportTab() {
  const [orgFileContent, setOrgFileContent] = useState<string | null>(null);
  const [userFileContent, setUserFileContent] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // دانلود فایل تمپلیت
  const handleDownloadTemplate = (type: "org" | "users") => {
    const data = type === "org" ? organizationTemplate : usersRolesTemplate;
    const filename = type === "org" ? "organization-template.json" : "users-roles-template.json";
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // خواندن فایل انتخاب شده توسط کاربر
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "org" | "users") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        JSON.parse(text); // بررسی صحت فرمت JSON
        if (type === "org") {
          setOrgFileContent(text);
        } else {
          setUserFileContent(text);
        }
        setStatusMsg({ type: "success", text: `فایل ${file.name} با موفقیت بررسی و بارگذاری شد.` });
      } catch {
        setStatusMsg({ type: "error", text: `فرمت فایل ${file.name} نامعتبر است. لطفاً فایل JSON معتبر انتخاب کنید.` });
      }
    };
    reader.readAsText(file);
  };

  // ارسال داده به سرور از طریق کلاینت متمرکز
  const handleImport = async (type: "org" | "users") => {
    const content = type === "org" ? orgFileContent : userFileContent;
    if (!content) {
      setStatusMsg({ type: "error", text: "ابتدا فایل JSON مربوطه را انتخاب کنید." });
      return;
    }

    setIsLoading(true);
    setStatusMsg(null);

    try {
      const parsedData = JSON.parse(content);
      let response: any;

      if (type === "org") {
        response = await settingsApi.importOrganization(parsedData);
      } else {
        response = await settingsApi.importUsersAndRoles(parsedData);
      }

      // پشتیبانی از ساختارهای بازگشتی متفاوت (Axios response.data یا شیء مستقیم)
      const data = response?.data || response;
      setStatusMsg({
        type: "success",
        text: data?.message || "اطلاعات با موفقیت در پایگاه داده ثبت شد."
      });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "خطای غیرمنتظره در ثبت اطلاعات رخ داد.";
      setStatusMsg({ type: "error", text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* پیام وضعیت */}
      {statusMsg && (
        <div
          className={`flex items-center gap-2 p-3.5 rounded-lg text-sm border ${
            statusMsg.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 border-rose-500/20"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* کارت اول: ساختار سازمان */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-base">
              <FileJson className="w-5 h-5" />
              <h3>۱. ساختار سازمان و شعب</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              شامل مشخصات شرکت اصلی، لیست شعبات و دپارتمان‌های متصل.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleDownloadTemplate("org")}
              className="w-full flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground py-2 px-3 rounded-lg text-xs font-medium border border-border transition-colors"
            >
              <Download className="w-4 h-4" />
              دانلود تمپلیت JSON سازمان
            </button>

            <div className="border border-dashed border-border rounded-lg p-3 text-center hover:bg-muted/20 transition-colors">
              <input
                type="file"
                accept=".json"
                id="org-upload"
                className="hidden"
                onChange={(e) => handleFileChange(e, "org")}
              />
              <label htmlFor="org-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">
                  {orgFileContent ? "فایل انتخاب شد (برای تعویض کلیک کنید)" : "انتخاب فایل JSON ویرایش‌شده"}
                </span>
              </label>
            </div>

            <button
              onClick={() => handleImport("org")}
              disabled={!orgFileContent || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-3 rounded-lg text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              درون‌ریزی و ساخت دیتای سازمان
            </button>
          </div>
        </div>

        {/* کارت دوم: کاربران و نقش‌ها */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-base">
              <FileJson className="w-5 h-5" />
              <h3>۲. کاربران، نقش‌ها و دسترسی‌ها</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              شامل تعریف نقش‌ها، سطوح دسترسی (RBAC) و تعریف کاربران و انتساب آن‌ها به شعب.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleDownloadTemplate("users")}
              className="w-full flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground py-2 px-3 rounded-lg text-xs font-medium border border-border transition-colors"
            >
              <Download className="w-4 h-4" />
              دانلود تمپلیت JSON نقش‌ها و کاربران
            </button>

            <div className="border border-dashed border-border rounded-lg p-3 text-center hover:bg-muted/20 transition-colors">
              <input
                type="file"
                accept=".json"
                id="user-upload"
                className="hidden"
                onChange={(e) => handleFileChange(e, "users")}
              />
              <label htmlFor="user-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">
                  {userFileContent ? "فایل انتخاب شد (برای تعویض کلیک کنید)" : "انتخاب فایل JSON ویرایش‌شده"}
                </span>
              </label>
            </div>

            <button
              onClick={() => handleImport("users")}
              disabled={!userFileContent || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-3 rounded-lg text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              درون‌ریزی و ایجاد کاربران و دسترسی‌ها
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
