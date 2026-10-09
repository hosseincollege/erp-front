'use client';

import { Download, FileUp, Loader2, X } from 'lucide-react';
import { type ChangeEvent, useRef } from 'react';

import { usersImportSample } from '../users-json';

interface UserImportModalProps {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onImportFile: (file: File) => Promise<void>;
}

export function UserImportModal({
  isOpen,
  isSaving,
  onClose,
  onImportFile,
}: UserImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadSample = () => {
    const blob = new Blob([JSON.stringify(usersImportSample, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'users-import-sample.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void onImportFile(file);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && !isSaving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl outline-none"
        dir="rtl"
      >
        <div className="mb-5 flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="text-lg font-semibold">درون‌ریزی کاربران از JSON</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              کاربران جدید اضافه می‌شوند و رکوردهای با ایمیل یا شناسه یکسان به‌روزرسانی خواهند شد.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleDownloadSample}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
          >
            <Download className="size-4" />
            دانلود فایل نمونه JSON
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <FileUp className="size-4" />}
            {isSaving ? 'در حال پردازش فایل...' : 'انتخاب و بارگذاری فایل JSON'}
          </button>

          <p className="rounded-lg bg-muted p-3 text-xs leading-6 text-muted-foreground">
            ساختار فایل باید شامل آرایه‌ای با کلید <code>users</code> باشد. هر رکورد باید حداقل دارای <code>name</code>، <code>email</code> و <code>role</code> باشد.
          </p>
        </div>
      </div>
    </div>
  );
}
