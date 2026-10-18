'use client';

import { useState, type FormEvent } from 'react';
import { BriefcaseBusiness, Bot, Code2, X } from 'lucide-react';
import { usePreferences, getLocaleDirection } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';
import { humanResourcesApi } from '@/lib/api/hr/human-resources-api';
import type { CreateBusinessTripRequestPayload } from '@/types/human-resources';

export type MissionEntryMode = 'form' | 'command' | 'ai';

const emptyMission = { destination: '', purpose: '', startAt: '', endAt: '', estimatedCost: '', currency: 'IRR' };

function parseMissionCommand(source: string): CreateBusinessTripRequestPayload {
  const json = source.trim().replace(/^mission\s*/i, '');
  const value: unknown = JSON.parse(json);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('invalid');
  const item = value as Record<string, unknown>;
  if (typeof item.destination !== 'string' || typeof item.purpose !== 'string' || typeof item.startAt !== 'string' || typeof item.endAt !== 'string') throw new Error('invalid');
  const payload: CreateBusinessTripRequestPayload = {
    destination: item.destination,
    purpose: item.purpose,
    startAt: item.startAt,
    endAt: item.endAt,
    ...(typeof item.estimatedCost === 'number' ? { estimatedCost: item.estimatedCost } : {}),
    ...(typeof item.currency === 'string' ? { currency: item.currency } : {}),
  };
  if (!payload.destination.trim() || !payload.purpose.trim() || Number.isNaN(Date.parse(payload.startAt)) || Number.isNaN(Date.parse(payload.endAt)) || Date.parse(payload.startAt) >= Date.parse(payload.endAt)) throw new Error('invalid');
  return payload;
}

