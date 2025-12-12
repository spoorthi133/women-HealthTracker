import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { healthAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

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
    LOW: "green",
    MODERATE: "orange",
    HIGH: "red",
  };

  return (
    <>
      {/* ✅ PAGE-SPECIFIC NAVBAR */}
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


      {/* ✅ PAGE CONTENT */}
      <div className="container fade-in">
        <div className="dashboard-header">
          <h1>Hormonal Health (PCOS / PCOD Awareness) </h1>
          <p className="dashboard-subtitle">
            Pattern-based insights from your cycles and symptoms
          </p>
        </div>

        {loading && <p>Analyzing your data...</p>}

        {error && <div className="alert alert-error">{error}</div>}

        {data && (
          <div className="card">
            <h2>
              Risk Level:{" "}
              <span style={{ color: colorMap[data.risk_level] }}>
                {data.risk_level}
              </span>
            </h2>

            <p className="mt-2">
              <strong>Score:</strong> {data.score}
            </p>

            <hr className="my-3" />

            <h3>What we observed 👇</h3>
            <ul style={{ paddingLeft: "1.2rem", lineHeight: "1.8" }}>
              {data.observations.map((obs, index) => (
                <li key={index}>{obs}</li>
              ))}
            </ul>

            <hr className="my-3" />

            <div className="alert alert-info">
              <strong>Important:</strong>
              <br />
              {data.recommendation}
            </div>
          </div>
        )}

        <div className="card mt-4">
          <h3>💡 Why this matters</h3>
          <ul>
            <li>PCOS / PCOD often affects menstrual regularity</li>
            <li>Early awareness helps lifestyle correction</li>
            <li>This tool does NOT diagnose conditions</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default HormonalHealth;
