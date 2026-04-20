import { cookies } from 'next/headers';
import LoginForm from '@/components/admin/LoginForm';
import { getCaseStudies } from '@/lib/crud';
import Link from 'next/link';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950">
        <LoginForm />
      </main>
    );
  }

  const caseStudies = await getCaseStudies();

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/new" className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-slate-200">
          + New Case Study
        </Link>
      </div>

      <div className="grid gap-4">
        {caseStudies.map((study) => (
          <div key={study.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{study.title}</h3>
              <p className="text-sm text-slate-400">{study.company}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/edit/${study.id}`} className="text-slate-400 hover:text-white">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
