/**
 * مسیر فایل:
 * frontend/src/app/(workspace)/accounting/new/page.tsx
 *
 * هدف:
 * صفحه ثبت فاکتور خرید در ماژول حسابداری.
 *
 * ویژگی‌ها:
 * - ثبت اطلاعات اصلی فاکتور
 * - مدیریت پویا و افزودن یا حذف ردیف‌های فاکتور
 * - محاسبه subtotal، مالیات و total
 * - اعتبارسنجی سمت کاربر
 * - ارسال اطلاعات به accountingApi.createInvoice
 * - انتقال کاربر به صفحه جزئیات پس از ثبت موفق
 *
 * نکته:
 * شعبه و دپارتمان در این مرحله از API تنظیمات دریافت نمی‌شوند
 * و هیچ مقدار mock یا مقدار پیش‌فرض سازمانی در این فایل وجود ندارد.
 * این دو فیلد فعلاً اختیاری هستند.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calculator,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  accountingApi,
  ApiClientError,
} from "@/lib/accounting-api";

import type {
  AccountingLineItem,
  AccountingPriority,
  CreateInvoicePayload,
} from "@/types/accounting";

type InvoiceFormItem = {
  localId: string;
  description: string;
  quantity: string;
  unitPrice: string;
  taxRate: string;
};

type FormValues = {
  title: string;
  vendorName: string;
  description: string;
  branchId: string;
  departmentId: string;
  dueDate: string;
  currency: string;
  priority: AccountingPriority;
};

const INITIAL_FORM: FormValues = {
  title: "",
  vendorName: "",
  description: "",
  branchId: "",
  departmentId: "",
  dueDate: "",
  currency: "IRR",
  priority: "MEDIUM",
};

function createEmptyItem(): InvoiceFormItem {
  return {
    localId: `${Date.now()}-${Math.random()}`,
    description: "",
    quantity: "1",
    unitPrice: "",
    taxRate: "0",
  };
}

function parseNumber(value: string): number {
  const normalizedValue = value.replace(/,/g, "").trim();

  if (!normalizedValue) {
    return 0;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "ثبت فاکتور با خطا مواجه شد.";
}

export default function NewAccountingInvoicePage() {
  const router = useRouter();

  const [form, setForm] = useState<FormValues>(INITIAL_FORM);

  const [items, setItems] = useState<InvoiceFormItem[]>([
    createEmptyItem(),
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    let subtotal = 0;
    let taxAmount = 0;

    for (const item of items) {
      const quantity = parseNumber(item.quantity);
      const unitPrice = parseNumber(item.unitPrice);
      const taxRate = parseNumber(item.taxRate);

      const lineSubtotal = quantity * unitPrice;
      const lineTax = lineSubtotal * (taxRate / 100);

      subtotal += lineSubtotal;
      taxAmount += lineTax;
    }

    return {
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
    };
  }, [items]);

  function updateFormField(
    field: keyof FormValues,
    value: string,
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function updateItem(
    localId: string,
    field: keyof Omit<InvoiceFormItem, "localId">,
    value: string,
  ) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.localId === localId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((currentItems) => [
      ...currentItems,
      createEmptyItem(),
    ]);
  }

  function removeItem(localId: string) {
    if (items.length === 1) {
      setItems([createEmptyItem()]);
      return;
    }

    setItems((currentItems) =>
      currentItems.filter((item) => item.localId !== localId),
    );
  }

  function validateForm(): string | null {
    if (!form.title.trim()) {
      return "عنوان فاکتور را وارد کنید.";
    }

    if (items.length === 0) {
      return "حداقل یک ردیف برای فاکتور لازم است.";
    }

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const quantity = parseNumber(item.quantity);
      const unitPrice = parseNumber(item.unitPrice);
      const taxRate = parseNumber(item.taxRate);

      if (!item.description.trim()) {
        return `توضیحات ردیف ${index + 1} را وارد کنید.`;
      }

      if (quantity <= 0) {
        return `تعداد ردیف ${index + 1} باید بیشتر از صفر باشد.`;
      }

      if (unitPrice < 0) {
        return `قیمت واحد ردیف ${index + 1} نمی‌تواند منفی باشد.`;
      }

      if (taxRate < 0 || taxRate > 100) {
        return `نرخ مالیات ردیف ${index + 1} باید بین صفر تا صد باشد.`;
      }
    }

    if (totals.total <= 0) {
      return "مبلغ فاکتور باید بیشتر از صفر باشد.";
    }

    return null;
  }

  function buildPayload(): CreateInvoicePayload {
    const lineItems: AccountingLineItem[] = items.map((item) => {
      const quantity = parseNumber(item.quantity);
      const unitPrice = parseNumber(item.unitPrice);
      const taxRate = parseNumber(item.taxRate);

      return {
        description: item.description.trim(),
        quantity,
        unitPrice,
        taxRate,
        total: quantity * unitPrice * (1 + taxRate / 100),
      };
    });

    return {
      title: form.title.trim(),
      vendorName: form.vendorName.trim() || undefined,
      description: form.description.trim() || undefined,
      branchId: form.branchId.trim() || undefined,
      departmentId: form.departmentId.trim() || undefined,
      dueDate: form.dueDate || null,
      currency: form.currency,
      priority: form.priority,
      lineItems,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const createdInvoice = await accountingApi.createInvoice(
        buildPayload(),
      );

      if (createdInvoice?.id) {
        router.push(`/accounting/${createdInvoice.id}`);
      } else {
        router.push("/accounting");
      }
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNumericChange(
    event: ChangeEvent<HTMLInputElement>,
    localId: string,
    field: "quantity" | "unitPrice" | "taxRate",
  ) {
    const value = event.target.value;

    if (value !== "" && !/^\d*([.]\d*)?$/.test(value)) {
      return;
    }

    updateItem(localId, field, value);
  }

  return (
    <main
      dir="rtl"
      className="min-h-full space-y-6 bg-[var(--background)] p-4 text-[var(--foreground)] md:p-6"
    >
      <section className="surface-card rounded-2xl p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/accounting"
              className="mb-3 inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] transition hover:text-[var(--primary)]"
            >
              <ArrowRight size={16} />
              بازگشت به حسابداری
            </Link>

            <h1 className="text-xl font-bold text-[var(--foreground)]">
              ثبت فاکتور خرید
            </h1>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              اطلاعات فاکتور و اقلام خرید را وارد کنید.
            </p>
          </div>

          <div className="rounded-xl bg-[var(--primary-soft)] p-3 text-[var(--primary)]">
            <Calculator size={24} />
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <section className="surface-card rounded-2xl p-5">
          <h2 className="mb-5 text-lg font-bold text-[var(--foreground)]">
            اطلاعات اصلی فاکتور
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--foreground)]">
                عنوان فاکتور
                <span className="text-[var(--danger)]"> *</span>
              </span>

              <input
                value={form.title}
                onChange={(event) =>
                  updateFormField("title", event.target.value)
                }
                placeholder="مثلاً خرید تجهیزات اداری"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--foreground)]">
                نام تأمین‌کننده
              </span>

              <input
                value={form.vendorName}
                onChange={(event) =>
                  updateFormField(
                    "vendorName",
                    event.target.value,
                  )
                }
                placeholder="نام شخص یا شرکت تأمین‌کننده"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-[var(--foreground)]">
                توضیحات
              </span>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateFormField(
                    "description",
                    event.target.value,
                  )
                }
                rows={3}
                placeholder="توضیحات تکمیلی فاکتور"
                className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--foreground)]">
                شناسه شعبه
              </span>

              <input
                value={form.branchId}
                onChange={(event) =>
                  updateFormField(
                    "branchId",
                    event.target.value,
                  )
                }
                placeholder="در صورت وجود شناسه شعبه"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
              />

              <span className="block text-xs text-[var(--muted-foreground)]">
                تا زمان آماده‌شدن API تنظیمات، این فیلد اختیاری است.
              </span>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--foreground)]">
                شناسه دپارتمان
              </span>

              <input
                value={form.departmentId}
                onChange={(event) =>
                  updateFormField(
                    "departmentId",
                    event.target.value,
                  )
                }
                placeholder="در صورت وجود شناسه دپارتمان"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
              />

              <span className="block text-xs text-[var(--muted-foreground)]">
                تا زمان آماده‌شدن API تنظیمات، این فیلد اختیاری است.
              </span>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--foreground)]">
                تاریخ سررسید
              </span>

              <input
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  updateFormField(
                    "dueDate",
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--foreground)]">
                ارز
              </span>

              <select
                value={form.currency}
                onChange={(event) =>
                  updateFormField(
                    "currency",
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
              >
                <option value="IRR">ریال</option>
                <option value="toman">تومان</option>
                <option value="USD">دلار</option>
                <option value="EUR">یورو</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--foreground)]">
                اولویت
              </span>

              <select
                value={form.priority}
                onChange={(event) =>
                  updateFormField(
                    "priority",
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
              >
                <option value="LOW">کم</option>
                <option value="MEDIUM">متوسط</option>
                <option value="HIGH">زیاد</option>
                <option value="URGENT">فوری</option>
              </select>
            </label>
          </div>
        </section>

        <section className="surface-card overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-3 border-b border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                اقلام فاکتور
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                اقلام خرید، تعداد، قیمت و مالیات را وارد کنید.
              </p>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--primary)_35%,var(--border))] bg-[var(--primary-soft)] px-4 py-2.5 text-sm font-medium text-[var(--primary)] transition hover:brightness-95"
            >
              <Plus size={17} />
              افزودن ردیف
            </button>
          </div>

          <div className="space-y-4 p-5">
            {items.map((item, index) => {
              const quantity = parseNumber(item.quantity);
              const unitPrice = parseNumber(item.unitPrice);
              const taxRate = parseNumber(item.taxRate);

              const lineSubtotal = quantity * unitPrice;
              const lineTax =
                lineSubtotal * (taxRate / 100);
              const lineTotal = lineSubtotal + lineTax;

              return (
                <div
                  key={item.localId}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-[var(--foreground)]">
                      ردیف {formatAmount(index + 1)}
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.localId)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--danger)] transition hover:bg-[var(--danger-soft)]"
                    >
                      <Trash2 size={15} />
                      حذف ردیف
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <label className="space-y-2 lg:col-span-2">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        شرح کالا یا خدمت
                        <span className="text-[var(--danger)]"> *</span>
                      </span>

                      <input
                        value={item.description}
                        onChange={(event) =>
                          updateItem(
                            item.localId,
                            "description",
                            event.target.value,
                          )
                        }
                        placeholder="شرح ردیف فاکتور"
                        className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        تعداد
                        <span className="text-[var(--danger)]"> *</span>
                      </span>

                      <input
                        inputMode="decimal"
                        value={item.quantity}
                        onChange={(event) =>
                          handleNumericChange(
                            event,
                            item.localId,
                            "quantity",
                          )
                        }
                        placeholder="1"
                        className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        قیمت واحد
                        <span className="text-[var(--danger)]"> *</span>
                      </span>

                      <input
                        inputMode="decimal"
                        value={item.unitPrice}
                        onChange={(event) =>
                          handleNumericChange(
                            event,
                            item.localId,
                            "unitPrice",
                          )
                        }
                        placeholder="0"
                        className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        مالیات درصدی
                      </span>

                      <input
                        inputMode="decimal"
                        value={item.taxRate}
                        onChange={(event) =>
                          handleNumericChange(
                            event,
                            item.localId,
                            "taxRate",
                          )
                        }
                        placeholder="0"
                        className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-3 text-sm">
                    <span className="text-[var(--muted-foreground)]">
                      مبلغ این ردیف با مالیات:
                    </span>

                    <span className="font-bold text-[var(--foreground)]">
                      {formatAmount(lineTotal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="surface-card rounded-2xl p-5">
          <div className="ms-auto max-w-md space-y-3">
            <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)]">
              <span>جمع کالا و خدمات</span>
              <span>{formatAmount(totals.subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)]">
              <span>مبلغ مالیات</span>
              <span>{formatAmount(totals.taxAmount)}</span>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-base font-bold text-[var(--foreground)]">
              <span>مبلغ نهایی</span>
              <span>
                {formatAmount(totals.total)}{" "}
                {form.currency === "IRR"
                  ? "ریال"
                  : form.currency}
              </span>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--danger)_35%,var(--border))] bg-[var(--danger-soft)] p-4 text-sm leading-6 text-[var(--danger)]">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/accounting"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]"
          >
            انصراف
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-medium text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {isSubmitting
              ? "در حال ثبت..."
              : "ثبت فاکتور"}
          </button>
        </div>
      </form>
    </main>
  );
}
