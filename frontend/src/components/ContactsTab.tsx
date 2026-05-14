import { useState, useEffect, FormEvent } from 'react';
import client from '../api/client';
import type { Contact } from '../types';

interface Props {
  appId: string;
}

const EMPTY_FORM = {
  name: '',
  email: '',
  lastContactDate: '',
  nextFollowUpDate: '',
  notes: '',
};

export default function ContactsTab({ appId }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await client.get<Contact[]>(`/applications/${appId}/contacts`);
    setContacts(data);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await client.post(`/applications/${appId}/contacts`, {
        name: form.name,
        email: form.email || undefined,
        lastContactDate: form.lastContactDate || undefined,
        nextFollowUpDate: form.nextFollowUpDate || undefined,
        notes: form.notes || undefined,
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
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
    if (!confirm('Delete this contact?')) return;
    await client.delete(`/applications/${appId}/contacts/${id}`);
    load();
  }

  function field(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-semibold">
          {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
        </span>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? 'Cancel' : '+ Add Contact'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-3 border-primary">
          <div className="card-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label">Name *</label>
                  <input
                    className="form-control form-control-sm"
                    value={form.name}
                    onChange={(e) => field('name', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    value={form.email}
                    onChange={(e) => field('email', e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Contact Date</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={form.lastContactDate}
                    onChange={(e) => field('lastContactDate', e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Next Follow-Up Date</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={form.nextFollowUpDate}
                    onChange={(e) => field('nextFollowUpDate', e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows={2}
                    value={form.notes}
                    onChange={(e) => field('notes', e.target.value)}
                  />
                </div>
              </div>
              <button className="btn btn-primary btn-sm mt-2" type="submit">
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {contacts.length === 0 ? (
        <p className="text-muted">No contacts yet.</p>
      ) : (
        <ul className="list-group">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div>
                <div className="fw-semibold">{c.name}</div>
                {c.email && <div className="small">{c.email}</div>}
                {c.lastContactDate && (
                  <div className="small text-muted">Last contact: {c.lastContactDate}</div>
                )}
                {c.nextFollowUpDate && (
                  <div className="small text-muted">Follow up: {c.nextFollowUpDate}</div>
                )}
                {c.notes && <div className="small text-muted">{c.notes}</div>}
              </div>
              <button
                className="btn btn-outline-danger btn-sm ms-2"
                onClick={() => handleDelete(c.id)}
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
