import { Link, useLocation } from "react-router-dom";

/* All styles live in this file, scoped under .nv.
   No page/body background is set, so your existing bg color stays. */
const styles = `
.nv {
  --n-ink: #3a1f2b;
  --n-ink-soft: #7a5563;
  --n-accent: #e0457b;
  --n-accent-deep: #b82a5c;
  --n-line: rgba(58, 31, 43, 0.12);
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
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border: 1px solid var(--n-line);
  border-radius: 999px;
  box-shadow: 0 6px 24px rgba(58, 31, 43, 0.1);
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  color: var(--n-ink);
}
.nv-left { display: flex; align-items: center; }
.nv-logo {
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
.nv-center {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}
.nv-link {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--n-ink-soft);
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
.nv-link:hover {
  background: rgba(224, 69, 123, 0.1);
  color: var(--n-accent-deep);
}
.nv-link.nv-active,
.nv-link.nv-active:hover {
  background: var(--n-accent);
  color: #fff;
}
.nv-right { display: flex; align-items: center; }
.nv-logout {
  padding: 8px 16px;
  border: 1px solid var(--n-ink);
  border-radius: 999px;
  background: transparent;
  color: var(--n-ink);
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.nv-logout:hover { background: var(--n-ink); color: #fff; }

.nv-link:focus-visible,
.nv-logout:focus-visible {
  outline: 3px solid rgba(224, 69, 123, 0.5);
  outline-offset: 2px;
}
@media (max-width: 720px) {
  .nv {
    flex-direction: column;
    align-items: stretch;
    border-radius: 24px;
    padding: 12px 14px;
  }
  .nv-right { justify-content: flex-end; }
}
@media (prefers-reduced-motion: reduce) {
  .nv * { transition: none !important; }
}
`;

export default function Navbar() {
  const location = useLocation();

  const active = (path) =>
    location.pathname === path ? "nv-link nv-active" : "nv-link";

  return (
    <nav className="nv">
      <style>{styles}</style>

      <div className="nv-left">
        <span className="nv-logo">Women Health</span>
      </div>

      <div className="nv-center">
        <Link to="/dashboard" className={active("/dashboard")}>Dashboard</Link>
        <Link to="/cycles" className={active("/cycles")}>Cycles</Link>
        <Link to="/symptoms" className={active("/symptoms")}>Symptoms</Link>
        <Link to="/health" className={active("/health")}>PCOS Risk</Link>
        <Link to="/ai" className={active("/ai")}>AI</Link>
      </div>

      <div className="nv-right">
        <button className="nv-logout">Logout</button>
      </div>
    </nav>
  );
}