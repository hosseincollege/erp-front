// File: frontend/src/app/api/settings/import/organization/route.ts
// Frontend API Route - اعتبارسنجی فایل JSON اطلاعات شرکت و ساختار سازمانی

import { NextResponse } from 'next/server';

interface OrganizationImportBody {
  company?: {
    name?: string;
    [key: string]: unknown;
  };
  branches?: unknown[];
  departments?: unknown[];
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'خطای ناشناخته‌ای رخ داد.';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrganizationImportBody;

    if (
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          message: 'ساختار فایل JSON معتبر نیست.',
        },
        {
          status: 400,
        },
      );
    }

    const company = body.company;
    const branches = body.branches ?? [];
    const departments = body.departments ?? [];

    if (
      !company ||
      typeof company !== 'object' ||
      Array.isArray(company) ||
      typeof company.name !== 'string' ||
      company.name.trim().length === 0
    ) {
      return NextResponse.json(
        {
          message:
            'اطلاعات شرکت ناقص است. فیلد company.name الزامی است.',
        },
        {
          status: 400,
        },
      );
    }

    if (!Array.isArray(branches)) {
      return NextResponse.json(
        {
          message: 'فیلد branches باید یک آرایه باشد.',
        },
        {
          status: 400,
        },
      );
    }

    if (!Array.isArray(departments)) {
      return NextResponse.json(
        {
          message: 'فیلد departments باید یک آرایه باشد.',
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: 'اطلاعات سازمان با موفقیت دریافت و اعتبارسنجی شد.',
        data: {
          company,
          branches,
          departments,
          summary: {
            branchesCount: branches.length,
            departmentsCount: departments.length,
          },
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `خواندن فایل JSON انجام نشد: ${getErrorMessage(error)}`,
      },
      {
        status: 400,
      },
    );
  }
}
