import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

/* ── Input ────────────────────────────────────────────────── */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...rest }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">{label}</label>}
      <input
        id={inputId}
        className={`w-full px-3 py-2 bg-surface-0 border rounded-lg text-text-primary placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors
          ${error ? 'border-error' : 'border-border-default'} ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}

/* ── Textarea ─────────────────────────────────────────────── */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', id, ...rest }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">{label}</label>}
      <textarea
        id={inputId}
        className={`w-full px-3 py-2 bg-surface-0 border rounded-lg text-text-primary placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-y min-h-[80px]
          ${error ? 'border-error' : 'border-border-default'} ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}

/* ── Select ───────────────────────────────────────────────── */

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Select({ label, error, className = '', id, children, ...rest }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">{label}</label>}
      <select
        id={inputId}
        className={`w-full px-3 py-2 bg-surface-0 border rounded-lg text-text-primary
          focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors
          ${error ? 'border-error' : 'border-border-default'} ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}
