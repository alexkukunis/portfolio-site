"use client";

import Link from 'next/link';
import type { SaveStatus } from './useCaseStudyDraft';

interface Props {
  mode: 'create' | 'edit';
  slug: string;
  published: boolean;
  saving: SaveStatus;
  lastSavedAt: Date | null;
  onSlugChange: (s: string) => void;
  onPublishedChange: (v: boolean) => void;
  onSave: () => void;
  saveLabel?: string;
}

function formatSaved(status: SaveStatus, at: Date | null) {
  if (status === 'saving') return 'Saving…';
  if (status === 'error') return 'Save failed';
  if (status === 'saved' && at) {
    const secs = Math.max(1, Math.floor((Date.now() - at.getTime()) / 1000));
    if (secs < 60) return `Saved · ${secs}s ago`;
    const mins = Math.floor(secs / 60);
    return `Saved · ${mins}m ago`;
  }
  return 'Ready';
}

export default function EditorTopBar({
  mode,
  slug,
  published,
  saving,
  lastSavedAt,
  onSlugChange,
  onPublishedChange,
  onSave,
  saveLabel,
}: Props) {
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center gap-4 px-6 py-3">
        <Link href="/admin" className="text-sm text-text-muted hover:text-foreground">
          ← Admin
        </Link>
        <div className="h-5 w-px bg-border" />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs uppercase tracking-wider text-text-muted">Slug</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="my-case-study"
            className="flex-1 max-w-sm rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-mono text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">{formatSaved(saving, lastSavedAt)}</span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-xs text-text-muted">{published ? 'Published' : 'Draft'}</span>
          <span
            role="switch"
            aria-checked={published}
            onClick={() => onPublishedChange(!published)}
            className={`relative inline-flex h-5 w-9 rounded-full transition ${
              published ? 'bg-accent' : 'bg-border'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                published ? 'translate-x-4' : ''
              }`}
            />
          </span>
        </label>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition"
        >
          {saveLabel ?? (mode === 'create' ? 'Create' : 'Save')}
        </button>
      </div>
    </div>
  );
}
