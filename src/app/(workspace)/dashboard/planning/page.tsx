'use client';

import { ClipboardList } from 'lucide-react';
import { getLocaleDirection, usePreferences } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';

export default function PlanningPage() {
  const { locale } = usePreferences();

  return (
    <main dir={getLocaleDirection(locale)} className="space-y-5">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <ClipboardList size={21} className="text-primary" />
          {uiMessage(locale, 'dashboardPlanning')}
        </h1>
      </header>
      <section className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <ClipboardList size={23} />
        </span>
        <p className="max-w-xl text-sm leading-7 text-muted-foreground">
          {uiMessage(locale, 'planningComingSoon')}
        </p>
      </section>
    </main>
  );
}
