import { cookies } from 'next/headers';
import LoginForm from '@/components/admin/LoginForm';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MessagesClient from '@/app/admin/contact/messages/MessagesClient';

export default async function MessagesPage() {
  const cookieStore = await cookies();
  const authed = cookieStore.get('admin_auth')?.value === 'true';

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <LoginForm />
      </main>
    );
  }

  return (
    <div className="flex bg-background min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-10 max-w-5xl">
        <MessagesClient />
      </main>
    </div>
  );
}
