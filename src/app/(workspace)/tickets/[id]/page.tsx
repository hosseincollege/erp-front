// File: src/app/(workspace)/tickets/[id]/page.tsx

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3006';

type Ticket = {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  source: string;
  customerName?: string | null;
  customerPhone?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/tickets/${resolvedParams.id}`,
          {
            cache: 'no-store',
          },
        );

        if (!response.ok) {
          throw new Error('Unable to load ticket');
        }

        const result = await response.json();
        setTicket(result?.data ?? result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  if (error || !ticket) {
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">{error || 'Ticket not found'}</p>
        <button
          onClick={() => router.push('/tickets')}
          className="rounded-md bg-slate-900 px-4 py-2 text-white"
        >
          بازگشت به لیست
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <button
          onClick={() => router.push('/tickets')}
          className="mb-4 rounded-md border px-4 py-2"
        >
          بازگشت
        </button>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <h1 className="text-xl font-bold">{ticket.title}</h1>
        <p className="text-sm text-slate-500">شماره: {ticket.ticketNumber}</p>
        <p>{ticket.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>وضعیت: {ticket.status}</div>
          <div>اولویت: {ticket.priority}</div>
          <div>منبع: {ticket.source}</div>
          <div>مشتری: {ticket.customerName || '-'}</div>
          <div>تلفن: {ticket.customerPhone || '-'}</div>
        </div>
      </div>
    </div>
  );
}
