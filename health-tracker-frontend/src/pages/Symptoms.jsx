import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { symptomAPI } from "../api/api";
import { format } from "date-fns";



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
        setSuccess("✨ Symptom log updated successfully!");
      } else {
        await symptomAPI.create(formData);
        setSuccess("✨ Symptom log created successfully!");
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
      setSuccess("✨ Symptom log deleted!");
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
    <div>
      <nav className="navbar">
  <div
    className="navbar-brand"
    onClick={() => navigate("/dashboard")}
    style={{ cursor: "pointer" }}
  >
    Health Tracker
  </div>

  <ul className="navbar-menu">
    <li>
      <span className="navbar-link" onClick={() => navigate("/dashboard")}>
        Dashboard
      </span>
    </li>

    <li>
      <span className="navbar-link" onClick={() => navigate("/symptoms")}>
        Symptoms
      </span>
    </li>

    <li>
      <span className="navbar-link" onClick={() => navigate("/cycles")}>
        Cycles
      </span>
    </li>

    <li>
      <span
        className="navbar-link"
        onClick={() => navigate("/hormonal-health")}
      >
        Hormonal Health
      </span>
    </li>

     {/* AI INSIGHTS LINK */}
    <li>
      <span
        className="navbar-link"
        onClick={() => navigate("/ai-insights")}
      >
        AI Insights
      </span>
    </li>

    <li>
      <button onClick={logout} className="btn btn-outline">
        Logout
      </button>
    </li>
  </ul>
</nav>


      <div className="container fade-in">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Symptom Tracking</h1>
          <p className="dashboard-subtitle">
            Track your daily symptoms and feelings
          </p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        <div className="flex-between mb-4">
          <h2>Your Symptom Logs</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "❌ Cancel" : "➕ Add New Log"}
          </button>
        </div>

        {showForm && (
          <div className="card card-gradient slide-in">
            <h3 className="card-title">
              {editingId ? "✏️ Edit Log" : " New Symptom Log"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">📅 Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.log_date}
                  onChange={(e) =>
                    setFormData({ ...formData, log_date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                   How are you feeling today?
                </label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Describe your symptoms, mood, energy level, pain, etc..."
                  required
                  rows="6"
                />
                <small className="text-muted">
                  Be specific! Include details like headaches, cramps, mood
                  changes, energy levels, sleep quality, etc.
                </small>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingId ? "💾 Update Log" : "✨ Save Log"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline"
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
          <div className="loading">
            <div className="spinner"></div>
            <p className="loading-text">Loading your logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="card text-center">
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📝</div>
            <h3>No symptom logs yet</h3>
            <p className="text-muted mb-3">
              Start tracking your symptoms to see patterns and get AI insights!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
               Create Your First Log
            </button>
          </div>
        ) : (
          <div className="grid">
            {logs.map((log) => (
              <div key={log.id} className="card slide-in">
                <div className="flex-between mb-2">
                  <div>
                    <span className="badge badge-primary">
                      📅 {format(new Date(log.log_date), "MMM dd, yyyy")}
                    </span>
                    {log.created_at && (
                      <span className="badge badge-info ml-2">
                        🕐 {format(new Date(log.created_at), "hh:mm a")}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-soft"
                      onClick={() => handleEdit(log)}
                      style={{ padding: "0.5rem 1rem" }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleDelete(log.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        borderColor: "var(--error)",
                        color: "var(--error)",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    background: "var(--surface-light)",
                    borderRadius: "var(--radius-md)",
                    marginTop: "1rem",
                  }}
                >
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                    {log.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {logs.length > 0 && (
          <div className="card card-gradient mt-4">
            <h3 className="card-title">💡 Tracking Tips</h3>
            <ul style={{ paddingLeft: "1.5rem", lineHeight: "2" }}>
              <li>Track symptoms daily for better patterns</li>
              <li>Include mood, energy levels, and sleep quality</li>
              <li>Note any triggers (food, stress, activities)</li>
              <li>Be honest and detailed for accurate AI insights</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Symptoms;
