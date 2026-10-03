import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { symptomAPI } from "../api/api";
import { format } from "date-fns";

/* All styles live in this file, scoped under .sy.
   No page/body background is set, so your existing bg color stays. */
const styles = `
.sy {
  --s-ink: #3a1f2b;
  --s-ink-soft: #7a5563;
  --s-accent: #e0457b;
  --s-accent-deep: #b82a5c;
  --s-blush: #ffd6e4;
  --s-blush-soft: #fff0f5;
  --s-line: rgba(58, 31, 43, 0.12);
  --s-surface: rgba(255, 255, 255, 0.82);
  --s-radius: 18px;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  color: var(--s-ink);
}

/* ---------- Navbar ---------- */
.sy-nav {
  position: sticky;
  top: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1080px;
  margin: 12px auto 0;
  padding: 10px 14px 10px 22px;
  background: var(--s-surface);
  backdrop-filter: blur(10px);
  border: 1px solid var(--s-line);
  border-radius: 999px;
  box-shadow: 0 6px 24px rgba(58, 31, 43, 0.1);
}
.sy-brand {
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
  cursor: pointer;
  white-space: nowrap;
}
.sy-menu {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
}
.sy-link {
  display: block;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--s-ink-soft);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
.sy-link:hover {
  background: rgba(224, 69, 123, 0.1);
  color: var(--s-accent-deep);
}
.sy-link--active,
.sy-link--active:hover {
  background: var(--s-accent);
  color: #fff;
}
.sy-logout {
  margin-left: 6px;
  padding: 8px 16px;
  border: 1px solid var(--s-ink);
  border-radius: 999px;
  background: transparent;
  color: var(--s-ink);
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.sy-logout:hover { background: var(--s-ink); color: #fff; }

/* ---------- Layout ---------- */
.sy-main {
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 20px 72px;
}
.sy-header { margin-bottom: 28px; }
.sy-title {
  margin: 0 0 8px;
  font-size: clamp(2rem, 5vw, 2.8rem);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.sy-subtitle {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--s-ink-soft);
}

/* ---------- Alerts ---------- */
.sy-alert {
  margin-bottom: 16px;
  padding: 12px 16px;
  border: 1px solid;
  border-radius: 12px;
  font-size: 0.93rem;
  font-weight: 500;
}
.sy-alert--error { background: #fdecec; border-color: #f3b6b6; color: #a12626; }
.sy-alert--success { background: #eaf7ee; border-color: #b4dfc0; color: #1f6b3a; }

/* ---------- Section bar ---------- */
.sy-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}
.sy-h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* ---------- Buttons ---------- */
.sy-btn {
  padding: 12px 22px;
  border: 0;
  border-radius: 12px;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s, background 0.15s, color 0.15s;
}
.sy-btn:active { transform: translateY(1px); }
.sy-btn--primary {
  background: linear-gradient(135deg, #f78fb8, #e0457b);
  color: #fff;
  box-shadow: 0 6px 16px rgba(224, 69, 123, 0.3);
}
.sy-btn--primary:hover { background: linear-gradient(135deg, #ee77a6, #b82a5c); }
.sy-btn--soft {
  background: var(--s-blush);
  color: var(--s-accent-deep);
  box-shadow: inset 0 0 0 1.5px #f4a3c0;
}
.sy-btn--soft:hover { background: #ffc2d6; color: #8f1d45; }
.sy-btn--outline {
  background: transparent;
  color: var(--s-ink);
  box-shadow: inset 0 0 0 1.5px var(--s-ink);
}
.sy-btn--outline:hover { background: var(--s-ink); color: #fff; }
.sy-btn--danger {
  background: transparent;
  color: #a12626;
  box-shadow: inset 0 0 0 1.5px #e4a3a3;
}
.sy-btn--danger:hover { background: #fdecec; box-shadow: inset 0 0 0 1.5px #a12626; }
.sy-btn--sm { padding: 8px 16px; font-size: 0.85rem; }

/* ---------- Cards ---------- */
.sy-card {
  margin-bottom: 20px;
  padding: 26px 28px;
  background: var(--s-surface);
  border: 1px solid var(--s-line);
  border-radius: var(--s-radius);
  box-shadow: 0 10px 30px rgba(58, 31, 43, 0.08);
}
.sy-card--tint {
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,214,228,0.95));
}
.sy-card-title {
  margin: 0 0 18px;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* ---------- Form ---------- */
.sy-field { margin-bottom: 18px; }
.sy-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}
.sy-input,
.sy-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px;
  border: 1.5px solid var(--s-line);
  border-radius: 12px;
  background: #fff;
  font: inherit;
  font-size: 0.95rem;
  color: var(--s-ink);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.sy-textarea { resize: vertical; line-height: 1.6; }
.sy-input::placeholder,
.sy-textarea::placeholder { color: #b392a0; }
.sy-input:focus,
.sy-textarea:focus {
  outline: none;
  border-color: var(--s-accent);
  box-shadow: 0 0 0 4px rgba(224, 69, 123, 0.15);
}
.sy-hint {
  display: block;
  margin-top: 6px;
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--s-ink-soft);
}
.sy-row { display: flex; flex-wrap: wrap; gap: 10px; }

/* ---------- Logs ---------- */
.sy-logs { display: flex; flex-direction: column; }
.sy-log-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.sy-badges { display: flex; flex-wrap: wrap; gap: 8px; }
.sy-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}
.sy-badge--date { background: var(--s-accent); color: #fff; }
.sy-badge--time { background: var(--s-blush); color: var(--s-accent-deep); }
.sy-log-actions { display: flex; gap: 8px; }
.sy-notes {
  margin-top: 16px;
  padding: 16px 18px;
  background: var(--s-blush-soft);
  border-left: 4px solid var(--s-accent);
  border-radius: 4px 12px 12px 4px;
}
.sy-notes p {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.65;
  font-size: 0.97rem;
}

/* ---------- Empty + loading ---------- */
.sy-empty { text-align: center; padding: 44px 28px; }
.sy-empty h3 { margin: 0 0 8px; font-size: 1.25rem; }
.sy-empty p { margin: 0 auto 20px; max-width: 42ch; line-height: 1.6; color: var(--s-ink-soft); }
.sy-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 80px 20px;
}
.sy-spinner {
  width: 44px;
  height: 44px;
  border: 4px solid var(--s-blush);
  border-top-color: var(--s-accent);
  border-radius: 50%;
  animation: sy-spin 0.8s linear infinite;
}
.sy-loading-text { margin: 0; color: var(--s-ink-soft); font-weight: 500; }
@keyframes sy-spin { to { transform: rotate(360deg); } }

/* ---------- Tips list ---------- */
.sy-tips {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}
.sy-tips li {
  position: relative;
  padding: 10px 14px 10px 34px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  font-size: 0.93rem;
  line-height: 1.55;
  color: var(--s-ink-soft);
}
.sy-tips li::before {
  content: "";
  position: absolute;
  left: 15px;
  top: 17px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--s-accent);
}

/* ---------- Focus + responsive ---------- */
.sy-link:focus-visible,
.sy-logout:focus-visible,
.sy-btn:focus-visible,
.sy-brand:focus-visible {
  outline: 3px solid rgba(224, 69, 123, 0.5);
  outline-offset: 2px;
}
@media (max-width: 720px) {
  .sy-nav { flex-direction: column; align-items: stretch; border-radius: 24px; padding: 12px 14px; }
  .sy-card { padding: 20px; }
  .sy-bar { flex-direction: column; align-items: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .sy * { transition: none !important; }
  .sy-spinner { animation-duration: 2s; }
}
`;

