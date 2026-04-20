"use client";

import { type ReactNode } from 'react';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-medium uppercase tracking-wider text-text-muted">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition resize-y"
    />
  );
}

export function StringArrayEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</div>
      <div className="space-y-2">
        {safeItems.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...safeItems];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
            />
            <button
              type="button"
              onClick={() => onChange(safeItems.filter((_, j) => j !== i))}
              className="px-2 py-2 rounded-lg border border-border bg-surface text-text-muted hover:text-red-400 hover:border-red-500/40 text-xs"
              aria-label="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...safeItems, ''])}
        className="text-xs font-medium text-accent hover:text-accent/80"
      >
        + Add item
      </button>
    </div>
  );
}

/**
 * Empty placeholder for rendering images while files are being uploaded / blank.
 */
export function ImagePlaceholder({ label = 'Image' }: { label?: string }) {
  return (
    <div className="w-full aspect-video rounded-xl border border-dashed border-border bg-surface flex items-center justify-center text-text-muted text-sm">
      {label}
    </div>
  );
}
