import { useState, useEffect } from "react";
import { format, addDays, subDays, differenceInDays } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { cycleAPI } from "../api/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

/* All styles live in this file, scoped under .cyc.
   No page/body background is set, so your existing bg color stays. */
const styles = `
.cyc {
  --c-ink: #3a1f2b;
  --c-ink-soft: #7a5563;
  --c-accent: #e0457b;
  --c-accent-deep: #b82a5c;
  --c-blush: #ffd6e4;
  --c-blush-soft: #fff0f5;
  --c-line: rgba(58, 31, 43, 0.12);
  --c-surface: rgba(255, 255, 255, 0.82);
  --c-radius: 18px;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  color: var(--c-ink);
}

/* ---------- Navbar ---------- */
.cyc-nav {
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
  background: var(--c-surface);
  backdrop-filter: blur(10px);
  border: 1px solid var(--c-line);
  border-radius: 999px;
  box-shadow: 0 6px 24px rgba(58, 31, 43, 0.1);
}
.cyc-brand {
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
  color: var(--c-ink);
  text-decoration: none;
  white-space: nowrap;
}
.cyc-menu {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
}
.cyc-link {
  display: block;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--c-ink-soft);
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
.cyc-link:hover {
  background: rgba(224, 69, 123, 0.1);
  color: var(--c-accent-deep);
}
.cyc-link--active,
.cyc-link--active:hover {
  background: var(--c-accent);
  color: #fff;
}
.cyc-logout {
  margin-left: 6px;
  padding: 8px 16px;
  border: 1px solid var(--c-ink);
  border-radius: 999px;
  background: transparent;
  color: var(--c-ink);
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.cyc-logout:hover { background: var(--c-ink); color: #fff; }

/* ---------- Layout ---------- */
.cyc-main {
  max-width: 860px;
  margin: 0 auto;
  padding: 48px 20px 72px;
}
.cyc-header { margin-bottom: 28px; }
.cyc-title {
  margin: 0 0 8px;
  font-size: clamp(2rem, 5vw, 2.8rem);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.cyc-subtitle {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--c-ink-soft);
}

/* ---------- Alerts ---------- */
.cyc-alert {
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.93rem;
  font-weight: 500;
  border: 1px solid;
}
.cyc-alert--error { background: #fdecec; border-color: #f3b6b6; color: #a12626; }
.cyc-alert--success { background: #eaf7ee; border-color: #b4dfc0; color: #1f6b3a; }
.cyc-alert--warning { background: #fff4e0; border-color: #f1d49a; color: #8a5a00; }

/* ---------- Stats ---------- */
.cyc-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 32px;
}
.cyc-stat {
  padding: 18px 14px;
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--c-radius);
  box-shadow: 0 8px 22px rgba(58, 31, 43, 0.07);
  text-align: center;
}
.cyc-stat:first-child {
  background: linear-gradient(135deg, #f78fb8, #e0457b);
  border-color: transparent;
  color: #fff;
}
.cyc-stat:first-child .cyc-stat-label { color: rgba(255, 255, 255, 0.88); }
.cyc-stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.cyc-stat-label {
  margin-top: 4px;
  font-size: 0.8rem;
  color: var(--c-ink-soft);
}

/* ---------- Section bar ---------- */
.cyc-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}
.cyc-h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* ---------- Buttons ---------- */
.cyc-btn {
  padding: 12px 22px;
  border: 0;
  border-radius: 12px;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s, background 0.15s;
}
.cyc-btn:active { transform: translateY(1px); }
.cyc-btn--primary {
  background: linear-gradient(135deg, #f78fb8, #e0457b);
  color: #fff;
  box-shadow: 0 6px 16px rgba(224, 69, 123, 0.3);
}
.cyc-btn--primary:hover { background: linear-gradient(135deg, #ee77a6, #b82a5c); }
.cyc-btn--soft {
  background: var(--c-blush);
  color: var(--c-accent-deep);
  box-shadow: inset 0 0 0 1.5px #f4a3c0;
}
.cyc-btn--soft:hover { background: #ffc2d6; color: #8f1d45; }

/* ---------- Cards ---------- */
.cyc-card {
  margin-bottom: 20px;
  padding: 26px 28px;
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--c-radius);
  box-shadow: 0 10px 30px rgba(58, 31, 43, 0.08);
}
.cyc-card--tint {
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,214,228,0.95));
}
.cyc-card-title {
  margin: 0 0 18px;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* ---------- Form ---------- */
.cyc-field { margin-bottom: 18px; }
.cyc-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}
.cyc-input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px;
  border: 1.5px solid var(--c-line);
  border-radius: 12px;
  background: #fff;
  font: inherit;
  font-size: 0.95rem;
  color: var(--c-ink);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.cyc-input:focus {
  outline: none;
  border-color: var(--c-accent);
  box-shadow: 0 0 0 4px rgba(224, 69, 123, 0.15);
}
.cyc-hint {
  display: block;
  margin-top: 5px;
  font-size: 0.8rem;
  color: var(--c-ink-soft);
}
.cyc-row { display: flex; flex-wrap: wrap; gap: 10px; }

/* ---------- Predictions ---------- */
.cyc-pred {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  padding: 14px 18px;
  background: #fff;
  border: 1px solid var(--c-line);
  border-radius: 14px;
}
.cyc-pred--hl {
  background: var(--c-blush-soft);
  border-color: #f4a3c0;
  border-left: 5px solid var(--c-accent);
}
.cyc-pred-icon {
  flex: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
.cyc-pred-icon--next { background: var(--c-accent); }
.cyc-pred-icon--ovu { background: #8f1d45; }
.cyc-pred-icon--fertile { background: var(--c-blush); box-shadow: inset 0 0 0 2px #f4a3c0; }
.cyc-pred-icon--phase { background: #f78fb8; }
.cyc-pred-body h4 {
  margin: 0 0 2px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-ink-soft);
}
.cyc-pred-date {
  margin: 0 0 4px;
  font-size: 1.1rem;
  font-weight: 700;
}
.cyc-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--c-accent);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
}
.cyc-badge--soft { background: var(--c-blush); color: var(--c-accent-deep); }
.cyc-badge--latest { margin-right: 6px; background: #fff; color: var(--c-accent-deep); box-shadow: inset 0 0 0 1.5px #f4a3c0; }
.cyc-phase {
  margin-top: 20px;
  padding: 16px 18px;
  background: var(--c-blush-soft);
  border-radius: 14px;
}
.cyc-phase h4 { margin: 0 0 8px; font-size: 1rem; }
.cyc-phase p { margin: 0; font-size: 0.95rem; line-height: 1.65; color: var(--c-ink-soft); }

/* ---------- Calendar legend ---------- */
.cyc-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}
.cyc-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #fff;
  border: 1px solid var(--c-line);
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
}
.cyc-dot { width: 14px; height: 14px; border-radius: 50%; }
.cyc-dot--period { background: var(--c-accent); }
.cyc-dot--fertile { background: var(--c-blush); box-shadow: inset 0 0 0 1.5px #f4a3c0; }
.cyc-dot--ovulation { background: #8f1d45; }
.cyc-dot--today {
  position: relative;
  background: #fff;
  box-shadow: inset 0 0 0 1.5px var(--c-line);
}
.cyc-dot--today::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--c-ink);
  transform: translateX(-50%);
}

/* ---------- Calendar ---------- */
.cyc-cal {
  padding: 18px;
  background: #fff;
  border: 1px solid var(--c-line);
  border-radius: 22px;
  box-shadow: 0 8px 24px rgba(58, 31, 43, 0.06);
}
.cyc .react-calendar {
  width: 100%;
  border: 0;
  background: transparent;
  font-family: inherit;
  line-height: 1.2;
}

/* header: arrows + month label */
.cyc .react-calendar__navigation {
  display: flex;
  align-items: center;
  height: auto;
  margin-bottom: 14px;
}
.cyc .react-calendar__navigation button {
  min-width: 44px;
  height: 44px;
  border-radius: 14px;
  background: transparent;
  color: var(--c-ink);
  font-size: 1rem;
  font-weight: 700;
  transition: background 0.15s;
}
.cyc .react-calendar__navigation__label {
  font-size: 1.15rem !important;
  letter-spacing: -0.01em;
}
.cyc .react-calendar__navigation__arrow {
  font-size: 1.5rem !important;
  color: var(--c-accent-deep) !important;
}
.cyc .react-calendar__navigation button:enabled:hover,
.cyc .react-calendar__navigation button:enabled:focus {
  background: var(--c-blush);
}
.cyc .react-calendar__navigation button:disabled { background: transparent; opacity: 0.35; }

/* weekday row */
.cyc .react-calendar__month-view__weekdays { margin-bottom: 6px; }
.cyc .react-calendar__month-view__weekdays__weekday {
  padding: 6px 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--c-ink-soft);
}
.cyc .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }

/* day tiles: round, evenly spaced */
.cyc .react-calendar__tile {
  position: relative;
  padding: 0;
  border: 3px solid transparent;
  background: transparent;
  background-clip: padding-box;
  color: var(--c-ink);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background 0.12s, color 0.12s;
}
.cyc .react-calendar__month-view__days__day {
  aspect-ratio: 1 / 1;
  border-radius: 50%;
}
.cyc .react-calendar__year-view .react-calendar__tile,
.cyc .react-calendar__decade-view .react-calendar__tile,
.cyc .react-calendar__century-view .react-calendar__tile {
  padding: 18px 6px;
  border-radius: 14px;
}
.cyc .react-calendar__tile:enabled:hover,
.cyc .react-calendar__tile:enabled:focus {
  background: var(--c-blush);
}
.cyc .react-calendar__month-view__days__day--neighboringMonth { color: #cdb8c1; }

/* today: bold with a small dot under the number */
.cyc .react-calendar__tile--now { font-weight: 800; }
.cyc .react-calendar__month-view__days__day.react-calendar__tile--now::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 18%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  transform: translateX(-50%);
}

/* selected date: dark ring */
.cyc .react-calendar__tile--active,
.cyc .react-calendar__tile--active:enabled:hover,
.cyc .react-calendar__tile--active:enabled:focus {
  background: transparent;
  color: var(--c-ink);
  box-shadow: inset 0 0 0 2px var(--c-ink);
}

/* cycle days */
.cyc .react-calendar__tile.period-day {
  background: var(--c-accent);
  color: #fff;
  font-weight: 700;
}
.cyc .react-calendar__tile.period-day:enabled:hover,
.cyc .react-calendar__tile.period-day:enabled:focus { background: var(--c-accent-deep); }

.cyc .react-calendar__tile.fertile-day {
  background: var(--c-blush);
  color: var(--c-accent-deep);
  font-weight: 700;
}
.cyc .react-calendar__tile.fertile-day:enabled:hover,
.cyc .react-calendar__tile.fertile-day:enabled:focus { background: #ffc2d6; }

.cyc .react-calendar__tile.ovulation-day {
  background: #8f1d45;
  color: #fff;
  font-weight: 800;
  box-shadow: 0 0 0 4px rgba(224, 69, 123, 0.25);
}
.cyc .react-calendar__tile.ovulation-day:enabled:hover,
.cyc .react-calendar__tile.ovulation-day:enabled:focus { background: #721536; }

/* ---------- Pro tip ---------- */
.cyc-tip {
  margin-top: 22px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #fff0f5, #ffd6e4);
  border-left: 4px solid var(--c-accent);
  border-radius: 4px 12px 12px 4px;
  font-size: 0.93rem;
  line-height: 1.65;
}

/* ---------- History ---------- */
.cyc-history { display: flex; flex-direction: column; gap: 10px; }
.cyc-hitem {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: #fff;
  border: 1.5px solid var(--c-line);
  border-radius: 14px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.cyc-hitem:hover { border-color: #f4a3c0; }
.cyc-hitem--selected { border-color: var(--c-accent); background: var(--c-blush-soft); }
.cyc-hicon {
  flex: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--c-accent);
}
.cyc-hbody { flex: 1; }
.cyc-hdate { font-weight: 700; }
.cyc-hdur { font-size: 0.82rem; color: var(--c-ink-soft); }
.cyc-delete {
  padding: 6px 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--c-ink-soft);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.cyc-delete:hover { background: #fdecec; color: #a12626; }

/* ---------- Tips list ---------- */
.cyc-tips {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}
.cyc-tips li::before {
  content: "";
  position: absolute;
  left: 15px;
  top: 17px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--c-accent);
}
.cyc-tips li {
  position: relative;
  padding: 10px 14px 10px 34px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  font-size: 0.93rem;
  line-height: 1.55;
  color: var(--c-ink-soft);
}

/* ---------- Loading ---------- */
.cyc-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 120px 20px;
}
.cyc-spinner {
  width: 44px;
  height: 44px;
  border: 4px solid var(--c-blush);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: cyc-spin 0.8s linear infinite;
}
.cyc-loading-text { margin: 0; color: var(--c-ink-soft); font-weight: 500; }
@keyframes cyc-spin { to { transform: rotate(360deg); } }

/* ---------- Focus + responsive ---------- */
.cyc-link:focus-visible,
.cyc-logout:focus-visible,
.cyc-btn:focus-visible,
.cyc-brand:focus-visible,
.cyc-delete:focus-visible {
  outline: 3px solid rgba(224, 69, 123, 0.5);
  outline-offset: 2px;
}
@media (max-width: 720px) {
  .cyc-nav { flex-direction: column; align-items: stretch; border-radius: 24px; padding: 12px 14px; }
  .cyc-stats { grid-template-columns: repeat(2, 1fr); }
  .cyc-card { padding: 20px; }
  .cyc-bar { flex-direction: column; align-items: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .cyc * { transition: none !important; }
  .cyc-spinner { animation-duration: 2s; }
}
`;

