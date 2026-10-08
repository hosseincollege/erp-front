import type { Locale, LocaleMessages, UiMessage } from './languages/types';
import faMessages from './languages/messages/fa';
import enMessages from './languages/messages/en';
import arMessages from './languages/messages/ar';
import zhCNMessages from './languages/messages/zh-CN';
import frMessages from './languages/messages/fr';
import esMessages from './languages/messages/es';
import deMessages from './languages/messages/de';
import ruMessages from './languages/messages/ru';
import jaMessages from './languages/messages/ja';
import ptBRMessages from './languages/messages/pt-BR';

const messages: Record<Locale, LocaleMessages> = {
  'fa': faMessages,
  'en': enMessages,
  'ar': arMessages,
  'zh-CN': zhCNMessages,
  'fr': frMessages,
  'es': esMessages,
  'de': deMessages,
  'ru': ruMessages,
  'ja': jaMessages,
  'pt-BR': ptBRMessages,
};

export function uiMessage(locale: Locale, key: UiMessage): string {
  return messages[locale][key];
}
