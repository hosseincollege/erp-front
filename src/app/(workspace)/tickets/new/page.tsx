/**
 * @file src/app/(workspace)/tickets/new/page.tsx
 * @name new-ticket-page
 * @description صفحه RTL ثبت تیکت جدید با پشتیبانی کامل از متغیرهای CSS در تم‌های روشن و تیره.
 */

'use client';

import Link from 'next/link';
import { FormEvent, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Phone,
  Send,
  UserRound,
} from 'lucide-react';

import { createTicket } from '@/lib/ticket-api';

type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

type TicketSource =
  | 'PHONE'
  | 'EMAIL'
  | 'WHATSAPP'
  | 'TELEGRAM'
  | 'WEB'
  | 'IN_PERSON'
  | 'OTHER';

type FormState = {
  title: string;
  description: string;
  customerName: string;
  customerPhone: string;
  customerId: string;
  priority: TicketPriority;
  source: TicketSource;
};

const INITIAL_FORM: FormState = {
  title: '',
  description: '',
  customerName: '',
  customerPhone: '',
  customerId: '',
  priority: 'MEDIUM',
  source: 'PHONE',
};

const PRIORITY_OPTIONS: Array<{
  value: TicketPriority;
  label: string;
  description: string;
}> = [
  {
    value: 'LOW',
    label: 'کم',
    description: 'درخواست عادی بدون فوریت',
  },
  {
    value: 'MEDIUM',
    label: 'متوسط',
    description: 'نیازمند پیگیری در روند معمول',
  },
  {
    value: 'HIGH',
    label: 'زیاد',
    description: 'تأثیر قابل توجه بر مشتری یا عملیات',
  },
  {
    value: 'URGENT',
    label: 'فوری',
    description: 'اختلال جدی یا نیازمند اقدام سریع',
  },
];

const SOURCE_OPTIONS: Array<{ value: TicketSource; label: string }> = [
  { value: 'PHONE', label: 'تماس تلفنی' },
  { value: 'EMAIL', label: 'ایمیل' },
  { value: 'WHATSAPP', label: 'واتساپ' },
  { value: 'TELEGRAM', label: 'تلگرام' },
  { value: 'WEB', label: 'وب‌سایت' },
  { value: 'IN_PERSON', label: 'مراجعه حضوری' },
  { value: 'OTHER', label: 'سایر' },
];

function getCreatedTicketId(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (typeof record.id === 'string') {
    return record.id;
  }

  if (typeof record.ticketNumber === 'string') {
    return record.ticketNumber;
  }

  return null;
}

