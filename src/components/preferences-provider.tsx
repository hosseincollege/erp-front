'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { getLocaleDirection, supportedLocales, type Locale } from '@/lib/languages';

export {
  getLocaleDirection,
  localeOptions,
  supportedLocales,
} from '@/lib/languages';
export type { Locale } from '@/lib/languages';

export type AccentColor = 'blue' | 'green' | 'red' | 'amber' | 'violet' | `#${string}`;
export type ContrastLevel = 'soft' | 'balanced' | 'strong';
export type ContrastPreferences = { light: ContrastLevel; dark: ContrastLevel };

type PreferencesContextValue = {
  locale: Locale;
  accentColor: AccentColor;
  contrastPreferences: ContrastPreferences;
  contrastPreview: ContrastPreferences | null;
  previewContrastPreferences: (preferences: ContrastPreferences | null) => void;
  setLocale: (locale: Locale) => void;
  setAccentColor: (color: AccentColor) => void;
  setContrastPreferences: (preferences: ContrastPreferences) => void;
  previewAccentColor: (color: AccentColor) => void;
};

const LOCALE_KEY = 'erp-locale';
const ACCENT_KEY = 'erp-accent-color';
const CONTRAST_KEY = 'erp-shell-contrast';
const DEFAULT_CONTRAST = { light: 'balanced', dark: 'balanced' } as const satisfies ContrastPreferences;
const DEFAULT_CONTRAST_SNAPSHOT = JSON.stringify(DEFAULT_CONTRAST);
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

function isContrastLevel(value: unknown): value is ContrastLevel {
  return value === 'soft' || value === 'balanced' || value === 'strong';
}

function parseContrastPreferences(value: string): ContrastPreferences {
  try {
    const parsed = JSON.parse(value) as Partial<ContrastPreferences>;
    return {
      light: isContrastLevel(parsed.light) ? parsed.light : DEFAULT_CONTRAST.light,
      dark: isContrastLevel(parsed.dark) ? parsed.dark : DEFAULT_CONTRAST.dark,
    };
  } catch {
    return { ...DEFAULT_CONTRAST };
  }
}

function readContrastSnapshot(): string {
  try {
    return window.localStorage.getItem(CONTRAST_KEY) ?? DEFAULT_CONTRAST_SNAPSHOT;
  } catch {
    return DEFAULT_CONTRAST_SNAPSHOT;
  }
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
  const contrastSnapshot = useSyncExternalStore(
    subscribePreferences,
    readContrastSnapshot,
    () => DEFAULT_CONTRAST_SNAPSHOT,
  );
  const contrastPreferences = useMemo(
    () => parseContrastPreferences(contrastSnapshot),
    [contrastSnapshot],
  );
  const [contrastPreview, setContrastPreview] = useState<ContrastPreferences | null>(null);

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

  const setContrastPreferences = useCallback((nextPreferences: ContrastPreferences) => {
    window.localStorage.setItem(CONTRAST_KEY, JSON.stringify(nextPreferences));
    window.dispatchEvent(new Event('erp-preferences-changed'));
  }, []);

  const previewContrastPreferences = useCallback((nextPreferences: ContrastPreferences | null) => {
    setContrastPreview(nextPreferences);
  }, []);

  const previewAccentColor = useCallback((previewColor: AccentColor) => {
    applyAccentColor(previewColor);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      accentColor,
      contrastPreferences,
      contrastPreview,
      previewContrastPreferences,
      setLocale,
      setAccentColor,
      setContrastPreferences,
      previewAccentColor,
    }),
    [
      locale,
      accentColor,
      contrastPreferences,
      contrastPreview,
      previewContrastPreferences,
      setLocale,
      setAccentColor,
      setContrastPreferences,
      previewAccentColor,
    ],
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
