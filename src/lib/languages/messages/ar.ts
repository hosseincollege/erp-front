import type { UiMessage } from '../types';

const messages = {

    settingsTitle:'الإعدادات العامة', settingsDescription:'اختر لون الواجهة ولغة العرض. يتوفر الوضع الفاتح والداكن في الشريط العلوي.', accentTitle:'لون الواجهة', accentDescription:'يُعرض اللون المختار فورًا في مساحة العمل. اختر «حفظ التغييرات» للاحتفاظ به؛ والانتقال دون حفظ يعيد اللون السابق.', preview:'معاينة', primaryAction:'إجراء رئيسي', selectedItem:'عنصر محدد', languageTitle:'لغة العرض', languageDescription:'الفارسية والإنجليزية والعربية والصينية المبسطة والفرنسية والإسبانية والألمانية والروسية واليابانية والبرتغالية البرازيلية.', languageHelp:'لتغيير اللغة، افتح الإعدادات ← عام، واختر اللغة، ثم اضغط «حفظ التغييرات».', languageLabel:'اللغة', saveChanges:'حفظ التغييرات', blue:'أزرق', green:'أخضر', red:'أحمر', yellow:'أصفر', purple:'بنفسجي', customColor:'لون مخصص', accentPreviewHint:'معاينة اللون المحدد', openSidebar:'فتح الشريط الجانبي', unlockSidebar:'إلغاء قفل الشريط الجانبي', lockSidebar:'قفل الشريط الجانبي', themeSystem:'المظهر: النظام', themeLight:'المظهر: فاتح', themeDark:'المظهر: داكن', viewProfile:'عرض الملف الشخصي في الشريط الجانبي', admin:'المسؤول', user:'مستخدم', dashboard:'الانتقال إلى لوحة التحكم', notifications:'الإشعارات', changeTheme:'تغيير المظهر', navigateOn:'التنقل التلقائي مفعّل؛ انقر على الوحدة لفتحها', navigateOff:'التنقل التلقائي متوقف؛ انقر على الوحدة لفتح قائمتها', organizationLogo:'شعار المؤسسة', logoBackgroundTitle:'خلفية الشعار', logoBackgroundHint:'اختر الخلفية التي تظهر خلف الشعار في الشريط العلوي.', backgroundNone:'بلا خلفية', backgroundDark:'خلفية داكنة', backgroundWhite:'خلفية بيضاء',
    invalidLogoBackground: 'يجب أن تكون خلفية الشعار بلا خلفية أو داكنة أو بيضاء.',
} satisfies Record<UiMessage, string>;

export default messages;
