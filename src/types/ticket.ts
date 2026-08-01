// file: src/types/ticket.ts

export type TicketStatus =
  | "NEW" | "OPEN" | "IN_PROGRESS" | "PENDING_CUSTOMER"
  | "PENDING_VENDOR" | "PENDING_FIELD_TEAM" | "MONITORING"
  | "RESOLVED" | "CLOSED" | "REOPENED" | "CANCELED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT" | "CRITICAL";

// برای فرم ایجاد تیکت که CRITICAL را ندارد
export type NewTicketPriority = Exclude<TicketPriority, "CRITICAL">;

export type IncidentSeverity =
  | "MINOR" | "DEGRADED" | "PARTIAL_OUTAGE" | "FULL_OUTAGE";

export type TicketSource =
  | "PHONE" | "BALE" | "WHATSAPP" | "EMAIL" | "IN_PERSON" | "SYSTEM";

export type TicketRow = {
  id: string;
  number: string;
  title: string;
  customer: string;
  service: string;
  status: TicketStatus;
  priority: TicketPriority;
  severity: IncidentSeverity;
  assignedTo: string;
  team: string;
  createdAt: string;
  updatedAt: string;
  slaRemaining: string;
  breached: boolean;
  tags: string[];
};

export type ApiTicket = Record<string, any>;
