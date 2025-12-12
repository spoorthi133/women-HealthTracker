import { useState, useEffect } from "react";
import { format, addDays, subDays, differenceInDays } from "date-fns";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cycleAPI } from '../api/api';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Cycles() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Form states
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  
  // Prediction states
  const [predictedPeriods, setPredictedPeriods] = useState([]);
  const [ovulationDate, setOvulationDate] = useState(null);
  const [fertileWindow, setFertileWindow] = useState([]);
  const [phase, setPhase] = useState("");
  
  // UI states
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [warning, setWarning] = useState("");
  const [savedCycles, setSavedCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
const [selectedCycle, setSelectedCycle] = useState(null);

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      const response = await cycleAPI.getAll();


      setSavedCycles(response.data);
      
      // Auto-predict from latest cycle
      if (response.data.length > 0) {
        const latest = response.data[0];
        setLastPeriod(latest.cycle_start_date);
        // Calculate average cycle length
        if (response.data.length >= 2) {
          const lengths = [];
          for (let i = 0; i < response.data.length - 1; i++) {
            const start1 = new Date(response.data[i].cycle_start_date);
            const start2 = new Date(response.data[i + 1].cycle_start_date);
            lengths.push(Math.abs(differenceInDays(start1, start2)));
          }
          const avg = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
          setCycleLength(avg);
        }
        autoPredictFromLatest(latest.cycle_start_date);
      }
    } catch (err) {
      console.error('Failed to load cycles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCycle = async (cycleId) => {
  if (!window.confirm("Delete this cycle?")) return;

  try {
    await cycleAPI.delete(cycleId);
    await fetchCycles();

    // If the deleted cycle was selected, reset
    if (selectedCycle?.id === cycleId) {
      setSelectedCycle(null);
      setLastPeriod("");
      setPredictedPeriods([]);
    }

  } catch (err) {
    console.error("Failed to delete cycle:", err);
  }
};


  const autoPredictFromLatest = (startDate) => {
    const start = new Date(startDate);
    const periods = [];

    for (let i = 1; i <= 6; i++) {
      periods.push(addDays(start, cycleLength * i));
    }
    setPredictedPeriods(periods);

    const ovu = subDays(periods[0], 14);
    setOvulationDate(ovu);

    setFertileWindow([
      subDays(ovu, 5),
      subDays(ovu, 4),
      subDays(ovu, 3),
      subDays(ovu, 2),
      subDays(ovu, 1),
      ovu,
      addDays(ovu, 1),
    ]);

    const today = new Date();
    const diff = differenceInDays(today, start);

    if (diff <= periodLength) setPhase("Menstrual Phase ");
    else if (diff < cycleLength / 2) setPhase("Follicular Phase ");
    else if (diff === Math.floor(cycleLength / 2)) setPhase("Ovulation Phase ");
    else setPhase("Luteal Phase ");

    if (cycleLength < 21 || cycleLength > 35) {
      setWarning("⚠️ Your cycle length seems irregular. This can be a sign of hormonal imbalance or PCOS/PCOD. Consider consulting a healthcare provider.");
    } else {
      setWarning("");
    }
  };

  
  const predict = () => {
    autoPredictFromLatest(lastPeriod);
  };

  // When user clicks a cycle in history
const handleSelectCycle = (cycle) => {
  setSelectedCycle(cycle);

  // Set form values
  setLastPeriod(cycle.cycle_start_date);
  setCycleLength(cycle.cycle_length || cycleLength);
  setPeriodLength(cycle.period_length || periodLength);

  // Recalculate predictions
  autoPredictFromLatest(cycle.cycle_start_date);

  // Move calendar focus to selected cycle
  setCalendarValue(new Date(cycle.cycle_start_date));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Save to backend
await cycleAPI.create({
  cycle_start_date: lastPeriod
});


      
      setSuccess('✨ Cycle saved successfully!');
      predict();
      fetchCycles();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save cycle');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCycleClick = (cycle) => {
  setSelectedCycle(cycle);

  const start = new Date(cycle.cycle_start_date);

  // Jump calendar to that month
  setCalendarValue(start);

  // Recalculate predictions for selected cycle
  autoPredictFromLatest(start);
};


  const getDaysUntilNextPeriod = () => {
    if (predictedPeriods.length === 0) return null;
    const today = new Date();
    const next = predictedPeriods[0];
    const days = differenceInDays(next, today);
    return days > 0 ? days : 0;
  };

  const getPhaseEmoji = () => {
    if (phase.includes("Menstrual")) return "🩸";
    if (phase.includes("Follicular")) return "🌱";
    if (phase.includes("Ovulation")) return "🌸";
    if (phase.includes("Luteal")) return "🌙";
    return "✨";
  };

  if (loading) {
    return (
      <div>
        <nav className="navbar">
          <a href="/dashboard" className="navbar-brand">Health Tracker</a>
        </nav>
        <div className="loading">
          <div className="spinner"></div>
          <p className="loading-text">Loading your cycles...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <a href="/dashboard" className="navbar-brand">Health Tracker</a>
        <ul className="navbar-menu">
          <li><a href="/dashboard" className="navbar-link">Dashboard</a></li>
          <li><a href="/symptoms" className="navbar-link">Symptoms</a></li>
          <li><a href="/cycles" className="navbar-link" style={{color: 'var(--primary)'}}>Cycles</a></li>
          <li>
      <a
        onClick={() => navigate("/hormonal-health")}
        className="navbar-link"
      >
        Hormonal Health
      </a>
    </li>
          <li><a href="/ai-insights" className="navbar-link">AI Insights</a></li>
          <li>
            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
          </li>
        </ul>
      </nav>

      <div className="container fade-in">
        <div className="dashboard-header">
          <h1 className="dashboard-title"> Cycle Tracker</h1>
          <p className="dashboard-subtitle">Track and predict your menstrual cycle</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}
        {warning && <div className="alert alert-warning">{warning}</div>}

        {/* Quick Stats */}
        {predictedPeriods.length > 0 && (
          <div className="stats-grid">
            <div className="stat-card cycle-stat">
              <div className="stat-icon">📅</div>
              <div className="stat-value">{getDaysUntilNextPeriod()}</div>
              <div className="stat-label">Days Until Period</div>
            </div>

            <div className="stat-card cycle-stat">
              <div className="stat-icon">{getPhaseEmoji()}</div>
              <div className="stat-value">{phase.split(' ')[0]}</div>
              <div className="stat-label">{phase.split(' ').slice(1).join(' ')}</div>
            </div>

            <div className="stat-card cycle-stat">
              <div className="stat-icon">🌸</div>
              <div className="stat-value">{format(ovulationDate, "MMM dd")}</div>
              <div className="stat-label">Ovulation Day</div>
            </div>

            <div className="stat-card cycle-stat">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{cycleLength}</div>
              <div className="stat-label">Cycle Length (days)</div>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="flex-between mb-3">
          <h2>Track New Cycle</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '❌ Cancel' : '➕ Start New Cycle'}
          </button>
        </div>

        {showForm && (
          <div className="card card-gradient slide-in">
            <h3 className="card-title">📝 Cycle Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">📅 Last Period Start Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  required 
                  value={lastPeriod} 
                  onChange={(e) => setLastPeriod(e.target.value)}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <div className="form-group">
                <label className="form-label">🔄 Average Cycle Length (days)</label>
                <input 
                  type="number" 
                  className="form-input"
                  required 
                  value={cycleLength} 
                  onChange={(e) => setCycleLength(+e.target.value)}
                  min="21"
                  max="45"
                />
                <small className="text-muted">Normal range: 21-35 days</small>
              </div>

              <div className="form-group">
                <label className="form-label">🩸 Period Duration (days)</label>
                <input 
                  type="number" 
                  className="form-input"
                  required 
                  value={periodLength} 
                  onChange={(e) => setPeriodLength(+e.target.value)}
                  min="2"
                  max="10"
                />
                <small className="text-muted">Normal range: 3-7 days</small>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">💾 Save & Predict</button>
                <button type="button" className="btn btn-soft" onClick={predict}>
                  🔮 Preview Prediction
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Predictions */}
        {predictedPeriods.length > 0 && (
          <div className="card cycle-predictions">
            <h3 className="card-title">🔮 Your Cycle Predictions</h3>
            
            <div className="prediction-item highlight">
              <div className="prediction-icon">📅</div>
              <div className="prediction-content">
                <h4>Next Period</h4>
                <p className="prediction-date">{format(predictedPeriods[0], "MMMM dd, yyyy")}</p>
                <span className="badge badge-primary">{getDaysUntilNextPeriod()} days away</span>
              </div>
            </div>

            <div className="prediction-item">
              <div className="prediction-icon">🌸</div>
              <div className="prediction-content">
                <h4>Ovulation Day</h4>
                <p className="prediction-date">{format(ovulationDate, "MMMM dd, yyyy")}</p>
              </div>
            </div>

            <div className="prediction-item">
              <div className="prediction-icon">💕</div>
              <div className="prediction-content">
                <h4>Fertile Window</h4>
                <p className="prediction-date">
                  {format(fertileWindow[0], "MMM dd")} – {format(fertileWindow[6], "MMM dd, yyyy")}
                </p>
                <span className="badge badge-info">7 days</span>
              </div>
            </div>

            <div className="prediction-item">
              <div className="prediction-icon">{getPhaseEmoji()}</div>
              <div className="prediction-content">
                <h4>Current Phase</h4>
                <p className="prediction-date">{phase}</p>
              </div>
            </div>

            <div className="phase-info mt-4">
              <h4>📚 About Your Current Phase</h4>
              {phase.includes("Menstrual") && (
                <p>🩸 <strong>Menstrual Phase:</strong> Your period days. Take it easy, stay hydrated, and manage cramps with heat therapy.</p>
              )}
              {phase.includes("Follicular") && (
                <p>🌱 <strong>Follicular Phase:</strong> Energy is rising! Great time for new activities and social events.</p>
              )}
              {phase.includes("Ovulation") && (
                <p>🌸 <strong>Ovulation Phase:</strong> Peak fertility and energy! You're at your most confident.</p>
              )}
              {phase.includes("Luteal") && (
                <p>🌙 <strong>Luteal Phase:</strong> Energy may dip. Focus on self-care and prepare for your period.</p>
              )}
            </div>
          </div>
        )}

{/* Calendar */}
<div className="card cycle-calendar-card">
  <h3 className="card-title">🗓 Cycle Calendar</h3>
  
  <div className="calendar-legend">
    <div className="legend-item">
      <span className="legend-color period"></span>
      <span>Period Days 🩸</span>
    </div>
    <div className="legend-item">
      <span className="legend-color fertile"></span>
      <span>Fertile Window 💕</span>
    </div>
    <div className="legend-item">
      <span className="legend-color ovulation"></span>
      <span>Ovulation Day 🌸</span>
    </div>
    <div className="legend-item" style={{background: 'linear-gradient(135deg, var(--primary-light), var(--accent))', border: '2px solid var(--primary)'}}>
      <span className="legend-color" style={{background: 'var(--primary)', border: '3px solid white'}}></span>
      <span>Today ✨</span>
    </div>
  </div>

  <div className="calendar-wrapper">
    <Calendar
      value={calendarValue}
      onChange={setCalendarValue}
      tileClassName={({ date }) => {
        const isPeriod = predictedPeriods.some(
          (d) => date >= d && date <= addDays(d, periodLength - 1)
        );

        const isFertile = fertileWindow.some(
          (f) => format(f, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
        );

        const isOvulation =
          ovulationDate &&
          format(date, "yyyy-MM-dd") === format(ovulationDate, "yyyy-MM-dd");

        if (isOvulation) return "ovulation-day";
        if (isFertile) return "fertile-day";
        if (isPeriod) return "period-day";
        return null;
      }}
    />
  </div>

  {/* Calendar Tips */}
  <div className="mt-4 p-3" style={{
    background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
    borderRadius: 'var(--radius-md)',
    borderLeft: '4px solid var(--info)'
  }}>
    <p style={{fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text)'}}>
      <strong>💡 Pro Tip:</strong> Tap any date to see details. The brighter the color, the more significant the day! 
      Ovulation day sparkles ✨ because it's your most fertile day.
    </p>
  </div>
</div>

        {/* Cycle History */}
        {/* {savedCycles.length > 0 && (
          <div className="card">
            <h3 className="card-title">📊 Cycle History</h3>
            <div className="cycle-history">
              {savedCycles.slice(0, 6).map((cycle, index) => (
 <div 
  key={cycle.id} 
  className={`history-item ${selectedCycle?.id === cycle.id ? "selected-cycle" : ""}`}

  onClick={() => handleCycleClick(cycle)}

  style={{ cursor: "pointer" }}
> 




                  <div className="history-icon">🌸</div>
                  <div className="history-content">
                    <div className="history-date">
                      {format(new Date(cycle.cycle_start_date), "MMMM dd, yyyy")}
                    </div>
                    {cycle.cycle_end_date && (
                      <div className="history-duration">
                        Duration: {differenceInDays(new Date(cycle.cycle_end_date), new Date(cycle.cycle_start_date))} days
                      </div>
                    )}
                  </div>
                  {index === 0 && <span className="badge badge-success">Latest</span>}
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Cycle History */}
{savedCycles.length > 0 && (
  <div className="card">
    <h3 className="card-title">📊 Cycle History</h3>
    <div className="cycle-history">
      {savedCycles.slice(0, 6).map((cycle, index) => (
        <div
          key={cycle.id}
          className={`history-item ${selectedCycle?.id === cycle.id ? "selected-cycle" : ""}`}
          onClick={() => handleCycleClick(cycle)}
          style={{ cursor: "pointer", position: "relative" }}
        >

          {/* main content */}
          <div className="history-icon">🌸</div>
          <div className="history-content">
            <div className="history-date">
              {format(new Date(cycle.cycle_start_date), "MMMM dd, yyyy")}
            </div>

            {cycle.cycle_end_date && (
              <div className="history-duration">
                Duration: {differenceInDays(new Date(cycle.cycle_end_date), new Date(cycle.cycle_start_date))} days
              </div>
            )}
          </div>

          {index === 0 && <span className="badge badge-success">Latest</span>}

          {/* ❌ Delete button */}
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation(); // prevent selecting cycle when deleting
              handleDeleteCycle(cycle.id);
            }}
          >
            ❌
          </button>

        </div>
      ))}
    </div>
  </div>
)}


        {/* Health Tips */}
        <div className="card card-gradient">
          <h3 className="card-title">💡 Cycle Tracking Tips</h3>
          <ul className="tips-list">
            <li>✨ Track your cycle consistently for accurate predictions</li>
            <li>🌸 Note symptoms during different phases to identify patterns</li>
            <li>💕 A normal cycle is 21-35 days (28 days average)</li>
            <li>🩺 Irregular cycles may indicate PCOS, thyroid issues, or stress</li>
            <li>📱 Set reminders for upcoming periods and fertile windows</li>
            <li>🏃‍♀️ Exercise and diet affect cycle regularity</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cycles;