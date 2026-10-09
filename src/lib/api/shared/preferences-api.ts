import { apiClient } from '@/lib/api-client';
import type { AccentColor, CalendarSystem, ContrastPreferences } from '@/components/preferences-provider';
import type { Locale } from '@/lib/languages';

export type UserPreferences = {
  locale: Locale;
  accentColor: AccentColor;
  lightContrast: ContrastPreferences['light'];
  darkContrast: ContrastPreferences['dark'];
  calendar: CalendarSystem;
};

export type SaveUserPreferences = {
  locale: Locale;
  accentColor: AccentColor;
  contrastPreferences: ContrastPreferences;
  calendar: CalendarSystem;
};

export const preferencesApi = {
  get(): Promise<UserPreferences> {
    return apiClient.get<UserPreferences>('/auth/preferences');
  },

  save(preferences: SaveUserPreferences): Promise<UserPreferences> {
    return apiClient.put<UserPreferences>('/auth/preferences', {
      locale: preferences.locale,
      accentColor: preferences.accentColor,
      lightContrast: preferences.contrastPreferences.light,
      darkContrast: preferences.contrastPreferences.dark,
      calendar: preferences.calendar,
    });
  },
};
