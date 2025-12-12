import { useEffect, useState } from "react";
import { healthAPI } from "../api/api";

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

  if (loading) return <p className="loading">Loading health insights...</p>;
  if (error) return <p className="alert-error">{error}</p>;

  const colorMap = {
    LOW: "risk-low",
    MODERATE: "risk-moderate",
    HIGH: "risk-high",
  };

  return (
    <div className="container fade-in">
      <h1 className="page-title">🌸 Hormonal Health Overview</h1>

      {/* Risk Card */}
      <div className={`risk-card ${colorMap[data.risk_level]}`}>
        <h2>{data.risk_level} RISK</h2>
        <p className="risk-score">Score: {data.score}</p>
        <p className="risk-text">{data.recommendation}</p>
      </div>

      {/* Observations */}
      <div className="card">
        <h3>🔍 Observations</h3>
        <ul className="observations-list">
          {data.observations.map((obs, i) => (
            <li key={i}>• {obs}</li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="card card-gradient">
        <h3>💡 What You Can Do</h3>
        <ul className="action-list">
          <li>Track cycles consistently</li>
          <li>Maintain a balanced diet & exercise</li>
          <li>Manage stress & sleep properly</li>
          {data.risk_level !== "LOW" && (
            <li>Consider consulting a gynecologist</li>
          )}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer">
        ⚠️ This analysis is informational only and not a medical diagnosis.
      </div>
    </div>
  );
}

export default HealthRisk;
