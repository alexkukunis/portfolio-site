import { NextResponse } from 'next/server';
import { updateCaseStudy, deleteCaseStudy, setPublished, getCaseStudyById } from '@/lib/crud';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { validateBlockContent } from '@/lib/blocks/schemas';
import type { BlockType } from '@/lib/blocks/types';

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const study = await getCaseStudyById(id);
  if (!study) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ caseStudy: study });
}

export async function PUT(request: Request, { params }: Ctx) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    const data = await request.json();
    const blocks = Array.isArray(data.blocks) ? data.blocks : [];
    const sanitizedBlocks = blocks.map((b: any, i: number) => ({
      type: String(b.type),
      content: validateBlockContent(b.type as BlockType, b.content),
      order: i,
    }));

    const updated = await updateCaseStudy(id, {
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

    return NextResponse.json({ success: true, caseStudy: updated });
  } catch (error: any) {
    console.error('Error updating case study:', error);
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Failed to update' },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  try {
    await deleteCaseStudy(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? 'Failed' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  try {
    const body = await request.json();
    if (typeof body.published === 'boolean') {
      const updated = await setPublished(id, body.published);
      return NextResponse.json({ success: true, caseStudy: updated });
    }
    return NextResponse.json({ success: false, error: 'no-op' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? 'Failed' }, { status: 500 });
  }
}
