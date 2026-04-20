'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-border p-8 rounded-2xl w-full max-w-sm"
    >
      <h2 className="text-xl font-bold text-foreground mb-1">Admin login</h2>
      <p className="text-sm text-text-muted mb-6">Sign in to manage your portfolio.</p>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full bg-background text-foreground p-3 rounded-xl mb-3 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-background text-foreground p-3 rounded-xl mb-5 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
      />
      {error ? <p className="text-red-400 mb-4 text-sm">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-accent text-white p-3 rounded-xl font-semibold hover:bg-accent/90 transition disabled:opacity-50"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
