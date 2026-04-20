"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Row {
  id: string;
  slug: string | null;
  title: string;
  company: string;
  updatedAt: string | Date;
  published: boolean;
}

export default function AdminCaseStudyTable({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Row | null>(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.slug ?? '').toLowerCase().includes(q) ||
        (r.company ?? '').toLowerCase().includes(q),
    );
  }, [rows, query]);

  async function togglePublish(row: Row) {
    setPending(row.id);
    try {
      const res = await fetch(`/api/case-studies/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !row.published }),
      });
      if (!res.ok) throw new Error('Failed');
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: !row.published } : r)));
    } catch (e) {
      alert('Failed to toggle publish');
    } finally {
      setPending(null);
    }
  }

  async function doDelete(row: Row) {
    setConfirm(null);
    setPending(row.id);
    try {
      const res = await fetch(`/api/case-studies/${row.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      router.refresh();
    } catch (e) {
      alert('Failed to delete');
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, slug, company…"
          className="flex-1 max-w-md rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
        />
        <Link
          href="/admin/case-studies/new"
          className="px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition"
        >
          + New case study
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-surface/50">
          <p className="text-text-muted mb-4">
            {rows.length === 0 ? 'No case studies yet.' : 'No matches.'}
          </p>
          {rows.length === 0 ? (
            <Link href="/admin/case-studies/new" className="text-accent hover:underline text-sm">
              Create your first case study →
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-text-muted">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Slug</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Updated</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-background/60 transition">
                  <td className="px-5 py-4">
                    <div className="font-medium text-foreground">{r.title || '(untitled)'}</div>
                    <div className="text-xs text-text-muted">{r.company}</div>
                  </td>
                  <td className="px-5 py-4 text-text-muted font-mono text-xs">{r.slug}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      disabled={pending === r.id}
                      onClick={() => togglePublish(r)}
                      className={`px-2.5 py-1 rounded-full text-xs border transition ${
                        r.published
                          ? 'bg-green-500/15 border-green-500/40 text-green-300 hover:bg-green-500/25'
                          : 'bg-orange-500/15 border-orange-500/40 text-orange-300 hover:bg-orange-500/25'
                      }`}
                    >
                      {r.published ? '● Published' : '○ Draft'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-text-muted">
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-4 justify-end">
                      <Link
                        href={r.published && r.slug ? `/case-studies/${r.slug}` : `/case-studies/${r.id}`}
                        className="text-text-muted hover:text-foreground"
                        target="_blank"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/case-studies/${r.id}/edit`}
                        className="text-text-muted hover:text-foreground"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setConfirm(r)}
                        disabled={pending === r.id}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete case study?</h3>
            <p className="text-sm text-text-muted mb-6">
              Delete <strong className="text-foreground">{confirm.title}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground hover:bg-surface"
              >
                Cancel
              </button>
              <button
                onClick={() => doDelete(confirm)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
