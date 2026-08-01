import { ModulePage } from "@/components/module-page";

export default function SettingsPage() {
  return (
    <ModulePage
      title="تنظیمات"
      description="پیکربندی سامانه، تنظیمات کاربران، دسترسی‌ها و ترجیحات عمومی"
      stats={[
        { label: "کاربر فعال", value: "16" },
        { label: "نقش تعریف‌شده", value: "5" },
        { label: "دسترسی سفارشی", value: "12" },
        { label: "اعلان فعال", value: "9" },
      ]}
    />
  );
}
