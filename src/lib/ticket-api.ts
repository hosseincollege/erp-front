/**
 * @file src/lib/ticket-api.ts
 * @description Ticket API service layer for ERP Pro frontend.
 */

import { apiClient, ApiClientError } from './api-client';
import type {
  CreateTicketPayload,
  Ticket,
  TicketDetails,
  TicketPriority,
  TicketSource,
  TicketStatus,
} from '../types/ticket';

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

export type TicketListQuery = {
  search?: string;
  status?: TicketStatus | 'ALL';
  priority?: TicketPriority | 'ALL';
  source?: TicketSource | 'ALL';
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function unwrapApiData<T>(response: unknown): T {
  if (isRecord(response) && 'data' in response) {
    return (response as ApiEnvelope<T>).data as T;
  }

  return response as T;
}

function buildQueryString(query?: TicketListQuery): string {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();

  if (query.search?.trim()) {
    params.set('search', query.search.trim());
  }

  if (query.status && query.status !== 'ALL') {
    params.set('status', query.status);
  }

  if (query.priority && query.priority !== 'ALL') {
    params.set('priority', query.priority);
  }

  if (query.source && query.source !== 'ALL') {
    params.set('source', query.source);
  }

  const serializedQuery = params.toString();

  return serializedQuery ? `?${serializedQuery}` : '';
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    localStorage.getItem('accessToken') ??
    localStorage.getItem('token') ??
    localStorage.getItem('auth_token')
  );
}

function normalizeError(error: unknown, fallbackMessage: string): never {
  if (error instanceof ApiClientError) {
    throw new Error(error.message || fallbackMessage);
  }

  if (error instanceof Error) {
    throw new Error(error.message || fallbackMessage);
  }

  throw new Error(fallbackMessage);
}

/**
 * دریافت فهرست تیکت‌ها.
 * فیلترهای فعلی در صورت پشتیبانی بک‌اند به query string ارسال می‌شوند.
 */
export async function getTickets(
  query?: TicketListQuery,
): Promise<Ticket[]> {
  try {
    const response = await apiClient.get<unknown>(
      `/tickets${buildQueryString(query)}`,
      {
        token: getAccessToken(),
      },
    );

    const data = unwrapApiData<unknown>(response);

    if (!Array.isArray(data)) {
      return [];
    }

    return data as Ticket[];
  } catch (error) {
    normalizeError(error, 'دریافت فهرست تیکت‌ها با خطا مواجه شد.');
  }
}

/**
 * دریافت جزئیات یک تیکت از طریق شناسه UUID.
 */
export async function getTicketById(id: string): Promise<TicketDetails> {
  if (!id?.trim()) {
    throw new Error('شناسه تیکت معتبر نیست.');
  }

  try {
    const response = await apiClient.get<unknown>(`/tickets/${id}`, {
      token: getAccessToken(),
    });

    return unwrapApiData<TicketDetails>(response);
  } catch (error) {
    normalizeError(error, 'دریافت جزئیات تیکت با خطا مواجه شد.');
  }
}

/**
 * ثبت تیکت جدید.
 */
export async function createTicket(
  payload: CreateTicketPayload,
): Promise<Ticket> {
  try {
    const response = await apiClient.post<unknown>('/tickets', payload, {
      token: getAccessToken(),
    });

    return unwrapApiData<Ticket>(response);
  } catch (error) {
    normalizeError(error, 'ثبت تیکت با خطا مواجه شد.');
  }
}

/**
 * API شیء‌گرا برای سازگاری با صفحات UI.
 *
 * نمونه استفاده:
 * const tickets = await ticketApi.getTickets();
 */
export const ticketApi = {
  getTickets,
  getTicketById,
  createTicket,
} as const;
