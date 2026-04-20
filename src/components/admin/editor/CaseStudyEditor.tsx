"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditorTopBar from './EditorTopBar';
import BlockListPanel from './BlockListPanel';
import LivePreview from './LivePreview';
import {
  useCaseStudyDraft,
  useAutosave,
  draftToPayload,
  type Draft,
} from './useCaseStudyDraft';
import type { BlockType } from '@/lib/blocks/types';

function slugifyClient(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

interface Props {
  mode: 'create' | 'edit';
  initial: Draft;
}

export default function CaseStudyEditor({ mode, initial }: Props) {
  const router = useRouter();
  const { draft, dispatch } = useCaseStudyDraft(initial);
  const [manualSlugEdit, setManualSlugEdit] = useState(!!initial.slug);
  const [createError, setCreateError] = useState<string | null>(null);

  const heroTitle = useMemo(() => {
    const hero = draft.blocks.find((b) => b.type === 'hero');
    return hero?.content?.title ?? '';
  }, [draft.blocks]);

  // Auto-slugify from hero title while the user hasn't manually touched slug.
  useEffect(() => {
    if (manualSlugEdit) return;
    const next = slugifyClient(heroTitle || '');
    if (next && next !== draft.slug) {
      dispatch({ type: 'setMeta', patch: { slug: next } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroTitle, manualSlugEdit]);

  const autosave = useAutosave(draft, mode === 'edit', async (payload) => {
    if (!draft.id) return;
    const res = await fetch(`/api/case-studies/${draft.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Autosave failed');
  });

  async function handleManualSave() {
    setCreateError(null);
    if (mode === 'create') {
      try {
        const payload = draftToPayload(draft);
        const res = await fetch('/api/case-studies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.caseStudy?.id) {
          throw new Error(data?.error ?? 'Failed to create');
        }
        router.push(`/admin/case-studies/${data.caseStudy.id}/edit`);
      } catch (e: any) {
        setCreateError(e.message ?? 'Failed to create');
      }
    } else {
      // force-flush autosave
      try {
        const res = await fetch(`/api/case-studies/${draft.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draftToPayload(draft)),
        });
        if (!res.ok) throw new Error('Save failed');
        router.refresh();
      } catch (e: any) {
        setCreateError(e.message ?? 'Save failed');
      }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EditorTopBar
        mode={mode}
        slug={draft.slug}
        published={draft.published}
        saving={autosave.status}
        lastSavedAt={autosave.lastSavedAt}
        onSlugChange={(s) => {
          setManualSlugEdit(true);
          dispatch({ type: 'setMeta', patch: { slug: s } });
        }}
        onPublishedChange={(v) => dispatch({ type: 'setMeta', patch: { published: v } })}
        onSave={handleManualSave}
      />

      {createError ? (
        <div className="mx-6 mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {createError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 px-6 py-6">
        <div>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground mb-1">Blocks</h2>
            <p className="text-xs text-text-muted">Drag ⋮⋮ to reorder. Hero stays on top.</p>
          </div>
          <BlockListPanel
            blocks={draft.blocks}
            onReorder={(keys) => dispatch({ type: 'reorder', keys })}
            onContentChange={(key, content) => dispatch({ type: 'updateContent', key, content })}
            onRemove={(key) => dispatch({ type: 'removeBlock', key })}
            onAdd={(t: BlockType) => dispatch({ type: 'addBlock', blockType: t })}
          />
        </div>
        <div>
          <LivePreview blocks={draft.blocks} />
        </div>
      </div>
    </div>
  );
}
