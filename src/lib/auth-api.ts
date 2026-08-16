/**
 * @file src/lib/auth-api.ts
 * @description توابع احراز هویت ERP Pro هماهنگ با api-client.ts
 */

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
}

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
  access_token?: string;
  user?: AuthUser;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  username?: string;
  [key: string]: unknown;
}

const USER_STORAGE_KEY = 'auth_user';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function normalizeUser(
  payload: Partial<AuthResponse> | undefined,
  fallback: Partial<AuthUser> = {},
): AuthUser {
  const source = payload?.user ?? payload ?? {};

  return {
    id: source.id,
    name: source.name || fallback.name || 'کاربر',
    email: source.email || fallback.email,
    role: source.role || fallback.role || 'user',
    username: source.username || fallback.username,
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
  const token = response.access_token;
  if (token) {
    setAccessToken(token);
  }

  const user = normalizeUser(response, fallbackUser);
  saveUser(user);
  return user;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse, {
    identifier: string;
    password: string;
  }>('/auth/login', {
    identifier: payload.email,
    password: payload.password,
  });

  persistSession(response, {
    name: payload.email.split('@')[0] || 'کاربر',
    email: payload.email,
  });

  return response;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse, RegisterPayload>(
    '/auth/register',
    {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
  );

  persistSession(response, {
    name: payload.name,
    email: payload.email,
  });

  return response;
}

export function getCurrentUser(): AuthUser | null {
  if (!isBrowser()) return null;

  const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    clearUser();
    return null;
  }
}

export function isUserAuthenticated(): boolean {
  return isAuthenticated() || getCurrentUser() !== null || getAccessToken() !== null;
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
