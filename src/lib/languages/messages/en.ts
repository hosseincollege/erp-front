import type { UiMessage } from '../types';

const messages = {

    settingsTitle:'General settings', settingsDescription:'Choose the application accent color and display language. Light and dark mode stay available in the top header.', accentTitle:'Accent color', accentDescription:'Selecting a color previews it immediately in the workspace. Choose “Save changes” to keep it; leaving without saving restores the previous color.', preview:'Preview', primaryAction:'Primary action', selectedItem:'Selected item', languageTitle:'Display language', languageDescription:'Persian, English, Arabic, Simplified Chinese, French, Spanish, German, Russian, Japanese, and Brazilian Portuguese.', languageHelp:'To change the language, open Settings → General, select a language, then choose “Save changes”.', languageLabel:'Language', saveChanges:'Save changes', blue:'Blue', green:'Green', red:'Red', yellow:'Yellow', purple:'Purple', customColor:'Custom color', accentPreviewHint:'Selected color preview', openSidebar:'Open sidebar', unlockSidebar:'Unlock sidebar', lockSidebar:'Lock sidebar', themeSystem:'Theme: system', themeLight:'Theme: light', themeDark:'Theme: dark', viewProfile:'View profile in sidebar', admin:'admin', user:'User', dashboard:'Go to dashboard', notifications:'Notifications', changeTheme:'Change theme', navigateOn:'Automatic navigation is on; click a module to open it', navigateOff:'Automatic navigation is off; click a module to open its menu', organizationLogo:'Organization logo', logoShadowTitle:'Logo shadow', logoShadowHint:'Choose the shadow shown around the header logo.', shadowNone:'No shadow', shadowDark:'Dark shadow', shadowLight:'Light shadow',
    contrastTitle: "Display contrast",
    contrastDescription: "Choose contrast separately for light and dark mode. Changes preview immediately and remain after saving.",
    lightContrast: "Light mode",
    darkContrast: "Dark mode",
    contrastSoft: "Soft",
    contrastBalanced: "Balanced",
    contrastStrong: "Strong",
    invalidLogoShadow: 'Logo shadow must be none, dark, or light.',
} satisfies Record<UiMessage, string>;

export default messages;
