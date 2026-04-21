import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-surface border-r border-border h-screen flex flex-col p-6">
      <div className="font-bold text-xl mb-10 text-foreground">Portfolio Admin</div>
      <nav className="flex-1 space-y-2">
        <Link href="/admin" className="block px-4 py-2 rounded-lg bg-background text-foreground font-medium">Dashboard</Link>
        <Link href="/admin/contact/messages" className="block px-4 py-2 rounded-lg text-text-muted hover:text-foreground">Messages</Link>
      </nav>
      <div className="border-t border-border pt-6">
        <Link href="/" className="text-sm text-text-muted hover:text-foreground">Visit Live Site</Link>
      </div>
    </aside>
  );
}
