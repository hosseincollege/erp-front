'use client';

import { useCallback, useEffect, useState } from 'react';
import { BookOpen, FileText, Receipt, Wallet } from 'lucide-react';
import { usePreferences, getLocaleDirection } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';
import type { UiMessage } from '@/lib/languages/types';
import { accountingApi } from '@/lib/api/accounting/accounting-api';
import type { AccountingDashboardSummary } from '@/types/accounting';

const emptySummary: AccountingDashboardSummary = { totalInvoices: 0, pendingReview: 0, approved: 0, rejected: 0, paid: 0, overdue: 0 };

export default function AccountingPage() {
  const { locale } = usePreferences();
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setFailed(false);
    try { setSummary(await accountingApi.getDashboard()); }
    catch { setFailed(true); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    // Load the accounting summary from the authenticated accounting API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  const stats: Array<{ label: UiMessage; value: number; icon: typeof FileText; color: string }> = [
    { label: 'accountingTotalDocuments', value: summary.totalInvoices, icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'accountingAwaitingReview', value: summary.pendingReview, icon: Receipt, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'accountingApproved', value: summary.approved, icon: BookOpen, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'accountingPaid', value: summary.paid, icon: Wallet, color: 'text-cyan-500 bg-cyan-500/10' },
    { label: 'accountingOverdue', value: summary.overdue, icon: Wallet, color: 'text-rose-500 bg-rose-500/10' },
  ];
  return <main dir={getLocaleDirection(locale)} className="space-y-5">
    <header className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold text-primary">ERP</p><h1 className="mt-1 text-xl font-bold text-foreground">{uiMessage(locale, 'accountingOverview')}</h1></div></header>
    {failed && <div role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-600">{uiMessage(locale, 'notificationsLoadFailed')} <button onClick={() => void load()} className="ms-2 underline">{uiMessage(locale, 'notificationsRetry')}</button></div>}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon, color }) => <article key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{uiMessage(locale, label)}</p><p className="mt-3 text-2xl font-bold text-foreground">{loading ? '—' : new Intl.NumberFormat(locale).format(value)}</p></div><span className={`grid size-11 place-items-center rounded-xl ${color}`}><Icon size={20} /></span></div></article>)}</section>
  </main>;
}
