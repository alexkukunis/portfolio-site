import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export interface BlockInput {
  type: string;
  content: any;
  order: number;
}

export interface CaseStudyInput {
  slug?: string;
  title: string;
  summary: string;
  role: string;
  company: string;
  year: string;
  duration: string;
  coverImageUrl?: string | null;
  published?: boolean;
  blocks: BlockInput[];
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || `cs-${Date.now()}`;
}

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let i = 1;
  // Loop until we find a free slug
  while (true) {
    const existing = await prisma.caseStudy.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

/**
 * Pull top-level fields from the first Hero block when present.
 * Keeps listing/SEO cheap without rendering every block.
 */
function syncFromHero(data: CaseStudyInput) {
  const hero = data.blocks.find((b) => b.type === 'hero');
  if (!hero) return data;
  const c = hero.content ?? {};
  return {
    ...data,
    title: c.title ?? data.title,
    summary: c.summary ?? data.summary,
    role: c.role ?? data.role,
    company: c.company ?? data.company,
    year: c.year ?? data.year,
    duration: c.duration ?? data.duration,
    coverImageUrl: c.coverImageUrl ?? data.coverImageUrl ?? null,
  };
}

export async function createCaseStudy(input: CaseStudyInput) {
  const synced = syncFromHero(input);
  const baseSlug = slugify(synced.slug || synced.title);
  const slug = await ensureUniqueSlug(baseSlug);
  const published = synced.published ?? false;

  return prisma.caseStudy.create({
    data: {
      slug,
      title: synced.title,
      summary: synced.summary,
      role: synced.role,
      company: synced.company,
      year: synced.year,
      duration: synced.duration,
      coverImageUrl: synced.coverImageUrl ?? null,
      imageUrl: synced.coverImageUrl ?? null,
      published,
      publishedAt: published ? new Date() : null,
      blocks: {
        create: synced.blocks.map((b, i) => ({
          type: b.type,
          content: b.content as Prisma.InputJsonValue,
          order: i,
        })),
      },
    },
    include: { blocks: { orderBy: { order: 'asc' } } },
  });
}

export async function getCaseStudies(opts?: { publishedOnly?: boolean }) {
  try {
    return await prisma.caseStudy.findMany({
      where: opts?.publishedOnly ? { published: true } : undefined,
      include: { blocks: { orderBy: { order: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }
}

export async function getCaseStudyBySlug(slug: string) {
  return prisma.caseStudy.findUnique({
    where: { slug },
    include: { blocks: { orderBy: { order: 'asc' } } },
  });
}

export async function getCaseStudyById(id: string) {
  return prisma.caseStudy.findUnique({
    where: { id },
    include: { blocks: { orderBy: { order: 'asc' } } },
  });
}

export async function getCaseStudyByIdOrSlug(idOrSlug: string) {
  const bySlug = await getCaseStudyBySlug(idOrSlug);
  if (bySlug) return bySlug;
  return getCaseStudyById(idOrSlug);
}

export async function updateCaseStudy(id: string, input: CaseStudyInput) {
  const synced = syncFromHero(input);
  const wanted = slugify(synced.slug || synced.title);
  const slug = await ensureUniqueSlug(wanted, id);
  const published = synced.published ?? false;

  return prisma.$transaction(async (tx) => {
    const prev = await tx.caseStudy.findUnique({ where: { id }, select: { published: true, publishedAt: true } });
    await tx.caseStudyBlock.deleteMany({ where: { caseStudyId: id } });
    return tx.caseStudy.update({
      where: { id },
      data: {
        slug,
        title: synced.title,
        summary: synced.summary,
        role: synced.role,
        company: synced.company,
        year: synced.year,
        duration: synced.duration,
        coverImageUrl: synced.coverImageUrl ?? null,
        imageUrl: synced.coverImageUrl ?? null,
        published,
        publishedAt:
          published && !prev?.publishedAt
            ? new Date()
            : !published
            ? null
            : prev?.publishedAt ?? new Date(),
        blocks: {
          create: synced.blocks.map((b, i) => ({
            type: b.type,
            content: b.content as Prisma.InputJsonValue,
            order: i,
          })),
        },
      },
      include: { blocks: { orderBy: { order: 'asc' } } },
    });
  });
}

export async function deleteCaseStudy(id: string) {
  // onDelete: Cascade handles blocks.
  return prisma.caseStudy.delete({ where: { id } });
}

export async function setPublished(id: string, published: boolean) {
  return prisma.caseStudy.update({
    where: { id },
    data: {
      published,
      publishedAt: published ? new Date() : null,
    },
  });
}

export async function reorderBlocks(caseStudyId: string, orderedBlockIds: string[]) {
  return prisma.$transaction(
    orderedBlockIds.map((blockId, i) =>
      prisma.caseStudyBlock.update({
        where: { id: blockId },
        data: { order: i },
      }),
    ),
  );
}
