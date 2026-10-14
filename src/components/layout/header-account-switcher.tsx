'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getLocaleDirection, usePreferences } from '@/components/preferences-provider';
import { developmentApi, getHeaderAccountSwitcherPreferenceEvent, getHeaderAccountSwitcherPreferenceKey, isHeaderAccountSwitcherEnabled, type DevelopmentAccount, type ImpersonationContext } from '@/lib/api/development/development-api';
import { ApiError, setAccessToken } from '@/lib/api-client';
import { uiMessage } from '@/lib/ui-messages';

export function HeaderAccountSwitcher({ userId }: { userId?: string }) {
  const { locale } = usePreferences();
  const [enabled, setEnabled] = useState(false);
  const [accounts, setAccounts] = useState<DevelopmentAccount[]>([]);
  const [impersonation, setImpersonation] = useState<ImpersonationContext | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [denied, setDenied] = useState(false);
  const [failed, setFailed] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [switchFailed, setSwitchFailed] = useState(false);
  const [returning, setReturning] = useState(false);
  const [returnFailed, setReturnFailed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = (key: Parameters<typeof uiMessage>[1]) => uiMessage(locale, key);

  const refreshPreference = useCallback(() => setEnabled(isHeaderAccountSwitcherEnabled(userId)), [userId]);
  const loadSwitcherData = useCallback(async () => {
    setLoading(true); setFailed(false); setDenied(false);
    try {
      const context = await developmentApi.getImpersonationContext();
      setImpersonation(context);
      const result = await developmentApi.getAccounts();
      setAccounts(result.accounts);
    } catch (error) {
      setFailed(true);
      if (error instanceof ApiError && error.status === 403) setDenied(true);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    refreshPreference();
    const eventName = getHeaderAccountSwitcherPreferenceEvent();
    const onPreferenceChange = (event: Event) => {
      const detail = (event as CustomEvent<{ userId: string }>).detail;
      if (detail?.userId === userId) refreshPreference();
    };
    const onStorage = (event: StorageEvent) => {
      if (userId && event.key === getHeaderAccountSwitcherPreferenceKey(userId)) refreshPreference();
    };
    window.addEventListener(eventName, onPreferenceChange);
    window.addEventListener('storage', onStorage);
    return () => { window.removeEventListener(eventName, onPreferenceChange); window.removeEventListener('storage', onStorage); };
  }, [refreshPreference, userId]);

  useEffect(() => { if (enabled && userId) void loadSwitcherData(); }, [enabled, userId, loadSwitcherData]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  if (!enabled || !userId || denied) return null;

  const switchAccount = async (accountId: string) => {
    if (switching) return;
    setSwitching(true); setSwitchFailed(false);
    try {
      const response = await developmentApi.switchAccount(accountId);
      setAccessToken(response.access_token);
      window.location.assign('/dashboard');
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) { setDenied(true); setOpen(false); }
      else setSwitchFailed(true);
      setSwitching(false);
    }
  };

  const returnToAdmin = async () => {
    setReturning(true); setReturnFailed(false);
    try {
      const response = await developmentApi.stopImpersonation();
      setAccessToken(response.access_token);
      window.location.assign('/development/account-switching');
    } catch {
      setReturnFailed(true);
      setReturning(false);
    }
  };

  return (
    <div ref={dropdownRef} dir={getLocaleDirection(locale)} className="pointer-events-auto relative shrink-0">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label={t('developmentAccountSwitching')} aria-expanded={open} aria-controls="header-account-switcher-menu" title={t('developmentAccountSwitching')} className="flex h-9 items-center justify-center whitespace-nowrap rounded-xl border border-[var(--border)] px-3 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--primary-soft)] sm:text-sm">
        {t('developmentAccountSwitching')}
      </button>
      {open && (
        <div id="header-account-switcher-menu" className="absolute end-0 top-full z-[70] mt-2 w-[min(18rem,calc(100vw-1rem))] space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl">
          <p className="text-sm font-semibold text-[var(--foreground)]">{t('developmentChooseAccount')}</p>
          {impersonation?.isImpersonating && (
            <button type="button" onClick={() => void returnToAdmin()} disabled={returning} className="flex min-h-11 w-full items-center rounded-lg px-3 text-start text-sm font-semibold text-foreground transition-colors hover:bg-[var(--primary-soft)] disabled:cursor-wait disabled:opacity-60">
              {t(returning ? 'developmentReturningToAdmin' : 'developmentReturnToAdmin')}
            </button>
          )}
          {impersonation?.isImpersonating && <div className="border-t border-border" />}
          {loading ? (
            <p className="text-sm text-muted-foreground">{t('developmentAccountListLoading')}</p>
          ) : failed ? (
            <div role="alert" className="space-y-2">
              <p className="text-sm text-red-600">{t('developmentAccountListFailed')}</p>
              <button type="button" onClick={() => void loadSwitcherData()} className="text-sm font-semibold text-primary underline">{t('projectsRetry')}</button>
            </div>
          ) : accounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('developmentNoAccountsAvailable')}</p>
          ) : (
            <div role="list" aria-label={t('developmentChooseAccount')} className="max-h-72 space-y-1 overflow-y-auto">
              {accounts.map((account) => (
                <div key={account.id} role="listitem">
                  <button type="button" onClick={() => void switchAccount(account.id)} disabled={switching} className="flex min-h-12 w-full flex-col justify-center rounded-lg px-3 py-2 text-start transition-colors hover:bg-[var(--primary-soft)] disabled:cursor-wait disabled:opacity-60">
                    <span className="text-sm font-semibold text-foreground">{account.name}</span>
                    <span className="text-xs text-muted-foreground" dir="auto">@{account.username}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
          {switchFailed && <p role="alert" className="text-sm text-red-600">{t('developmentSwitchAccountFailed')}</p>}
          {returnFailed && <p role="alert" className="text-sm text-red-600">{t('developmentReturnFailed')}</p>}
        </div>
      )}
    </div>
  );
}
