import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createCaseStudy(data: {
  title: string;
  summary: string;
  role: string;
  company: string;
  year: string;
  duration: string;
  blocks: { type: string; content: any; order: number }[];
}) {
  return await prisma.caseStudy.create({
    data: {
      ...data,
      blocks: {
        create: data.blocks,
      },
    },
  });
}

export async function getCaseStudies() {
  return await prisma.caseStudy.findMany({
    include: { blocks: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateCaseStudy(id: string, data: any) {
  // Simplistic update - in reality, would handle blocks diffing
  return await prisma.caseStudy.update({
    where: { id },
    data,
  });
}

export async function deleteCaseStudy(id: string) {
  return await prisma.caseStudy.delete({
    where: { id },
  });
}
