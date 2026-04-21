'use client';

import { useEffect, useState, Fragment } from 'react';

interface Msg {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesClient() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/contact-messages')
      .then((r) => r.json())
      .then((d) => {
        setMsgs(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const unread = msgs.filter((m) => !m.read).length;

  const markAll = async () => {
    try {
      await fetch('/api/admin/contact-messages', { method: 'PATCH' });
      setMsgs((p) => p.map((x) => ({ ...x, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await fetch(`/api/admin/contact-messages/${id}`, { method: 'DELETE' });
      setMsgs(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete message', error);
    }
  };

  const toggle = async (m: Msg) => {
    if (!m.read) {
      try {
        await fetch(`/api/admin/contact-messages/${m.id}`, {
          method: 'PATCH',
        });

        setMsgs((p) =>
          p.map((x) => (x.id === m.id ? { ...x, read: true } : x))
        );
      } catch (error) {
        console.error('Failed to mark as read', error);
      }
    }

    setExpanded((prev) => (prev === m.id ? null : m.id));
  };

  if (loading)
    return <p className="text-text-muted text-center py-20">Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          {unread > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-500/15 text-indigo-400 rounded-full">
              {unread} new
            </span>
          )}
        </div>

        {unread > 1 && (
          <button
            onClick={markAll}
            className="text-sm text-accent hover:text-accent/80 font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {msgs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-surface/50">
          <p className="text-text-muted">No messages yet</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-text-muted">
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Message</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {msgs.map((m) => (
                <Fragment key={m.id}>
                  <tr
                    className="border-b border-border last:border-0 hover:bg-background/60 transition cursor-pointer"
                    onClick={() => toggle(m)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-foreground">
                          {m.name}
                        </div>
                        {!m.read && (
                          <span className="size-2 rounded-full bg-indigo-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">
                        {m.email}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-text-muted max-w-md truncate">
                        {m.subject || m.message}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-text-muted">
                      {new Date(m.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-accent hover:underline text-xs mr-4">
                        {expanded === m.id ? 'Close' : 'View'}
                      </span>
                      <button
                        onClick={() => remove(m.id)}
                        className="text-xs text-destructive hover:text-destructive/80"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expanded === m.id && (
                    <tr className="bg-background/40">
                      <td colSpan={4} className="px-5 py-5">
                        {m.subject && (
                          <p className="text-sm text-foreground mb-2">
                            <span className="text-text-muted">Subject</span> —{' '}
                            {m.subject}
                          </p>
                        )}

                        <p className="text-text-muted whitespace-pre-wrap leading-relaxed text-sm">
                          {m.message}
                        </p>

                        <div className="mt-3">
                          <a
                            href={`mailto:${m.email}`}
                            className="text-xs text-accent hover:underline"
                          >
                            Reply to {m.email}
                          </a>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}