'use client';

import { useEffect, useState } from 'react';
import { localeOptions, usePreferences, type ContrastLevel, type ContrastPreferences, type Locale } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';
import { useTheme } from '@/components/theme-provider';
import type { OrganizationAppearance, SaveOrganizationAppearance } from '@/lib/api/shared/preferences-api';

const accentOptions: Array<{
  id: Exclude<OrganizationAppearance['accentPreset'], 'custom'>;
  light: `#${string}`;
  dark: `#${string}`;
  message: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}> = [
  { id: 'blue', light: '#2563eb', dark: '#1d4ed8', message: 'blue' },
  { id: 'green', light: '#16a34a', dark: '#15803d', message: 'green' },
  { id: 'red', light: '#ef4444', dark: '#b91c1c', message: 'red' },
  { id: 'amber', light: '#facc15', dark: '#a16207', message: 'yellow' },
  { id: 'violet', light: '#8b5cf6', dark: '#6d28d9', message: 'purple' },
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

const timezones = [
  'Asia/Tehran', 'UTC', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Tokyo',
  'Asia/Shanghai', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'Australia/Sydney',
];

function toSaveAppearance(appearance: OrganizationAppearance): SaveOrganizationAppearance {
  return {
    accentPreset: appearance.accentPreset,
    accentLightColor: appearance.accentLightColor,
    accentDarkColor: appearance.accentDarkColor,
    backgroundStyle: appearance.backgroundStyle,
    timezone: appearance.timezone,
    calendar: appearance.calendar,
  };
}

export function GeneralSettingsContent() {
  const {
    locale,
    contrastPreferences,
    organizationAppearance,
    canEditOrganizationAppearance,
    previewContrastPreferences,
    previewOrganizationAppearance,
    savePreferences,
    saveOrganizationAppearance,
  } = usePreferences();
  const { resolvedTheme } = useTheme();
  const [draftLocale, setDraftLocale] = useState<Locale>(locale);
  const [draftContrast, setDraftContrast] = useState<ContrastPreferences>(contrastPreferences);
  const [draftAppearance, setDraftAppearance] = useState<SaveOrganizationAppearance>(
    toSaveAppearance(organizationAppearance),
  );
  const [saveError, setSaveError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const message = (key: Parameters<typeof uiMessage>[1]) => uiMessage(locale, key);

  useEffect(() => setDraftLocale(locale), [locale]);
  useEffect(() => setDraftContrast(contrastPreferences), [contrastPreferences]);
  useEffect(() => setDraftAppearance(toSaveAppearance(organizationAppearance)), [organizationAppearance]);
  useEffect(() => {
    previewContrastPreferences(draftContrast);
    return () => previewContrastPreferences(null);
  }, [draftContrast, previewContrastPreferences]);
  useEffect(() => {
    if (!canEditOrganizationAppearance) return;
    previewOrganizationAppearance(draftAppearance);
    return () => previewOrganizationAppearance(null);
  }, [canEditOrganizationAppearance, draftAppearance, previewOrganizationAppearance]);

  const setAccentPreset = (option: (typeof accentOptions)[number]) => {
    setDraftAppearance((current) => ({
      ...current,
      accentPreset: option.id,
      accentLightColor: option.light,
      accentDarkColor: option.dark,
    }));
  };

  return (
    <div className="space-y-6" dir={localeOptions.find((option) => option.id === locale)?.direction}>
      <header>
        <h1 className="text-2xl font-black text-foreground">{message('settingsTitle')}</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{message('settingsDescription')}</p>
      </header>

      <section className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-base font-bold text-foreground">{message('organizationAppearanceTitle')}</h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">{message('organizationAppearanceDescription')}</p>
          <p className="mt-2 rounded-xl border border-border bg-background px-3 py-2 text-xs leading-6 text-muted-foreground">
            {message(canEditOrganizationAppearance ? 'organizationAppearanceSharedNotice' : 'organizationAppearanceReadOnly')}
          </p>
        </div>

        <fieldset disabled={!canEditOrganizationAppearance} className="space-y-5 disabled:opacity-75">
          <div>
            <h3 className="text-sm font-bold text-foreground">{message('accentTitle')}</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">{message('accentDescription')}</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {accentOptions.map((option) => {
                const selected = draftAppearance.accentPreset === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setAccentPreset(option)}
                    className={`inline-flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${selected ? 'border-primary bg-primary-soft text-foreground ring-2 ring-primary/20' : 'border-border bg-background text-foreground hover:border-primary/50'}`}
                  >
                    <span className="flex gap-1" aria-hidden="true">
                      <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: resolvedTheme === 'dark' ? option.dark : option.light }} />
                      <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: resolvedTheme === 'dark' ? option.light : option.dark }} />
                    </span>
                    {message(option.message)}
                  </button>
                );
              })}
              <button
                type="button"
                aria-pressed={draftAppearance.accentPreset === 'custom'}
                onClick={() => setDraftAppearance((current) => ({ ...current, accentPreset: 'custom' }))}
                className={`rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${draftAppearance.accentPreset === 'custom' ? 'border-primary bg-primary-soft ring-2 ring-primary/20' : 'border-border bg-background hover:border-primary/50'}`}
              >
                {message('customColor')}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 text-sm font-medium text-foreground">
              <span>{message('accentLightColor')}</span>
              <input
                type="color"
                aria-label={message('accentLightColor')}
                value={draftAppearance.accentLightColor}
                onChange={(event) => setDraftAppearance((current) => ({ ...current, accentPreset: 'custom', accentLightColor: event.target.value as `#${string}` }))}
                className="size-9 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 text-sm font-medium text-foreground">
              <span>{message('accentDarkColor')}</span>
              <input
                type="color"
                aria-label={message('accentDarkColor')}
                value={draftAppearance.accentDarkColor}
                onChange={(event) => setDraftAppearance((current) => ({ ...current, accentPreset: 'custom', accentDarkColor: event.target.value as `#${string}` }))}
                className="size-9 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
            </label>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground">{message('backgroundStyleTitle')}</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">{message('backgroundStyleDescription')}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={message('backgroundStyleTitle')}>
              {(['THEME', 'GRAY'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  role="radio"
                  aria-checked={draftAppearance.backgroundStyle === style}
                  onClick={() => setDraftAppearance((current) => ({ ...current, backgroundStyle: style }))}
                  className={`rounded-xl border p-3 text-start text-sm font-semibold transition ${draftAppearance.backgroundStyle === style ? 'border-primary bg-primary-soft text-foreground ring-2 ring-primary/20' : 'border-border bg-background text-foreground hover:border-primary/50'}`}
                >
                  {message(style === 'THEME' ? 'backgroundTheme' : 'backgroundGray')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold text-foreground">{message('calendarTitle')}</h3>
              <p className="mb-2 mt-1 text-xs leading-6 text-muted-foreground">{message('calendarDescription')}</p>
              <label className="block text-sm font-semibold text-foreground" htmlFor="organization-calendar">
                {message('calendarLabel')}
              <select
                id="organization-calendar"
                value={draftAppearance.calendar}
                onChange={(event) => setDraftAppearance((current) => ({ ...current, calendar: event.target.value as SaveOrganizationAppearance['calendar'] }))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="persian">{message('calendarPersian')}</option>
                <option value="islamic">{message('calendarIslamic')}</option>
                <option value="gregorian">{message('calendarGregorian')}</option>
              </select>
              </label>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{message('timezoneTitle')}</h3>
              <p className="mb-2 mt-1 text-xs leading-6 text-muted-foreground">{message('timezoneDescription')}</p>
              <label className="block text-sm font-semibold text-foreground" htmlFor="organization-timezone">
                {message('timezoneLabel')}
              <select
                id="organization-timezone"
                dir="ltr"
                value={draftAppearance.timezone}
                onChange={(event) => setDraftAppearance((current) => ({ ...current, timezone: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {!timezones.includes(draftAppearance.timezone) && <option value={draftAppearance.timezone}>{draftAppearance.timezone}</option>}
                {timezones.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}
              </select>
              </label>
            </div>
          </div>
        </fieldset>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-bold text-foreground">{message('contrastTitle')}</h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">{message('contrastDescription')}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {contrastModes.map((mode) => (
            <div key={mode.id}>
              <h3 className="mb-2 text-sm font-semibold text-foreground">{message(mode.message)}</h3>
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
        <h2 className="text-base font-bold text-foreground">{message('languageTitle')}</h2>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">{message('languageDescription')}</p>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">{message('languageHelp')}</p>
        <label htmlFor="display-language" className="mb-1.5 mt-4 block text-xs font-semibold text-muted-foreground">{message('languageLabel')}</label>
        <select
          id="display-language"
          value={draftLocale}
          onChange={(event) => setDraftLocale(event.target.value as Locale)}
          className="w-full max-w-sm rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {localeOptions.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
        </select>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={isSaving}
          onClick={async () => {
            setIsSaving(true);
            setSaveError(false);
            try {
              await savePreferences({ locale: draftLocale, contrastPreferences: draftContrast });
              if (canEditOrganizationAppearance) await saveOrganizationAppearance(draftAppearance);
              previewContrastPreferences(null);
              previewOrganizationAppearance(null);
            } catch {
              setSaveError(true);
            } finally {
              setIsSaving(false);
            }
          }}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
        >
          {isSaving ? message('preferencesSaving') : message('saveChanges')}
        </button>
      </div>
      {saveError && <p role="alert" className="text-sm text-red-600">{message('preferencesSaveFailed')}</p>}
    </div>
  );
}
