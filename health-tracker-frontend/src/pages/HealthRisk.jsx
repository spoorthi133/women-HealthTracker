import { useEffect, useState } from "react";
import { healthAPI } from "../api/api";

/* All styles live in this file, scoped under .hr.
   No page/body background is set, so your existing bg color stays. */
const styles = `
.hr {
  --h-ink: #3a1f2b;
  --h-ink-soft: #7a5563;
  --h-accent: #e0457b;
  --h-accent-deep: #b82a5c;
  --h-blush: #ffd6e4;
  --h-blush-soft: #fff0f5;
  --h-line: rgba(58, 31, 43, 0.12);
  --h-surface: rgba(255, 255, 255, 0.82);
  --h-radius: 18px;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  color: var(--h-ink);
}

.hr-main {
  max-width: 760px;
  margin: 0 auto;
  padding: 56px 20px 72px;
}
.hr-title {
  margin: 0 0 28px;
  font-size: clamp(2rem, 5vw, 2.8rem);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
}

/* ---------- Risk card ---------- */
.hr-risk {
  margin-bottom: 20px;
  padding: 30px 32px;
  border-radius: var(--h-radius);
  border: 1px solid var(--h-line);
  border-left-width: 8px;
  box-shadow: 0 10px 30px rgba(58, 31, 43, 0.08);
  background: var(--h-surface);
}
.hr-risk-level {
  margin: 0 0 6px;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.hr-risk-score {
  display: inline-block;
  margin: 0 0 14px;
  padding: 4px 14px;
  border-radius: 999px;
  background: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  box-shadow: inset 0 0 0 1.5px currentColor;
}
.hr-risk-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--h-ink);
}

/* risk levels (class names come from colorMap) */
.hr .risk-low {
  background: linear-gradient(135deg, #f3fbf5, #e3f5e9);
  border-left-color: #3b9a5f;
  color: #1f6b3a;
}
.hr .risk-moderate {
  background: linear-gradient(135deg, #fffaf0, #ffefd0);
  border-left-color: #e0a020;
  color: #8a5a00;
}
.hr .risk-high {
  background: linear-gradient(135deg, #fff0f5, #ffd0e0);
  border-left-color: var(--h-accent-deep);
  color: #a11d4a;
}

/* ---------- Cards ---------- */
.hr-card {
  margin-bottom: 20px;
  padding: 26px 28px;
  background: var(--h-surface);
  border: 1px solid var(--h-line);
  border-radius: var(--h-radius);
  box-shadow: 0 10px 30px rgba(58, 31, 43, 0.08);
}
.hr-card--tint {
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,214,228,0.95));
}
.hr-card-title {
  margin: 0 0 16px;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* ---------- Lists ---------- */
.hr-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}
.hr-list li {
  position: relative;
  padding: 11px 14px 11px 36px;
  background: #fff;
  border: 1px solid var(--h-line);
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--h-ink-soft);
}
.hr-list li::before {
  content: "";
  position: absolute;
  left: 16px;
  top: 19px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--h-accent);
}
.hr-card--tint .hr-list li {
  background: rgba(255, 255, 255, 0.78);
  border-color: transparent;
}

/* ---------- Disclaimer ---------- */
.hr-disclaimer {
  padding: 14px 18px;
  background: var(--h-blush-soft);
  border-left: 4px solid var(--h-accent);
  border-radius: 4px 12px 12px 4px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--h-ink-soft);
}

/* ---------- States ---------- */
.hr-state {
  max-width: 760px;
  margin: 0 auto;
  padding: 120px 20px;
  text-align: center;
}
.hr-loading {
  margin: 0;
  color: var(--h-ink-soft);
  font-weight: 500;
}
.hr-error {
  display: inline-block;
  margin: 0;
  padding: 12px 18px;
  background: #fdecec;
  border: 1px solid #f3b6b6;
  border-radius: 12px;
  font-weight: 500;
  color: #a12626;
}

@media (max-width: 720px) {
  .hr-risk, .hr-card { padding: 20px; }
}
`;

function HealthRisk() {
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
    } catch {
      setError("Unable to load risk data");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="hr">
        <style>{styles}</style>
        <div className="hr-state">
          <p className="hr-loading">Loading health insights...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="hr">
        <style>{styles}</style>
        <div className="hr-state">
          <p className="hr-error">{error}</p>
        </div>
      </div>
    );

  const colorMap = {
    LOW: "risk-low",
    MODERATE: "risk-moderate",
    HIGH: "risk-high",
  };

  return (
    <div className="hr">
      <style>{styles}</style>

      <main className="hr-main">
        <h1 className="hr-title">Hormonal Health Overview</h1>

        {/* Risk Card */}
        <section className={`hr-risk ${colorMap[data.risk_level]}`}>
          <h2 className="hr-risk-level">{data.risk_level} RISK</h2>
          <p className="hr-risk-score">Score: {data.score}</p>
          <p className="hr-risk-text">{data.recommendation}</p>
        </section>

        {/* Observations */}
        <section className="hr-card">
          <h3 className="hr-card-title">Observations</h3>
          <ul className="hr-list">
            {data.observations.map((obs, i) => (
              <li key={i}>{obs}</li>
            ))}
          </ul>
        </section>

        {/* Actions */}
        <section className="hr-card hr-card--tint">
          <h3 className="hr-card-title">What You Can Do</h3>
          <ul className="hr-list">
            <li>Track cycles consistently</li>
            <li>Maintain a balanced diet & exercise</li>
            <li>Manage stress & sleep properly</li>
            {data.risk_level !== "LOW" && (
              <li>Consider consulting a gynecologist</li>
            )}
          </ul>
        </section>

        {/* Disclaimer */}
        <div className="hr-disclaimer">
          This analysis is informational only and not a medical diagnosis.
        </div>
      </main>
    </div>
  );
}

export default HealthRisk;