export default function NewTicketPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmitError(null);
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.title.trim()) {
      nextErrors.title = 'عنوان تیکت الزامی است';
    } else if (form.title.trim().length < 5) {
      nextErrors.title = 'عنوان تیکت باید حداقل ۵ کاراکتر باشد';
    } else if (form.title.trim().length > 150) {
      nextErrors.title = 'عنوان تیکت نباید بیشتر از ۱۵۰ کاراکتر باشد';
    }

    if (!form.description.trim()) {
      nextErrors.description = 'شرح درخواست الزامی است';
    } else if (form.description.trim().length < 10) {
      nextErrors.description = 'شرح درخواست باید حداقل ۱۰ کاراکتر باشد';
    } else if (form.description.trim().length > 5000) {
      nextErrors.description = 'شرح درخواست نباید بیشتر از ۵۰۰۰ کاراکتر باشد';
    }

    if (form.customerName.trim().length > 120) {
      nextErrors.customerName = 'نام مشتری نباید بیشتر از ۱۲۰ کاراکتر باشد';
    }

    if (form.customerPhone.trim().length > 20) {
      nextErrors.customerPhone =
        'شماره تماس مشتری نباید بیشتر از ۲۰ کاراکتر باشد';
    }

    if (form.customerId.trim() && !isUuid(form.customerId.trim())) {
      nextErrors.customerId = 'شناسه مشتری باید UUID معتبر باشد';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        source: form.source,
        ...(form.customerName.trim()
          ? { customerName: form.customerName.trim() }
          : {}),
        ...(form.customerPhone.trim()
          ? { customerPhone: form.customerPhone.trim() }
          : {}),
        ...(form.customerId.trim()
          ? { customerId: form.customerId.trim() }
          : {}),
      };

      const createdTicket = await createTicket(
        payload as Parameters<typeof createTicket>[0],
      );

      const createdTicketId = getCreatedTicketId(createdTicket);

      setIsSubmitted(true);

      if (createdTicketId) {
        router.push(`/tickets/${createdTicketId}`);
        return;
      }

      router.push('/tickets');
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'خطا در ثبت تیکت',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitError(null);
    setIsSubmitted(false);
  };

  return (
    <div dir="rtl" className="mx-auto max-w-5xl space-y-6">
      <section
        className="
          flex flex-col gap-4 border-b border-[var(--border)] pb-5
          md:flex-row md:items-end md:justify-between
        "
      >
        <div>
          <Link
            href="/tickets"
            className="
              mb-4 inline-flex items-center gap-2 text-sm
              text-[var(--muted)] transition-colors
              hover:text-[var(--foreground)]
            "
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به فهرست تیکت‌ها
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="
                rounded-lg border border-[var(--primary)]/20
                bg-[var(--primary-soft)] p-2.5
                text-[var(--primary)]
              "
            >
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">
                ثبت تیکت جدید
              </h1>

              <p className="mt-1 text-sm text-[var(--muted)]">
                درخواست مشتری را با اطلاعات کامل در سیستم ثبت کنید.
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            rounded-lg border border-[var(--border)]
            bg-[var(--surface)] px-4 py-3 text-sm
            text-[var(--muted)]
          "
        >
          وضعیت اولیه پس از ثبت:{' '}
          <strong className="text-[var(--foreground)]">باز</strong>
        </div>
      </section>

      {isSubmitted ? (
        <section
          className="
            rounded-xl border border-[var(--success)]/20
            bg-[var(--success-soft)] p-6
          "
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="mt-0.5 h-6 w-6 shrink-0 text-[var(--success)]"
            />

            <div>
              <h2 className="font-semibold text-[var(--success)]">
                تیکت با موفقیت ثبت شد
              </h2>

              <p className="mt-1 text-sm text-[var(--success)]">
                در حال انتقال به صفحه جزئیات تیکت هستید...
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {submitError ? (
        <section
          role="alert"
          className="
            rounded-lg border border-[var(--danger)]/20
            bg-[var(--danger-soft)] px-4 py-3
            text-sm text-[var(--danger)]
          "
        >
          {submitError}
        </section>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section
          className="
            rounded-xl border border-[var(--border)]
            bg-[var(--surface)]
          "
        >
          <div className="border-b border-[var(--border)] px-5 py-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[var(--muted)]" />

              <div>
                <h2 className="font-semibold text-[var(--foreground)]">
                  اطلاعات درخواست
                </h2>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  عنوان و شرح دقیق، مبنای پیگیری تیم پشتیبانی خواهد بود.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5">
            <Field
              label="عنوان تیکت"
              required
              error={errors.title}
              hint={`${form.title.length}/150`}
            >
              <input
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="مثلاً: قطعی سرویس اینترنت مشتری"
                maxLength={150}
                className={inputClass(Boolean(errors.title))}
              />
            </Field>

            <Field
              label="شرح درخواست"
              required
              error={errors.description}
              hint={`${form.description.length}/5000`}
            >
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                placeholder="شرح مشکل، اقدامات انجام‌شده و نتیجه مورد انتظار را وارد کنید..."
                rows={7}
                maxLength={5000}
                className={`${inputClass(Boolean(errors.description))} resize-y py-3`}
              />
            </Field>
          </div>
        </section>

        <section
          className="
            rounded-xl border border-[var(--border)]
            bg-[var(--surface)]
          "
        >
          <div className="border-b border-[var(--border)] px-5 py-4">
            <div className="flex items-center gap-3">
              <UserRound className="h-5 w-5 text-[var(--muted)]" />

              <div>
                <h2 className="font-semibold text-[var(--foreground)]">
                  اطلاعات مشتری
                </h2>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  این بخش برای شناسایی و پیگیری سریع‌تر مشتری استفاده می‌شود.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-2">
            <Field
              label="نام مشتری"
              error={errors.customerName}
              hint="اختیاری"
            >
              <input
                value={form.customerName}
                onChange={(event) =>
                  updateField('customerName', event.target.value)
                }
                placeholder="نام و نام خانوادگی یا نام شرکت"
                maxLength={120}
                className={inputClass(Boolean(errors.customerName))}
              />
            </Field>

            <Field
              label="شماره تماس"
              error={errors.customerPhone}
              hint="اختیاری"
            >
              <div className="relative">
                <Phone
                  className="
                    pointer-events-none absolute right-3 top-1/2
                    h-4 w-4 -translate-y-1/2 text-[var(--muted)]
                  "
                />

                <input
                  dir="ltr"
                  value={form.customerPhone}
                  onChange={(event) =>
                    updateField('customerPhone', event.target.value)
                  }
                  placeholder="0912xxxxxxx"
                  maxLength={20}
                  className={`${inputClass(Boolean(errors.customerPhone))} pr-10 text-right`}
                />
              </div>
            </Field>

            <Field
              label="شناسه مشتری"
              error={errors.customerId}
              hint="اختیاری؛ UUID"
            >
              <input
                dir="ltr"
                value={form.customerId}
                onChange={(event) =>
                  updateField('customerId', event.target.value)
                }
                placeholder="شناسه مشتری در CRM"
                className={`${inputClass(Boolean(errors.customerId))} text-left`}
              />
            </Field>
          </div>
        </section>

        <section
          className="
            rounded-xl border border-[var(--border)]
            bg-[var(--surface)]
          "
        >
          <div className="border-b border-[var(--border)] px-5 py-4">
            <div className="flex items-center gap-3">
              <Send className="h-5 w-5 text-[var(--muted)]" />

              <div>
                <h2 className="font-semibold text-[var(--foreground)]">
                  طبقه‌بندی عملیاتی
                </h2>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  اولویت و منبع، برای تقسیم کار و گزارش‌گیری استفاده می‌شوند.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5">
            <Field label="اولویت تیکت" required>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {PRIORITY_OPTIONS.map((option) => {
                  const selected = form.priority === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`
                        cursor-pointer rounded-lg border p-3 transition
                        ${
                          selected
                            ? 'border-[var(--primary)] bg-[var(--primary-soft)] ring-1 ring-[var(--primary)]'
                            : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={option.value}
                        checked={selected}
                        onChange={() =>
                          updateField('priority', option.value)
                        }
                        className="sr-only"
                      />

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-[var(--foreground)]">
                          {option.label}
                        </span>

                        <span
                          className={`
                            h-2.5 w-2.5 rounded-full
                            ${
                              option.value === 'URGENT'
                                ? 'bg-[var(--danger)]'
                                : option.value === 'HIGH'
                                  ? 'bg-[var(--warning)]'
                                  : option.value === 'MEDIUM'
                                    ? 'bg-[var(--primary)]'
                                    : 'bg-[var(--muted)]'
                            }
                          `}
                        />
                      </div>

                      <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                        {option.description}
                      </p>
                    </label>
                  );
                })}
              </div>
            </Field>

            <Field label="منبع ثبت تیکت" required>
              <select
                value={form.source}
                onChange={(event) =>
                  updateField('source', event.target.value as TicketSource)
                }
                className={inputClass(false)}
              >
                {SOURCE_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-[var(--surface)] text-[var(--foreground)]"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <section
          className="
            flex flex-col-reverse gap-3
            border-t border-[var(--border)] pt-5
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="
              h-11 rounded-lg border border-[var(--border)]
              px-5 text-sm font-medium text-[var(--muted)]
              transition-colors hover:bg-[var(--surface-hover)]
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            پاک کردن فرم
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/tickets"
              className="
                inline-flex h-11 items-center justify-center
                rounded-lg border border-[var(--border)]
                px-5 text-sm font-medium text-[var(--muted)]
                transition-colors hover:bg-[var(--surface-hover)]
              "
            >
              انصراف
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                inline-flex h-11 items-center justify-center gap-2
                rounded-lg bg-[var(--primary)]
                px-6 text-sm font-medium
                text-[var(--primary-foreground)]
                transition-opacity hover:opacity-90
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال ثبت...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  ثبت تیکت
                </>
              )}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

function Field({
  label,
  required = false,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-[var(--foreground)]">
          {label}

          {required ? (
            <span
              className="mr-1 text-[var(--danger)]"
              aria-label="الزامی"
            >
              *
            </span>
          ) : null}
        </label>

        {hint ? (
          <span className="text-xs text-[var(--muted)]">{hint}</span>
        ) : null}
      </div>

      {children}

      {error ? (
        <p className="text-xs text-[var(--danger)]">{error}</p>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `
    h-11 w-full rounded-lg border
    bg-[var(--background)]
    px-3 text-sm text-[var(--foreground)]
    outline-none transition-colors
    placeholder:text-[var(--muted)]
    focus:ring-2
    ${
      hasError
        ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/15'
        : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--ring)]/20'
    }
  `;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
