import type { UiMessage } from '../types';

const messages = {

    settingsTitle:'تنظیمات عمومی', settingsDescription:'رنگ اصلی و زبان نمایش برنامه را انتخاب کنید. حالت روشن و تیره از هدر بالا در دسترس است.', accentTitle:'رنگ تم', accentDescription:'با انتخاب هر رنگ، پیش‌نمایش آن فوراً در محیط داخلی اعمال می‌شود. برای نگه‌داشتن آن «ذخیره تغییرات» را بزنید؛ با خروج بدون ذخیره، رنگ قبلی برمی‌گردد.', preview:'پیش‌نمایش', primaryAction:'دکمهٔ اصلی', selectedItem:'گزینهٔ فعال', languageTitle:'زبان نمایش', languageDescription:'فارسی، انگلیسی، عربی، چینی ساده‌شده، فرانسوی، اسپانیایی، آلمانی، روسی، ژاپنی و پرتغالی برزیلی.', languageHelp:'برای تغییر زبان به تنظیمات ← عمومی بروید، زبان را انتخاب کنید و «ذخیره تغییرات» را بزنید.', languageLabel:'زبان', saveChanges:'ذخیره تغییرات', blue:'آبی', green:'سبز', red:'قرمز', yellow:'زرد', purple:'بنفش', customColor:'رنگ سفارشی', accentPreviewHint:'نمونهٔ رنگ انتخاب‌شده', openSidebar:'باز کردن سایدبار', unlockSidebar:'باز کردن قفل سایدبار', lockSidebar:'قفل کردن سایدبار', themeSystem:'حالت فعلی: سیستم', themeLight:'حالت فعلی: روشن', themeDark:'حالت فعلی: تیره', viewProfile:'مشاهده پروفایل در سایدبار', admin:'مدیر', user:'کاربر', dashboard:'رفتن به صفحه اصلی', notifications:'اعلان‌ها', changeTheme:'تغییر تم', navigateOn:'ناوبری خودکار فعال است؛ کلیک روی ماژول صفحه را باز می‌کند', navigateOff:'ناوبری خودکار غیرفعال است؛ کلیک روی ماژول فقط منو را باز می‌کند', organizationLogo:'لوگوی سازمان', logoShadowTitle:'سایهٔ لوگو', logoShadowHint:'نوع سایهٔ لوگوی هدر را انتخاب کنید.', shadowNone:'بدون سایه', shadowDark:'سایهٔ تیره', shadowLight:'سایهٔ روشن',
    contrastTitle: "تنظیم کنتراست",
    contrastDescription: "کنتراست حالت روشن و تیره را جداگانه انتخاب کنید؛ تغییرها پیش‌نمایش می‌شوند و با ذخیره باقی می‌مانند.",
    lightContrast: "حالت روشن",
    darkContrast: "حالت تیره",
    contrastSoft: "ملایم",
    contrastBalanced: "متعادل",
    contrastStrong: "پررنگ",
    invalidLogoShadow: 'سایهٔ لوگو باید بدون سایه، تیره یا روشن باشد.',
} satisfies Record<UiMessage, string>;

export default messages;
