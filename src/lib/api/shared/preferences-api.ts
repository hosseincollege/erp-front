import { apiClient } from '@/lib/api-client';
import type { CalendarSystem, ContrastPreferences } from '@/components/preferences-provider';
import type { Locale } from '@/lib/languages';
import { getCurrentOrganizationId } from '@/lib/api/shared/auth-api';

export type UserPreferences = {
  locale: Locale;
  lightContrast: ContrastPreferences['light'];
  darkContrast: ContrastPreferences['dark'];
};

export type SaveUserPreferences = {
  locale: Locale;
  contrastPreferences: ContrastPreferences;
};

export type OrganizationAppearance = {
  accentPreset: 'blue' | 'green' | 'red' | 'amber' | 'violet' | 'custom';
  accentLightColor: `#${string}`;
  accentDarkColor: `#${string}`;
  backgroundStyle: 'THEME' | 'GRAY';
  timezone: string;
  calendar: CalendarSystem;
  canEdit: boolean;
};

export type SaveOrganizationAppearance = Omit<OrganizationAppearance, 'canEdit'>;

const defaultOrganizationAppearance: OrganizationAppearance = {
  accentPreset: 'blue',
  accentLightColor: '#2563eb',
  accentDarkColor: '#1d4ed8',
  backgroundStyle: 'THEME',
  timezone: 'Asia/Tehran',
  calendar: 'persian',
  canEdit: false,
};

export const preferencesApi = {
  get(): Promise<UserPreferences> {
    return apiClient.get<UserPreferences>('/auth/preferences');
  },

  save(preferences: SaveUserPreferences): Promise<UserPreferences> {
    return apiClient.put<UserPreferences>('/auth/preferences', {
      locale: preferences.locale,
      lightContrast: preferences.contrastPreferences.light,
      darkContrast: preferences.contrastPreferences.dark,
    });
  },

  async getOrganizationAppearance(): Promise<OrganizationAppearance> {
    const organizationId = getCurrentOrganizationId();
    if (!organizationId) return defaultOrganizationAppearance;
    return apiClient.get<OrganizationAppearance>(
      `/settings/organization/${encodeURIComponent(organizationId)}/appearance`,
    );
  },

  async saveOrganizationAppearance(
    appearance: SaveOrganizationAppearance,
  ): Promise<OrganizationAppearance> {
    const organizationId = getCurrentOrganizationId();
    if (!organizationId) throw new Error('سازمان فعالی انتخاب نشده است.');
    return apiClient.put<OrganizationAppearance>(
      `/settings/organization/${encodeURIComponent(organizationId)}/appearance`,
      appearance,
    );
  },
};
