import { ModulePage } from "@/components/module-page";

export default function ReportsPage() {
  return (
    <ModulePage
      title="گزارش‌ها"
      description="مشاهده گزارش‌های مدیریتی، عملکرد واحدها و شاخص‌های کلیدی کسب‌وکار"
      stats={[
        { label: "گزارش امروز", value: "11" },
        { label: "گزارش زمان‌بندی‌شده", value: "7" },
        { label: "شاخص فعال", value: "18" },
        { label: "هشدار تحلیلی", value: "3" },
      ]}
    />
  );
}