function Cycles() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // -------------------------------------------------
  // Form states
  // -------------------------------------------------

  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);

  // -------------------------------------------------
  // Prediction states
  // -------------------------------------------------

  const [predictedPeriods, setPredictedPeriods] = useState([]);
  const [ovulationDate, setOvulationDate] = useState(null);
  const [fertileWindow, setFertileWindow] = useState([]);
  const [phase, setPhase] = useState("");

  // -------------------------------------------------
  // UI states
  // -------------------------------------------------

  const [calendarValue, setCalendarValue] = useState(new Date());
  const [warning, setWarning] = useState("");
  const [savedCycles, setSavedCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedCycle, setSelectedCycle] = useState(null);

  // -------------------------------------------------
  // Load cycles when page opens
  // -------------------------------------------------

  useEffect(() => {
    fetchCycles();
  }, []);

  // -------------------------------------------------
  // Fetch cycles
  // -------------------------------------------------

  const fetchCycles = async () => {
    try {
      const response = await cycleAPI.getAll();

      const cycles = response.data;

      setSavedCycles(cycles);

      // Auto-predict from latest cycle
      if (cycles.length > 0) {
        const latest = cycles[0];

        setLastPeriod(latest.cycle_start_date);

        let lengthToUse = latest.cycle_length || 28;

        // Calculate average cycle length from saved cycles
        if (cycles.length >= 2) {
          const lengths = [];

          for (let i = 0; i < cycles.length - 1; i++) {
            const start1 = parseDateOnly(
              cycles[i].cycle_start_date
            );

            const start2 = parseDateOnly(
              cycles[i + 1].cycle_start_date
            );

            lengths.push(
              Math.abs(differenceInDays(start1, start2))
            );
          }

          if (lengths.length > 0) {
            const avg = Math.round(
              lengths.reduce((a, b) => a + b, 0) / lengths.length
            );

            lengthToUse = avg;
            setCycleLength(avg);
          }
        } else {
          setCycleLength(lengthToUse);
        }

        // IMPORTANT:
        // Pass the calculated length directly instead of
        // depending on the asynchronous React state update.
        autoPredictFromLatest(
          latest.cycle_start_date,
          lengthToUse,
          latest.period_length || 5
        );
      }
    } catch (err) {
      console.error("Failed to load cycles:", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------
  // Parse YYYY-MM-DD safely
  // Prevents timezone shifting
  // -------------------------------------------------

  const parseDateOnly = (dateString) => {
    const [year, month, day] = dateString
      .split("-")
      .map(Number);

    return new Date(year, month - 1, day);
  };

  // -------------------------------------------------
  // Delete cycle
  // -------------------------------------------------

  const handleDeleteCycle = async (cycleId) => {
    if (!window.confirm("Delete this cycle?")) return;

    try {
      await cycleAPI.delete(cycleId);

      await fetchCycles();

      if (selectedCycle?.id === cycleId) {
        setSelectedCycle(null);
        setLastPeriod("");
        setPredictedPeriods([]);
      }
    } catch (err) {
      console.error("Failed to delete cycle:", err);
    }
  };

  // -------------------------------------------------
  // Predict cycles
  // -------------------------------------------------

  const autoPredictFromLatest = (
    startDate,
    length = cycleLength,
    currentPeriodLength = periodLength
  ) => {
    // Parse date without timezone conversion
    const start = parseDateOnly(startDate);

    const periods = [];

    // Today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // -------------------------------------------------
    // Find the NEXT FUTURE period
    // -------------------------------------------------

    let nextPeriod = new Date(start);

    while (nextPeriod <= today) {
      nextPeriod = addDays(nextPeriod, length);
    }

    // -------------------------------------------------
    // Generate next 6 predicted periods
    // -------------------------------------------------

    for (let i = 0; i < 6; i++) {
      periods.push(new Date(nextPeriod));

      nextPeriod = addDays(
        nextPeriod,
        length
      );
    }

    setPredictedPeriods(periods);

    // -------------------------------------------------
    // Ovulation
    // -------------------------------------------------

    const ovu = subDays(periods[0], 14);

    setOvulationDate(ovu);

    // -------------------------------------------------
    // Fertile window
    // -------------------------------------------------

    setFertileWindow([
      subDays(ovu, 5),
      subDays(ovu, 4),
      subDays(ovu, 3),
      subDays(ovu, 2),
      subDays(ovu, 1),
      ovu,
      addDays(ovu, 1),
    ]);

    // -------------------------------------------------
    // Current phase
    // -------------------------------------------------

    const diff = differenceInDays(
      today,
      start
    );

    if (diff <= currentPeriodLength) {
      setPhase("Menstrual Phase");
    } else if (diff < length / 2) {
      setPhase("Follicular Phase");
    } else if (
      diff === Math.floor(length / 2)
    ) {
      setPhase("Ovulation Phase");
    } else {
      setPhase("Luteal Phase");
    }

    // -------------------------------------------------
    // Irregular cycle warning
    // -------------------------------------------------

    if (length < 21 || length > 35) {
      setWarning(
        "Your cycle length seems irregular. Consider consulting a healthcare provider."
      );
    } else {
      setWarning("");
    }
  };

  // -------------------------------------------------
  // Manual prediction
  // -------------------------------------------------

  const predict = () => {
    if (!lastPeriod) {
      setError("Please select your last period date.");
      return;
    }

    autoPredictFromLatest(
      lastPeriod,
      cycleLength,
      periodLength
    );
  };

  // -------------------------------------------------
  // Select cycle from history
  // -------------------------------------------------

  const handleSelectCycle = (cycle) => {
    setSelectedCycle(cycle);

    const selectedLength =
      cycle.cycle_length || cycleLength;

    const selectedPeriodLength =
      cycle.period_length || periodLength;

    setLastPeriod(cycle.cycle_start_date);
    setCycleLength(selectedLength);
    setPeriodLength(selectedPeriodLength);

    // Recalculate prediction immediately
    autoPredictFromLatest(
      cycle.cycle_start_date,
      selectedLength,
      selectedPeriodLength
    );

    setCalendarValue(
      parseDateOnly(cycle.cycle_start_date)
    );
  };

  // -------------------------------------------------
  // Save new cycle
  // -------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      await cycleAPI.create({
        cycle_start_date: lastPeriod,
        cycle_length: cycleLength,
        period_length: periodLength,
      });

      setSuccess(
        "Cycle saved successfully!"
      );

      // Predict immediately using entered values
      autoPredictFromLatest(
        lastPeriod,
        cycleLength,
        periodLength
      );

      // Refresh saved cycles
      await fetchCycles();

      setShowForm(false);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to save cycle"
      );
    }
  };

  // -------------------------------------------------
  // Logout
  // -------------------------------------------------

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // -------------------------------------------------
  // Cycle click
  // -------------------------------------------------

  const handleCycleClick = (cycle) => {
    setSelectedCycle(cycle);

    const start = parseDateOnly(
      cycle.cycle_start_date
    );

    setCalendarValue(start);

    autoPredictFromLatest(
      cycle.cycle_start_date,
      cycle.cycle_length || cycleLength,
      cycle.period_length || periodLength
    );
  };

  // -------------------------------------------------
  // Days until next period
  // -------------------------------------------------

  const getDaysUntilNextPeriod = () => {
    if (predictedPeriods.length === 0) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextPeriod = new Date(
      predictedPeriods[0]
    );

    nextPeriod.setHours(0, 0, 0, 0);

    return Math.max(
      differenceInDays(
        nextPeriod,
        today
      ),
      0
    );
  };

  // -------------------------------------------------
  // Loading screen
  // -------------------------------------------------

  if (loading) {
    return (
      <div className="cyc">
        <style>{styles}</style>

        <nav className="cyc-nav">
          <a href="/dashboard" className="cyc-brand">
            Health Tracker
          </a>
        </nav>

        <div className="cyc-loading">
          <div className="cyc-spinner"></div>

          <p className="cyc-loading-text">
            Loading your cycles...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------
  // UI
  // -------------------------------------------------

  return (
    <div className="cyc">
      <style>{styles}</style>

      {/* NAVBAR */}

      <nav className="cyc-nav">
        <a href="/dashboard" className="cyc-brand">
          Health Tracker
        </a>

        <ul className="cyc-menu">
          <li>
            <a href="/dashboard" className="cyc-link">
              Dashboard
            </a>
          </li>

          <li>
            <a href="/symptoms" className="cyc-link">
              Symptoms
            </a>
          </li>

          <li>
            <a
              href="/cycles"
              className="cyc-link cyc-link--active"
            >
              Cycles
            </a>
          </li>

          <li>
            <a
              onClick={() =>
                navigate("/hormonal-health")
              }
              className="cyc-link"
            >
              Hormonal Health
            </a>
          </li>

          <li>
            <a href="/ai-insights" className="cyc-link">
              AI Insights
            </a>
          </li>

          <li>
            <button
              onClick={handleLogout}
              className="cyc-logout"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <main className="cyc-main">

        {/* HEADER */}

        <header className="cyc-header">
          <h1 className="cyc-title">Cycle Tracker</h1>

          <p className="cyc-subtitle">
            Track and predict your menstrual cycle
          </p>
        </header>

        {/* ALERTS */}

        {error && (
          <div className="cyc-alert cyc-alert--error">
            {error}
          </div>
        )}

        {success && (
          <div className="cyc-alert cyc-alert--success">
            {success}
          </div>
        )}

        {warning && (
          <div className="cyc-alert cyc-alert--warning">
            {warning}
          </div>
        )}

        {/* QUICK STATS */}

        {predictedPeriods.length > 0 && (
          <div className="cyc-stats">

            <div className="cyc-stat">
              <div className="cyc-stat-value">
                {getDaysUntilNextPeriod()}
              </div>

              <div className="cyc-stat-label">
                Days Until Period
              </div>
            </div>

            <div className="cyc-stat">
              <div className="cyc-stat-value">
                {phase.split(" ")[0]}
              </div>

              <div className="cyc-stat-label">
                {phase
                  .split(" ")
                  .slice(1)
                  .join(" ")}
              </div>
            </div>

            <div className="cyc-stat">
              <div className="cyc-stat-value">
                {format(
                  ovulationDate,
                  "MMM dd"
                )}
              </div>

              <div className="cyc-stat-label">
                Ovulation Day
              </div>
            </div>

            <div className="cyc-stat">
              <div className="cyc-stat-value">
                {cycleLength}
              </div>

              <div className="cyc-stat-label">
                Cycle Length (days)
              </div>
            </div>

          </div>
        )}

        {/* FORM HEADER */}

        <div className="cyc-bar">
          <h2 className="cyc-h2">Track New Cycle</h2>

          <button
            className="cyc-btn cyc-btn--primary"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "Cancel"
              : "Start New Cycle"}
          </button>
        </div>

        {/* FORM */}

        {showForm && (
          <div className="cyc-card cyc-card--tint">

            <h3 className="cyc-card-title">
              Cycle Details
            </h3>

            <form onSubmit={handleSubmit}>

              <div className="cyc-field">

                <label className="cyc-label">
                  Last Period Start Date
                </label>

                <input
                  type="date"
                  className="cyc-input"
                  required
                  value={lastPeriod}
                  onChange={(e) =>
                    setLastPeriod(
                      e.target.value
                    )
                  }
                  max={format(
                    new Date(),
                    "yyyy-MM-dd"
                  )}
                />

              </div>

              <div className="cyc-field">

                <label className="cyc-label">
                  Average Cycle Length (days)
                </label>

                <input
                  type="number"
                  className="cyc-input"
                  required
                  value={cycleLength}
                  onChange={(e) =>
                    setCycleLength(
                      Number(e.target.value)
                    )
                  }
                  min="21"
                  max="45"
                />

                <small className="cyc-hint">
                  Normal range: 21-35 days
                </small>

              </div>

              <div className="cyc-field">

                <label className="cyc-label">
                  Period Duration (days)
                </label>

                <input
                  type="number"
                  className="cyc-input"
                  required
                  value={periodLength}
                  onChange={(e) =>
                    setPeriodLength(
                      Number(e.target.value)
                    )
                  }
                  min="2"
                  max="10"
                />

                <small className="cyc-hint">
                  Normal range: 3-7 days
                </small>

              </div>

              <div className="cyc-row">

                <button
                  type="submit"
                  className="cyc-btn cyc-btn--primary"
                >
                  Save & Predict
                </button>

                <button
                  type="button"
                  className="cyc-btn cyc-btn--soft"
                  onClick={predict}
                >
                  Preview Prediction
                </button>

              </div>

            </form>
          </div>
        )}

        {/* PREDICTIONS */}

        {predictedPeriods.length > 0 && (
          <div className="cyc-card">

            <h3 className="cyc-card-title">
              Your Cycle Predictions
            </h3>

            {/* NEXT PERIOD */}

            <div className="cyc-pred cyc-pred--hl">

              <div className="cyc-pred-icon cyc-pred-icon--next"></div>

              <div className="cyc-pred-body">

                <h4>Next Period</h4>

                <p className="cyc-pred-date">
                  {format(
                    predictedPeriods[0],
                    "MMMM dd, yyyy"
                  )}
                </p>

                <span className="cyc-badge">
                  {getDaysUntilNextPeriod()} days away
                </span>

              </div>

            </div>

            {/* OVULATION */}

            <div className="cyc-pred">

              <div className="cyc-pred-icon cyc-pred-icon--ovu"></div>

              <div className="cyc-pred-body">

                <h4>Ovulation Day</h4>

                <p className="cyc-pred-date">
                  {format(
                    ovulationDate,
                    "MMMM dd, yyyy"
                  )}
                </p>

              </div>

            </div>

            {/* FERTILE WINDOW */}

            <div className="cyc-pred">

              <div className="cyc-pred-icon cyc-pred-icon--fertile"></div>

              <div className="cyc-pred-body">

                <h4>Fertile Window</h4>

                <p className="cyc-pred-date">
                  {format(
                    fertileWindow[0],
                    "MMM dd"
                  )}{" "}
                  –{" "}
                  {format(
                    fertileWindow[6],
                    "MMM dd, yyyy"
                  )}
                </p>

                <span className="cyc-badge cyc-badge--soft">
                  7 days
                </span>

              </div>

            </div>

            {/* CURRENT PHASE */}

            <div className="cyc-pred">

              <div className="cyc-pred-icon cyc-pred-icon--phase"></div>

              <div className="cyc-pred-body">

                <h4>Current Phase</h4>

                <p className="cyc-pred-date">
                  {phase}
                </p>

              </div>

            </div>

            {/* PHASE INFO */}

            <div className="cyc-phase">

              <h4>
                About Your Current Phase
              </h4>

              {phase.includes("Menstrual") && (
                <p>
                  <strong>Menstrual Phase:</strong>{" "}
                  Your period days. Take it easy,
                  stay hydrated, and manage cramps
                  with heat therapy.
                </p>
              )}

              {phase.includes("Follicular") && (
                <p>
                  <strong>Follicular Phase:</strong>{" "}
                  Energy is rising! Great time for
                  new activities and social events.
                </p>
              )}

              {phase.includes("Ovulation") && (
                <p>
                  <strong>Ovulation Phase:</strong>{" "}
                  Peak fertility and energy! You're
                  at your most confident.
                </p>
              )}

              {phase.includes("Luteal") && (
                <p>
                  <strong>Luteal Phase:</strong>{" "}
                  Energy may dip. Focus on self-care
                  and prepare for your period.
                </p>
              )}

            </div>

          </div>
        )}

        {/* CALENDAR */}

        <div className="cyc-card">

          <h3 className="cyc-card-title">
            Cycle Calendar
          </h3>

          <div className="cyc-legend">

            <div className="cyc-legend-item">
              <span className="cyc-dot cyc-dot--period"></span>
              <span>Period days</span>
            </div>

            <div className="cyc-legend-item">
              <span className="cyc-dot cyc-dot--fertile"></span>
              <span>Fertile window</span>
            </div>

            <div className="cyc-legend-item">
              <span className="cyc-dot cyc-dot--ovulation"></span>
              <span>Ovulation day</span>
            </div>

            <div className="cyc-legend-item">
              <span className="cyc-dot cyc-dot--today"></span>
              <span>Today</span>
            </div>

          </div>

          <div className="cyc-cal">

            <Calendar
              value={calendarValue}
              onChange={setCalendarValue}
              tileClassName={({ date }) => {

                const isPeriod =
                  predictedPeriods.some(
                    (d) =>
                      date >= d &&
                      date <=
                        addDays(
                          d,
                          periodLength - 1
                        )
                  );

                const isFertile =
                  fertileWindow.some(
                    (f) =>
                      format(
                        f,
                        "yyyy-MM-dd"
                      ) ===
                      format(
                        date,
                        "yyyy-MM-dd"
                      )
                  );

                const isOvulation =
                  ovulationDate &&
                  format(
                    date,
                    "yyyy-MM-dd"
                  ) ===
                    format(
                      ovulationDate,
                      "yyyy-MM-dd"
                    );

                if (isOvulation)
                  return "ovulation-day";

                if (isFertile)
                  return "fertile-day";

                if (isPeriod)
                  return "period-day";

                return null;
              }}
            />

          </div>

          {/* Calendar Tips */}

          <div className="cyc-tip">
            <strong>Tip:</strong>{" "}
            Tap any date to see details.
            The brighter the color,
            the more significant the day.
            Ovulation day is the darkest
            tile because it's your most
            fertile day.
          </div>

        </div>

        {/* CYCLE HISTORY */}

        {savedCycles.length > 0 && (
          <div className="cyc-card">

            <h3 className="cyc-card-title">
              Cycle History
            </h3>

            <div className="cyc-history">

              {savedCycles
                .slice(0, 6)
                .map((cycle, index) => (

                <div
                  key={cycle.id}
                  className={`cyc-hitem ${
                    selectedCycle?.id ===
                    cycle.id
                      ? "cyc-hitem--selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleCycleClick(cycle)
                  }
                >

                  <div className="cyc-hicon"></div>

                  <div className="cyc-hbody">

                    <div className="cyc-hdate">
                      {format(
                        parseDateOnly(
                          cycle.cycle_start_date
                        ),
                        "MMMM dd, yyyy"
                      )}
                    </div>

                    {cycle.cycle_end_date && (
                      <div className="cyc-hdur">
                        Duration:{" "}
                        {differenceInDays(
                          parseDateOnly(
                            cycle.cycle_end_date
                          ),
                          parseDateOnly(
                            cycle.cycle_start_date
                          )
                        )}{" "}
                        days
                      </div>
                    )}

                  </div>

                  {index === 0 && (
                    <span className="cyc-badge cyc-badge--latest">
                      Latest
                    </span>
                  )}

                  {/* DELETE BUTTON */}

                  <button
                    className="cyc-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCycle(
                        cycle.id
                      );
                    }}
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>

          </div>
        )}

        {/* HEALTH TIPS */}

        <div className="cyc-card cyc-card--tint">

          <h3 className="cyc-card-title">
            Cycle Tracking Tips
          </h3>

          <ul className="cyc-tips">

            <li>
              Track your cycle consistently
              for accurate predictions
            </li>

            <li>
              Note symptoms during different
              phases to identify patterns
            </li>

            <li>
              A normal cycle is 21-35 days
              (28 days average)
            </li>

            <li>
              Irregular cycles can have
              different causes; consult a
              healthcare provider if concerned
            </li>

            <li>
              Set reminders for upcoming
              periods and fertile windows
            </li>

            <li>
              Exercise and diet can affect
              cycle regularity
            </li>

          </ul>

        </div>

      </main>
    </div>
  );
}

export default Cycles;