/**
 * @file src/components/home/authenticated-home.tsx
 * @description داشبورد اصلی کاربر لاگین‌شده (تابلو اعلانات و اطلاعیه‌های سازمانی).
 */

'use client';

import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  Megaphone,
  Pin,
  Sparkles,
} from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';

interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'عمومی' | 'مالی' | 'منابع انسانی' | 'فنی';
  date: string;
  author: string;
  isPinned?: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'NORMAL';
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'بروزرسانی زیرساخت و نگهداری دوره‌ای سرورها',
    summary: 'سامانه در روز جمعه مورخ ۲۵ مهرماه از ساعت ۰۲:۰۰ الی ۰۶:۰۰ بامداد به مدت ۴ ساعت از دسترس خارج خواهد بود.',
    content:
      'به اطلاع کلیه همکاران گرامی می‌رساند به منظور ارتقای امنیت و بهینه‌سازی پایگاه‌داده سامانه‌های یکپارچه، عملیات نگهداری فنی در بازه زمانی اعلام شده انجام خواهد گرفت. خواهشمند است قبل از این بازه، تغییرات و اسناد خود را ذخیره نمایید.',
    category: 'فنی',
    date: '۱۴۰۳/۰۷/۲۱',
    author: 'تیم فنی و زیرساخت',
    isPinned: true,
    priority: 'HIGH',
  },
  {
    id: 'ann-2',
    title: 'مهلت نهایی ثبت فاکتورها و اسناد مالی پایان ماه',
    summary: 'کلیه واحدهای سازمانی موظفند اسناد معوقه را تا حداکثر سه‌شنبه ثبت نمایند.',
    content:
      'با توجه به نزدیک شدن به روزهای پایانی ماه و نیاز به بستن حساب‌ها، لطفاً کلیه اسناد تنخواه‌گردان، پیش‌فاکتورها و رسیدهای انبار مربوطه را تا پایان ساعت اداری سه‌شنبه در ماژول حسابداری نهایی کنید.',
    category: 'مالی',
    date: '۱۴۰۳/۰۷/۲۰',
    author: 'مدیریت مالی',
    isPinned: true,
    priority: 'MEDIUM',
  },
  {
    id: 'ann-3',
    title: 'دستورالعمل جدید ثبت مرخصی و ماموریت‌های درون‌استانی',
    summary: 'فرایند تأیید مرخصی ساعتی و روزانه از طریق ماژول منابع انسانی بروز شد.',
    content:
      'از ابتدای ماه جاری، کلیه درخواست‌های مرخصی و ماموریت باید حداقل ۲۴ ساعت قبل در بخش پرسنلی سامانه ثبت و به تأیید مدیر واحد برسد. درخواست‌های کاغذی فاقد اعتبار اداری خواهند بود.',
    category: 'منابع انسانی',
    date: '۱۴۰۳/۰۷/۱۸',
    author: 'امور اداری و پرسنلی',
    isPinned: false,
    priority: 'NORMAL',
  },
  {
    id: 'ann-4',
    title: 'خوش‌آمدگویی به همکاران جدید در بخش پشتیبانی و فروش',
    summary: 'آشنایی با اعضای جدید تیم که از این هفته به خانواده ERP Pro پیوسته‌اند.',
    content:
      'با آرزوی موفقیت و پیشرفت، پیوستن همکاران محترم جدید به تیم‌های فنی و پشتیبانی را تبریک می‌گوییم و امیدواریم گام‌های مؤثری در راستای اهداف سازمان برداریم.',
    category: 'عمومی',
    date: '۱۴۰۳/۰۷/۱۵',
    author: 'روابط عمومی',
    isPinned: false,
    priority: 'NORMAL',
  },
];

function getCategoryColor(category: Announcement['category']) {
  switch (category) {
    case 'مالی':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'فنی':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'منابع انسانی':
      return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

export function AuthenticatedHome() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <AppShell>
      <div dir="rtl" className="mx-auto max-w-5xl space-y-4">
        {/* نوار بالایی اعلانات */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-3.5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Megaphone size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">
                تابلو اعلانات و اطلاعیه‌ها
              </h1>
              <p className="text-[11px] text-muted-foreground">
                آخرین اخبار، بخشنامه‌ها و هماهنگی‌های درون‌سازمانی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
            <Bell size={14} className="text-blue-500" />
            <span>{MOCK_ANNOUNCEMENTS.length} اطلاعیه فعال</span>
          </div>
        </div>

        {/* لیست اطلاعیه‌ها */}
        <div className="space-y-3">
          {MOCK_ANNOUNCEMENTS.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-2xl border bg-card transition-all duration-200 ${
                  item.isPinned
                    ? 'border-blue-500/30 shadow-sm'
                    : 'border-border shadow-xs'
                }`}
              >
                {/* بخش هدر هر اطلاعیه */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="flex cursor-pointer flex-col gap-2.5 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {item.isPinned ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                          <Pin size={14} className="rotate-45" />
                        </div>
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Info size={14} />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${getCategoryColor(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                        {item.isPinned && (
                          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                            سنجاق‌شده
                          </span>
                        )}
                        <h2 className="text-sm font-bold text-foreground">
                          {item.title}
                        </h2>
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>{item.author}</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar size={12} />
                        {item.date}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                    >
                      {isExpanded ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </button>
                  </div>
                </div>

                {/* متن کامل اطلاعیه در صورت باز شدن */}
                {isExpanded && (
                  <div className="border-t border-border/70 bg-muted/10 p-4 text-xs leading-6 text-foreground/90">
                    <p className="whitespace-pre-line">{item.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
