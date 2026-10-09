'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ShoppingCart } from 'lucide-react';
import { getLocaleDirection, usePreferences } from '@/components/preferences-provider';
import { uiMessage } from '@/lib/ui-messages';

const sections = [
  { href: '/supply/inventory', key: 'sidebarInventory' as const, icon: Package },
  { href: '/supply/purchasing', key: 'sidebarPurchases' as const, icon: ShoppingCart },
];

export function SupplyChainModuleNav() {
  const pathname = usePathname();
  const { locale } = usePreferences();

  return (
    <header dir={getLocaleDirection(locale)} className="mb-5 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-primary">ERP</p>
        <h1 className="mt-1 text-xl font-bold text-foreground">{uiMessage(locale, 'sidebarSupplyChain')}</h1>
      </div>
      <nav aria-label={uiMessage(locale, 'sidebarSupplyChain')} className="flex flex-wrap gap-2">
        {sections.map(({ href, key, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${active ? 'bg-primary text-primary-foreground shadow-sm' : 'border border-border text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <Icon size={17} aria-hidden="true" />{uiMessage(locale, key)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
