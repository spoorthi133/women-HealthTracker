import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { aiAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

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
    <>
      {/* ✅ PAGE-SPECIFIC NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
           Health Tracker
        </div>

        <ul className="navbar-menu">
          <li onClick={() => navigate("/dashboard")} className="navbar-link">
            Dashboard
          </li>
          <li onClick={() => navigate("/symptoms")} className="navbar-link">
            Symptoms
          </li>
          <li onClick={() => navigate("/cycles")} className="navbar-link">
            Cycles
          </li>
          <li>
      <a
        onClick={() => navigate("/hormonal-health")}
        className="navbar-link"
      >
        Hormonal Health
      </a>
    </li>
          <li className="navbar-link active">
            AI Insights
          </li>
          <li>
            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* ✅ PAGE CONTENT */}
      <div className="container fade-in">
        <h1> AI Health Insights</h1>
        <p className="subtitle">
          Personalized insights based on your cycles & symptoms
        </p>

        {/* ANALYZE */}
        <div className="card">
          <h3>🔍 Automatic Health Analysis</h3>
          <button className="btn btn-primary" onClick={runAnalysis}>
            {loading ? "Analyzing..." : "Analyze My Health"}
          </button>

{analysis && (
  <div
    className="ai-box"
    dangerouslySetInnerHTML={{
      __html: formatAIText(analysis),
    }}
  />
)}

        </div>

        {/* ASK AI */}
        <div className="card">
          <h3>💬 Ask AI Anything</h3>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Why am I feeling tired before periods?"
          />
          <button className="btn btn-secondary" onClick={askAI}>
            Talk to AI
          </button>

{answer && (
  <div
    className="ai-chat"
    dangerouslySetInnerHTML={{
      __html: `<strong>AI:</strong><br/>${formatAIText(answer)}`,
    }}
  />
)}

        </div>

        {error && <p className="error">{error}</p>}

        {/* SAFETY NOTE */}
        <div className="card card-gradient">
          <h3>🩺 AI Safety Note</h3>
          <p>
            This AI does NOT diagnose diseases.
            It helps you understand patterns and decide when to seek medical advice.
          </p>
        </div>
      </div>
    </>
  );
}

export default AIInsights;
