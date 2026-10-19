'use client';

import { ClipboardList, MessageCircle, Megaphone, UsersRound, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getLocaleDirection, usePreferences } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';

export default function ConversationsPage() {
  const { locale } = usePreferences();
  const [activeTab, setActiveTab] = useState<'personal' | 'group' | 'channel' | 'planning'>('personal');
  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    if (requestedTab === 'planning') setActiveTab('planning');
    if (requestedTab === 'search' || requestedTab === 'help') {
      window.location.replace(`/dashboard/events?tab=${requestedTab}`);
    }
  }, []);
  const tabs = [
    { id: 'personal' as const, label: 'conversationPersonal' as const, icon: UserRound },
    { id: 'group' as const, label: 'conversationGroup' as const, icon: UsersRound },
    { id: 'channel' as const, label: 'conversationChannel' as const, icon: Megaphone },
    { id: 'planning' as const, label: 'dashboardPlanning' as const, icon: ClipboardList },
  ];
  const selectedTab = tabs.find((tab) => tab.id === activeTab)!;

  return (
    <main dir={getLocaleDirection(locale)} className="space-y-5">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <MessageCircle size={21} className="text-primary" />
          {uiMessage(locale, 'dashboardConversation')}
        </h1>
      </header>
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto border-b border-border px-3 sm:px-5">
          <div className="flex min-w-max gap-1" role="tablist" aria-label={uiMessage(locale, 'dashboardConversation')}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`conversation-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                aria-controls="conversation-tab-panel"
                onClick={() => setActiveTab(id)}
                style={activeTab === id ? { color: 'var(--primary)', borderBottomColor: 'var(--primary)' } : undefined}
                className={`inline-flex min-h-12 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition-colors ${activeTab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                <Icon size={17} />
                {uiMessage(locale, label)}
              </button>
            ))}
          </div>
        </div>
        <div
          id="conversation-tab-panel"
          role="tabpanel"
          aria-labelledby={`conversation-tab-${activeTab}`}
          className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center sm:p-8"
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <MessageCircle size={23} />
          </span>
          <p className="text-sm leading-7 text-muted-foreground">
            {activeTab === 'planning'
              ? uiMessage(locale, 'planningComingSoon')
              : uiMessage(locale, 'conversationTabEmpty').replace('{type}', uiMessage(locale, selectedTab.label))}
          </p>
        </div>
      </section>
    </main>
  );
}
