// File: src/components/layout/app-shell.tsx

import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
      <main className="mx-auto w-full max-w-[1680px] p-4 md:p-6 xl:p-8">
        {children}
      </main>
    </div>
  );
}
