'use client';

import { useEffect, useState } from 'react';
import { isHexColor, localeOptions, usePreferences, type AccentColor, type ContrastLevel, type ContrastPreferences, type Locale } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';
import { useTheme } from '@/components/theme-provider';

const accentOptions: Array<{
  id: AccentColor;
  hex: string;
  darkHex?: string;
  message: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}> = [
  { id: 'blue', hex: '#2563eb', darkHex: '#3b82f6', message: 'blue' },
  { id: 'green', hex: '#16a34a', message: 'green' },
  { id: 'red', hex: '#ef4444', message: 'red' },
  { id: 'amber', hex: '#facc15', message: 'yellow' },
  { id: 'violet', hex: '#8b5cf6', message: 'purple' },
];

const contrastModes = [
  { id: 'light', message: 'lightContrast' },
  { id: 'dark', message: 'darkContrast' },
] as const;

const contrastOptions: Array<{
  id: ContrastLevel;
  message: 'contrastSoft' | 'contrastBalanced' | 'contrastStrong';
}> = [
  { id: 'soft', message: 'contrastSoft' },
  { id: 'balanced', message: 'contrastBalanced' },
  { id: 'strong', message: 'contrastStrong' },
];

export function GeneralSettingsTab() {
  const {
    locale,
    setLocale,
    accentColor,
    setAccentColor,
    previewAccentColor,
    contrastPreferences,
    previewContrastPreferences,
    setContrastPreferences,
  } = usePreferences();
  const { resolvedTheme } = useTheme();
  const [draftLocale, setDraftLocale] = useState<Locale>(locale);
  const [draftAccent, setDraftAccent] = useState<AccentColor>(accentColor);
  const [draftContrast, setDraftContrast] = useState<ContrastPreferences>(contrastPreferences);
  const message = (key: Parameters<typeof uiMessage>[1]) => uiMessage(locale, key);
  const previewHex = isHexColor(draftAccent)
    ? draftAccent
    : (() => {
        const option = accentOptions.find((item) => item.id === draftAccent);
        return (resolvedTheme === 'dark' ? option?.darkHex : option?.hex) ?? option?.hex ?? '#2563eb';
      })();

  useEffect(() => {
    previewAccentColor(draftAccent);
    return () => previewAccentColor(accentColor);
  }, [accentColor, draftAccent, previewAccentColor]);

  useEffect(() => {
    previewContrastPreferences(draftContrast);
    return () => previewContrastPreferences(null);
  }, [draftContrast, previewContrastPreferences]);

  useEffect(() => {
    setDraftContrast(contrastPreferences);
  }, [contrastPreferences]);

  return (
    <div className="space-y-6" dir={localeOptions.find((option) => option.id === locale)?.direction}>
      <header>
        <h1 className="text-2xl font-black text-foreground">
          {message('settingsTitle')}
        </h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {message('settingsDescription')}
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-bold text-foreground">
            {message('accentTitle')}
          </h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            {message('accentDescription')}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {accentOptions.map((option) => {
            const selected = draftAccent === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-label={message(option.message)}
                aria-pressed={selected}
                onClick={() => setDraftAccent(option.id)}
                className={`inline-flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-sm ${
                  selected
                    ? 'border-primary bg-primary-soft text-foreground ring-2 ring-primary/20'
                    : 'border-border bg-background text-foreground hover:border-primary/50'
                }`}
              >
                <span
                  className="h-5 w-5 rounded-full border border-black/10"
                  style={{ backgroundColor: resolvedTheme === 'dark' ? option.darkHex ?? option.hex : option.hex }}
                />
                {message(option.message)}
              </button>
            );
          })}
          <label
            className={`inline-flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition hover:shadow-sm ${isHexColor(draftAccent) ? 'border-primary bg-primary-soft ring-2 ring-primary/20' : 'border-border bg-background hover:border-primary/50'}`}
          >
            <input
              type="color"
              aria-label={message('customColor')}
              value={isHexColor(draftAccent) ? draftAccent : '#2563eb'}
              onChange={(event) => setDraftAccent(event.target.value as AccentColor)}
              className="h-6 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            {message('customColor')}
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-4">
          <span className="text-sm font-medium text-muted-foreground">{message('accentPreviewHint')}</span>
          <span className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground">
            <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: previewHex }} />
            {previewHex.toUpperCase()}
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-bold text-foreground">
            {message('contrastTitle')}
          </h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            {message('contrastDescription')}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {contrastModes.map((mode) => (
            <div key={mode.id}>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                {message(mode.message)}
              </h3>
              <div className="flex flex-wrap gap-2" role="group" aria-label={message(mode.message)}>
                {contrastOptions.map((option) => {
                  const selected = draftContrast[mode.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setDraftContrast((current) => ({ ...current, [mode.id]: option.id }))}
                      className={`rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${selected ? 'border-primary bg-primary-soft text-primary ring-2 ring-primary/20' : 'border-border bg-background text-foreground hover:border-primary/50'}`}
                    >
                      {message(option.message)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="max-w-xl">
          <h2 className="text-base font-bold text-foreground">
            {message('languageTitle')}
          </h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            {message('languageDescription')}
          </p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            {message('languageHelp')}
          </p>
          <label
            htmlFor="display-language"
            className="mb-1.5 mt-4 block text-xs font-semibold text-muted-foreground"
          >
            {message('languageLabel')}
          </label>
          <select
            id="display-language"
            value={draftLocale}
            onChange={(event) => setDraftLocale(event.target.value as Locale)}
            className="w-full max-w-sm rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {localeOptions.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
          </select>
        </div>
      </section>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setAccentColor(draftAccent);
            setLocale(draftLocale);
            setContrastPreferences(draftContrast);
            previewContrastPreferences(null);
          }}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
        >
          {message('saveChanges')}
        </button>
      </div>
    </div>
  );
}
