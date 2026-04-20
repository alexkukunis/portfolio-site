import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export const runtime = 'nodejs';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = /^(image\/(png|jpe?g|webp|gif|svg\+xml)|video\/(mp4|webm))$/;

function extFromMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/svg+xml') return 'svg';
  return mime.split('/')[1] ?? 'bin';
}

function safeSlug(name: string): string {
  const base = name.replace(/\.[^/.]+$/, '');
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'file';
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED.test(file.type)) {
      return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (10 MB max)' }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const ext = extFromMime(file.type);
    const slug = safeSlug(file.name || 'file');
    const id = crypto.randomUUID();
    const filename = `${id}-${slug}.${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, filename), buf);

    return NextResponse.json({ url: `/uploads/${filename}`, size: buf.length, type: file.type });
  } catch (error: any) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: error?.message ?? 'Upload failed' }, { status: 500 });
  }
}
