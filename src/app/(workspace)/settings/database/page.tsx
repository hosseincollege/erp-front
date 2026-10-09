'use client';

import { useRef, useState } from 'react';
import { Download, Database, Upload, AlertTriangle } from 'lucide-react';
import { usePreferences, getLocaleDirection } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';
import { getCurrentOrganizationId } from '@/lib/api/shared/auth-api';
import { settingsApi, type OrganizationImportPayload } from '@/lib/api/settings/settings-api';

type Snapshot = { format: 'erp-organization-v1'; exportedAt: string; payload: OrganizationImportPayload };

export default function DatabaseSettingsPage() {
  const { locale } = usePreferences();
  const direction = getLocaleDirection(locale);
  const t = (key: Parameters<typeof uiMessage>[1]) => uiMessage(locale, key);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  async function exportData() {
    const orgId = getCurrentOrganizationId();
    if (!orgId) return setNotice(t('databaseNoOrganization'));
    setBusy(true); setNotice('');
    try {
      const raw = await settingsApi.exportOrganization(orgId) as Record<string, unknown>;
      const payload: OrganizationImportPayload = {
        organization: Object.fromEntries(['name', 'legalName', 'nationalId', 'registrationNumber', 'economicCode', 'taxOffice', 'phone', 'email', 'website', 'address', 'postalCode', 'currency', 'fiscalYearStart', 'logoUrl'].filter(key => raw[key] !== undefined).map(key => [key, raw[key]])),
        branches: Array.isArray(raw.branches) ? raw.branches.map((item: any) => ({ name: item.name, code: item.code, address: item.address, phone: item.phone, email: item.email, postalCode: item.postalCode, isMain: item.isMain, isActive: item.isActive })) : [],
        departments: Array.isArray(raw.departments) ? raw.departments.map((item: any) => ({ name: item.name, code: item.code, branchName: item.branch?.name, isActive: item.isActive })) : [],
      };
      const snapshot: Snapshot = { format: 'erp-organization-v1', exportedAt: new Date().toISOString(), payload };
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `erp-organization-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
      setNotice(t('databaseExportSuccess'));
    } catch (e) { setNotice(e instanceof Error ? e.message : t('databaseError')); }
    finally { setBusy(false); }
  }

  async function importData(file?: File) {
    if (!file) return;
    const orgId = getCurrentOrganizationId();
    if (!orgId) return setNotice(t('databaseNoOrganization'));
    setBusy(true); setNotice('');
    try {
      const snapshot = JSON.parse(await file.text()) as Snapshot;
      if (snapshot?.format !== 'erp-organization-v1' || !snapshot.payload || !Array.isArray(snapshot.payload.branches) || !Array.isArray(snapshot.payload.departments)) throw new Error(t('databaseInvalidFile'));
      if (!window.confirm(t('databaseImportConfirm'))) return;
      const payload: OrganizationImportPayload = {
        organization: snapshot.payload.organization,
        branches: snapshot.payload.branches.map(({ id: _id, ...branch }) => branch),
        departments: snapshot.payload.departments.map(({ id: _id, ...department }) => department),
      };
      await settingsApi.importOrganization(orgId, payload);
      setNotice(t('databaseImportSuccess'));
    } catch (e) { setNotice(e instanceof Error ? e.message : t('databaseError')); }
    finally { setBusy(false); if (input.current) input.current.value = ''; }
  }

  return <main dir={direction} className="mx-auto w-full max-w-5xl space-y-6 p-6 text-start">
    <header><div className="flex items-center gap-3"><Database className="h-7 w-7 text-primary"/><h1 className="text-2xl font-bold">{t('databaseTitle')}</h1></div><p className="mt-2 text-sm text-muted-foreground">{t('databaseDescription')}</p></header>
    <div role="note" className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100"><AlertTriangle className="h-5 w-5 shrink-0"/><p>{t('databaseScopeNotice')}</p></div>
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-xl border bg-card p-5"><h2 className="font-semibold">{t('databaseExport')}</h2><p className="my-3 text-sm text-muted-foreground">{t('databaseExportHelp')}</p><button disabled={busy} onClick={exportData} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"><Download className="h-4 w-4"/>{t('databaseExport')}</button></section>
      <section className="rounded-xl border bg-card p-5"><h2 className="font-semibold">{t('databaseImport')}</h2><p className="my-3 text-sm text-muted-foreground">{t('databaseImportHelp')}</p><input ref={input} hidden type="file" accept="application/json,.json" onChange={e => void importData(e.target.files?.[0])}/><button disabled={busy} onClick={() => input.current?.click()} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 disabled:opacity-50"><Upload className="h-4 w-4"/>{t('databaseChooseFile')}</button></section>
    </div>
    {busy && <p aria-live="polite">{t('databaseLoading')}</p>}{notice && <p role="status" className="rounded-md border p-3 text-sm">{notice}</p>}
  </main>;
}
