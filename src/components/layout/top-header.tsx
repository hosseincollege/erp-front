/**
 * @file src/components/layout/top-header.tsx
 * @description هدر اصلی ERP Pro با فونت اصلاح شده و لوگوی لینک‌دار.
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, AuthUser } from '@/lib/auth-api';
import { Menu, User, LogOut, ChevronDown, Bell, ShieldCheck } from 'lucide-react';

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export function TopHeader({ onToggleSidebar }: TopHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    const handleAuth = () => setUser(getCurrentUser());
    window.addEventListener('auth:logout', handleAuth);
    window.addEventListener('storage', handleAuth);
    return () => {
      window.removeEventListener('auth:logout', handleAuth);
      window.removeEventListener('storage', handleAuth);
    };
  }, []);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-5 sticky top-0 z-50" dir="rtl">
      <div className="flex items-center gap-5">
        <button 
          onClick={onToggleSidebar}
          className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
        >
          <Menu size={22} />
        </button>

        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:rotate-12 transition-transform">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
            ERP <span className="text-blue-500 text-lg font-medium italic">Pro</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-white transition relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-slate-800/80 border border-slate-800 transition-all"
          >
            <div className="text-right ml-1">
              {/* افزایش سایز فونت نام کاربر */}
              <p className="text-sm font-bold text-slate-100">{user?.name || 'کاربر سیستم'}</p>
              <p className="text-[10px] text-blue-400 font-medium">{user?.role || 'مدیر ارشد'}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black shadow-inner">
              {user?.name ? user.name[0] : <User size={20} />}
            </div>
            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-800/50 mb-1">
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-semibold">خروج از حساب</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
