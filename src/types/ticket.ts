/**
 * @file frontend/src/types/ticket.ts
 * @description Typeهای مربوط به ماژول تیکت.
 */

export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_CUSTOMER'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export type TicketPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

export type TicketType =
  | 'SUPPORT'
  | 'INCIDENT'
  | 'REQUEST'
  | 'QUESTION'
  | 'COMPLAINT';

export type TicketVisibility =
  | 'INTERNAL'
  | 'CUSTOMER';

export type TicketSource =
  | 'PANEL'
  | 'EMAIL'
  | 'PHONE'
  | 'OTHER';

export type CreateTicketPayload = {
  title: string;
  description: string;
  type?: TicketType;
  priority?: TicketPriority;
  visibility?: TicketVisibility;
  category?: string;
  dueAt?: string;
};

export type Ticket = {
  id: string;
  ticketNumber: number;
  subject: string;
  description: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  visibility: TicketVisibility;
  category?: string | null;
  dueAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  creatorId: string;
  assigneeId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TicketMessage = {
  id: string;
  ticketId: string;
  authorId: string;
  body: string;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TicketDetails = Ticket & {
  messages?: TicketMessage[];
};
