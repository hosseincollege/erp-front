// src/lib/log-store.ts
'use client';

export type LogLevel = 'info' | 'success' | 'warning' | 'error';

export interface LogEntry {
  id: number;
  level: LogLevel;
  message: string;
  time: string;
}

type Listener = (logs: LogEntry[]) => void;

let logs: LogEntry[] = [];
let seq = 0;
const listeners = new Set<Listener>();
const MAX_LOGS = 200;

function emit() {
  for (const l of listeners) l(logs);
}

export function subscribeLogs(listener: Listener) {
  listeners.add(listener);
  listener(logs);
  return () => listeners.delete(listener);
}

export function getLogs() {
  return logs;
}

export function addLog(level: LogLevel, message: string) {
  logs = [
    ...logs.slice(-(MAX_LOGS - 1)),
    { id: ++seq, level, message, time: new Date().toLocaleTimeString('fa-IR') },
  ];
  emit();
}

export function clearLogs() {
  logs = [];
  emit();
}
