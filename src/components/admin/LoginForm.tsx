'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-sm">
      <h2 className="text-xl font-bold text-white mb-6">Admin Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full bg-slate-950 text-white p-3 rounded-xl mb-4 border border-slate-800"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-slate-950 text-white p-3 rounded-xl mb-6 border border-slate-800"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button type="submit" className="w-full bg-white text-slate-900 p-3 rounded-xl font-semibold hover:bg-slate-200">
        Login
      </button>
    </form>
  );
}
