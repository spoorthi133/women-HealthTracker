// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// function Dashboard() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div>
//      <nav className="navbar">
//   <div
//     className="navbar-brand"
//     onClick={() => navigate("/dashboard")}
//     style={{ cursor: "pointer" }}
//   >
//     Health Tracker
//   </div>

//   <ul className="navbar-menu">
//     <li>
//       <span className="navbar-link" onClick={() => navigate("/dashboard")}>
//         Dashboard
//       </span>
//     </li>

//     <li>
//       <span className="navbar-link" onClick={() => navigate("/symptoms")}>
//         Symptoms
//       </span>
//     </li>

//     <li>
//       <span className="navbar-link" onClick={() => navigate("/cycles")}>
//         Cycles
//       </span>
//     </li>

//     <li>
//       <span
//         className="navbar-link"
//         onClick={() => navigate("/hormonal-health")}
//       >
//         Hormonal Health
//       </span>
//     </li>

//      {/* AI INSIGHTS LINK */}
//     <li>
//       <span
//         className="navbar-link"
//         onClick={() => navigate("/ai-insights")}
//       >
//         AI Insights
//       </span>
//     </li>

//     <li>
//       <button onClick={logout} className="btn btn-outline">
//         Logout
//       </button>
//     </li>
//   </ul>
// </nav>


//       <div className="container fade-in">
//         <div className="dashboard-header">
//           <h1 className="dashboard-title">Hello, Beautiful! 💕</h1>
//           <p className="dashboard-subtitle">Welcome back, {user?.email}</p>
//         </div>

//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-icon">📝</div>
//             <div className="stat-value">0</div>
//             <div className="stat-label">Symptom Logs</div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">🌸</div>
//             <div className="stat-value">0</div>
//             <div className="stat-label">Tracked Cycles</div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">🤖</div>
//             <div className="stat-value">0</div>
//             <div className="stat-label">AI Insights</div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">✨</div>
//             <div className="stat-value">Good</div>
//             <div className="stat-label">Overall Health</div>
//           </div>
//         </div>

//         <div className="grid grid-2">
//           <div className="card card-gradient">
//             <div className="card-icon">📊</div>
//             <h2 className="card-title">Quick Actions</h2>
//             <div className="flex-between mt-3">
//               <button className="btn btn-primary" onClick={() => navigate('/symptoms')}>
//                 Log Symptoms
//               </button>
//               <button className="btn btn-soft" onClick={() => navigate('/cycles')}>
//                 Start Cycle
//               </button>
//             </div>
//           </div>

//           <div className="card">
//             <h2 className="card-title">Recent Activity</h2>
//             <p className="text-muted">No activity yet. Start tracking your health!</p>
//             <div className="mt-3">
//               <button className="btn btn-secondary" onClick={() => navigate('/symptoms')}>
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="card">
//           <h2 className="card-title">💡 Health Tips</h2>
//           <p>Track your cycle regularly to understand your body better. Consistent logging helps identify patterns and improves health insights!</p>
//           <div className="flex gap-2 mt-3">
//             <span className="badge badge-primary">Wellness</span>
//             <span className="badge badge-info">Tracking</span>
//             <span className="badge badge-success">Health</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

import { cycleAPI, symptomAPI, aiAPI } from "../api/api";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 🔥 Dashboard stats
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
    <div>
      {/* NAVBAR */}
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
            <span className="navbar-link" onClick={() => navigate("/hormonal-health")}>
              Hormonal Health
            </span>
          </li>

          <li>
            <span className="navbar-link" onClick={() => navigate("/ai-insights")}>
              AI Insights
            </span>
          </li>

          <li>
            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <div className="container fade-in">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Hello, Beautiful! 💕</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.email}</p>
        </div>

        {/* 🔥 Dynamic Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{symptomCount}</div>
            <div className="stat-label">Symptom Logs</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🌸</div>
            <div className="stat-value">{cycleCount}</div>
            <div className="stat-label">Tracked Cycles</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🤖</div>
            <div className="stat-value">{insightCount}</div>
            <div className="stat-label">AI Insights</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✨</div>
            <div className="stat-value">Good</div>
            <div className="stat-label">Overall Health</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-2">
          <div className="card card-gradient">
            <div className="card-icon">📊</div>
            <h2 className="card-title">Quick Actions</h2>
            <div className="flex-between mt-3">
              <button className="btn btn-primary" onClick={() => navigate("/symptoms")}>
                Log Symptoms
              </button>
              <button className="btn btn-soft" onClick={() => navigate("/cycles")}>
                Start Cycle
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Recent Activity</h2>
            <p className="text-muted">
              Your recent actions will appear here as you track more health data.
            </p>
            <div className="mt-3">
              <button className="btn btn-secondary" onClick={() => navigate("/symptoms")}>
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div className="card">
          <h2 className="card-title">💡 Health Tips</h2>
          <p>
            Track your cycle regularly to understand your body better. Consistent logging helps
            identify patterns and improves health insights!
          </p>
          <div className="flex gap-2 mt-3">
            <span className="badge badge-primary">Wellness</span>
            <span className="badge badge-info">Tracking</span>
            <span className="badge badge-success">Health</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
