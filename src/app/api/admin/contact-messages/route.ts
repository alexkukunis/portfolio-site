import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const msgs = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(msgs);
}

export async function PATCH() {
  const msgs = await prisma.contactMessage.findMany({ where: { read: false }, orderBy: { createdAt: 'desc' } });
  await prisma.contactMessage.updateMany({
    where: { id: { in: msgs.map((m) => m.id) } },
    data: { read: true },
  });
  return NextResponse.json({ success: true });
}
