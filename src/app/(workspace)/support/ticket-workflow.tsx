'use client';

import { useEffect, useRef, useState } from 'react';
import { getLocaleDirection, usePreferences } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';
import type { UiMessage } from '@/languages/types';
import { ticketApi } from './ticket-api';
import type { TicketStatus } from './types';

export const ticketStatusKeys: Record<TicketStatus, UiMessage> = {
  OPEN: 'ticketStatusOpen',
  IN_PROGRESS: 'ticketStatusInProgress',
  WAITING_FOR_CUSTOMER: 'ticketStatusWaiting',
  RESOLVED: 'ticketStatusResolved',
  CLOSED: 'ticketStatusClosed',
  CANCELLED: 'ticketStatusCancelled',
};

export function TicketWorkflow({ id, status, resolution, canEdit, onSaved }: {
  id: string;
  status: TicketStatus;
  resolution?: string | null;
  canEdit: boolean;
  onSaved: () => Promise<void>;
}) {
  const { locale } = usePreferences();
  const [nextStatus, setNextStatus] = useState(status);
  const [summary, setSummary] = useState(resolution ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const submitting = useRef(false);
  useEffect(() => {
    setNextStatus(status);
    setSummary(resolution ?? '');
    setError(null);
    setSaved(false);
  }, [id, status, resolution]);

  return (
    <section dir={getLocaleDirection(locale)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-start">
      <h2 className="mb-4 font-semibold">{uiMessage(locale, 'ticketWorkflow')}</h2>
      {canEdit ? (
        <form className="space-y-4" onSubmit={async (event) => {
          event.preventDefault();
          if (submitting.current) return;
          submitting.current = true;
          setSaving(true);
          setError(null);
          setSaved(false);
          try {
            await ticketApi.updateTicket(id, { status: nextStatus, resolution: summary.trim() }, locale);
            await onSaved();
            setSaved(true);
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : uiMessage(locale, 'ticketSaveFailed'));
          } finally {
            submitting.current = false;
            setSaving(false);
          }
        }}>
          <label className="block space-y-2 text-sm">
            <span>{uiMessage(locale, 'ticketStatus')}</span>
            <select value={nextStatus} onChange={(event) => setNextStatus(event.target.value as TicketStatus)} disabled={saving}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-2 text-[var(--foreground)]">
              {(Object.keys(ticketStatusKeys) as TicketStatus[]).map((value) => <option key={value} value={value}>{uiMessage(locale, ticketStatusKeys[value])}</option>)}
            </select>
          </label>
          <label className="block space-y-2 text-sm">
            <span>{uiMessage(locale, 'ticketResolution')}</span>
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={5000}
              required={nextStatus === 'RESOLVED'} disabled={saving} rows={4}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-2 text-[var(--foreground)]" />
          </label>
          {error && <p role="alert" className="text-sm text-[var(--danger)]">{error}</p>}
          {saved && <p role="status" className="text-sm text-[var(--success)]">{uiMessage(locale, 'ticketSaved')}</p>}
          <button type="submit" disabled={saving || (nextStatus === 'RESOLVED' && !summary.trim())}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-50">
            {uiMessage(locale, saving ? 'preferencesSaving' : 'saveChanges')}
          </button>
        </form>
      ) : (
        <div className="space-y-3 text-sm">
          <p>{uiMessage(locale, ticketStatusKeys[status])}</p>
          {resolution && <p className="whitespace-pre-wrap break-words">{resolution}</p>}
        </div>
      )}
    </section>
  );
}
