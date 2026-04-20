import { NextResponse } from 'next/server';
import { createCaseStudy } from '@/lib/crud';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { validateBlockContent } from '@/lib/blocks/schemas';
import type { BlockType } from '@/lib/blocks/types';

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const data = await request.json();
    const blocks = Array.isArray(data.blocks) ? data.blocks : [];

    const sanitizedBlocks = blocks.map((b: any, i: number) => ({
      type: String(b.type),
      content: validateBlockContent(b.type as BlockType, b.content),
      order: i,
    }));

    const created = await createCaseStudy({
      slug: data.slug,
      title: data.title ?? '',
      summary: data.summary ?? '',
      role: data.role ?? '',
      company: data.company ?? '',
      year: data.year ?? '',
      duration: data.duration ?? '',
      coverImageUrl: data.coverImageUrl ?? null,
      published: !!data.published,
      blocks: sanitizedBlocks,
    });

    return NextResponse.json({ success: true, caseStudy: created });
  } catch (error: any) {
    console.error('Error creating case study:', error);
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Failed to create case study' },
      { status: 500 },
    );
  }
}
