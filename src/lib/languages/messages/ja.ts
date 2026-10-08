import type { UiMessage } from '../types';

const messages = {

    settingsTitle:'一般設定', settingsDescription:'アクセントカラーと言語を選択します。ライト・ダークモードは上部ヘッダーから切り替えられます。', accentTitle:'アクセントカラー', accentDescription:'選択した色はワークスペースにすぐ反映されます。「変更を保存」で保持し、保存せずに移動すると元の色に戻ります。', preview:'プレビュー', primaryAction:'主な操作', selectedItem:'選択中の項目', languageTitle:'表示言語', languageDescription:'ペルシア語、英語、アラビア語、簡体字中国語、フランス語、スペイン語、ドイツ語、ロシア語、日本語、ブラジルポルトガル語。', languageHelp:'言語を変更するには、設定 → 一般を開き、言語を選んで「変更を保存」を押してください。', languageLabel:'言語', saveChanges:'変更を保存', blue:'青', green:'緑', red:'赤', yellow:'黄', purple:'紫', customColor:'カスタムカラー', accentPreviewHint:'選択した色のプレビュー', openSidebar:'サイドバーを開く', unlockSidebar:'サイドバーのロックを解除', lockSidebar:'サイドバーをロック', themeSystem:'テーマ：システム', themeLight:'テーマ：ライト', themeDark:'テーマ：ダーク', viewProfile:'サイドバーでプロフィールを表示', admin:'管理者', user:'ユーザー', dashboard:'ダッシュボードへ移動', notifications:'通知', changeTheme:'テーマを変更', navigateOn:'自動ナビゲーションが有効です。クリックしてモジュールを開きます', navigateOff:'自動ナビゲーションは無効です。クリックしてメニューを開きます', organizationLogo:'組織のロゴ', logoShadowTitle:'ロゴの影', logoShadowHint:'ヘッダーのロゴ周囲に表示する影を選択します。', shadowNone:'影なし', shadowDark:'濃い影', shadowLight:'明るい影',
    contrastTitle: "表示コントラスト",
    contrastDescription: "ライトモードとダークモードのコントラストを個別に選択します。変更はすぐにプレビューされ、保存後も保持されます。",
    lightContrast: "ライトモード",
    darkContrast: "ダークモード",
    contrastSoft: "やわらかい",
    contrastBalanced: "標準",
    contrastStrong: "強い",
    invalidLogoShadow: 'ロゴの影は、なし・濃い・明るいのいずれかを選択してください。',
} satisfies Record<UiMessage, string>;

export default messages;
