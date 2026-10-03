import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { aiAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

/* All styles live in this file, scoped under .aii.
   No page/body background is set, so your existing bg color stays. */
const styles = `
.aii {
  --aii-ink: #3a1f2b;
  --aii-ink-soft: #7a5563;
  --aii-accent: #e0457b;
  --aii-accent-deep: #b82a5c;
  --aii-line: rgba(58, 31, 43, 0.12);
  --aii-surface: rgba(255, 255, 255, 0.82);
  --aii-radius: 18px;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  min-height: 100vh;
}

/* Navbar */
.aii-nav {
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
  background: var(--aii-surface);
  backdrop-filter: blur(10px);
  border: 1px solid var(--aii-line);
  border-radius: 999px;
  box-shadow: 0 6px 24px rgba(58, 31, 43, 0.1);
}
.aii-brand {
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
  color: var(--aii-ink);
  cursor: pointer;
  white-space: nowrap;
}
.aii-menu {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
}
.aii-link {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--aii-ink-soft);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
.aii-link:hover {
  background: rgba(224, 69, 123, 0.1);
  color: var(--aii-accent-deep);
}
.aii-link--active,
.aii-link--active:hover {
  background: var(--aii-accent);
  color: #fff;
  cursor: default;
}
.aii-logout {
  margin-left: 6px;
  padding: 8px 16px;
  border: 1px solid var(--aii-ink);
  border-radius: 999px;
  background: transparent;
  color: var(--aii-ink);
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.aii-logout:hover {
  background: var(--aii-ink);
  color: #fff;
}

/* Layout */
.aii-main {
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 20px 72px;
}
.aii-header { margin-bottom: 32px; }
.aii-title {
  margin: 0 0 8px;
  font-size: clamp(2rem, 5vw, 2.8rem);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--aii-ink);
}
.aii-subtitle {
  margin: 0;
  max-width: 52ch;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--aii-ink-soft);
}

/* Cards */
.aii-card {
  margin-bottom: 20px;
  padding: 26px 28px;
  background: var(--aii-surface);
  border: 1px solid var(--aii-line);
  border-radius: var(--aii-radius);
  box-shadow: 0 10px 30px rgba(58, 31, 43, 0.08);
  color: var(--aii-ink);
}
.aii-card-title {
  margin: 0 0 16px;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* Buttons */
.aii-btn {
  padding: 12px 24px;
  border: 0;
  border-radius: 12px;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s, background 0.15s;
}
.aii-btn:active { transform: translateY(1px); }
.aii-btn--primary {
  background: linear-gradient(135deg, #f78fb8, #e0457b);
  color: #fff;
  box-shadow: 0 6px 16px rgba(224, 69, 123, 0.3);
}
.aii-btn--primary:hover { background: linear-gradient(135deg, #ee77a6, #b82a5c); }
.aii-btn--secondary { background: #ffd6e4; color: #b82a5c; box-shadow: inset 0 0 0 1.5px #f4a3c0; }
.aii-btn--secondary:hover { background: #ffc2d6; color: #8f1d45; }

/* Ask row */
.aii-ask { display: flex; gap: 10px; }
.aii-input {
  flex: 1;
  min-width: 0;
  padding: 12px 16px;
  border: 1.5px solid var(--aii-line);
  border-radius: 12px;
  background: #fff;
  font: inherit;
  font-size: 0.95rem;
  color: var(--aii-ink);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.aii-input::placeholder { color: #b392a0; }
.aii-input:focus {
  outline: none;
  border-color: var(--aii-accent);
  box-shadow: 0 0 0 4px rgba(224, 69, 123, 0.15);
}

/* AI output */
.aii-result {
  margin-top: 20px;
  padding: 16px 18px;
  background: #fff;
  border-left: 4px solid var(--aii-accent);
  border-radius: 4px 12px 12px 4px;
  font-size: 0.97rem;
  line-height: 1.7;
  color: var(--aii-ink);
}
.aii-result--chat { border-left-color: var(--aii-ink); }

/* Error */
.aii-error {
  margin: 0 0 20px;
  padding: 12px 16px;
  background: #fdecec;
  border: 1px solid #f3b6b6;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 500;
  color: #a12626;
}

/* Safety note */
.aii-note {
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,214,228,0.95));
}
.aii-note p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--aii-ink-soft);
}

/* Focus + responsive */
.aii-link:focus-visible,
.aii-logout:focus-visible,
.aii-btn:focus-visible,
.aii-brand:focus-visible {
  outline: 3px solid rgba(224, 69, 123, 0.5);
  outline-offset: 2px;
}
@media (max-width: 720px) {
  .aii-nav { flex-direction: column; align-items: stretch; border-radius: 24px; padding: 12px 14px; }
  .aii-ask { flex-direction: column; }
  .aii-card { padding: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .aii * { transition: none !important; }
}
`;

function AIInsights() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const formatAIText = (text = "") => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // italic
      .replace(/\n/g, "<br/>"); // line breaks
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await aiAPI.analyze(30, "comprehensive");
      setAnalysis(res.data.insight);
    } catch {
      setError("AI analysis failed");
    }
    setLoading(false);
  };

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await aiAPI.ask(question);
      setAnswer(res.data.answer);
      setQuestion("");
    } catch {
      setError("AI could not answer");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="aii">
      <style>{styles}</style>

      {/* PAGE-SPECIFIC NAVBAR */}
      <nav className="aii-nav">
        <div className="aii-brand" onClick={() => navigate("/dashboard")}>
          Health Tracker
        </div>

        <ul className="aii-menu">
          <li className="aii-link" onClick={() => navigate("/dashboard")}>
            Dashboard
          </li>
          <li className="aii-link" onClick={() => navigate("/symptoms")}>
            Symptoms
          </li>
          <li className="aii-link" onClick={() => navigate("/cycles")}>
            Cycles
          </li>
          <li className="aii-link" onClick={() => navigate("/hormonal-health")}>
            Hormonal Health
          </li>
          <li className="aii-link aii-link--active">AI Insights</li>
          <li>
            <button onClick={handleLogout} className="aii-logout">
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* PAGE CONTENT */}
      <main className="aii-main">
        <header className="aii-header">
          <h1 className="aii-title">AI Health Insights</h1>
          <p className="aii-subtitle">
            Personalized insights based on your cycles &amp; symptoms
          </p>
        </header>

        {/* ANALYZE */}
        <section className="aii-card">
          <h3 className="aii-card-title">🔍 Automatic Health Analysis</h3>
          <button className="aii-btn aii-btn--primary" onClick={runAnalysis}>
            {loading ? "Analyzing..." : "Analyze My Health"}
          </button>

          {analysis && (
            <div
              className="aii-result"
              dangerouslySetInnerHTML={{
                __html: formatAIText(analysis),
              }}
            />
          )}
        </section>

        {/* ASK AI */}
        <section className="aii-card">
          <h3 className="aii-card-title">💬 Ask AI Anything</h3>
          <div className="aii-ask">
            <input
              className="aii-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Why am I feeling tired before periods?"
            />
            <button className="aii-btn aii-btn--secondary" onClick={askAI}>
              Talk to AI
            </button>
          </div>

          {answer && (
            <div
              className="aii-result aii-result--chat"
              dangerouslySetInnerHTML={{
                __html: `<strong>AI:</strong><br/>${formatAIText(answer)}`,
              }}
            />
          )}
        </section>

        {error && <p className="aii-error">{error}</p>}

        {/* SAFETY NOTE */}
        <section className="aii-card aii-note">
          <h3 className="aii-card-title">🩺 AI Safety Note</h3>
          <p>
            This AI does NOT diagnose diseases.
            It helps you understand patterns and decide when to seek medical advice.
          </p>
        </section>
      </main>
    </div>
  );
}

export default AIInsights;