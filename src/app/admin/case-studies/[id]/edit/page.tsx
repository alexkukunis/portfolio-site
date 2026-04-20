import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';
import CaseStudyEditor from '@/components/admin/editor/CaseStudyEditor';
import { getCaseStudyById } from '@/lib/crud';

interface Props {
  params: Promise<{ id: string }>;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function draftFromServer(cs: any) {
  return {
    id: cs.id,
    slug: cs.slug ?? '',
    published: !!cs.published,
    blocks: (cs.blocks ?? []).map((b: any) => ({
      key: uid(),
      id: b.id,
      type: b.type as string,
      content: b.content,
    })),
  };
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
