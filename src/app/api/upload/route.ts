import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export const runtime = 'nodejs';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = /^(image\/(png|jpe?g|webp|gif|svg\+xml)|video\/(mp4|webm))$/;

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

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
      return NextResponse.json({ error: 'File too large (5 MB max)' }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const b64 = buf.toString('base64');
    const id = crypto.randomUUID();
    const dataUrl = `data:${file.type};base64,${b64}`;

    return NextResponse.json({
      id,
      url: dataUrl,
      fileName: file.name,
      size: buf.length,
      type: file.type,
    });
  } catch (error: any) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: error?.message ?? 'Upload failed' }, { status: 500 });
  }
}
