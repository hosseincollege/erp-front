// file: src/lib/ticket-constants.ts

import type { TicketPriority, TicketStatus } from '@/types/ticket';

// 1. پیکربندی بصری وضعیت‌های تیکت (مانند رنگ و متن)
export const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  NEW: { label: 'جدید', className: 'bg-blue-100 text-blue-800 border-blue-500' },
  OPEN: { label: 'باز', className: 'bg-cyan-100 text-cyan-800 border-cyan-500' },
  IN_PROGRESS: { label: 'در حال کار', className: 'bg-indigo-100 text-indigo-800 border-indigo-500' },
  PENDING_CUSTOMER: { label: 'انتظار مشتری', className: 'bg-yellow-100 text-yellow-800 border-yellow-500' },
  PENDING_VENDOR: { label: 'انتظار وندور', className: 'bg-orange-100 text-orange-800 border-orange-500' },
  PENDING_FIELD_TEAM: { label: 'انتظار تیم میدانی', className: 'bg-pink-100 text-pink-800 border-pink-500' },
  MONITORING: { label: 'مانیتورینگ', className: 'bg-gray-100 text-gray-800 border-gray-500' },
  RESOLVED: { label: 'حل‌شده', className: 'bg-green-100 text-green-800 border-green-500' },
  CLOSED: { label: 'بسته', className: 'bg-zinc-100 text-zinc-800 border-zinc-500' },
  REOPENED: { label: 'بازگشایی شده', className: 'bg-red-100 text-red-800 border-red-500' },
  CANCELED: { label: 'لغو شده', className: 'bg-stone-100 text-stone-800 border-stone-500' },
};

// 2. پیکربندی بصری اولویت‌های تیکت
export const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  LOW: { label: 'پایین', className: 'bg-gray-200 text-gray-700' },
  MEDIUM: { label: 'متوسط', className: 'bg-green-200 text-green-700' },
  HIGH: { label: 'بالا', className: 'bg-yellow-200 text-yellow-700' },
  URGENT: { label: 'فوری', className: 'bg-orange-200 text-orange-700' },
  CRITICAL: { label: 'بحرانی', className: 'bg-red-200 text-red-700' },
};
