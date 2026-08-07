/**
 * @file src/types/auth.ts
 * @name auth.ts
 * @description حذف role از RegisterRequest و هم‌راستا کردن تایپ احراز هویت با نقش‌های امن سمت سرور.
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface UserPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "SUPPORT"
  | "TECHNICIAN"
  | "CUSTOMER"
  | "USER";
