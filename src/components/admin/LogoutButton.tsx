'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-3 bg-surface border border-border text-foreground font-semibold rounded-xl hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all active:scale-95"
    >
      Logout
    </button>
  );
}
