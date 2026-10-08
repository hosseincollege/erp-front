'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react';

export const supportedLocales = [
  'fa', 'en', 'ar', 'zh-CN', 'fr', 'es', 'de', 'ru', 'ja', 'pt-BR',
] as const;
export type Locale = (typeof supportedLocales)[number];
export type AccentColor = 'blue' | 'green' | 'red' | 'amber' | 'violet' | `#${string}`;

export const localeOptions: Array<{ id: Locale; name: string; direction: 'rtl' | 'ltr' }> = [
  { id: 'fa', name: 'فارسی', direction: 'rtl' },
  { id: 'en', name: 'English', direction: 'ltr' },
  { id: 'ar', name: 'العربية', direction: 'rtl' },
  { id: 'zh-CN', name: '中文（简体）', direction: 'ltr' },
  { id: 'fr', name: 'Français', direction: 'ltr' },
  { id: 'es', name: 'Español', direction: 'ltr' },
  { id: 'de', name: 'Deutsch', direction: 'ltr' },
  { id: 'ru', name: 'Русский', direction: 'ltr' },
  { id: 'ja', name: '日本語', direction: 'ltr' },
  { id: 'pt-BR', name: 'Português (Brasil)', direction: 'ltr' },
];

export function getLocaleDirection(locale: Locale): 'rtl' | 'ltr' {
  return localeOptions.find((option) => option.id === locale)?.direction ?? 'ltr';
}

type PreferencesContextValue = {
  locale: Locale;
  accentColor: AccentColor;
  setLocale: (locale: Locale) => void;
  setAccentColor: (color: AccentColor) => void;
  previewAccentColor: (color: AccentColor) => void;
};

const LOCALE_KEY = 'erp-locale';
const ACCENT_KEY = 'erp-accent-color';
const accentStyleProperties = [
  '--primary', '--primary-hover', '--primary-soft', '--primary-foreground', '--ring', '--sidebar-active',
] as const;

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function subscribePreferences(callback: () => void) {
  window.addEventListener('erp-preferences-changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('erp-preferences-changed', callback);
    window.removeEventListener('storage', callback);
  };
}

function isLocale(value: string | null): value is Locale {
  return supportedLocales.some((locale) => locale === value);
}

function isAccentColor(value: string | null): value is AccentColor {
  return (
    value === 'blue' ||
    value === 'green' ||
    value === 'red' ||
    value === 'amber' ||
    value === 'violet' ||
    isHexColor(value)
  );
}

export function isHexColor(value: string | null): value is `#${string}` {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

export function isCustomAccentColor(color: AccentColor): color is `#${string}` {
  return isHexColor(color);
}

export function getCustomAccentStyle(
  color: AccentColor,
): (CSSProperties & Record<(typeof accentStyleProperties)[number], string>) | undefined {
  if (!isCustomAccentColor(color)) return undefined;
  const red = parseInt(color.slice(1, 3), 16);
  const green = parseInt(color.slice(3, 5), 16);
  const blue = parseInt(color.slice(5, 7), 16);
  const darker = [red, green, blue]
    .map((channel) => Math.round(channel * 0.82).toString(16).padStart(2, '0'))
    .join('');
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return {
    '--primary': color,
    '--primary-hover': `#${darker}`,
    '--primary-soft': `${color}1a`,
    '--primary-foreground': luminance > 0.68 ? '#172033' : '#ffffff',
    '--ring': `${color}55`,
    '--sidebar-active': color,
  } as CSSProperties & Record<(typeof accentStyleProperties)[number], string>;
}

function applyLocale(locale: Locale) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = getLocaleDirection(locale);
  root.dataset.locale = locale;
}

function applyAccentColor(color: AccentColor) {
  document.documentElement.dataset.accent = color;
  const shell = document.querySelector<HTMLElement>('.erp-app-shell');
  if (!shell) return;
  shell.dataset.accent = isCustomAccentColor(color) ? 'custom' : color;
  const customStyle = getCustomAccentStyle(color);
  for (const property of accentStyleProperties) {
    const value = customStyle?.[property];
    if (value) shell.style.setProperty(property, value);
    else shell.style.removeProperty(property);
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(
    subscribePreferences,
    () => {
      const saved = window.localStorage.getItem(LOCALE_KEY);
      return isLocale(saved) ? saved : 'fa';
    },
    (): Locale => 'fa',
  );
  const accentColor = useSyncExternalStore<AccentColor>(
    subscribePreferences,
    () => {
      const saved = window.localStorage.getItem(ACCENT_KEY);
      return isAccentColor(saved) ? saved : 'blue';
    },
    (): AccentColor => 'blue',
  );

  useEffect(() => {
    applyLocale(locale);
    applyAccentColor(accentColor);
  }, [locale, accentColor]);

  const setLocale = useCallback((nextLocale: Locale) => {
    applyLocale(nextLocale);
    window.localStorage.setItem(LOCALE_KEY, nextLocale);
    window.dispatchEvent(new Event('erp-preferences-changed'));
  }, []);

  const setAccentColor = useCallback((nextColor: AccentColor) => {
    applyAccentColor(nextColor);
    window.localStorage.setItem(ACCENT_KEY, nextColor);
    window.dispatchEvent(new Event('erp-preferences-changed'));
  }, []);

  const previewAccentColor = useCallback((previewColor: AccentColor) => {
    applyAccentColor(previewColor);
  }, []);

  const value = useMemo(
    () => ({ locale, accentColor, setLocale, setAccentColor, previewAccentColor }),
    [locale, accentColor, setLocale, setAccentColor, previewAccentColor],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences باید داخل PreferencesProvider استفاده شود.');
  }
  return context;
}
