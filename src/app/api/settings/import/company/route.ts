// Path: src/app/api/settings/import/company/route.ts

import { NextRequest, NextResponse } from 'next/server';

interface CompanyImportPayload {
  name: string;
  legalName?: string;
  registrationNumber?: string;
  nationalId?: string;
  economicCode?: string;
  taxOffice?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  currency?: string;
  fiscalYearStart?: string;
  logoUrl?: string;
}

function isOptionalString(value: unknown): value is string | undefined {
  return typeof value === 'undefined' || typeof value === 'string';
}

function validatePayload(data: unknown): data is CompanyImportPayload {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }

  const candidate = data as Record<string, unknown>;

  if (typeof candidate.name !== 'string' || !candidate.name.trim()) {
    return false;
  }

  return (
    isOptionalString(candidate.legalName) &&
    isOptionalString(candidate.registrationNumber) &&
    isOptionalString(candidate.nationalId) &&
    isOptionalString(candidate.economicCode) &&
    isOptionalString(candidate.taxOffice) &&
    isOptionalString(candidate.phone) &&
    isOptionalString(candidate.email) &&
    isOptionalString(candidate.website) &&
    isOptionalString(candidate.address) &&
    isOptionalString(candidate.postalCode) &&
    isOptionalString(candidate.currency) &&
    isOptionalString(candidate.fiscalYearStart) &&
    isOptionalString(candidate.logoUrl)
  );
}

export async function POST(request: NextRequest) {
  try {
    const rawBody: unknown = await request.json().catch(() => null);

    if (!validatePayload(rawBody)) {
      return NextResponse.json(
        {
          message:
            'فرمت فایل نامعتبر است. لطفاً ساختار داده و نام شرکت را بررسی کنید.',
        },
        { status: 400 },
      );
    }

    // مطابقت کامل و دقیق با ImportOrganizationDetailsDto در بک‌اند (ارسال تمام ۱۴ فیلد)
    const backendPayload = {
      organization: {
        name: rawBody.name.trim(),
        legalName: rawBody.legalName?.trim() || undefined,
        registrationNumber: rawBody.registrationNumber?.trim() || undefined,
        nationalId: rawBody.nationalId?.trim() || undefined,
        economicCode: rawBody.economicCode?.trim() || undefined,
        taxOffice: rawBody.taxOffice?.trim() || undefined,
        phone: rawBody.phone?.trim() || undefined,
        email: rawBody.email?.trim() || undefined,
        website: rawBody.website?.trim() || undefined,
        address: rawBody.address?.trim() || undefined,
        postalCode: rawBody.postalCode?.trim() || undefined,
        currency: rawBody.currency?.trim() || undefined,
        fiscalYearStart: rawBody.fiscalYearStart?.trim() || undefined,
        logoUrl: rawBody.logoUrl?.trim() || undefined,
      },
    };

    const backendBaseUrl =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:3006';

    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['authorization'] = authHeader;
    }
    if (cookieHeader) {
      headers['cookie'] = cookieHeader;
    }

    const backendResponse = await fetch(
      `${backendBaseUrl.replace(/\/$/, '')}/settings/organization/import`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(backendPayload),
        cache: 'no-store',
      },
    );

    const backendResult: unknown = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      const message =
        backendResult &&
        typeof backendResult === 'object' &&
        'message' in backendResult &&
        typeof backendResult.message === 'string'
          ? backendResult.message
          : 'خطا در برقراری ارتباط با سرور یا ذخیره اطلاعات شرکت.';

      return NextResponse.json(
        { message },
        { status: backendResponse.status || 500 },
      );
    }

    return NextResponse.json(
      {
        message: 'اطلاعات شرکت با موفقیت در سیستم ثبت شد.',
        data: backendResult,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'خطای پیش‌بینی‌نشده در پردازش درخواست واردسازی.',
      },
      { status: 500 },
    );
  }
}
