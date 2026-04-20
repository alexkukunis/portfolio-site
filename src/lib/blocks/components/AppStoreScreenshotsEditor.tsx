"use client";

import { useState } from 'react';
import type { AppStoreScreenshotsContent } from '../types';
import type { EditorProps } from '../types';
import { Field, TextInput, ImagePlaceholder } from './shared';
import { appStoreScreenshotsDefault } from './AppStoreScreenshotsBlock';

export function AppStoreScreenshotsEditor({ value, onChange }: EditorProps<'appstore-screenshots'>) {
  const screenshots = Array.isArray(value.screenshots) ? value.screenshots : appStoreScreenshotsDefault.screenshots;
  const update = (patch: Partial<AppStoreScreenshotsContent>) => onChange({ ...value, ...patch });
  const [uploading, setUploading] = useState<Record<number, boolean>>({});

  const updateScreenshot = (i: number, patch: Partial<{ url: string; alt: string }>) => {
    const next = [...screenshots];
    next[i] = { ...next[i], ...patch };
    update({ screenshots: next });
  };

  const addScreenshot = () => {
    update({ screenshots: [...screenshots, { url: '', alt: `Screen ${screenshots.length + 1}` }] });
  };

  const removeScreenshot = (i: number) => {
    update({ screenshots: screenshots.filter((_, idx) => idx !== i) });
  };

  async function handleFile(i: number, file: File) {
    setUploading((prev) => ({ ...prev, [i]: true }));
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) updateScreenshot(i, { url: data.url });
    setUploading((prev) => ({ ...prev, [i]: false }));
  }

  return (
    <div className="space-y-3">
      <Field label="Section title">
        <TextInput value={value.title} onChange={(v) => update({ title: v })} placeholder="Screens" />
      </Field>
      <Field label="Subtitle">
        <TextInput value={value.subtitle} onChange={(v) => update({ subtitle: v })} placeholder="Key screens from the app" />
      </Field>
      <div className="pt-2" />
      {screenshots.map((ss, i) => {
        const isUploading = uploading[i] ?? false;
        return (
          <div key={i} className="p-3 rounded-lg border border-border space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-text-muted">Screenshot {i + 1}</div>
              <button
                type="button"
                onClick={() => removeScreenshot(i)}
                className="text-xs text-red-400 underline"
              >
                Remove
              </button>
            </div>
            <Field label="Alt label">
              <TextInput value={ss.alt} onChange={(v) => updateScreenshot(i, { alt: v })} placeholder={`Screen ${i + 1}`} />
            </Field>
            {ss.url ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ss.url} alt="" className="max-h-40 rounded-lg border border-border object-contain" />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateScreenshot(i, { url: '' })}
                    className="text-xs text-red-400 underline"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = () => {
                    const file = input.files?.[0];
                    if (file) handleFile(i, file);
                  };
                  input.click();
                }}
                className="cursor-pointer"
              >
                <ImagePlaceholder label={isUploading ? 'Uploading…' : 'Drop or click to upload screenshot'} />
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={addScreenshot}
        className="w-full py-2 rounded-lg border border-dashed border-border text-sm text-text-muted hover:text-foreground hover:border-accent transition"
      >
        + Add Screenshot
      </button>
    </div>
  );
}
