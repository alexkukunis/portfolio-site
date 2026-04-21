import { NextResponse } from 'next/server';
import { createCaseStudy, getCaseStudies } from '@/lib/crud';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { validateBlockContent } from '@/lib/blocks/schemas';
import type { BlockType } from '@/lib/blocks/registry';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published_only') !== 'false';

    const studies = await getCaseStudies({ publishedOnly });

    return NextResponse.json({
      success: true,
      count: studies.length,
      publishedOnly,
      caseStudies: studies.map(cs => ({
        id: cs.id,
        slug: cs.slug,
        title: cs.title,
        summary: cs.summary,
        role: cs.role,
        company: cs.company,
        year: cs.year,
        duration: cs.duration,
        coverImageUrl: cs.coverImageUrl,
        imageUrl: cs.imageUrl,
        published: cs.published,
        publishedAt: cs.publishedAt,
        createdAt: cs.createdAt,
        updatedAt: cs.updatedAt,
        blockCount: cs.blocks.length,
        blocks: cs.blocks.map(b => ({
          id: b.id,
          type: b.type,
          order: b.order,
          content: b.content,
        })),
      })),
    });
  } catch (error: any) {
    console.error('Error fetching case studies:', error);
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Failed to fetch case studies' },
      { status: 500 },
    );
  }
}

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
