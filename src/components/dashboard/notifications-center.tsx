'use client';

import { Suspense, useEffect, useState, type KeyboardEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePreferences, getLocaleDirection } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';
import { ActivityPanel } from './activity-panel';
import { AnnouncementsPanel } from './announcements-panel';
import { HistoryPanel } from './history-panel';
import { NotificationsPanel } from './notifications-panel';
import { notificationsApi } from '@/lib/api/shared/notifications-api';

export type DashboardCenterTab = 'notifications' | 'announcements' | 'history' | 'activity';

const tabs: Array<{ id: DashboardCenterTab; label: 'notifications' | 'dashboardMessages' | 'dashboardHistory' | 'dashboardActivities' }> = [
  { id: 'notifications', label: 'notifications' },
  { id: 'announcements', label: 'dashboardMessages' },
  { id: 'history', label: 'dashboardHistory' },
  { id: 'activity', label: 'dashboardActivities' },
];

const validTabs = new Set<DashboardCenterTab>(tabs.map(({ id }) => id));

function readTabFromLocation(fallback: DashboardCenterTab): DashboardCenterTab {
  if (typeof window === 'undefined') return fallback;
  return fallback;
}

export function NotificationsCenter({ initialTab = 'notifications' }: { initialTab?: DashboardCenterTab }) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-32 max-w-5xl" aria-hidden="true" />}>
      <NotificationsCenterContent initialTab={initialTab} />
    </Suspense>
  );
}

function NotificationsCenterContent({ initialTab }: { initialTab: DashboardCenterTab }) {
  const { locale } = usePreferences();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const direction = getLocaleDirection(locale);
  const activeTab = requestedTab && validTabs.has(requestedTab as DashboardCenterTab)
    ? requestedTab as DashboardCenterTab
    : readTabFromLocation(initialTab);
  const message = (key: Parameters<typeof uiMessage>[1]) => uiMessage(locale, key);
  const [unreadBySource, setUnreadBySource] = useState<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;
    const refreshUnreadCounts = () => {
      void notificationsApi.getSummary().then((summary) => {
        if (mounted) setUnreadBySource(summary.unreadBySource ?? {});
      }).catch(() => {
        if (mounted) setUnreadBySource({});
      });
    };
    refreshUnreadCounts();
    window.addEventListener('notifications-updated', refreshUnreadCounts);
    return () => {
      mounted = false;
      window.removeEventListener('notifications-updated', refreshUnreadCounts);
    };
  }, []);

  const selectTab = (tab: DashboardCenterTab) => {
    const url = new URL(window.location.href);
    url.pathname = '/dashboard/events';
    url.searchParams.set('tab', tab);
    window.history.pushState({ dashboardCenterTab: tab }, '', url);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = tabs.findIndex(({ id }) => id === activeTab);
    const forwardKey = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const backwardKey = direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    if (event.key !== forwardKey && event.key !== backwardKey && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (currentIndex + (event.key === forwardKey ? 1 : -1) + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    selectTab(nextTab.id);
    document.getElementById(`dashboard-center-tab-${nextTab.id}`)?.focus();
  };

  const renderPanel = () => {
    switch (activeTab) {
      case 'announcements': return <AnnouncementsPanel />;
      case 'history': return <HistoryPanel />;
      case 'activity': return <ActivityPanel />;
      default: return <NotificationsPanel />;
    }
  };

  return (
    <div dir={direction} className="mx-auto max-w-5xl space-y-4">
      <div className="overflow-x-auto border-b border-border">
        <div role="tablist" aria-label={message('notificationsTitle')} className="flex min-w-max gap-1">
          {tabs.map(({ id, label }) => {
            const unreadCount = id === 'notifications'
              ? Object.entries(unreadBySource).filter(([source]) => source !== 'announcements').reduce((total, [, count]) => total + count, 0)
              : id === 'announcements' ? unreadBySource.announcements ?? 0 : 0;
            return (
              <button
                key={id}
                id={`dashboard-center-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                aria-controls="dashboard-center-panel"
                tabIndex={activeTab === id ? 0 : -1}
                onClick={() => selectTab(id)}
                onKeyDown={handleTabKeyDown}
                className={`min-h-11 border-b-2 px-3 text-sm font-semibold transition-colors sm:px-4 ${activeTab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                {message(label)}
                {unreadCount > 0 && (
                  <span className="ms-2 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-primary-foreground" dir="ltr">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div id="dashboard-center-panel" role="tabpanel" aria-labelledby={`dashboard-center-tab-${activeTab}`} tabIndex={0}>
        {renderPanel()}
      </div>
    </div>
  );
}
