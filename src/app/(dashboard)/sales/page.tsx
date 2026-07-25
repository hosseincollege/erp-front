import { ModulePage } from "@/components/module-page";

export default function SalesPage() {
  return (
    <ModulePage
      title="مدیریت فروش"
      description="ثبت سفارش‌ها، پیگیری فاکتورها، مشتریان و عملکرد فروش روزانه"
      stats={[
        { label: "فروش امروز", value: "26" },
        { label: "سفارش باز", value: "13" },
        { label: "فاکتور صادرشده", value: "18" },
        { label: "مشتری جدید", value: "7" },
      ]}
    />
  );
}
