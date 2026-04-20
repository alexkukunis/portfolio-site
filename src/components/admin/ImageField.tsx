"use client";

import { useRef, useState } from 'react';
import { ImagePlaceholder } from '@/lib/blocks/components/shared';

interface ImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageField({ value, onChange, label = 'Image' }: ImageFieldProps) {
  const [mode, setMode] = useState<'upload' | 'url'>(value ? 'url' : 'upload');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || `Upload failed (${res.status})`);
      }
      const data = await res.json();
      if (!data.url) throw new Error('Upload returned no URL');
      onChange(data.url);
    } catch (e: any) {
      setError(e.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</span>
        <div className="flex text-xs rounded-md border border-border bg-surface overflow-hidden">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 ${mode === 'upload' ? 'bg-accent text-white' : 'text-text-muted'}`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 ${mode === 'url' ? 'bg-accent text-white' : 'text-text-muted'}`}
          >
            URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl border border-dashed border-border bg-surface hover:border-accent/60 transition cursor-pointer p-4 text-center"
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="mx-auto max-h-48 rounded-lg object-cover" />
          ) : (
            <ImagePlaceholder label={uploading ? 'Uploading…' : 'Drop image or click to upload'} />
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
          />
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="max-h-48 rounded-lg border border-border object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      )}
    </div>
  );
}
