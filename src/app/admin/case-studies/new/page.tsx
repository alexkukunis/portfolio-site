import CaseStudyEditor from '@/components/admin/editor/CaseStudyEditor';
import { makeEmptyDraft } from '@/components/admin/editor/useCaseStudyDraft';
import { cookies } from 'next/headers';
import LoginForm from '@/components/admin/LoginForm';

export default async function NewCaseStudyPage() {
  const cookieStore = await cookies();
  const authed = cookieStore.get('admin_auth')?.value === 'true';
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <LoginForm />
      </main>
    );
  }
  return <CaseStudyEditor mode="create" initial={makeEmptyDraft()} />;
}
