import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import type {
  JobApplication, ApplicationStatus, WorkplaceType,
  Interview, Contact, Note,
} from '../types';

const STATUSES: ApplicationStatus[] = [
  'APPLIED', 'RECRUITER_SCREEN', 'TECHNICAL_INTERVIEW', 'FINAL_INTERVIEW',
  'OFFER', 'REJECTED', 'WITHDRAWN',
];
const WORKPLACES: WorkplaceType[] = ['REMOTE', 'HYBRID', 'ON_SITE'];

// ─────────────────────── Interviews ───────────────────────
function InterviewsTab({ appId }: { appId: string }) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ interviewType: '', scheduledAt: '', interviewerNames: '', topics: '', outcome: '', notes: '' });
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await client.get<Interview[]>(`/applications/${appId}/interviews`);
    setInterviews(data);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await client.post(`/applications/${appId}/interviews`, {
        ...form,
        scheduledAt: form.scheduledAt || undefined,
        interviewerNames: form.interviewerNames ? form.interviewerNames.split(',').map((s) => s.trim()) : [],
        topics: form.topics || undefined,
        outcome: form.outcome || undefined,
        notes: form.notes || undefined,
      });
      setForm({ interviewType: '', scheduledAt: '', interviewerNames: '', topics: '', outcome: '', notes: '' });
      setShowForm(false);
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      setError(msg ?? 'Failed to save.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this interview?')) return;
    await client.delete(`/applications/${appId}/interviews/${id}`);
    load();
  }

  function field(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-semibold">{interviews.length} interview{interviews.length !== 1 ? 's' : ''}</span>
        <button className="btn btn-sm btn-outline-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add Interview'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-3 border-primary">
          <div className="card-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label">Type *</label>
                  <input className="form-control form-control-sm" placeholder="e.g. Technical, Behavioural" value={form.interviewType} onChange={(e) => field('interviewType', e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Scheduled At</label>
                  <input type="datetime-local" className="form-control form-control-sm" value={form.scheduledAt} onChange={(e) => field('scheduledAt', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Interviewer Names <small className="text-muted">(comma-separated)</small></label>
                  <input className="form-control form-control-sm" placeholder="Jane Smith, John Doe" value={form.interviewerNames} onChange={(e) => field('interviewerNames', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Topics</label>
                  <input className="form-control form-control-sm" value={form.topics} onChange={(e) => field('topics', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Outcome</label>
                  <input className="form-control form-control-sm" placeholder="e.g. Passed, Pending" value={form.outcome} onChange={(e) => field('outcome', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control form-control-sm" rows={2} value={form.notes} onChange={(e) => field('notes', e.target.value)} />
                </div>
              </div>
              <button className="btn btn-primary btn-sm mt-2" type="submit">Save</button>
            </form>
          </div>
        </div>
      )}

      {interviews.length === 0 ? (
        <p className="text-muted">No interviews yet.</p>
      ) : (
        <ul className="list-group">
          {interviews.map((iv) => (
            <li key={iv.id} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <div className="fw-semibold">{iv.interviewType}</div>
                {iv.scheduledAt && <div className="small text-muted">{new Date(iv.scheduledAt).toLocaleString()}</div>}
                {iv.interviewerNames.length > 0 && <div className="small">Interviewers: {iv.interviewerNames.join(', ')}</div>}
                {iv.outcome && <div className="small">Outcome: {iv.outcome}</div>}
                {iv.notes && <div className="small text-muted">{iv.notes}</div>}
              </div>
              <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => handleDelete(iv.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────── Contacts ───────────────────────
function ContactsTab({ appId }: { appId: string }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', lastContactDate: '', nextFollowUpDate: '', notes: '' });
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
      setForm({ name: '', email: '', lastContactDate: '', nextFollowUpDate: '', notes: '' });
      setShowForm(false);
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error && 'response' in err
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
        <span className="fw-semibold">{contacts.length} contact{contacts.length !== 1 ? 's' : ''}</span>
        <button className="btn btn-sm btn-outline-primary" onClick={() => setShowForm((s) => !s)}>
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
                  <input className="form-control form-control-sm" value={form.name} onChange={(e) => field('name', e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control form-control-sm" value={form.email} onChange={(e) => field('email', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Contact Date</label>
                  <input type="date" className="form-control form-control-sm" value={form.lastContactDate} onChange={(e) => field('lastContactDate', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Next Follow-Up Date</label>
                  <input type="date" className="form-control form-control-sm" value={form.nextFollowUpDate} onChange={(e) => field('nextFollowUpDate', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control form-control-sm" rows={2} value={form.notes} onChange={(e) => field('notes', e.target.value)} />
                </div>
              </div>
              <button className="btn btn-primary btn-sm mt-2" type="submit">Save</button>
            </form>
          </div>
        </div>
      )}

      {contacts.length === 0 ? (
        <p className="text-muted">No contacts yet.</p>
      ) : (
        <ul className="list-group">
          {contacts.map((c) => (
            <li key={c.id} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <div className="fw-semibold">{c.name}</div>
                {c.email && <div className="small">{c.email}</div>}
                {c.lastContactDate && <div className="small text-muted">Last contact: {c.lastContactDate}</div>}
                {c.nextFollowUpDate && <div className="small text-muted">Follow up: {c.nextFollowUpDate}</div>}
                {c.notes && <div className="small text-muted">{c.notes}</div>}
              </div>
              <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => handleDelete(c.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────── Notes ───────────────────────
function NotesTab({ appId }: { appId: string }) {
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
      const msg = err instanceof Error && 'response' in err
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
        <button className="btn btn-primary btn-sm" type="submit">Add Note</button>
      </form>

      {notes.length === 0 ? (
        <p className="text-muted">No notes yet.</p>
      ) : (
        <ul className="list-group">
          {notes.map((n) => (
            <li key={n.id} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <p className="mb-1" style={{ whiteSpace: 'pre-wrap' }}>{n.content}</p>
                <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
              </div>
              <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => handleDelete(n.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────── Main Page ───────────────────────
export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<JobApplication | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<JobApplication>>({});
  const [saveError, setSaveError] = useState('');
  const [activeTab, setActiveTab] = useState<'interviews' | 'contacts' | 'notes'>('interviews');

  useEffect(() => { loadApp(); }, []);

  async function loadApp() {
    const { data } = await client.get<JobApplication>(`/applications/${id}`);
    setApp(data);
    setForm(data);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaveError('');
    try {
      const { data } = await client.put<JobApplication>(`/applications/${id}`, {
        company: form.company,
        roleTitle: form.roleTitle,
        status: form.status,
        appliedDate: form.appliedDate,
        location: form.location || undefined,
        workplaceType: form.workplaceType || undefined,
        salaryRange: form.salaryRange || undefined,
        jobPostingUrl: form.jobPostingUrl || undefined,
        description: form.description || undefined,
      });
      setApp(data);
      setEditing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      setSaveError(msg ?? 'Failed to save.');
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this application and all its data?')) return;
    await client.delete(`/applications/${id}`);
    navigate('/dashboard');
  }

  function field(key: keyof JobApplication, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  if (!app) return <div className="text-center py-5 text-muted">Loading…</div>;

  return (
    <div className="container my-4">
      <Link to="/dashboard" className="btn btn-sm btn-outline-secondary mb-3">← Back</Link>

      {/* ── Application Details Card ── */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-5">{app.company} — {app.roleTitle}</span>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-primary" onClick={() => setEditing((s) => !s)}>
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button className="btn btn-sm btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        </div>
        <div className="card-body">
          {editing ? (
            <form onSubmit={handleSave}>
              {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Company *</label>
                  <input className="form-control" value={form.company ?? ''} onChange={(e) => field('company', e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Role Title *</label>
                  <input className="form-control" value={form.roleTitle ?? ''} onChange={(e) => field('roleTitle', e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status ?? ''} onChange={(e) => field('status', e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Applied Date</label>
                  <input type="date" className="form-control" value={form.appliedDate ?? ''} onChange={(e) => field('appliedDate', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Workplace Type</label>
                  <select className="form-select" value={form.workplaceType ?? ''} onChange={(e) => field('workplaceType', e.target.value)}>
                    <option value="">—</option>
                    {WORKPLACES.map((w) => <option key={w}>{w}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Location</label>
                  <input className="form-control" value={form.location ?? ''} onChange={(e) => field('location', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Salary Range</label>
                  <input className="form-control" value={form.salaryRange ?? ''} onChange={(e) => field('salaryRange', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Job Posting URL</label>
                  <input type="url" className="form-control" value={form.jobPostingUrl ?? ''} onChange={(e) => field('jobPostingUrl', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={2} value={form.description ?? ''} onChange={(e) => field('description', e.target.value)} />
                </div>
              </div>
              <button className="btn btn-primary mt-3" type="submit">Save Changes</button>
            </form>
          ) : (
            <dl className="row mb-0">
              <dt className="col-sm-3">Status</dt>
              <dd className="col-sm-9">{app.status.replace(/_/g, ' ')}</dd>
              <dt className="col-sm-3">Applied</dt>
              <dd className="col-sm-9">{app.appliedDate}</dd>
              <dt className="col-sm-3">Location</dt>
              <dd className="col-sm-9">{app.location ?? '—'}</dd>
              <dt className="col-sm-3">Workplace</dt>
              <dd className="col-sm-9">{app.workplaceType?.replace(/_/g, ' ') ?? '—'}</dd>
              <dt className="col-sm-3">Salary</dt>
              <dd className="col-sm-9">{app.salaryRange ?? '—'}</dd>
              {app.jobPostingUrl && (
                <>
                  <dt className="col-sm-3">Posting</dt>
                  <dd className="col-sm-9"><a href={app.jobPostingUrl} target="_blank" rel="noopener noreferrer">View Job</a></dd>
                </>
              )}
              {app.description && (
                <>
                  <dt className="col-sm-3">Description</dt>
                  <dd className="col-sm-9">{app.description}</dd>
                </>
              )}
            </dl>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <ul className="nav nav-tabs mb-3">
        {(['interviews', 'contacts', 'notes'] as const).map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link text-capitalize ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {id && activeTab === 'interviews' && <InterviewsTab appId={id} />}
      {id && activeTab === 'contacts' && <ContactsTab appId={id} />}
      {id && activeTab === 'notes' && <NotesTab appId={id} />}
    </div>
  );
}