export function MissionQuickActions({ initialMode, onClose }: { initialMode: MissionEntryMode; onClose: () => void }) {
  const { locale } = usePreferences();
  const t = (key: Parameters<typeof uiMessage>[1]) => uiMessage(locale, key);
  const [mode, setMode] = useState(initialMode);
  const [mission, setMission] = useState(emptyMission);
  const [command, setCommand] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [parsedMission, setParsedMission] = useState<CreateBusinessTripRequestPayload | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === 'ai') return;
    setError(''); setSaved(false); setSaving(true);
    try {
      const payload = mode === 'command' ? parsedMission : {
        destination: mission.destination.trim(), purpose: mission.purpose.trim(),
        startAt: new Date(mission.startAt).toISOString(), endAt: new Date(mission.endAt).toISOString(),
        ...(mission.estimatedCost ? { estimatedCost: Number(mission.estimatedCost) } : {}), currency: mission.currency,
      };
      if (!payload) throw new Error('invalid');
      await humanResourcesApi.createBusinessTripRequest(payload);
      setSaved(true); setMission(emptyMission); setCommand(''); setParsedMission(null);
    } catch {
      setError(t('missionSubmitFailed'));
    } finally { setSaving(false); }
  };

  const parseCommand = () => {
    try { setParsedMission(parseMissionCommand(command)); setError(''); }
    catch { setParsedMission(null); setError(t('missionCommandInvalid')); }
  };

  const modes: Array<{ id: MissionEntryMode; icon: typeof BriefcaseBusiness; label: Parameters<typeof uiMessage>[1] }> = [
    { id: 'form', icon: BriefcaseBusiness, label: 'missionModeForm' },
    { id: 'command', icon: Code2, label: 'missionModeCommand' },
    { id: 'ai', icon: Bot, label: 'missionModeAI' },
  ];

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="mission-quick-title" dir={getLocaleDirection(locale)} className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-2xl sm:p-6">
      <header className="mb-5 flex items-start justify-between gap-3"><div><h2 id="mission-quick-title" className="text-lg font-bold">{t('missionShortcutTitle')}</h2><p className="mt-1 text-sm text-muted-foreground">{t('missionWindowDescription')}</p></div><button type="button" onClick={onClose} aria-label={t('missionClose')} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted"><X size={17}/></button></header>
      <div role="tablist" className="mb-5 grid grid-cols-3 gap-2">{modes.map(({id,icon:Icon,label})=><button key={id} type="button" role="tab" aria-selected={mode===id} onClick={()=>{setMode(id);setError('');setSaved(false);}} className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-2 py-2 text-xs font-semibold sm:text-sm ${mode===id?'border-primary bg-primary/10 text-primary':'border-border text-muted-foreground hover:bg-muted'}`}><Icon size={16}/>{t(label)}</button>)}</div>
      {mode === 'form' && <form onSubmit={(event)=>void submit(event)} className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm"><span>{t('hrTripDestination')}</span><input required maxLength={160} value={mission.destination} onChange={e=>setMission({...mission,destination:e.target.value})} className="h-11 w-full rounded-xl border border-border bg-background px-3"/></label>
        <label className="space-y-1 text-sm"><span>{t('hrTripCostCurrency')}</span><input required minLength={3} maxLength={3} dir="ltr" value={mission.currency} onChange={e=>setMission({...mission,currency:e.target.value.toUpperCase()})} className="h-11 w-full rounded-xl border border-border bg-background px-3"/></label>
        <label className="space-y-1 text-sm"><span>{t('hrLeaveStartAt')}</span><input required type="datetime-local" value={mission.startAt} onChange={e=>setMission({...mission,startAt:e.target.value})} className="h-11 w-full rounded-xl border border-border bg-background px-3"/></label>
        <label className="space-y-1 text-sm"><span>{t('hrLeaveEndAt')}</span><input required type="datetime-local" value={mission.endAt} onChange={e=>setMission({...mission,endAt:e.target.value})} className="h-11 w-full rounded-xl border border-border bg-background px-3"/></label>
        <label className="space-y-1 text-sm"><span>{t('hrTripEstimatedCost')}</span><input type="number" min="0" step="0.01" dir="ltr" value={mission.estimatedCost} onChange={e=>setMission({...mission,estimatedCost:e.target.value})} className="h-11 w-full rounded-xl border border-border bg-background px-3"/></label>
        <label className="space-y-1 text-sm sm:col-span-2"><span>{t('hrTripPurpose')}</span><textarea required rows={3} maxLength={2000} value={mission.purpose} onChange={e=>setMission({...mission,purpose:e.target.value})} className="w-full rounded-xl border border-border bg-background px-3 py-2"/></label>
        {error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p>}{saved && <p role="status" className="text-sm text-primary sm:col-span-2">{t('missionSubmitSuccess')}</p>}
        <button disabled={saving} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50 sm:col-span-2">{saving?t('preferencesSaving'):t('missionSubmit')}</button>
      </form>}
      {mode === 'command' && <div className="space-y-3"><p className="text-sm text-muted-foreground">{t('missionCommandHelp')}</p><textarea dir="ltr" spellCheck={false} rows={8} value={command} onChange={e=>{setCommand(e.target.value);setParsedMission(null);}} placeholder={t('missionCommandPlaceholder')} className="w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-xs"/><button type="button" onClick={parseCommand} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">{t('missionCommandParse')}</button>{error&&<p role="alert" className="text-sm text-destructive">{error}</p>}{parsedMission&&<form onSubmit={(event)=>void submit(event)} className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-4"><p className="text-sm font-semibold">{t('missionPreview')}</p><pre dir="ltr" className="overflow-x-auto whitespace-pre-wrap break-words text-xs">{JSON.stringify(parsedMission,null,2)}</pre>{saved&&<p role="status" className="text-sm text-primary">{t('missionSubmitSuccess')}</p>}<button disabled={saving} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50">{saving?t('preferencesSaving'):t('missionSubmit')}</button></form>}</div>}
      {mode === 'ai' && <div className="space-y-3"><label className="block space-y-2 text-sm"><span>{t('missionAssistantPrompt')}</span><textarea rows={5} value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} placeholder={t('missionAIHint')} className="w-full rounded-xl border border-border bg-background px-3 py-2"/></label><div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-muted-foreground">{t('missionAIUnavailable')}</div></div>}
    </section>
  </div>;
}
