import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === 'alexkukunis' && password === 'Igotbapes1!') {
    (await cookies()).set('admin_auth', 'true', { httpOnly: true, secure: true, path: '/' });
    return Response.json({ success: true });
  }

  return Response.json({ success: false }, { status: 401 });
}
