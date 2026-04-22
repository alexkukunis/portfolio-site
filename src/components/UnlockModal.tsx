"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function UnlockModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('unlock');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) {
      router.replace('/case-studies');
    }
  }, [slug, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    if (password === 'alex2026') {
      document.cookie = `pw_${slug}=alex2026; path=/; max-age=86400`;
      router.push(`/case-studies/${slug}`);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  if (!slug) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4 animate-in fade-in zoom-in duration-200"
      onClick={(e) => e.target === e.currentTarget && router.replace('/case-studies')}
    >
      <div className="w-full max-w-md bg-surface backdrop-blur-xl rounded-3xl border border-border p-8 max-h-[90vh] overflow-y-auto pointer-events-auto animate-in slide-in-from-top-4 duration-300 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center border">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Unlock Case Study</h1>
              <p className="text-sm text-muted-foreground">Password required for {decodeURIComponent(slug)}</p>
            </div>
          </div>
          <button
            onClick={() => router.replace('/case-studies')}
            className="p-2 hover:bg-accent/10 rounded-2xl transition-all hover:scale-105 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-surface border border-border rounded-2xl focus:ring-2 focus:ring-accent focus:border-accent transition-all text-lg placeholder:text-muted-foreground"
              placeholder="Enter password"
              required
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 hover:scale-110"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858 .908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              )}
            </button>
          </div>
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive rounded-xl p-3 text-sm animate-in slide-in-from-bottom-2">
              Incorrect password
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Unlocking...
              </span>
            ) : 'Unlock & View'}
          </button>
        </form>
      </div>
    </div>
  );
}