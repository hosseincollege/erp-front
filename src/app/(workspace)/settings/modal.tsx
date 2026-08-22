// File: frontend/src/app/(workspace)/settings/modal.tsx
"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function SettingsModal({ isOpen, onClose, title, children }: ModalProps) {
  // بستن مودال با کلید Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-md rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* هدر مودال */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* محتوای مودال */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
