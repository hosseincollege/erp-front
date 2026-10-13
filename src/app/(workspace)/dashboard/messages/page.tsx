'use client';

import { useCallback, useEffect, useState } from 'react';
import { Mail, Megaphone, RefreshCw } from 'lucide-react';
import { usePreferences, getLocaleDirection } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';
import { getCalendarLocale } from '@/lib/calendar';
import { notificationsApi, notifyNotificationsChanged, type Announcement } from '@/lib/api/shared/notifications-api';

export default function MessagesPage() {
  const { locale } = usePreferences();
  const t = (key: Parameters<typeof uiMessage>[1]) => uiMessage(locale, key);
  const [messages, setMessages] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true); setFailed(false);
    try { setMessages(await notificationsApi.getAnnouncements()); }
    catch { setFailed(true); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const date = (value: string) => new Intl.DateTimeFormat(getCalendarLocale(locale), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  const categoryLabel = (category: string) => t(({ general: 'announcementCategoryGeneral', operations: 'announcementCategoryOperations', finance: 'announcementCategoryFinance', hr: 'announcementCategoryHr', technical: 'announcementCategoryTechnical' } as const)[category as 'general' | 'operations' | 'finance' | 'hr' | 'technical'] ?? 'announcementCategoryGeneral');
  const markRead = async (item: Announcement) => {
    if (!item.notificationId || item.readAt) return;
    setBusyId(item.id);
    try { await notificationsApi.markRead(item.notificationId); notifyNotificationsChanged(); setMessages((current) => current.map((message) => message.id === item.id ? { ...message, readAt: new Date().toISOString() } : message)); }
    catch { setFailed(true); }
    finally { setBusyId(null); }
  };

  return <main dir={getLocaleDirection(locale)} className="space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="flex items-center gap-2 text-xl font-bold text-foreground"><Mail size={21} className="text-primary" />{t('messagesTitle')}</h1><p className="mt-1 text-sm text-muted-foreground">{t('messagesDescription')}</p></div><button type="button" onClick={() => void load()} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold hover:bg-muted disabled:opacity-50"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} />{t('notificationsRetry')}</button></header>
    {failed && <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{t('messagesLoadFailed')} <button type="button" onClick={() => void load()} className="ms-2 underline">{t('notificationsRetry')}</button></div>}
    {loading && <p className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">{t('notificationsLoading')}</p>}
    {!loading && !failed && !messages.length && <p className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">{t('messagesEmpty')}</p>}
    {!loading && !failed && messages.map((item) => <article key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><header className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Megaphone size={17} /></span><div className="min-w-0"><h2 className="font-semibold text-foreground">{item.title}</h2><p className="mt-1 text-xs text-muted-foreground">{date(item.createdAt)} · {categoryLabel(item.category)}</p></div></div>{!item.readAt && item.notificationId && <button type="button" onClick={() => void markRead(item)} disabled={busyId === item.id} className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50">{busyId === item.id ? t('notificationsLoading') : t('notificationsMarkRead')}</button>}</header>{item.summary && <p className="mt-4 font-medium text-foreground">{item.summary}</p>}<p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{item.body}</p></article>)}
  </main>;
}
