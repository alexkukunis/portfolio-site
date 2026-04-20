import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';
import CaseStudyEditor from '@/components/admin/editor/CaseStudyEditor';
import { draftFromServer } from '@/components/admin/editor/useCaseStudyDraft';
import { getCaseStudyById } from '@/lib/crud';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCaseStudyPage({ params }: Props) {
  const cookieStore = await cookies();
  const authed = cookieStore.get('admin_auth')?.value === 'true';
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <LoginForm />
      </main>
    );
  }
  const { id } = await params;
  const study = await getCaseStudyById(id);
  if (!study) return notFound();
  return <CaseStudyEditor mode="edit" initial={draftFromServer(study)} />;
}
