/**
 * @file src/lib/auth-api.ts
 * @name auth-api.ts
 * @description مدیریت ورود، ثبت‌نام، نشست و خروج؛ حذف ارسال نقش از ثبت‌نام و اعتبارسنجی نقش کاربر.
 */

import {
  ApiClientError,
  apiClient,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from './api-client';

export type UserRole =
  | 'ADMIN'
  | 'MANAGER'
  | 'SUPPORT'
  | 'TECHNICIAN'
  | 'CUSTOMER'
  | 'USER';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  expiresAt: Date | null;
}

interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
}

function decodeBase64Url(value: string): string {
  const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/');
  const paddingLength = (4 - (normalizedValue.length % 4)) % 4;
  const paddedValue = normalizedValue.padEnd(
    normalizedValue.length + paddingLength,
    '=',
  );

  return window.atob(paddedValue);
}

function parseJwt(token: string): JwtPayload | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const [, encodedPayload] = token.split('.');

    if (!encodedPayload) {
      return null;
    }

    return JSON.parse(decodeBase64Url(encodedPayload)) as JwtPayload;
  } catch {
    return null;
  }
}

function getTokenExpirationDate(payload: JwtPayload): Date | null {
  if (!payload.exp) {
    return null;
  }

  return new Date(payload.exp * 1000);
}

function isTokenExpired(payload: JwtPayload): boolean {
  if (!payload.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
}

function isUserRole(value: string | undefined): value is UserRole {
  return (
    value === 'ADMIN' ||
    value === 'MANAGER' ||
    value === 'SUPPORT' ||
    value === 'TECHNICIAN' ||
    value === 'CUSTOMER' ||
    value === 'USER'
  );
}

function validateAndSaveToken(response: AuthResponse): AuthResponse {
  if (!response?.access_token) {
    throw new ApiClientError('توکن احراز هویت از سرور دریافت نشد.', 500);
  }

  setAccessToken(response.access_token);

  return response;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse, LoginPayload>(
    '/auth/login',
    {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    },
  );

  return validateAndSaveToken(response);
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse, RegisterPayload>(
    '/auth/register',
    {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    },
  );

  return validateAndSaveToken(response);
}

export function getCurrentUser(): AuthUser | null {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  const payload = parseJwt(token);

  if (!payload?.sub || !payload.email) {
    clearAccessToken();
    return null;
  }

  if (isTokenExpired(payload)) {
    clearAccessToken();
    return null;
  }

  return {
    id: payload.sub,
    email: payload.email,
    role: isUserRole(payload.role) ? payload.role : 'USER',
    expiresAt: getTokenExpirationDate(payload),
  };
}

export function isUserAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function logout(): void {
  clearAccessToken();
}

export function getUserDisplayName(user: AuthUser | null): string {
  if (!user) {
    return 'کاربر مهمان';
  }

  const [displayName] = user.email.split('@');

  return displayName || user.email;
}
