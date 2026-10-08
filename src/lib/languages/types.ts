export type UiMessage =
  | 'settingsTitle' | 'settingsDescription' | 'accentTitle' | 'accentDescription'
  | 'preview' | 'primaryAction' | 'selectedItem' | 'languageTitle'
  | 'languageDescription' | 'languageLabel' | 'saveChanges'
  | 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  | 'openSidebar' | 'unlockSidebar' | 'lockSidebar' | 'themeSystem'
  | 'themeLight' | 'themeDark' | 'viewProfile' | 'admin' | 'user'
  | 'dashboard' | 'notifications' | 'changeTheme' | 'navigateOn'
  | 'navigateOff' | 'organizationLogo' | 'customColor' | 'accentPreviewHint'
  | 'languageHelp' | 'logoShadowTitle' | 'logoShadowHint'
  | 'shadowNone' | 'shadowDark' | 'shadowLight'
  | 'contrastTitle' | 'contrastDescription' | 'lightContrast' | 'darkContrast'
  | 'contrastSoft' | 'contrastBalanced' | 'contrastStrong'
  | 'invalidLogoShadow';

export type LocaleMessages = Record<UiMessage, string>;
