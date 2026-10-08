export const supportedLocales = ['fa', 'en', 'ar', 'zh-CN', 'fr', 'es', 'de', 'ru', 'ja', 'pt-BR'] as const;
export type Locale = (typeof supportedLocales)[number];

export const localeOptions: ReadonlyArray<{ id: Locale; name: string; direction: 'rtl' | 'ltr' }> = [
  { id: 'fa', name: 'فارسی', direction: 'rtl' },
  { id: 'en', name: 'English', direction: 'ltr' },
  { id: 'ar', name: 'العربية', direction: 'rtl' },
  { id: 'zh-CN', name: '中文（简体）', direction: 'ltr' },
  { id: 'fr', name: 'Français', direction: 'ltr' },
  { id: 'es', name: 'Español', direction: 'ltr' },
  { id: 'de', name: 'Deutsch', direction: 'ltr' },
  { id: 'ru', name: 'Русский', direction: 'ltr' },
  { id: 'ja', name: '日本語', direction: 'ltr' },
  { id: 'pt-BR', name: 'Português (Brasil)', direction: 'ltr' },
];

export function getLocaleDirection(locale: Locale): 'rtl' | 'ltr' {
  return localeOptions.find((option) => option.id === locale)?.direction ?? 'ltr';
}

export type UiMessage =
  | 'settingsTitle' | 'settingsDescription' | 'accentTitle' | 'accentDescription'
  | 'preview' | 'primaryAction' | 'selectedItem' | 'languageTitle'
  | 'languageDescription' | 'languageLabel' | 'saveChanges'
  | 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  | 'openSidebar' | 'unlockSidebar' | 'lockSidebar' | 'themeSystem'
  | 'themeLight' | 'themeDark' | 'viewProfile' | 'admin' | 'user'
  | 'dashboard' | 'notifications' | 'changeTheme' | 'navigateOn'
  | 'navigateOff' | 'organizationLogo' | 'customColor' | 'accentPreviewHint'
  | 'languageHelp' | 'logoBackgroundTitle' | 'logoBackgroundHint'
  | 'backgroundNone' | 'backgroundDark' | 'backgroundWhite'
  | 'invalidLogoBackground';

export type LocaleMessages = Record<UiMessage, string>;
