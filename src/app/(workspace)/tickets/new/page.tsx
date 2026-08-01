'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { NewTicketPriority, TicketSource } from '@/types/ticket';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3006';

const inputBase =
  'w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/15';

const selectBase =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/15';

export default function NewTicketPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    customerName: '',
    customerPhone: '',
    priority: 'MEDIUM' as NewTicketPriority,
    source: 'PHONE' as TicketSource,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('خطا در ایجاد تیکت');
      }

      const created = await response.json();
      const ticketId = created?.data?.id || created?.id;

      router.push(ticketId ? `/tickets/${ticketId}` : '/tickets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="عنوان تیکت"
          className={inputBase}
        />

        <input
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="نام مشتری"
          className={inputBase}
        />

        <input
          name="customerPhone"
          value={form.customerPhone}
          onChange={handleChange}
          placeholder="شماره تماس مشتری"
          className={inputBase}
        />

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className={selectBase}
        >
          <option value="LOW">کم</option>
          <option value="MEDIUM">متوسط</option>
          <option value="HIGH">زیاد</option>
          <option value="URGENT">فوری</option>
        </select>

        <select
          name="source"
          value={form.source}
          onChange={handleChange}
          className={selectBase}
        >
          <option value="PHONE">تلفن</option>
          <option value="BALE">بله</option>
          <option value="WHATSAPP">واتساپ</option>
          <option value="EMAIL">ایمیل</option>
          <option value="IN_PERSON">حضوری</option>
          <option value="SYSTEM">سیستمی</option>
        </select>
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="شرح تیکت"
        rows={6}
        className={inputBase}
      />

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {loading ? 'در حال ثبت...' : 'ثبت تیکت'}
      </button>
    </form>
  );
}
