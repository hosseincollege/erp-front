import { UserAccountsPage } from './user-accounts-page';
import { SettingsAccessTabs } from '@/components/settings/settings-access-tabs';

export default function AccountsSettingsPage() {
  return <div dir="rtl" className="w-full space-y-5"><SettingsAccessTabs /><UserAccountsPage /></div>;
}
