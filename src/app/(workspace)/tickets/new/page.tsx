/**
 * مسیر فایل:
 * src/app/(workspace)/tickets/new/page.tsx
 *
 * هدف:
 * صفحه تمام‌عرض ثبت تیکت جدید مطابق با استانداردهای دیزاین‌سیستم و تم ERP Pro.
 */

'use client';

import Link from 'next/link';
import { FormEvent, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FilePlus2,
  FileText,
  Loader2,
  Phone,
  Send,
  Sparkles,
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
  dotColor: string;
  activeBorder: string;
  activeBg: string;
}> = [
  {
    value: 'LOW',
    label: 'کم',
    description: 'درخواست عادی بدون فوریت',
    dotColor: 'bg-slate-400',
    activeBorder: 'border-slate-500/40 ring-slate-500/20',
    activeBg: 'bg-slate-500/10',
  },
  {
    value: 'MEDIUM',
    label: 'متوسط',
    description: 'نیازمند پیگیری در روند معمول',
    dotColor: 'bg-blue-500',
    activeBorder: 'border-blue-500/40 ring-blue-500/20',
    activeBg: 'bg-blue-500/10',
  },
  {
    value: 'HIGH',
    label: 'زیاد',
    description: 'تأثیر قابل توجه بر مشتری یا عملیات',
    dotColor: 'bg-amber-500',
    activeBorder: 'border-amber-500/40 ring-amber-500/20',
    activeBg: 'bg-amber-500/10',
  },
  {
    value: 'URGENT',
    label: 'فوری',
    description: 'اختلال جدی یا نیازمند اقدام آنی',
    dotColor: 'bg-rose-500',
    activeBorder: 'border-rose-500/40 ring-rose-500/20',
    activeBg: 'bg-rose-500/10',
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
      nextErrors.customerId = 'شناسه مشتری باید یک شناسه معتبر (UUID) باشد';
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
        error instanceof Error ? error.message : 'خطا در برقراری ارتباط و ثبت تیکت',
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
    <div dir="rtl" className="w-full space-y-5">
      {/* ۱. هدر تمام‌عرض ماژول */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <FilePlus2 size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-foreground">
                ثبت تیکت پشتیبانی جدید
              </h1>

              <p className="mt-0.5 text-xs text-muted-foreground">
                ثبت و ارجاع درخواست، مشکل یا سوال مشتری در چرخه پاسخگویی سازمان
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/tickets"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-accent hover:text-blue-500"
            >
              <ArrowRight size={14} />
              بازگشت به فهرست تیکت‌ها
            </Link>
          </div>
        </div>
      </section>

      {/* وضعیت موفقیت */}
      {isSubmitted && (
        <section className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">تیکت با موفقیت در سامانه ایجاد شد.</p>
            <p className="mt-0.5 text-muted-foreground">
              در حال انتقال به صفحه پیگیری تیکت...
            </p>
          </div>
        </section>
      )}

      {/* پیام خطا */}
      {submitError && (
        <section
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-600 dark:text-rose-400"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">خطا در ثبت اطلاعات</p>
            <p className="mt-0.5">{submitError}</p>
          </div>
        </section>
      )}

      {/* فرم ثبت تیکت (تمام‌عرض با گرید دو ستونه) */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-3">
          {/* ستون اصلی: اطلاعات درخواست (عرض ۲ از ۳ در دسکتاپ) */}
          <div className="space-y-5 lg:col-span-2">
            <section className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 px-5 py-4">
                <FileText className="h-4 w-4 text-blue-500" />
                <h2 className="text-sm font-bold text-foreground">اطلاعات تیکت</h2>
              </div>

              <div className="space-y-4 p-5">
                <Field
                  label="عنوان تیکت"
                  required
                  error={errors.title}
                  hint={`${form.title.length}/150`}
                >
                  <input
                    value={form.title}
                    onChange={(event) => updateField('title', event.target.value)}
                    placeholder="مثلاً: عدم دسترسی کاربر به بخش صدور فاکتور"
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
                    placeholder="شرح دقیق مشکل، مراحل بازتولید و انتظارات مربوطه را وارد کنید..."
                    rows={8}
                    maxLength={5000}
                    className={`${inputClass(Boolean(errors.description))} resize-y py-3 leading-relaxed`}
                  />
                </Field>
              </div>
            </section>

            {/* بخش مشخصات مشتری */}
            <section className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 px-5 py-4">
                <UserRound className="h-4 w-4 text-blue-500" />
                <h2 className="text-sm font-bold text-foreground">اطلاعات مشتری</h2>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <Field
                  label="نام مشتری / سازمان"
                  error={errors.customerName}
                  hint="اختیاری"
                >
                  <input
                    value={form.customerName}
                    onChange={(event) =>
                      updateField('customerName', event.target.value)
                    }
                    placeholder="نام و نام خانوادگی یا شرکت"
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
                    <Phone className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

                <div className="sm:col-span-2">
                  <Field
                    label="شناسه سیستمی مشتری"
                    error={errors.customerId}
                    hint="UUID اختیاری"
                  >
                    <input
                      dir="ltr"
                      value={form.customerId}
                      onChange={(event) =>
                        updateField('customerId', event.target.value)
                      }
                      placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                      className={`${inputClass(Boolean(errors.customerId))} font-mono text-xs`}
                    />
                  </Field>
                </div>
              </div>
            </section>
          </div>

          {/* ستون کناری: طبقه‌بندی و اولویت‌بندی (عرض ۱ از ۳ در دسکتاپ) */}
          <div className="space-y-5">
            <section className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-border/80 px-5 py-4">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <h2 className="text-sm font-bold text-foreground">طبقه‌بندی و اولویت‌بندی</h2>
              </div>

              <div className="space-y-5 p-5">
                <Field label="میزان اولویت" required>
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                    {PRIORITY_OPTIONS.map((option) => {
                      const selected = form.priority === option.value;

                      return (
                        <label
                          key={option.value}
                          className={`cursor-pointer rounded-xl border p-3 transition-all ${
                            selected
                              ? `${option.activeBorder} ${option.activeBg} ring-1`
                              : 'border-border bg-card hover:border-border/80 hover:bg-accent/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="priority"
                            value={option.value}
                            checked={selected}
                            onChange={() => updateField('priority', option.value)}
                            className="sr-only"
                          />

                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">
                              {option.label}
                            </span>
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${option.dotColor}`}
                            />
                          </div>

                          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                            {option.description}
                          </p>
                        </label>
                      );
                    })}
                  </div>
                </Field>

                <Field label="کانال ورودی تیکت" required>
                  <select
                    value={form.source}
                    onChange={(event) =>
                      updateField('source', event.target.value as TicketSource)
                    }
                    className={`${inputClass(false)} cursor-pointer`}
                  >
                    {SOURCE_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-card text-foreground"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </section>
          </div>
        </div>

        {/* نوار دکمه‌های عملیاتی تمام‌عرض */}
        <section className="flex flex-col-reverse gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground disabled:opacity-50"
          >
            پاک کردن فرم
          </button>

          <div className="flex items-center gap-2.5">
            <Link
              href="/tickets"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-medium text-foreground transition-all hover:bg-accent"
            >
              انصراف
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white shadow-sm shadow-blue-600/30 transition-all hover:bg-blue-500 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال ثبت تیکت...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  ثبت نهایی تیکت
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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-foreground">
          {label}
          {required && <span className="mr-1 text-rose-500">*</span>}
        </label>

        {hint && (
          <span className="text-[11px] text-muted-foreground">{hint}</span>
        )}
      </div>

      {children}

      {error && <p className="text-[11px] text-rose-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `
    h-10 w-full rounded-xl border
    bg-background px-3.5 text-xs text-foreground
    outline-none transition-all placeholder:text-muted-foreground
    focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
    ${
      hasError
        ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
        : 'border-border'
    }
  `;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
