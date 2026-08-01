import { ModulePage } from "@/components/module-page";

export default function HrPage() {
  return (
    <ModulePage
      title="منابع انسانی"
      description="مدیریت کارکنان، حضور و غیاب، پرونده‌ها و درخواست‌های داخلی"
      stats={[
        { label: "کارمند فعال", value: "42" },
        { label: "مرخصی امروز", value: "5" },
        { label: "درخواست جدید", value: "8" },
        { label: "شیفت باز", value: "3" },
      ]}
    />
  );
}
