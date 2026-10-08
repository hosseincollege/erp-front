import type { UiMessage } from '../types';

const messages = {

    settingsTitle:'Allgemeine Einstellungen', settingsDescription:'Wähle Akzentfarbe und Anzeigesprache. Heller und dunkler Modus sind über die Kopfzeile verfügbar.', accentTitle:'Akzentfarbe', accentDescription:'Die gewählte Farbe wird sofort in der Arbeitsfläche angezeigt. Mit „Änderungen speichern“ bleibt sie erhalten; ohne Speichern wird die vorherige Farbe wiederhergestellt.', preview:'Vorschau', primaryAction:'Hauptaktion', selectedItem:'Ausgewählter Eintrag', languageTitle:'Anzeigesprache', languageDescription:'Persisch, Englisch, Arabisch, vereinfachtes Chinesisch, Französisch, Spanisch, Deutsch, Russisch, Japanisch und brasilianisches Portugiesisch.', languageHelp:'Zum Ändern der Sprache: Einstellungen → Allgemein öffnen, Sprache auswählen und „Änderungen speichern“ wählen.', languageLabel:'Sprache', saveChanges:'Änderungen speichern', blue:'Blau', green:'Grün', red:'Rot', yellow:'Gelb', purple:'Violett', customColor:'Benutzerdefinierte Farbe', accentPreviewHint:'Vorschau der gewählten Farbe', openSidebar:'Seitenleiste öffnen', unlockSidebar:'Seitenleiste entsperren', lockSidebar:'Seitenleiste sperren', themeSystem:'Design: System', themeLight:'Design: Hell', themeDark:'Design: Dunkel', viewProfile:'Profil in der Seitenleiste anzeigen', admin:'Administrator', user:'Benutzer', dashboard:'Zum Dashboard', notifications:'Benachrichtigungen', changeTheme:'Design ändern', navigateOn:'Automatische Navigation ist aktiv; Modul anklicken zum Öffnen', navigateOff:'Automatische Navigation ist aus; Modul anklicken zum Öffnen des Menüs', organizationLogo:'Organisationslogo', logoShadowTitle:'Logoschatten', logoShadowHint:'Wähle den Schatten um das Logo in der Kopfzeile.', shadowNone:'Kein Schatten', shadowDark:'Dunkler Schatten', shadowLight:'Heller Schatten',
    contrastTitle: "Anzeigekontrast",
    contrastDescription: "Lege den Kontrast für den hellen und dunklen Modus getrennt fest. Änderungen werden sofort angezeigt und nach dem Speichern beibehalten.",
    lightContrast: "Heller Modus",
    darkContrast: "Dunkler Modus",
    contrastSoft: "Sanft",
    contrastBalanced: "Ausgewogen",
    contrastStrong: "Stark",
    invalidLogoShadow: 'Der Logoschatten muss auf keinen, dunklen oder hellen Schatten gesetzt sein.',
} satisfies Record<UiMessage, string>;

export default messages;
