import type { UiMessage } from '../types';

const messages = {

    settingsTitle:'常规设置', settingsDescription:'选择界面强调色和显示语言。可在顶部栏切换浅色或深色模式。', accentTitle:'强调色', accentDescription:'选择颜色后会立即在工作区预览。点击“保存更改”以保留；未保存离开会恢复之前的颜色。', preview:'预览', primaryAction:'主要操作', selectedItem:'已选项目', languageTitle:'显示语言', languageDescription:'波斯语、英语、阿拉伯语、简体中文、法语、西班牙语、德语、俄语、日语和巴西葡萄牙语。', languageHelp:'更改语言：打开“设置”→“常规”，选择语言，然后点击“保存更改”。', languageLabel:'语言', saveChanges:'保存更改', blue:'蓝色', green:'绿色', red:'红色', yellow:'黄色', purple:'紫色', customColor:'自定义颜色', accentPreviewHint:'所选颜色预览', openSidebar:'展开侧边栏', unlockSidebar:'解锁侧边栏', lockSidebar:'锁定侧边栏', themeSystem:'主题：跟随系统', themeLight:'主题：浅色', themeDark:'主题：深色', viewProfile:'在侧边栏查看个人资料', admin:'管理员', user:'用户', dashboard:'前往仪表盘', notifications:'通知', changeTheme:'更改主题', navigateOn:'自动导航已开启；点击模块即可打开', navigateOff:'自动导航已关闭；点击模块可打开菜单', organizationLogo:'组织徽标', logoShadowTitle:'徽标阴影', logoShadowHint:'选择顶部栏徽标周围显示的阴影。', shadowNone:'无阴影', shadowDark:'深色阴影', shadowLight:'浅色阴影',
    contrastTitle: "显示对比度",
    contrastDescription: "分别设置浅色和深色模式的对比度。更改会立即预览，并在保存后保留。",
    lightContrast: "浅色模式",
    darkContrast: "深色模式",
    contrastSoft: "柔和",
    contrastBalanced: "均衡",
    contrastStrong: "增强",
    invalidLogoShadow: '徽标阴影必须为无、深色或浅色。',
} satisfies Record<UiMessage, string>;

export default messages;
