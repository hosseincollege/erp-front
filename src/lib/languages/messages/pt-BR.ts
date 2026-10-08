import type { UiMessage } from '../types';

const messages = {

    settingsTitle:'Configurações gerais', settingsDescription:'Escolha a cor de destaque e o idioma. Os modos claro e escuro ficam disponíveis no cabeçalho.', accentTitle:'Cor de destaque', accentDescription:'A cor escolhida aparece imediatamente na área de trabalho. Clique em “Salvar alterações” para mantê-la; sair sem salvar restaura a cor anterior.', preview:'Pré-visualização', primaryAction:'Ação principal', selectedItem:'Item selecionado', languageTitle:'Idioma de exibição', languageDescription:'Persa, inglês, árabe, chinês simplificado, francês, espanhol, alemão, russo, japonês e português brasileiro.', languageHelp:'Para mudar o idioma, abra Configurações → Geral, escolha um idioma e clique em “Salvar alterações”.', languageLabel:'Idioma', saveChanges:'Salvar alterações', blue:'Azul', green:'Verde', red:'Vermelho', yellow:'Amarelo', purple:'Roxo', customColor:'Cor personalizada', accentPreviewHint:'Pré-visualização da cor escolhida', openSidebar:'Abrir barra lateral', unlockSidebar:'Desbloquear barra lateral', lockSidebar:'Bloquear barra lateral', themeSystem:'Tema: sistema', themeLight:'Tema: claro', themeDark:'Tema: escuro', viewProfile:'Ver perfil na barra lateral', admin:'administrador', user:'Usuário', dashboard:'Ir para o painel', notifications:'Notificações', changeTheme:'Alterar tema', navigateOn:'A navegação automática está ativa; clique em um módulo para abri-lo', navigateOff:'A navegação automática está desativada; clique em um módulo para abrir o menu', organizationLogo:'Logotipo da organização', logoShadowTitle:'Sombra do logotipo', logoShadowHint:'Escolha a sombra exibida ao redor do logotipo no cabeçalho.', shadowNone:'Sem sombra', shadowDark:'Sombra escura', shadowLight:'Sombra clara',
    contrastTitle: "Contraste da tela",
    contrastDescription: "Escolha o contraste separadamente para os modos claro e escuro. As alterações são pré-visualizadas na hora e mantidas ao salvar.",
    lightContrast: "Modo claro",
    darkContrast: "Modo escuro",
    contrastSoft: "Suave",
    contrastBalanced: "Equilibrado",
    contrastStrong: "Forte",
    invalidLogoShadow: 'A sombra do logotipo deve ser nenhuma, escura ou clara.',
} satisfies Record<UiMessage, string>;

export default messages;
