import { redirect } from 'next/navigation';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 text-slate-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <p>Welcome, Alex. Use this dashboard to manage your case studies.</p>
    </main>
  );
}
