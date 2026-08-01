import { ModulePage } from "@/components/module-page";

export default function PurchasesPage() {
  return (
    <ModulePage
      title="مدیریت خرید"
      description="ثبت سفارش‌های خرید، پیگیری تأمین‌کنندگان و کنترل وضعیت تأمین"
      stats={[
        { label: "سفارش باز", value: "14" },
        { label: "تأمین‌کننده فعال", value: "31" },
        { label: "در انتظار تأیید", value: "6" },
        { label: "تحویل امروز", value: "4" },
      ]}
    />
  );
}
