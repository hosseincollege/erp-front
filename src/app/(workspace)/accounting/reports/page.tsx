'use client';

import { useEffect, useState } from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import { usePreferences, getLocaleDirection } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';
import { accountingApi } from '@/lib/api/accounting/accounting-api';
import type { AccountingListItem } from '@/types/accounting';

export default function AccountingReportsPage() {
  const { locale } = usePreferences();
  const [invoices, setInvoices] = useState<AccountingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      setInvoices(await accountingApi.getInvoices());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Fetching on mount is the page's external synchronization point.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  const money = (value: number, currency = 'IRR') => {
    try { return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value); }
    catch { return `${new Intl.NumberFormat(locale).format(value)} ${currency}`; }
  };
  const count = new Intl.NumberFormat(locale).format(invoices.length);
  const totalsByCurrency = invoices.reduce<Record<string, number>>((totals, invoice) => {
    const currency = invoice.currency || 'IRR';
    totals[currency] = (totals[currency] || 0) + Number(invoice.totalAmount || 0);
    return totals;
  }, {});

  return (
    <main dir={getLocaleDirection(locale)} className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-xl font-bold text-foreground">{uiMessage(locale, 'sidebarFinancialReports')}</h1></div>
          <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} />{uiMessage(locale, 'notificationsRetry')}</button>
        </div>
        {error ? <p role="alert" className="mt-5 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-600">{uiMessage(locale, 'notificationsLoadFailed')}</p> : <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-border bg-background p-4"><p className="text-sm text-muted-foreground">{uiMessage(locale, 'sidebarAccountingEntries')}</p><p className="mt-2 text-2xl font-bold text-foreground">{loading ? '—' : count}</p></article>
            <article className="rounded-xl border border-border bg-background p-4"><p className="text-sm text-muted-foreground">{uiMessage(locale, 'accountingInvoices')}</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xl font-bold text-foreground">{loading ? '—' : Object.entries(totalsByCurrency).map(([currency, amount]) => <span key={currency}>{money(amount, currency)}</span>)}</div></article>
          </div>
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-foreground"><FileText size={17} />{uiMessage(locale, 'sidebarAccountingEntries')}</div>
          <div className="mt-3 divide-y divide-border rounded-xl border border-border">
            {loading ? <p className="p-5 text-sm text-muted-foreground">{uiMessage(locale, 'notificationsLoading')}</p> : invoices.length === 0 ? <p className="p-5 text-sm text-muted-foreground">{uiMessage(locale, 'notificationsEmpty')}</p> : invoices.map((invoice) => <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><span className="font-medium text-foreground">{invoice.documentNumber} · {invoice.title}</span><span className="text-muted-foreground">{money(Number(invoice.totalAmount || 0), invoice.currency || 'IRR')}</span></div>)}
          </div>
        </>}
      </section>
    </main>
  );
}
