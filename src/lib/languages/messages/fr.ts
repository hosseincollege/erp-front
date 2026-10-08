import type { UiMessage } from '../types';

const messages = {

    settingsTitle:'Paramètres généraux', settingsDescription:'Choisissez la couleur principale et la langue. Le mode clair ou sombre reste accessible dans l’en-tête.', accentTitle:'Couleur principale', accentDescription:'La couleur choisie est prévisualisée immédiatement. Cliquez sur « Enregistrer » pour la conserver ; quitter sans enregistrer rétablit la couleur précédente.', preview:'Aperçu', primaryAction:'Action principale', selectedItem:'Élément sélectionné', languageTitle:'Langue d’affichage', languageDescription:'Persan, anglais, arabe, chinois simplifié, français, espagnol, allemand, russe, japonais et portugais brésilien.', languageHelp:'Pour changer de langue, ouvrez Paramètres → Général, choisissez une langue, puis cliquez sur « Enregistrer les modifications ».', languageLabel:'Langue', saveChanges:'Enregistrer', blue:'Bleu', green:'Vert', red:'Rouge', yellow:'Jaune', purple:'Violet', customColor:'Couleur personnalisée', accentPreviewHint:'Aperçu de la couleur choisie', openSidebar:'Ouvrir le menu', unlockSidebar:'Déverrouiller le menu', lockSidebar:'Verrouiller le menu', themeSystem:'Thème : système', themeLight:'Thème : clair', themeDark:'Thème : sombre', viewProfile:'Voir le profil dans le menu', admin:'administrateur', user:'Utilisateur', dashboard:'Aller au tableau de bord', notifications:'Notifications', changeTheme:'Changer de thème', navigateOn:'Navigation automatique activée ; cliquez sur un module pour l’ouvrir', navigateOff:'Navigation automatique désactivée ; cliquez sur un module pour ouvrir son menu', organizationLogo:'Logo de l’organisation', logoShadowTitle:'Ombre du logo', logoShadowHint:'Choisissez une ombre pour le logo du bandeau.', shadowNone:'Sans ombre', shadowDark:'Ombre sombre', shadowLight:'Ombre claire',
    contrastTitle: "Contraste de l’affichage",
    contrastDescription: "Choisissez séparément le contraste des modes clair et sombre. Le résultat est prévisualisé immédiatement et conservé après enregistrement.",
    lightContrast: "Mode clair",
    darkContrast: "Mode sombre",
    contrastSoft: "Doux",
    contrastBalanced: "Équilibré",
    contrastStrong: "Renforcé",
    invalidLogoShadow: 'Une ombre de logo doit être absente, sombre ou claire.',
} satisfies Record<UiMessage, string>;

export default messages;
