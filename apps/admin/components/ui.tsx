'use client';

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { initials } from '@/lib/format';

/* ── Button ───────────────────────────────────────────────────────────────── */

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  // Ink text on lime, never white — the brand rule the app follows too.
  primary: 'bg-lime text-ink hover:bg-lime-dark border-transparent',
  secondary: 'bg-surface text-ink hover:bg-surfaceAlt border-lineStrong',
  danger: 'bg-surface text-danger hover:bg-danger/10 border-danger/40',
  ghost: 'bg-transparent text-muted hover:bg-surfaceAlt border-transparent',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  size?: 'sm' | 'md';
}

export function Button({
  variant = 'secondary',
  loading = false,
  size = 'md',
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
      } ${VARIANTS[variant]} ${className}`}
    >
      {loading && (
        <span
          aria-hidden
          className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}

/* ── Surfaces ─────────────────────────────────────────────────────────────── */

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-card border border-line bg-surface shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, tone }: { label: string; value: ReactNode; tone?: 'lime' | 'plain' }) {
  return (
    <div
      className={`rounded-card border p-4 ${
        tone === 'lime' ? 'border-transparent bg-lime' : 'border-line bg-surface'
      }`}
    >
      <p className={`text-xs font-semibold ${tone === 'lime' ? 'text-ink/70' : 'text-muted'}`}>{label}</p>
      <p className="mt-1 text-3xl font-black text-ink">{value}</p>
    </div>
  );
}

/* ── Status ───────────────────────────────────────────────────────────────── */

const STATUS_TONES: Record<string, string> = {
  approved: 'bg-ok/15 text-ok',
  going: 'bg-ok/15 text-ok',
  completed: 'bg-ok/15 text-ok',
  active: 'bg-ok/15 text-ok',
  pending: 'bg-warn/15 text-warn',
  waiting: 'bg-warn/15 text-warn',
  in_progress: 'bg-warn/15 text-warn',
  submitted: 'bg-info/15 text-info',
  assigned: 'bg-info/15 text-info',
  rejected: 'bg-danger/15 text-danger',
  cancelled: 'bg-danger/15 text-danger',
  withdrawn: 'bg-faint/20 text-muted',
  draft: 'bg-faint/20 text-muted',
};

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONES[status] ?? 'bg-faint/20 text-muted';
  const label = status.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  return (
    <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${tone}`}>
      {label}
    </span>
  );
}

export function Avatar({ name, size = 40 }: { name?: string | null; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-lime-tint font-bold text-ink"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials(name)}
    </div>
  );
}

/* ── Feedback ─────────────────────────────────────────────────────────────── */

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-card border border-dashed border-lineStrong bg-surface px-6 py-12 text-center">
      <p className="font-semibold text-ink">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-muted">
      <span
        aria-hidden
        className="h-5 w-5 animate-spin rounded-full border-2 border-lineStrong border-t-ink"
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export function ErrorNote({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div
      role="alert"
      className="mb-4 flex items-start justify-between gap-3 rounded-card border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 font-semibold underline">
          Dismiss
        </button>
      )}
    </div>
  );
}

/* ── Form controls ────────────────────────────────────────────────────────── */

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const CONTROL =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-faint focus:border-ink';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${CONTROL} ${props.className ?? ''}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${CONTROL} ${props.className ?? ''}`} />;
}

export function Select(props: InputHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const { children, className, ...rest } = props;
  return (
    <select {...(rest as object)} className={`${CONTROL} ${className ?? ''}`}>
      {children}
    </select>
  );
}

/* ── Filter pills ─────────────────────────────────────────────────────────── */

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  counts,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
  counts?: Partial<Record<T, number>>;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
              active
                ? 'border-ink bg-ink text-white'
                : 'border-line bg-surface text-muted hover:bg-surfaceAlt'
            }`}
          >
            {opt.label}
            {counts?.[opt.key] !== undefined && (
              <span
                className={`rounded-full px-1.5 text-xs ${
                  active ? 'bg-white/20 text-white' : 'bg-surfaceAlt text-muted'
                }`}
              >
                {counts[opt.key]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Table ────────────────────────────────────────────────────────────────── */

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <tr className="border-b border-line last:border-0 hover:bg-surfaceAlt/60">{children}</tr>;
}

export function Cell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle text-ink ${className}`}>{children}</td>;
}
