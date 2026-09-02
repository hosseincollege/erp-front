// File: frontend/src/app/api/settings/import/users-roles/route.ts
// Frontend API Route - اعتبارسنجی و ارسال کاربران، نقش‌ها و دسترسی‌ها به بک‌اند

import { NextResponse } from 'next/server';

interface RoleImportItem {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  permissions?: unknown;
}

interface UserImportItem {
  fullName?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  roleName?: unknown;
  role?: unknown;
  isActive?: unknown;
PayloadLike {
  organizationId?: unknown;
  sub?: unknown;
}

function;
}

interface JwtPayloadLike {
  organizationId?: unknown;
  sub?: unknown;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'خطای ناشناخته‌ای رخ داد.';
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === 'string';
}

function validateRole(rawRole: unknown, index: number): string | null {
  if (!rawRole || typeof rawRole !== 'object' || Array.isArray(rawRole)) {
    return `اطلاعات نقش در ردیف ${index + 1} معتبر نیست.`;
  }

  const role = rawRole as RoleImportItem;

  if (typeof role.name !== 'string' || !role.name.trim()) {
    return `نام نقش در ردیف ${index + 1} الزامی است.`;
  }

  if (!isOptionalString(role.description)) {
    return `فیلد «description» در نقش ردیف ${index + 1} باید از نوع متن باشد.`;
  }

  if (
    role.permissions !== undefined &&
    role.permissions !== null &&
    !Array.isArray(role.permissions)
  ) {
    return `فیلد «permissions» در نقش ردیف ${index + 1} باید یک آرایه باشد.`;
  }

  return null;
}

function validateUser(rawUser: unknown, index: number): string | null {
  if (!rawUser || typeof rawUser !== 'object' || Array.isArray(rawUser)) {
    return `اطلاعات کاربر در ردیف ${index + 1} معتبر نیست.`;
  }

  const user = rawUser as UserImportItem;

  const hasName =
    (typeof user.fullName === 'string' && !!user.fullName.trim()) ||
    (typeof user.firstName === 'string' && !!user.firstName.trim()) ||
    (typeof user.lastName === 'string' && !!user.lastName.trim());

  if (!hasName) {
    return `نام کاربر در ردیف ${index + 1} الزامی است (fullName یا firstName/lastName).`;
  }

  if (!isOptionalString(user.email)) {
    return `فیلد «email» در کاربر ردیف ${index + 1} باید از نوع متن باشد.`;
  }

  if (!isOptionalString(user.phone)) {
    return `فیلد «phone» در کاربر ردیف ${index + 1} باید از نوع متن باشد.`;
  }

  if (
    typeof user.email === 'string' &&
    user.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
  ) {
    return `ایمیل کاربر در ردیف ${index + 1} معتبر نیست.`;
  }

  if (!isOptionalString(user.roleName) && !isOptionalString(user.role)) {
    return `فیلد نقش کاربر در ردیف ${index + 1} باید از نوع متن باشد.`;
  }

  if (
    user.isActive !== undefined &&
    user.isActive !== null &&
    typeof user.isActive !== 'boolean'
  ) {
    return `فیلد «isActive» در کاربر ردیف ${index + 1} باید true یا false باشد.`;
  }

  return null;
}

