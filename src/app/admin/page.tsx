import { cookies } from 'next/headers';
import LoginForm from '@/components/admin/LoginForm';
import LogoutButton from '@/components/admin/LogoutButton';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminCaseStudyTable from '@/components/admin/AdminCaseStudyTable';
import { getCaseStudies } from '@/lib/crud';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <LoginForm />
      </main>
    );
  }

  const caseStudies = await getCaseStudies();
  const rows = caseStudies.map((c) => ({
    id: c.id,
    slug: c.slug ?? null,
    title: c.title,
    company: c.company,
    updatedAt: c.updatedAt,
    published: c.published,
  }));

  return (
    <div className="flex bg-background min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-10 max-w-[1400px]">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Case studies</h1>
            <p className="text-text-muted mt-1">Manage everything on your portfolio.</p>
          </div>
          <LogoutButton />
        </div>
        <AdminCaseStudyTable initial={rows} />
      </main>
    </div>
  );
}
