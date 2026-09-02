// src/app/api/settings/import/organization-structure/route.ts
// Frontend API Route - اعتبارسنجی و ارسال Import ساختار سازمانی شامل شعب و دپارتمان‌ها

import { NextResponse } from 'next/server';

interface BranchImportItem {
  name?: unknown;
  code?: unknown;
  phone?: unknown;
  email?: unknown;
  address?: unknown;
  postalCode?: unknown;
  isMain?: unknown;
}

interface DepartmentImportItem {
  name?: unknown;
  code?: unknown;
  description?: unknown;
  branchName?: unknown;
}

interface OrganizationStructureImportBody {
  branches?: unknown;
  departments?: unknown;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'خطای ناشناخته‌ای رخ داد.';
}

function isOptionalString(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    typeof value === 'string'
  );
}

function validateBranch(
  rawBranch: unknown,
  index: number,
): string | null {
  if (
    !rawBranch ||
    typeof rawBranch !== 'object' ||
    Array.isArray(rawBranch)
  ) {
    return `اطلاعات شعبه در ردیف ${index + 1} معتبر نیست.`;
  }

  const branch = rawBranch as BranchImportItem;

  if (typeof branch.name !== 'string' || !branch.name.trim()) {
    return `نام شعبه در ردیف ${index + 1} الزامی است.`;
  }

  if (typeof branch.code !== 'string' || !branch.code.trim()) {
    return `کد شعبه در ردیف ${index + 1} الزامی است.`;
  }

  const optionalStringFields: Array<keyof BranchImportItem> = [
    'phone',
    'email',
    'address',
    'postalCode',
  ];

  for (const fieldName of optionalStringFields) {
    if (!isOptionalString(branch[fieldName])) {
      return `فیلد «${fieldName}» در شعبه ردیف ${
        index + 1
      } باید از نوع متن باشد.`;
    }
  }

  if (
    branch.isMain !== undefined &&
    branch.isMain !== null &&
    typeof branch.isMain !== 'boolean'
  ) {
    return `فیلد «isMain» در شعبه ردیف ${
      index + 1
    } باید true یا false باشد.`;
  }

  if (
    typeof branch.email === 'string' &&
    branch.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(branch.email)
  ) {
    return `ایمیل شعبه در ردیف ${index + 1} معتبر نیست.`;
  }

  return null;
}

