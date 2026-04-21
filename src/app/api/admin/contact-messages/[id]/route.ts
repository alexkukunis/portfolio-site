import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  await prisma.contactMessage.delete({
    where: { id },
  });
  return NextResponse.json({ success: true });
}
