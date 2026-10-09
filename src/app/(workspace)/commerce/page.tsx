'use client';

import Link from 'next/link';
import { ArrowUpLeft, ShoppingBag, UsersRound } from 'lucide-react';
import { getLocaleDirection, usePreferences } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';

export default function CommercialHomePage() {
  const { locale } = usePreferences();
  const direction = getLocaleDirection(locale);
  const areas = [
    { href: '/commerce/customers', title: uiMessage(locale, 'sidebarCustomers'), icon: UsersRound },
    { href: '/commerce/sales', title: uiMessage(locale, 'sidebarSales'), icon: ShoppingBag },
  ];
  return <main dir={direction} className="space-y-6">
    <header className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-primary">ERP</p>
      <h1 className="mt-2 text-2xl font-bold text-foreground">{uiMessage(locale, 'sidebarCommercial')}</h1>
    </header>
    <section className="grid gap-4 md:grid-cols-2">
      {areas.map(({ href, title, icon: Icon }) => <Link key={href} href={href} className="group flex min-h-32 items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md">
        <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={22}/></span><strong className="text-lg text-foreground">{title}</strong></div>
        <ArrowUpLeft size={18} className="text-muted-foreground transition group-hover:text-primary" />
      </Link>)}
    </section>
  </main>;
}
