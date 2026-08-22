// File: frontend/src/app/(workspace)/settings/page.tsx
"use client";

import { useState } from "react";
import { 
  Building2, 
  GitBranch, 
  Network, 
  ShieldCheck, 
  Users, 
  DatabaseBackup 
} from "lucide-react";

import { CompanyTab } from "./company-tab";
import { BranchesTab } from "./branches-tab";
import { DepartmentsTab } from "./departments-tab";
import { RolesTab } from "./roles-tab";
import { UsersTab } from "./users-tab";
import { DataImportTab } from "./data-import-tab";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("import");

  const tabs = [
    { id: "import", label: "درون‌ریزی داده (JSON)", icon: DatabaseBackup },
    { id: "company", label: "مشخصات شرکت", icon: Building2 },
    { id: "branches", label: "مدیریت شعب", icon: GitBranch },
    { id: "departments", label: "دپارتمان‌ها", icon: Network },
    { id: "roles", label: "نقش‌ها و دسترسی‌ها", icon: ShieldCheck },
    { id: "users", label: "کاربران سیستم", icon: Users },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* هدر صفحه تنظیمات */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">تنظیمات پایه و مدیریت سیستم</h1>
        <p className="text-sm text-muted-foreground mt-1">
          پیکربندی ساختار سازمان، شعب، دپارتمان‌ها، سطوح دسترسی و ورود گروهی داده‌ها.
        </p>
      </div>

      {/* منوی تب‌ها */}
      <div className="flex border-b border-border space-x-1 space-x-reverse overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* محتوای تب فعال */}
      <div className="mt-6">
        {activeTab === "import" && <DataImportTab />}
        {activeTab === "company" && <CompanyTab />}
        {activeTab === "branches" && <BranchesTab />}
        {activeTab === "departments" && <DepartmentsTab />}
        {activeTab === "roles" && <RolesTab />}
        {activeTab === "users" && <UsersTab />}
      </div>
    </div>
  );
}
