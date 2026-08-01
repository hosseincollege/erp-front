import { ModulePage } from "@/components/module-page";

export default function CrmPage() {
  return (
    <ModulePage
      title="مدیریت مشتریان"
      description="ثبت، پیگیری و تحلیل تعاملات مشتریان و سرنخ‌های فروش"
      stats={[
        { label: "مشتری فعال", value: "128" },
        { label: "سرنخ جدید", value: "17" },
        { label: "پیگیری امروز", value: "9" },
        { label: "فرصت باز", value: "23" },
      ]}
    />
  );
}