function extractOrganizationId(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');

  if (cookieHeader) {
    const cookies = cookieHeader.split(';');

    for (const cookie of cookies) {
      const [rawKey, ...rest] = cookie.trim().split('=');
      const key = rawKey.trim();
      const value = rest.join('=').trim();

      if (
        (key === 'auth_token' || key === 'token' || key === 'access_token') &&
        value
      ) {
        try {
          const payloadPart = value.split('.')[1];

          if (payloadPart) {
            const payload = JSON.parse(
              Buffer.from(payloadPart, 'base64').toString('utf-8'),
            ) as JwtPayloadLike;

            if (
              typeof payload.organizationId === 'string' &&
              payload.organizationId
            ) {
              return payload.organizationId;
            }
          }
        } catch {
          // توکن قابل خواندن نیست؛ ادامه می‌دهیم
        }
      }
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UsersRolesImportBody;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { message: 'ساختار فایل JSON معتبر نیست.' },
        { status: 400 },
      );
    }

    const roles = body.roles ?? [];
    const users = body.users ?? [];

    if (!Array.isArray(roles)) {
      return NextResponse.json(
        { message: 'فیلد «roles» باید یک آرایه باشد.' },
        { status: 400 },
      );
    }

    if (!Array.isArray(users)) {
      return NextResponse.json(
        { message: 'فیلد «users» باید یک آرایه باشد.' },
        { status: 400 },
      );
    }

    if (roles.length === 0 && users.length === 0) {
      return NextResponse.json(
        { message: 'فایل باید حداقل شامل یک کاربر یا یک نقش باشد.' },
        { status: 400 },
      );
    }

    for (let index = 0; index < roles.length; index += 1) {
      const validationError = validateRole(roles[index], index);

      if (validationError) {
        return NextResponse.json({ message: validationError }, { status: 400 });
      }
    }

    for (let index = 0; index < users.length; index += 1) {
      const validationError = validateUser(users[index], index);

      if (validationError) {
        return NextResponse.json({ message: validationError }, { status: 400 });
      }
    }

    const organizationId = extractOrganizationId(request);

    if (!organizationId) {
      return NextResponse.json(
        {
          message:
            'شناسه سازمان (organizationId) در توکن یا کوکی احراز هویت یافت نشد. لطفاً دوباره وارد شوید.',
        },
        { status: 401 },
      );
    }

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

    const warnings: string[] = [];

    /**
     * نقش‌ها: بک‌اند endpoint واقعی دارد (PUT roles/:organizationId)
     */
    if (roles.length > 0) {
      const rolesPayload = (roles as RoleImportItem[]).map((role) => ({
        ...(typeof role.id === 'string' && role.id
          ? { id: role.id }
          : {}),
        name: (role.name as string).trim(),
        description:
          typeof role.description === 'string'
            ? role.description.trim() || undefined
            : undefined,
        permissions: Array.isArray(role.permissions)
          ? role.permissions
          : [],
      }));

      const rolesResponse = await fetch(
        `${backendBaseUrl}/settings/roles/${organizationId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(rolesPayload),
          cache: 'no-store',
        },
      );

      let rolesData: unknown = null;

      try {
        rolesData = await rolesResponse.json();
      } catch {
        rolesData = null;
      }

      if (!rolesResponse.ok) {
        const errorPayload =
          rolesData && typeof rolesData === 'object'
            ? (rolesData as { message?: string | string[]; error?: string })
            : null;

        const backendMessage = errorPayload?.message;

        const errorMessage = Array.isArray(backendMessage)
          ? backendMessage.join('، ')
          : backendMessage ||
            errorPayload?.error ||
            `خطا در ذخیره نقش‌ها در سرور (${rolesResponse.status})`;

        return NextResponse.json(
          { message: errorMessage, data: rolesData },
          { status: rolesResponse.status },
        );
      }
    }

    /**
     * کاربران: بک‌اند هنوز endpoint ایمپورت کاربر ندارد
     */
    if (users.length > 0) {
      warnings.push(
        'ایمپورت کاربران هنوز در بک‌اند پیاده‌سازی نشده است؛ کاربران فایل اعتبارسنجی شدند اما در سیستم ثبت نشدند.',
      );
    }

    return NextResponse.json(
      {
        message:
          users.length > 0
            ? `${roles.length.toLocaleString('fa-IR')} نقش با موفقیت ذخیره شد و ${users.length.toLocaleString('fa-IR')} کاربر اعتبارسنجی شد (ثبت کاربران در دسترس نیست).`
            : `${roles.length.toLocaleString('fa-IR')} نقش با موفقیت ذخیره شد.`,
        data: {
          rolesSaved: roles.length,
          usersValidatedOnly: users.length,
          warnings,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `پردازش فایل کاربران و نقش‌ها با خطا مواجه شد: ${getErrorMessage(error)}`,
      },
      { status: 500 },
    );
  }
}
