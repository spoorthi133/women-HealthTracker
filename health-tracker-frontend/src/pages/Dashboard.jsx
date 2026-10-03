import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

import { cycleAPI, symptomAPI, aiAPI } from "../api/api";

/* All styles live in this file, scoped under .dsh.
   No page/body background is set, so your existing bg color stays. */
const styles = `
.dsh {
  --d-ink: #3a1f2b;
  --d-ink-soft: #7a5563;
  --d-accent: #e0457b;
  --d-accent-deep: #b82a5c;
  --d-blush: #ffd6e4;
  --d-blush-soft: #fff0f5;
  --d-line: rgba(58, 31, 43, 0.12);
  --d-surface: rgba(255, 255, 255, 0.82);
  --d-radius: 18px;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  color: var(--d-ink);
}

/* ---------- Navbar ---------- */
.dsh-nav {
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
  background: var(--d-surface);
  backdrop-filter: blur(10px);
  border: 1px solid var(--d-line);
  border-radius: 999px;
  box-shadow: 0 6px 24px rgba(58, 31, 43, 0.1);
}
.dsh-brand {
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
  cursor: pointer;
  white-space: nowrap;
}
.dsh-menu {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
}
.dsh-link {
  display: block;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--d-ink-soft);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
.dsh-link:hover {
  background: rgba(224, 69, 123, 0.1);
  color: var(--d-accent-deep);
}
.dsh-link--active,
.dsh-link--active:hover {
  background: var(--d-accent);
  color: #fff;
}
.dsh-logout {
  margin-left: 6px;
  padding: 8px 16px;
  border: 1px solid var(--d-ink);
  border-radius: 999px;
  background: transparent;
  color: var(--d-ink);
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.dsh-logout:hover { background: var(--d-ink); color: #fff; }

/* ---------- Layout ---------- */
.dsh-main {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 20px 72px;
}
.dsh-header { margin-bottom: 32px; }
.dsh-title {
  margin: 0 0 8px;
  font-size: clamp(2rem, 5vw, 2.8rem);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.dsh-subtitle {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--d-ink-soft);
}

/* ---------- Stats ---------- */
.dsh-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
.dsh-stat {
  padding: 20px 18px;
  background: var(--d-surface);
  border: 1px solid var(--d-line);
  border-radius: var(--d-radius);
  box-shadow: 0 8px 22px rgba(58, 31, 43, 0.07);
}
.dsh-stat:first-child {
  background: linear-gradient(135deg, #f78fb8, #e0457b);
  border-color: transparent;
  color: #fff;
}
.dsh-stat:first-child .dsh-stat-label { color: rgba(255, 255, 255, 0.88); }
.dsh-stat-value {
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
.dsh-stat-label {
  margin-top: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--d-ink-soft);
}

/* ---------- Cards ---------- */
.dsh-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.dsh-card {
  padding: 26px 28px;
  background: var(--d-surface);
  border: 1px solid var(--d-line);
  border-radius: var(--d-radius);
  box-shadow: 0 10px 30px rgba(58, 31, 43, 0.08);
}
.dsh-grid .dsh-card { margin-bottom: 0; }
.dsh-card--tint {
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,214,228,0.95));
}
.dsh-card-title {
  margin: 0 0 12px;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.dsh-text {
  margin: 0;
  font-size: 0.97rem;
  line-height: 1.65;
  color: var(--d-ink-soft);
}
.dsh-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

/* ---------- Buttons ---------- */
.dsh-btn {
  padding: 12px 22px;
  border: 0;
  border-radius: 12px;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s, background 0.15s;
}
.dsh-btn:active { transform: translateY(1px); }
.dsh-btn--primary {
  background: linear-gradient(135deg, #f78fb8, #e0457b);
  color: #fff;
  box-shadow: 0 6px 16px rgba(224, 69, 123, 0.3);
}
.dsh-btn--primary:hover { background: linear-gradient(135deg, #ee77a6, #b82a5c); }
.dsh-btn--soft {
  background: var(--d-blush);
  color: var(--d-accent-deep);
  box-shadow: inset 0 0 0 1.5px #f4a3c0;
}
.dsh-btn--soft:hover { background: #ffc2d6; color: #8f1d45; }

/* ---------- Badges ---------- */
.dsh-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.dsh-badge {
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}
.dsh-badge--a { background: var(--d-accent); color: #fff; }
.dsh-badge--b { background: var(--d-blush); color: var(--d-accent-deep); }
.dsh-badge--c { background: #fff; color: var(--d-accent-deep); box-shadow: inset 0 0 0 1.5px #f4a3c0; }

/* ---------- Focus + responsive ---------- */
.dsh-link:focus-visible,
.dsh-logout:focus-visible,
.dsh-btn:focus-visible,
.dsh-brand:focus-visible {
  outline: 3px solid rgba(224, 69, 123, 0.5);
  outline-offset: 2px;
}
@media (max-width: 820px) {
  .dsh-stats { grid-template-columns: repeat(2, 1fr); }
  .dsh-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .dsh-nav { flex-direction: column; align-items: stretch; border-radius: 24px; padding: 12px 14px; }
  .dsh-card { padding: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh * { transition: none !important; }
}
`;

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dashboard stats
  const [symptomCount, setSymptomCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [insightCount, setInsightCount] = useState(0);

  // Load stats from backend
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Symptoms count
      const symRes = await symptomAPI.getAll();
      setSymptomCount(symRes.data.length);

      // Cycles count
      const cycleRes = await cycleAPI.getAll();
      setCycleCount(cycleRes.data.length);

      // AI insights (if available)
      try {
        const insightsRes = await aiAPI.analyze();
        if (Array.isArray(insightsRes.data)) {
          setInsightCount(insightsRes.data.length);
        }
      } catch {
        setInsightCount(0);
      }

    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dsh">
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="dsh-nav">
        <div className="dsh-brand" onClick={() => navigate("/dashboard")}>
          Health Tracker
        </div>

        <ul className="dsh-menu">
          <li>
            <span className="dsh-link dsh-link--active" onClick={() => navigate("/dashboard")}>
              Dashboard
            </span>
          </li>

          <li>
            <span className="dsh-link" onClick={() => navigate("/symptoms")}>
              Symptoms
            </span>
          </li>

          <li>
            <span className="dsh-link" onClick={() => navigate("/cycles")}>
              Cycles
            </span>
          </li>

          <li>
            <span className="dsh-link" onClick={() => navigate("/hormonal-health")}>
              Hormonal Health
            </span>
          </li>

          <li>
            <span className="dsh-link" onClick={() => navigate("/ai-insights")}>
              AI Insights
            </span>
          </li>

          <li>
            <button onClick={handleLogout} className="dsh-logout">
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="dsh-main">
        <header className="dsh-header">
          <h1 className="dsh-title">Hello, Beautiful!</h1>
          <p className="dsh-subtitle">Welcome back, {user?.email}</p>
        </header>

        {/* Dynamic Stats */}
        <div className="dsh-stats">
          <div className="dsh-stat">
            <div className="dsh-stat-value">{symptomCount}</div>
            <div className="dsh-stat-label">Symptom Logs</div>
          </div>

          <div className="dsh-stat">
            <div className="dsh-stat-value">{cycleCount}</div>
            <div className="dsh-stat-label">Tracked Cycles</div>
          </div>

          <div className="dsh-stat">
            <div className="dsh-stat-value">{insightCount}</div>
            <div className="dsh-stat-label">AI Insights</div>
          </div>

          <div className="dsh-stat">
            <div className="dsh-stat-value">Good</div>
            <div className="dsh-stat-label">Overall Health</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dsh-grid">
          <section className="dsh-card dsh-card--tint">
            <h2 className="dsh-card-title">Quick Actions</h2>
            <p className="dsh-text">Jump straight into tracking.</p>
            <div className="dsh-actions">
              <button className="dsh-btn dsh-btn--primary" onClick={() => navigate("/symptoms")}>
                Log Symptoms
              </button>
              <button className="dsh-btn dsh-btn--soft" onClick={() => navigate("/cycles")}>
                Start Cycle
              </button>
            </div>
          </section>

          <section className="dsh-card">
            <h2 className="dsh-card-title">Recent Activity</h2>
            <p className="dsh-text">
              Your recent actions will appear here as you track more health data.
            </p>
            <div className="dsh-actions">
              <button className="dsh-btn dsh-btn--soft" onClick={() => navigate("/symptoms")}>
                Get Started
              </button>
            </div>
          </section>
        </div>

        {/* Health Tips */}
        <section className="dsh-card">
          <h2 className="dsh-card-title">Health Tips</h2>
          <p className="dsh-text">
            Track your cycle regularly to understand your body better. Consistent logging helps
            identify patterns and improves health insights!
          </p>
          <div className="dsh-badges">
            <span className="dsh-badge dsh-badge--a">Wellness</span>
            <span className="dsh-badge dsh-badge--b">Tracking</span>
            <span className="dsh-badge dsh-badge--c">Health</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;