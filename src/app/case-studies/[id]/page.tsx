import { RenderBlock } from '@/components/case-study/Blocks';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function CaseStudyDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const study = await prisma.caseStudy.findUnique({
    where: { id },
    include: { blocks: { orderBy: { order: 'asc' } } },
  });

  if (!study) return notFound();

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-[#ececec] py-20 px-8">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{study.title}</h1>
        {study.blocks.map((block) => (
          <RenderBlock key={block.id} type={block.type} content={block.content as any} />
        ))}
      </article>
    </main>
  );
}
