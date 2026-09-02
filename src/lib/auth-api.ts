//frontend/src/lib/auth-api.ts

import {
  apiClient,
  ApiError,
  ApiClientError,
  clearAccessToken,
  getAccessToken,
  isAuthenticated,
  setAccessToken,
} from '@/lib/api-client';

export { ApiError, ApiClientError };

export interface AuthUser {
  id?: string;
  name: string;
  email?: string;
  role?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  organizationId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthResponseUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  role?: string;
  organizationId?: string | null;
}

export interface AuthResponse {
  access_token: string;
  user: AuthResponseUser;
}

const USER_STORAGE_KEY = 'auth_user';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function getUserDisplayName(user: {
  name?: string;
  firstName?: string;
  lastName?: string;
}): string {
  if (user.name) {
    return user.name;
  }

  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return fullName || 'کاربر';
}

function normalizeUser(
  responseUser: AuthResponseUser | undefined,
  fallback: Partial<AuthUser> = {},
): AuthUser {
  const firstName = responseUser?.firstName ?? fallback.firstName;
  const lastName = responseUser?.lastName ?? fallback.lastName;

  return {
    id: responseUser?.id ?? fallback.id,
    name: getUserDisplayName({
      firstName,
      lastName,
      name: fallback.name,
    }),
    email: responseUser?.email ?? fallback.email ?? undefined,
    role: responseUser?.role ?? fallback.role ?? 'user',
    username: responseUser?.username ?? fallback.username,
    firstName,
    lastName,
    phone: responseUser?.phone ?? fallback.phone,
    organizationId: responseUser?.organizationId ?? fallback.organizationId,
  };
}

function saveUser(user: AuthUser): void {
  if (!isBrowser()) return;

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

function clearUser(): void {
  if (!isBrowser()) return;

  window.localStorage.removeItem(USER_STORAGE_KEY);
}

function persistSession(
  response: AuthResponse,
  fallbackUser: Partial<AuthUser>,
): AuthUser {
  if (response.access_token) {
    setAccessToken(response.access_token);
  }

  const user = normalizeUser(response.user, fallbackUser);
  saveUser(user);

  return user;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<
    AuthResponse,
    { identifier: string; password: string }
  >('/auth/login', {
    identifier: payload.email,
    password: payload.password,
  });

  persistSession(response, {
    name: payload.email.split('@')[0] || 'کاربر',
    email: payload.email,
  });

  return response;
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse, RegisterPayload>(
    '/auth/register',
    {
      username: payload.username,
      email: payload.email || undefined,
      phone: payload.phone || undefined,
      firstName: payload.firstName,
      lastName: payload.lastName,
      password: payload.password,
    },
  );

  persistSession(response, {
    name: `${payload.firstName} ${payload.lastName}`.trim(),
    email: payload.email,
    phone: payload.phone,
    username: payload.username,
    firstName: payload.firstName,
    lastName: payload.lastName,
  });

  return response;
}

export function getCurrentUser(): AuthUser | null {
  if (!isBrowser()) return null;

  const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    clearUser();
    return null;
  }
}

export function getCurrentOrganizationId(): string | null {
  return getCurrentUser()?.organizationId ?? null;
}

export function isUserAuthenticated(): boolean {
  return Boolean(getAccessToken() || isAuthenticated() || getCurrentUser());
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.warn('Logout request failed:', error);
  } finally {
    clearAccessToken();
    clearUser();

    if (isBrowser()) {
      window.dispatchEvent(new Event('auth:logout'));
    }
  }
}