function validateDepartment(
  rawDepartment: unknown,
  index: number,
  branchNames: Set<string>,
): string | null {
  if (
    !rawDepartment ||
    typeof rawDepartment !== 'object' ||
    Array.isArray(rawDepartment)
  ) {
    return `اطلاعات دپارتمان در ردیف ${index + 1} معتبر نیست.`;
  }

  const department = rawDepartment as DepartmentImportItem;

  if (
    typeof department.name !== 'string' ||
    !department.name.trim()
  ) {
    return `نام دپارتمان در ردیف ${index + 1} الزامی است.`;
  }

  if (
    typeof department.code !== 'string' ||
    !department.code.trim()
  ) {
    return `کد دپارتمان در ردیف ${index + 1} الزامی است.`;
  }

  const optionalStringFields: Array<keyof DepartmentImportItem> = [
    'description',
    'branchName',
  ];

  for (const fieldName of optionalStringFields) {
    if (!isOptionalString(department[fieldName])) {
      return `فیلد «${fieldName}» در دپارتمان ردیف ${
        index + 1
      } باید از نوع متن باشد.`;
    }
  }

  if (
    typeof department.branchName === 'string' &&
    department.branchName.trim() &&
    !branchNames.has(department.branchName.trim())
  ) {
    return `شعبه «${department.branchName.trim()}» برای دپارتمان ردیف ${
      index + 1
    } در فایل پیدا نشد.`;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrganizationStructureImportBody;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        {
          message:
            'بدنه درخواست نامعتبر است. فایل باید شامل یک شیء JSON باشد.',
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.branches)) {
      return NextResponse.json(
        {
          message: 'فیلد «branches» باید یک آرایه از شعب باشد.',
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.departments)) {
      return NextResponse.json(
        {
          message:
            'فیلد «departments» باید یک آرایه از دپارتمان‌ها باشد.',
        },
        { status: 400 },
      );
    }

    const branchNames = new Set<string>();
    const branchCodes = new Set<string>();

    for (let index = 0; index < body.branches.length; index += 1) {
      const branch = body.branches[index];

      const validationError = validateBranch(branch, index);

      if (validationError) {
        return NextResponse.json(
          { message: validationError },
          { status: 400 },
        );
      }

      const validBranch = branch as BranchImportItem;
      const branchName = (validBranch.name as string).trim();
      const branchCode = (validBranch.code as string).trim();

      if (branchNames.has(branchName)) {
        return NextResponse.json(
          {
            message: `نام شعبه «${branchName}» در فایل تکراری است.`,
          },
          { status: 400 },
        );
      }

      if (branchCodes.has(branchCode)) {
        return NextResponse.json(
          {
            message: `کد شعبه «${branchCode}» در فایل تکراری است.`,
          },
          { status: 400 },
        );
      }

      branchNames.add(branchName);
      branchCodes.add(branchCode);
    }

    const departmentKeys = new Set<string>();

    for (
      let index = 0;
      index < body.departments.length;
      index += 1
    ) {
      const department = body.departments[index];

      const validationError = validateDepartment(
        department,
        index,
        branchNames,
      );

      if (validationError) {
        return NextResponse.json(
          { message: validationError },
          { status: 400 },
        );
      }

      const validDepartment = department as DepartmentImportItem;
      const departmentName = (validDepartment.name as string).trim();

      const branchName =
        typeof validDepartment.branchName === 'string'
          ? validDepartment.branchName.trim()
          : '';

      const departmentKey = `${branchName}::${departmentName}`;

      if (departmentKeys.has(departmentKey)) {
        return NextResponse.json(
          {
            message: `دپارتمان «${departmentName}» در شعبه «${
              branchName || 'بدون شعبه'
            }» در فایل تکراری است.`,
          },
          { status: 400 },
        );
      }

      departmentKeys.add(departmentKey);
    }

    /**
     * فقط فیلدهای مورد نیاز بک‌اند را ارسال می‌کنیم.
     */
    const backendPayload = {
      branches: body.branches.map((branch) => {
        const item = branch as BranchImportItem;

        return {
          name: (item.name as string).trim(),
          code: (item.code as string).trim(),
          phone:
            typeof item.phone === 'string'
              ? item.phone.trim() || undefined
              : undefined,
          email:
            typeof item.email === 'string'
              ? item.email.trim() || undefined
              : undefined,
          address:
            typeof item.address === 'string'
              ? item.address.trim() || undefined
              : undefined,
          postalCode:
            typeof item.postalCode === 'string'
              ? item.postalCode.trim() || undefined
              : undefined,
          isMain:
            typeof item.isMain === 'boolean'
              ? item.isMain
              : undefined,
        };
      }),
      departments: body.departments.map((department) => {
        const item = department as DepartmentImportItem;

        return {
          name: (item.name as string).trim(),
          code: (item.code as string).trim(),
          description:
            typeof item.description === 'string'
              ? item.description.trim() || undefined
              : undefined,
          branchName:
            typeof item.branchName === 'string'
              ? item.branchName.trim() || undefined
              : undefined,
        };
      }),
    };

    const rawBaseUrl =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3006';

    const backendBaseUrl = rawBaseUrl.replace(/\/$/, '');

    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (authHeader) {
      headers.Authorization = authHeader;
    }

    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const backendResponse = await fetch(
      `${backendBaseUrl}/settings/organization/import`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(backendPayload),
        cache: 'no-store',
      },
    );

    let backendData: unknown = null;

    try {
      backendData = await backendResponse.json();
    } catch {
      backendData = null;
    }

    if (!backendResponse.ok) {
      const errorPayload =
        backendData && typeof backendData === 'object'
          ? (backendData as {
              message?: string | string[];
              error?: string;
            })
          : null;

      const backendMessage = errorPayload?.message;

      const errorMessage = Array.isArray(backendMessage)
        ? backendMessage.join('، ')
        : backendMessage ||
          errorPayload?.error ||
          `خطا در ثبت ساختار سازمانی در سرور (${backendResponse.status})`;

      return NextResponse.json(
        {
          message: errorMessage,
          data: backendData,
        },
        {
          status: backendResponse.status,
        },
      );
    }

    return NextResponse.json(
      {
        message:
          'شعب و دپارتمان‌ها با موفقیت در سیستم ثبت شدند.',
        data: backendData,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `پردازش فایل ساختار سازمانی با خطا مواجه شد: ${getErrorMessage(
          error,
        )}`,
      },
      {
        status: 500,
      },
    );
  }
}
