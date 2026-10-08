import type { UiMessage } from '../types';

const messages = {

    settingsTitle:'Configuración general', settingsDescription:'Elige el color principal y el idioma. El modo claro u oscuro está disponible en el encabezado.', accentTitle:'Color principal', accentDescription:'El color elegido se previsualiza al instante. Pulsa «Guardar cambios» para conservarlo; si sales sin guardar, se restaura el color anterior.', preview:'Vista previa', primaryAction:'Acción principal', selectedItem:'Elemento seleccionado', languageTitle:'Idioma de visualización', languageDescription:'Persa, inglés, árabe, chino simplificado, francés, español, alemán, ruso, japonés y portugués brasileño.', languageHelp:'Para cambiar el idioma, ve a Configuración → General, selecciónalo y pulsa «Guardar cambios».', languageLabel:'Idioma', saveChanges:'Guardar cambios', blue:'Azul', green:'Verde', red:'Rojo', yellow:'Amarillo', purple:'Morado', customColor:'Color personalizado', accentPreviewHint:'Vista previa del color elegido', openSidebar:'Abrir menú lateral', unlockSidebar:'Desbloquear menú', lockSidebar:'Bloquear menú', themeSystem:'Tema: sistema', themeLight:'Tema: claro', themeDark:'Tema: oscuro', viewProfile:'Ver perfil en el menú', admin:'administrador', user:'Usuario', dashboard:'Ir al panel', notifications:'Notificaciones', changeTheme:'Cambiar tema', navigateOn:'La navegación automática está activa; haz clic en un módulo para abrirlo', navigateOff:'La navegación automática está desactivada; haz clic en un módulo para abrir su menú', organizationLogo:'Logotipo de la organización', logoShadowTitle:'Sombra del logotipo', logoShadowHint:'Elige la sombra que aparece alrededor del logotipo del encabezado.', shadowNone:'Sin sombra', shadowDark:'Sombra oscura', shadowLight:'Sombra clara',
    contrastTitle: "Contraste de pantalla",
    contrastDescription: "Elige por separado el contraste de los modos claro y oscuro. Los cambios se previsualizan al instante y se conservan al guardar.",
    lightContrast: "Modo claro",
    darkContrast: "Modo oscuro",
    contrastSoft: "Suave",
    contrastBalanced: "Equilibrado",
    contrastStrong: "Intenso",
    invalidLogoShadow: 'La sombra del logotipo debe ser ninguna, oscura o clara.',
} satisfies Record<UiMessage, string>;

export default messages;
