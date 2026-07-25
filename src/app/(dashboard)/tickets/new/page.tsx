'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
type TicketSource = 'PHONE' | 'BALE' | 'WHATSAPP' | 'EMAIL' | 'IN_PERSON' | 'SYSTEM';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3006';

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
    priority: 'MEDIUM' as TicketPriority,
    source: 'PHONE' as TicketSource,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'عنوان تیکت الزامی است.';
    if (!form.description.trim()) return 'شرح مشکل الزامی است.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        customerName: form.customerName.trim() || undefined,
        customerPhone: form.customerPhone.trim() || undefined,
        priority: form.priority,
        source: form.source,
      };

      const res = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.message?.join?.(' - ') ||
            data?.message ||
            'ثبت تیکت با خطا مواجه شد.'
        );
      }

      setSuccess(`تیکت با موفقیت ثبت شد${data?.ticketNumber ? ` (${data.ticketNumber})` : ''}.`);

      setForm({
        title: '',
        description: '',
        customerName: '',
        customerPhone: '',
        priority: 'MEDIUM',
        source: 'PHONE',
      });

      setTimeout(() => {
        router.push('/tickets');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'خطای ناشناخته‌ای رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 text-[var(--foreground)]">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">ثبت تیکت جدید</h1>
        <p className="text-sm text-[var(--muted)]">
          اطلاعات اولیه مشکل مشتری را ثبت کن تا پیگیری و ارجاع راحت‌تر انجام شود.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error ? (
            <div className="rounded-xl border border-[color:var(--danger)]/30 bg-[color:var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-xl border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 px-4 py-3 text-sm text-[var(--success)]">
              {success}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                عنوان تیکت
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="مثلاً: قطعی اینترنت شرکت"
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="customerName" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                نام مشتری / شرکت
              </label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                value={form.customerName}
                onChange={handleChange}
                placeholder="مثلاً: شرکت نمونه"
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                شماره تماس
              </label>
              <input
                id="customerPhone"
                name="customerPhone"
                type="text"
                value={form.customerPhone}
                onChange={handleChange}
                placeholder="مثلاً: 09131234567"
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="priority" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                اولویت
              </label>
              <select
                id="priority"
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
            </div>

            <div>
              <label htmlFor="source" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                منبع ثبت
              </label>
              <select
                id="source"
                name="source"
                value={form.source}
                onChange={handleChange}
                className={selectBase}
              >
                <option value="PHONE">تماس تلفنی</option>
                <option value="BALE">بله</option>
                <option value="WHATSAPP">واتساپ</option>
                <option value="EMAIL">ایمیل</option>
                <option value="IN_PERSON">حضوری</option>
                <option value="SYSTEM">سیستمی</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                شرح مشکل
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={form.description}
                onChange={handleChange}
                placeholder="شرح کامل مشکل، زمان بروز، وضعیت چراغ‌ها، اقدام انجام‌شده و ..."
                className={inputBase}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push('/tickets')}
              className="rounded-xl border border-[var(--border)] bg-transparent px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent)]"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-medium text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'در حال ثبت...' : 'ثبت تیکت'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
