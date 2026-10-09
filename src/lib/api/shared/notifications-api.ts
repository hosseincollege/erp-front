import { apiClient } from '@/lib/api-client';

export type NotificationText = string | Partial<Record<string, string>>;

export type AppNotification = {
  id: string;
  source: string;
  eventKey: string;
  title: NotificationText;
  body: NotificationText | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

export type NotificationsResult = {
  items: AppNotification[];
  unreadCount: number;
  nextCursor?: string | null;
};

export type Announcement = {
  id: string; title: string; summary: string | null; body: string; locale: string;
  category: string; priority: string; isPinned: boolean; createdAt: string;
  notificationId: string | null; readAt: string | null;
};
export type AnnouncementDraft = Pick<Announcement, 'title' | 'body' | 'locale'> &
  Partial<Pick<Announcement, 'summary' | 'category' | 'priority' | 'isPinned'>>;

export const notificationsApi = {
  getList(filter: 'all' | 'unread' = 'all', cursor?: string | null): Promise<NotificationsResult> {
    const query = new URLSearchParams({ filter });
    if (cursor) query.set('cursor', cursor);
    return apiClient.get<NotificationsResult>(`/notifications?${query.toString()}`);
  },
  getSummary(): Promise<NotificationsResult> {
    return apiClient.get<NotificationsResult>('/notifications/summary');
  },
  markRead(id: string): Promise<AppNotification> {
    return apiClient.patch<AppNotification>(`/notifications/${encodeURIComponent(id)}/read`);
  },
  markAllRead(): Promise<{ updated: number }> {
    return apiClient.post<{ updated: number }>('/notifications/read-all');
  },
  getAnnouncements(): Promise<Announcement[]> {
    return apiClient.get<Announcement[]>('/notifications/announcements');
  },
  getAnnouncementAccess(): Promise<{ canManage: boolean }> {
    return apiClient.get<{ canManage: boolean }>('/notifications/announcements/access');
  },
  createAnnouncement(draft: AnnouncementDraft): Promise<Announcement & { recipientCount: number }> {
    return apiClient.post('/notifications/announcements', draft);
  },
  archiveAnnouncement(id: string): Promise<Announcement> {
    return apiClient.patch(`/notifications/announcements/${encodeURIComponent(id)}/archive`);
  },
};

export function getLocalizedNotificationText(
  text: NotificationText | null | undefined,
  locale: string,
): string {
  if (typeof text === 'string') return text;
  if (!text || typeof text !== 'object') return '';
  return text[locale] || text.fa || text.en || Object.values(text)[0] || '';
}

export function getSafeNotificationHref(href: string | null | undefined, fallback: string): string {
  if (!href || !href.startsWith('/') || href.startsWith('//') || href.includes('\\')) {
    return fallback;
  }
  return href;
}

export function notifyNotificationsChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('notifications-updated'));
  }
}
