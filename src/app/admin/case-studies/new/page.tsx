import CaseStudyEditor from '@/components/admin/editor/CaseStudyEditor';
import { cookies } from 'next/headers';
import LoginForm from '@/components/admin/LoginForm';
import type { DraftBlock } from '@/components/admin/editor/useCaseStudyDraft';

function makeEmptyDraftDraft(): { slug: string; published: boolean; blocks: DraftBlock[] } {
  return {
    slug: '',
    published: false,
    blocks: [
      { key: Math.random().toString(36).slice(2, 10), type: 'hero', content: { title: '', summary: '', role: '', company: '' } },
    ],
  };
}

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
  return <CaseStudyEditor mode="create" initial={makeEmptyDraftDraft()} />;
}
