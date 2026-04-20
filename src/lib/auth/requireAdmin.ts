import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return c.get('admin_auth')?.value === 'true';
}

export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}
