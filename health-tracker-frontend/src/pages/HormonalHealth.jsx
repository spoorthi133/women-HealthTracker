import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { healthAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

/* All styles live in this file, scoped under .hh.
   No page/body background is set, so your existing bg color stays. */
const styles = `
.hh {
  --y-ink: #3a1f2b;
  --y-ink-soft: #7a5563;
  --y-accent: #e0457b;
  --y-accent-deep: #b82a5c;
  --y-blush: #ffd6e4;
  --y-blush-soft: #fff0f5;
  --y-line: rgba(58, 31, 43, 0.12);
  --y-surface: rgba(255, 255, 255, 0.82);
  --y-radius: 18px;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  color: var(--y-ink);
}

/* ---------- Navbar ---------- */
.hh-nav {
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
  background: var(--y-surface);
  backdrop-filter: blur(10px);
  border: 1px solid var(--y-line);
  border-radius: 999px;
  box-shadow: 0 6px 24px rgba(58, 31, 43, 0.1);
}
.hh-brand {
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
  cursor: pointer;
  white-space: nowrap;
}
.hh-menu {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
}
.hh-link {
  display: block;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--y-ink-soft);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
.hh-link:hover {
  background: rgba(224, 69, 123, 0.1);
  color: var(--y-accent-deep);
}
.hh-link--active,
.hh-link--active:hover {
  background: var(--y-accent);
  color: #fff;
}
.hh-logout {
  margin-left: 6px;
  padding: 8px 16px;
  border: 1px solid var(--y-ink);
  border-radius: 999px;
  background: transparent;
  color: var(--y-ink);
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.hh-logout:hover { background: var(--y-ink); color: #fff; }

/* ---------- Layout ---------- */
.hh-main {
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 20px 72px;
}
.hh-header { margin-bottom: 32px; }
.hh-title {
  margin: 0 0 8px;
  font-size: clamp(1.9rem, 5vw, 2.6rem);
  line-height: 1.12;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.hh-subtitle {
  margin: 0;
  max-width: 52ch;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--y-ink-soft);
}
.hh-loading {
  margin: 0 0 20px;
  color: var(--y-ink-soft);
  font-weight: 500;
}

/* ---------- Alerts ---------- */
.hh-alert {
  margin-bottom: 20px;
  padding: 12px 16px;
  border: 1px solid #f3b6b6;
  border-radius: 12px;
  background: #fdecec;
  font-size: 0.93rem;
  font-weight: 500;
  color: #a12626;
}

/* ---------- Cards ---------- */
.hh-card {
  margin-bottom: 20px;
  padding: 28px 30px;
  background: var(--y-surface);
  border: 1px solid var(--y-line);
  border-radius: var(--y-radius);
  box-shadow: 0 10px 30px rgba(58, 31, 43, 0.08);
}
.hh-card--tint {
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,214,228,0.95));
}
.hh-level {
  margin: 0 0 12px;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.hh-score {
  display: inline-block;
  margin: 0;
  padding: 5px 14px;
  border-radius: 999px;
  background: var(--y-blush);
  color: var(--y-accent-deep);
  font-size: 0.88rem;
  font-weight: 600;
}
.hh-rule {
  height: 1px;
  margin: 22px 0;
  border: 0;
  background: var(--y-line);
}
.hh-card-title {
  margin: 0 0 14px;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* ---------- Lists ---------- */
.hh-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}
.hh-list li {
  position: relative;
  padding: 11px 14px 11px 36px;
  background: #fff;
  border: 1px solid var(--y-line);
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--y-ink-soft);
}
.hh-list li::before {
  content: "";
  position: absolute;
  left: 16px;
  top: 19px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--y-accent);
}
.hh-card--tint .hh-list li {
  background: rgba(255, 255, 255, 0.78);
  border-color: transparent;
}

/* ---------- Recommendation ---------- */
.hh-note {
  padding: 16px 18px;
  background: var(--y-blush-soft);
  border-left: 4px solid var(--y-accent);
  border-radius: 4px 12px 12px 4px;
  font-size: 0.95rem;
  line-height: 1.65;
}
.hh-note strong { color: var(--y-accent-deep); }

/* ---------- Focus + responsive ---------- */
.hh-link:focus-visible,
.hh-logout:focus-visible,
.hh-brand:focus-visible {
  outline: 3px solid rgba(224, 69, 123, 0.5);
  outline-offset: 2px;
}
@media (max-width: 720px) {
  .hh-nav { flex-direction: column; align-items: stretch; border-radius: 24px; padding: 12px 14px; }
  .hh-card { padding: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .hh * { transition: none !important; }
}
`;

function HormonalHealth() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRisk();
  }, []);

  const fetchRisk = async () => {
    try {
      const res = await healthAPI.getHormonalRisk();
      setData(res.data);
    } catch (err) {
      setError("Unable to load hormonal health insights");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const colorMap = {
    LOW: "#2f8f55",
    MODERATE: "#c98a10",
    HIGH: "#b82a5c",
  };

  return (
    <div className="hh">
      <style>{styles}</style>

      {/* PAGE-SPECIFIC NAVBAR */}
      <nav className="hh-nav">
        <div className="hh-brand" onClick={() => navigate("/dashboard")}>
          Health Tracker
        </div>

        <ul className="hh-menu">
          <li>
            <span className="hh-link" onClick={() => navigate("/dashboard")}>
              Dashboard
            </span>
          </li>

          <li>
            <span className="hh-link" onClick={() => navigate("/symptoms")}>
              Symptoms
            </span>
          </li>

          <li>
            <span className="hh-link" onClick={() => navigate("/cycles")}>
              Cycles
            </span>
          </li>

          <li>
            <span
              className="hh-link hh-link--active"
              onClick={() => navigate("/hormonal-health")}
            >
              Hormonal Health
            </span>
          </li>

          {/* AI INSIGHTS LINK */}
          <li>
            <span className="hh-link" onClick={() => navigate("/ai-insights")}>
              AI Insights
            </span>
          </li>

          <li>
            <button onClick={logout} className="hh-logout">
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* PAGE CONTENT */}
      <main className="hh-main">
        <header className="hh-header">
          <h1 className="hh-title">Hormonal Health (PCOS / PCOD Awareness)</h1>
          <p className="hh-subtitle">
            Pattern-based insights from your cycles and symptoms
          </p>
        </header>

        {loading && <p className="hh-loading">Analyzing your data...</p>}

        {error && <div className="hh-alert">{error}</div>}

        {data && (
          <section className="hh-card">
            <h2 className="hh-level">
              Risk Level:{" "}
              <span style={{ color: colorMap[data.risk_level] }}>
                {data.risk_level}
              </span>
            </h2>

            <p className="hh-score">
              <strong>Score:</strong> {data.score}
            </p>

            <hr className="hh-rule" />

            <h3 className="hh-card-title">What we observed</h3>
            <ul className="hh-list">
              {data.observations.map((obs, index) => (
                <li key={index}>{obs}</li>
              ))}
            </ul>

            <hr className="hh-rule" />

            <div className="hh-note">
              <strong>Important:</strong>
              <br />
              {data.recommendation}
            </div>
          </section>
        )}

        <section className="hh-card hh-card--tint">
          <h3 className="hh-card-title">Why this matters</h3>
          <ul className="hh-list">
            <li>PCOS / PCOD often affects menstrual regularity</li>
            <li>Early awareness helps lifestyle correction</li>
            <li>This tool does NOT diagnose conditions</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default HormonalHealth;