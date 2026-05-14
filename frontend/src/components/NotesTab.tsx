import { useState, useEffect, FormEvent } from 'react';
import client from '../api/client';
import type { Note } from '../types';

interface Props {
  appId: string;
}

export default function NotesTab({ appId }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await client.get<Note[]>(`/applications/${appId}/notes`);
    setNotes(data);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await client.post(`/applications/${appId}/notes`, { content });
      setContent('');
      load();
    } catch (err: unknown) {
      const msg =
        err instanceof Error && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(msg ?? 'Failed to save.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this note?')) return;
    await client.delete(`/applications/${appId}/notes/${id}`);
    load();
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-3">
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <label className="form-label fw-semibold">Add Note</label>
        <textarea
          className="form-control form-control-sm mb-2"
          rows={2}
          placeholder="Write a note…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button className="btn btn-primary btn-sm" type="submit">
          Add Note
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="text-muted">No notes yet.</p>
      ) : (
        <ul className="list-group">
          {notes.map((n) => (
            <li
              key={n.id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div>
                <p className="mb-1" style={{ whiteSpace: 'pre-wrap' }}>
                  {n.content}
                </p>
                <small className="text-muted">
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              </div>
              <button
                className="btn btn-outline-danger btn-sm ms-2"
                onClick={() => handleDelete(n.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
