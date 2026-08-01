import { ModulePage } from "@/components/module-page";

export default function InventoryPage() {
  return (
    <ModulePage
      title="مدیریت انبار"
      description="کنترل موجودی کالا، گردش انبار، ورود و خروج و هشدار کمبود"
      stats={[
        { label: "کالای فعال", value: "314" },
        { label: "کمبود موجودی", value: "12" },
        { label: "ورود امروز", value: "19" },
        { label: "خروج امروز", value: "27" },
      ]}
    />
  );
}
