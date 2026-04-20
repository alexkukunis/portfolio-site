"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { blockRegistry } from '@/lib/blocks/registry';
import type { BlockType, BlockContentMap } from '@/lib/blocks/types';

export interface DraftBlock {
  key: string; // local-only id for React list + dnd
  id?: string; // db id if persisted
  type: BlockType;
  content: any;
}

export interface Draft {
  id?: string;
  slug: string;
  published: boolean;
  blocks: DraftBlock[];
}

type Action =
  | { type: 'set'; draft: Draft }
  | { type: 'setMeta'; patch: Partial<Pick<Draft, 'slug' | 'published'>> }
  | { type: 'addBlock'; blockType: BlockType; index?: number }
  | { type: 'removeBlock'; key: string }
  | { type: 'updateContent'; key: string; content: any }
  | { type: 'reorder'; keys: string[] };

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function reducer(state: Draft, action: Action): Draft {
  switch (action.type) {
    case 'set':
      return action.draft;
    case 'setMeta':
      return { ...state, ...action.patch };
    case 'addBlock': {
      const def = blockRegistry[action.blockType];
      const block: DraftBlock = {
        key: uid(),
        type: action.blockType,
        content: structuredClone(def.defaultContent),
      };
      const blocks = [...state.blocks];
      const idx = action.index ?? blocks.length;
      blocks.splice(idx, 0, block);
      return { ...state, blocks };
    }
    case 'removeBlock':
      return { ...state, blocks: state.blocks.filter((b) => b.key !== action.key) };
    case 'updateContent':
      return {
        ...state,
        blocks: state.blocks.map((b) => (b.key === action.key ? { ...b, content: action.content } : b)),
      };
    case 'reorder': {
      const map = new Map(state.blocks.map((b) => [b.key, b]));
      const blocks = action.keys.map((k) => map.get(k)!).filter(Boolean);
      return { ...state, blocks };
    }
    default:
      return state;
  }
}

export function makeEmptyDraft(): Draft {
  return {
    slug: '',
    published: false,
    blocks: [
      {
        key: uid(),
        type: 'hero',
        content: structuredClone(blockRegistry.hero.defaultContent as BlockContentMap['hero']),
      },
    ],
  };
}

export function draftFromServer(cs: any): Draft {
  return {
    id: cs.id,
    slug: cs.slug ?? '',
    published: !!cs.published,
    blocks: (cs.blocks ?? []).map((b: any) => ({
      key: uid(),
      id: b.id,
      type: b.type as BlockType,
      content: b.content,
    })),
  };
}

export function draftToPayload(draft: Draft, heroTitle?: string) {
  const hero = draft.blocks.find((b) => b.type === 'hero')?.content ?? {};
  return {
    slug: draft.slug,
    title: hero.title ?? heroTitle ?? 'Untitled',
    summary: hero.summary ?? '',
    role: hero.role ?? '',
    company: hero.company ?? '',
    year: hero.year ?? '',
    duration: hero.duration ?? '',
    coverImageUrl: hero.coverImageUrl ?? null,
    published: draft.published,
    blocks: draft.blocks.map((b, i) => ({ type: b.type, content: b.content, order: i })),
  };
}

export function useCaseStudyDraft(initial: Draft) {
  const [draft, dispatch] = useReducer(reducer, initial);
  return { draft, dispatch };
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useAutosave(
  draft: Draft,
  enabled: boolean,
  save: (payload: ReturnType<typeof draftToPayload>) => Promise<void>,
) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRun = useRef(true);

  const trigger = useCallback(() => {
    if (!enabled) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setStatus('saving');
      try {
        await save(draftToPayload(draft));
        setStatus('saved');
        setLastSavedAt(new Date());
      } catch (e) {
        setStatus('error');
      }
    }, 1500);
  }, [draft, enabled, save]);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    trigger();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(draft)]);

  return { status, lastSavedAt };
}
