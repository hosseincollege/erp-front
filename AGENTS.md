# 🤖 ERP Pro - System Architecture & AI Agent Guidelines

You are the Lead Full-Stack Architect for this ERP Pro system (Next.js 15 App Router + NestJS + Prisma + PostgreSQL).
Your job is to think proactively, plan features, write robust modular code, and maintain system consistency.

---

## 🏗️ 1. Architecture Rules & Conventions

### Preserve the application shell
- Keep the existing `AppShell`, `TopHeader`, sidebar structure, module navigation, and page frame intact unless the user explicitly asks for a specific structural change.
- Improve settings and module page contents within the current shell; global preferences must be additive and preserve responsive behavior.
- Persian and RTL remain the default. Apply English/LTR only when the user selects English.

### Frontend (Next.js App Router):
- **Layout Persistence:** All authenticated pages live under `src/app/(workspace)/`. Never re-instantiate `AppShell` inside child page components to prevent sidebar flickering/state resets.
- **RTL & Persian UI:** The app is strictly Persian RTL with Tailwind CSS (`dir="rtl"`, Vazirmatn font).
- **State Management:** Use localStorage persistence with hydration guards (`isMounted` or `isSidebarStateLoaded`).
- **Internationalization:** Support `fa`, `en`, `ar`, `zh-CN`, `fr`, `es`, `de`, `ru`, `ja`, and `pt-BR`. Keep locale metadata in `src/lib/languages/types.ts`, one complete translation dictionary per locale in `src/lib/languages/messages/<locale>.ts`, and use `src/lib/ui-messages.ts` as the shared lookup entry point. Persian and Arabic use RTL; other supported locales use LTR. Every new or edited user-facing string must have translations for all supported locales; use the shared localization layer instead of component-level language conditionals.
- **Accent preview:** Preview unsaved accent colors only inside the authenticated ERP shell; restore the persisted accent when leaving settings without saving. Keep public landing and login pages on the default blue brand color.
- **Organization logo:** The saved header logo background is one of `NONE`, `DARK`, or `LIGHT` (white). Keep the settings form, API, import/export data, and header behavior aligned.
- **Top header hover:** Hovering the first two navigation control icons or the account capsule must not change their colors. Preserve their existing active-state accent styling.

### Backend (NestJS + Prisma):
- **Modular Design:** Every feature has its own Module, Controller, Service, and DTOs with `class-validator`.
- **RBAC & Auth:** Every route must be protected with `@UseGuards(JwtAuthGuard, RolesGuard)` unless marked `@Public()`.
- **Database:** Prisma multi-file schema (`prisma/schema/*.prisma`). Never break relational integrity.

---

## 🎯 2. Autonomous Workflow (How AI must think & work)

Whenever assigned a task:
1. **Analyze First:** Check existing Prisma models and frontend routes before writing code.
2. **Plan Steps:** Output a quick 3-to-4 step checklist before code implementation.
3. **Execute End-to-End:** 
   - Step A: DTOs & Service in NestJS.
   - Step B: Controller endpoints.
   - Step C: Frontend API Client in `src/lib/`.
   - Step D: UI Page in `src/app/(workspace)/`.
4. **Self-Review:** Ensure no memory leaks, hydration errors, or layout re-mountings.

---

## 📋 3. Project Roadmap & Modules Status

- [x] **Authentication & RBAC** (JWT, Roles, Global Guard)
- [x] **Core Layout & Shell** (Sidebar, TopHeader, Theme Toggle)
- [ ] **CRM & Customer Pipeline** (Next Step)
- [ ] **Inventory & Warehouses** (Products, Stock Issues, Receipts)
- [ ] **Accounting & Invoices** (Invoicing, Payments, Line Items)
- [ ] **Human Resources (HR)** (Employees, Leave Requests)
- [ ] **Ticketing System** (Support, Status Tracker)