function Symptoms() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    log_date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await symptomAPI.getAll();
      setLogs(response.data);
    } catch (err) {
      setError("Failed to load symptom logs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await symptomAPI.update(editingId, formData);
        setSuccess("Symptom log updated successfully!");
      } else {
        await symptomAPI.create(formData);
        setSuccess("Symptom log created successfully!");
      }

      setFormData({
        log_date: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      });
      setShowForm(false);
      setEditingId(null);
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save symptom log");
    }
  };

  const handleEdit = (log) => {
    setFormData({
      log_date: log.log_date,
      notes: log.notes,
    });
    setEditingId(log.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;
    setError("");
    setSuccess("");

    try {
      await symptomAPI.delete(id);
      setSuccess("Symptom log deleted!");
      fetchLogs();
    } catch (err) {
      setError("Failed to delete symptom log");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      log_date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    });
  };

  return (
    <div className="sy">
      <style>{styles}</style>

      <nav className="sy-nav">
        <div className="sy-brand" onClick={() => navigate("/dashboard")}>
          Health Tracker
        </div>

        <ul className="sy-menu">
          <li>
            <span className="sy-link" onClick={() => navigate("/dashboard")}>
              Dashboard
            </span>
          </li>

          <li>
            <span
              className="sy-link sy-link--active"
              onClick={() => navigate("/symptoms")}
            >
              Symptoms
            </span>
          </li>

          <li>
            <span className="sy-link" onClick={() => navigate("/cycles")}>
              Cycles
            </span>
          </li>

          <li>
            <span className="sy-link" onClick={() => navigate("/hormonal-health")}>
              Hormonal Health
            </span>
          </li>

          {/* AI INSIGHTS LINK */}
          <li>
            <span className="sy-link" onClick={() => navigate("/ai-insights")}>
              AI Insights
            </span>
          </li>

          <li>
            <button onClick={logout} className="sy-logout">
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <main className="sy-main">
        <header className="sy-header">
          <h1 className="sy-title">Symptom Tracking</h1>
          <p className="sy-subtitle">
            Track your daily symptoms and feelings
          </p>
        </header>

        {error && <div className="sy-alert sy-alert--error">{error}</div>}
        {success && <div className="sy-alert sy-alert--success">{success}</div>}

        <div className="sy-bar">
          <h2 className="sy-h2">Your Symptom Logs</h2>
          <button
            className="sy-btn sy-btn--primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add New Log"}
          </button>
        </div>

        {showForm && (
          <div className="sy-card sy-card--tint">
            <h3 className="sy-card-title">
              {editingId ? "Edit Log" : "New Symptom Log"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="sy-field">
                <label className="sy-label">Date</label>
                <input
                  type="date"
                  className="sy-input"
                  value={formData.log_date}
                  onChange={(e) =>
                    setFormData({ ...formData, log_date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="sy-field">
                <label className="sy-label">
                  How are you feeling today?
                </label>
                <textarea
                  className="sy-textarea"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Describe your symptoms, mood, energy level, pain, etc..."
                  required
                  rows="6"
                />
                <small className="sy-hint">
                  Be specific! Include details like headaches, cramps, mood
                  changes, energy levels, sleep quality, etc.
                </small>
              </div>

              <div className="sy-row">
                <button type="submit" className="sy-btn sy-btn--primary">
                  {editingId ? "Update Log" : "Save Log"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="sy-btn sy-btn--outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="sy-loading">
            <div className="sy-spinner"></div>
            <p className="sy-loading-text">Loading your logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="sy-card sy-empty">
            <h3>No symptom logs yet</h3>
            <p>
              Start tracking your symptoms to see patterns and get AI insights!
            </p>
            <button
              className="sy-btn sy-btn--primary"
              onClick={() => setShowForm(true)}
            >
              Create Your First Log
            </button>
          </div>
        ) : (
          <div className="sy-logs">
            {logs.map((log) => (
              <div key={log.id} className="sy-card">
                <div className="sy-log-top">
                  <div className="sy-badges">
                    <span className="sy-badge sy-badge--date">
                      {format(new Date(log.log_date), "MMM dd, yyyy")}
                    </span>
                    {log.created_at && (
                      <span className="sy-badge sy-badge--time">
                        {format(new Date(log.created_at), "hh:mm a")}
                      </span>
                    )}
                  </div>
                  <div className="sy-log-actions">
                    <button
                      className="sy-btn sy-btn--soft sy-btn--sm"
                      onClick={() => handleEdit(log)}
                    >
                      Edit
                    </button>
                    <button
                      className="sy-btn sy-btn--danger sy-btn--sm"
                      onClick={() => handleDelete(log.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="sy-notes">
                  <p>{log.notes}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {logs.length > 0 && (
          <div className="sy-card sy-card--tint">
            <h3 className="sy-card-title">Tracking Tips</h3>
            <ul className="sy-tips">
              <li>Track symptoms daily for better patterns</li>
              <li>Include mood, energy levels, and sleep quality</li>
              <li>Note any triggers (food, stress, activities)</li>
              <li>Be honest and detailed for accurate AI insights</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default Symptoms;