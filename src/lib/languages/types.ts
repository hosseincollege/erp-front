import type { Locale } from '@/components/preferences-provider';

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

export type { Locale };
