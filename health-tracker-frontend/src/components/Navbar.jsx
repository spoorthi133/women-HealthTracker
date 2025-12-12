import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const active = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="logo">🌸 Women Health</span>
      </div>

      <div className="nav-center">
        <Link to="/dashboard" className={active("/dashboard")}>Dashboard</Link>
        <Link to="/cycles" className={active("/cycles")}>Cycles</Link>
        <Link to="/symptoms" className={active("/symptoms")}>Symptoms</Link>
        <Link to="/health" className={active("/health")}>PCOS Risk</Link>
        <Link to="/ai" className={active("/ai")}>AI</Link>
      </div>

      <div className="nav-right">
        <button className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}
