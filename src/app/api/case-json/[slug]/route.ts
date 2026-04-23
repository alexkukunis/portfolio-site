import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { validateBlockContent } from '@/lib/blocks/schemas';
import type { BlockType } from '@/lib/blocks/types';
import { getCaseStudyBySlug, updateCaseStudy } from '@/lib/crud';
import type { CaseStudyInput } from '@/lib/crud';

interface Ctx {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: Ctx) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) {
    return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
  }
  const jsonData = {
    meta: {
      slug: caseStudy.slug,
      published: caseStudy.published,
    },
    blocks: caseStudy.blocks.map((b) => ({
      type: b.type,
      content: b.content,
    })),
  };
  return NextResponse.json(jsonData);
}

export async function PATCH(request: Request, { params }: Ctx) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { slug } = await params;
  try {
    const data = await request.json() as { meta?: { published?: boolean }; blocks: any[] };
    const caseStudy = await getCaseStudyBySlug(slug);
    if (!caseStudy) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    const input: CaseStudyInput = {
      title: caseStudy.title,
      summary: caseStudy.summary,
      role: caseStudy.role,
      company: caseStudy.company,
      year: caseStudy.year,
      duration: caseStudy.duration,
      coverImageUrl: caseStudy.coverImageUrl ?? null,
      published: data.meta?.published ?? caseStudy.published,
      blocks: data.blocks.map((b, i) => ({
        type: b.type as string,
        content: validateBlockContent(b.type as BlockType, b.content),
        order: i,
      })),
    };

    // Extract hero updates if present
    const hero = input.blocks.find((b) => b.type === 'hero');
    if (hero) {
      const c = hero.content;
      input.title = c.title ?? input.title;
      input.summary = c.summary ?? input.summary;
      input.role = c.role ?? input.role;
      input.company = c.company ?? input.company;
      input.year = c.year ?? input.year;
      input.duration = c.duration ?? input.duration;
      input.coverImageUrl = c.coverImageUrl ?? input.coverImageUrl;
    }

    const updated = await updateCaseStudy(caseStudy.id, input);

    const jsonData = {
      meta: { slug: updated.slug, published: updated.published },
      blocks: updated.blocks.map((b) => ({
        type: b.type,
        content: b.content,
      })),
    };
    return NextResponse.json({ success: true, jsonData });
  } catch (error: any) {
    console.error('Error updating case study JSON:', error);
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Failed to update' },
      { status: 500 },
    );
  }
}
