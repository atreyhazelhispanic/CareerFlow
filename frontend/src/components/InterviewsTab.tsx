import { useState, useEffect, FormEvent } from 'react';
import client from '../api/client';
import type { Interview } from '../types';

interface Props {
  appId: string;
}

const EMPTY_FORM = {
  interviewType: '',
  scheduledAt: '',
  interviewerNames: '',
  topics: '',
  outcome: '',
  notes: '',
};

export default function InterviewsTab({ appId }: Props) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
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
        interviewerNames: form.interviewerNames
          ? form.interviewerNames.split(',').map((s) => s.trim())
          : [],
        topics: form.topics || undefined,
        outcome: form.outcome || undefined,
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
        <span className="fw-semibold">
          {interviews.length} interview{interviews.length !== 1 ? 's' : ''}
        </span>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setShowForm((s) => !s)}
        >
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
                  <input
                    className="form-control form-control-sm"
                    placeholder="e.g. Technical, Behavioural"
                    value={form.interviewType}
                    onChange={(e) => field('interviewType', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Scheduled At</label>
                  <input
                    type="datetime-local"
                    className="form-control form-control-sm"
                    value={form.scheduledAt}
                    onChange={(e) => field('scheduledAt', e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">
                    Interviewer Names <small className="text-muted">(comma-separated)</small>
                  </label>
                  <input
                    className="form-control form-control-sm"
                    placeholder="Jane Smith, John Doe"
                    value={form.interviewerNames}
                    onChange={(e) => field('interviewerNames', e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Topics</label>
                  <input
                    className="form-control form-control-sm"
                    value={form.topics}
                    onChange={(e) => field('topics', e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Outcome</label>
                  <input
                    className="form-control form-control-sm"
                    placeholder="e.g. Passed, Pending"
                    value={form.outcome}
                    onChange={(e) => field('outcome', e.target.value)}
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

      {interviews.length === 0 ? (
        <p className="text-muted">No interviews yet.</p>
      ) : (
        <ul className="list-group">
          {interviews.map((iv) => (
            <li
              key={iv.id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div>
                <div className="fw-semibold">{iv.interviewType}</div>
                {iv.scheduledAt && (
                  <div className="small text-muted">
                    {new Date(iv.scheduledAt).toLocaleString()}
                  </div>
                )}
                {iv.interviewerNames.length > 0 && (
                  <div className="small">Interviewers: {iv.interviewerNames.join(', ')}</div>
                )}
                {iv.outcome && <div className="small">Outcome: {iv.outcome}</div>}
                {iv.notes && <div className="small text-muted">{iv.notes}</div>}
              </div>
              <button
                className="btn btn-outline-danger btn-sm ms-2"
                onClick={() => handleDelete(iv.id)}
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
