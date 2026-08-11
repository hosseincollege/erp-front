/**
 * @file src/lib/auth-api.ts
 * @description رفع خطای نبود getCurrentUser و هماهنگی با قراردادهای Identifier-based
 */

import { apiClient, clearAccessToken, setAccessToken, getAccessToken } from "./api-client";

// صادر کردن تایپ مورد نیاز صفحه اصلی
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role?: string;
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

/**
 * دریافت اطلاعات کاربر فعلی
 * در نسخه‌های پیشرفته‌تر این داده از دیکود کردن JWT یا درخواست به /auth/me می‌آید.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isUserAuthenticated()) return null;
  
  try {
    // تلاش برای دریافت پروفایل از بک‌اِند
    const user = await apiClient.get<AuthUser>("/auth/me");
    return user;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

/**
 * بررسی وضعیت احراز هویت
 */
export function isUserAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!getAccessToken();
}

/**
 * ورود کاربر با فیلد identifier
 */
export async function login(payload: LoginPayload): Promise<any> {
  const response = await apiClient.post<any, any>("/auth/login", {
    identifier: payload.email.trim().toLowerCase(),
    password: payload.password,
  });

  if (response?.access_token) {
    setAccessToken(response.access_token);
  }
  return response;
}

/**
 * ثبت‌نام با تفکیک نام برای سازگاری با مدل دیتابیس
 */
export async function register(payload: RegisterPayload): Promise<any> {
  const nameParts = payload.name.trim().split(" ");
  const firstName = nameParts[0] || "User";
  const lastName = nameParts.slice(1).join(" ") || "-";
  const username = payload.email.split("@")[0] + "_" + Math.floor(Math.random() * 100);

  const response = await apiClient.post<any, any>("/auth/register", {
    username,
    firstName,
    lastName,
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  });

  if (response?.access_token) {
    setAccessToken(response.access_token);
  }
  return response;
}

/**
 * خروج از سیستم
 */
export function logout(): void {
  clearAccessToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

/**
 * تابع کمکی برای نمایش نام در UI
 */
export function getUserDisplayName(user: AuthUser | null): string {
  if (!user) return "کاربر مهمان";
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
  return user.username || user.email;
}
