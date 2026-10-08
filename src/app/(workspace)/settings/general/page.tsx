import type { Metadata } from 'next';
import { GeneralSettingsTab } from './general-settings-tab';

export const metadata: Metadata = {
  title: 'تنظیمات عمومی | ERP Pro',
};

export default function GeneralSettingsPage() {
  return <GeneralSettingsTab />;
}
