import { OrganizationStructurePage } from './organization-structure-page';
import { SettingsOrganizationTabs } from '@/components/settings/settings-organization-tabs';

export default function OrganizationSettingsPage() {
  return <div className="w-full space-y-5"><SettingsOrganizationTabs /><OrganizationStructurePage /></div>;
}
