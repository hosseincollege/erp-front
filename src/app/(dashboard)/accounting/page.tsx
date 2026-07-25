import { ModulePage } from "@/components/module-page";

export default function AccountingPage() {
  return (
    <ModulePage
      title="مدیریت حسابداری"
      description="کنترل دریافت ها، پرداخت ها، اسناد مالی و مانده حساب ها"
      stats={[
        { label: "دریافت امروز", value: "12" },
        { label: "پرداخت امروز", value: "8" },
        { label: "اسناد باز", value: "21" },
        { label: "فاکتور معوق", value: "6" },
      ]}
    />
  );
}
