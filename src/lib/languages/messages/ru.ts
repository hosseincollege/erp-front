import type { UiMessage } from '../types';

const messages = {

    settingsTitle:'Общие настройки', settingsDescription:'Выберите основной цвет и язык интерфейса. Светлая и тёмная темы доступны в верхней панели.', accentTitle:'Основной цвет', accentDescription:'Выбранный цвет сразу отображается в рабочей области. Нажмите «Сохранить изменения», чтобы оставить его; при выходе без сохранения вернётся прежний цвет.', preview:'Предпросмотр', primaryAction:'Основное действие', selectedItem:'Выбранный элемент', languageTitle:'Язык интерфейса', languageDescription:'Персидский, английский, арабский, упрощённый китайский, французский, испанский, немецкий, русский, японский и бразильский португальский.', languageHelp:'Чтобы изменить язык, откройте Настройки → Общие, выберите язык и нажмите «Сохранить изменения».', languageLabel:'Язык', saveChanges:'Сохранить изменения', blue:'Синий', green:'Зелёный', red:'Красный', yellow:'Жёлтый', purple:'Фиолетовый', customColor:'Свой цвет', accentPreviewHint:'Предпросмотр выбранного цвета', openSidebar:'Открыть боковую панель', unlockSidebar:'Разблокировать панель', lockSidebar:'Заблокировать панель', themeSystem:'Тема: системная', themeLight:'Тема: светлая', themeDark:'Тема: тёмная', viewProfile:'Открыть профиль в боковой панели', admin:'администратор', user:'Пользователь', dashboard:'Перейти к панели', notifications:'Уведомления', changeTheme:'Изменить тему', navigateOn:'Автоматическая навигация включена; нажмите модуль, чтобы открыть его', navigateOff:'Автоматическая навигация выключена; нажмите модуль, чтобы открыть меню', organizationLogo:'Логотип организации', logoShadowTitle:'Тень логотипа', logoShadowHint:'Выберите тень вокруг логотипа в верхней панели.', shadowNone:'Без тени', shadowDark:'Тёмная тень', shadowLight:'Светлая тень',
    contrastTitle: "Контраст интерфейса",
    contrastDescription: "Настройте контраст отдельно для светлой и тёмной темы. Изменения сразу видны и сохраняются после подтверждения.",
    lightContrast: "Светлая тема",
    darkContrast: "Тёмная тема",
    contrastSoft: "Мягкий",
    contrastBalanced: "Сбалансированный",
    contrastStrong: "Высокий",
    invalidLogoShadow: 'Для тени логотипа выберите отсутствие тени, тёмный или светлый вариант.',
} satisfies Record<UiMessage, string>;

export default messages;
