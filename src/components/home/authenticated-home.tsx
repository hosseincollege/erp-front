'use client';

import { DashboardLiveSections } from './dashboard-live-sections';
import { NotificationsOverview } from './notifications-overview';

/** Authenticated dashboard backed by organization announcements, service health, and audit activity. */
export function AuthenticatedHome() {
  return <div className="mx-auto max-w-5xl space-y-4"><NotificationsOverview /><DashboardLiveSections /></div>;
}
