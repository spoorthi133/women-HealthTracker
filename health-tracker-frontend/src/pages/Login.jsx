import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* All styles live in this file, scoped under .au.
   No page/body background is set, so your existing bg color stays. */
const styles = `
.au {
  --a-ink: #3a1f2b;
  --a-ink-soft: #7a5563;
  --a-accent: #e0457b;
  --a-accent-deep: #b82a5c;
  --a-blush: #ffd6e4;
  --a-line: rgba(58, 31, 43, 0.12);
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  box-sizing: border-box;
  color: var(--a-ink);
}
.au-card {
  width: 100%;
  max-width: 420px;
  padding: 40px 36px 32px;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(10px);
  border: 1px solid var(--a-line);
  border-radius: 24px;
  box-shadow: 0 18px 50px rgba(58, 31, 43, 0.14);
}
.au-title {
  margin: 0 0 8px;
  font-size: 2rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.au-subtitle {
  margin: 0 0 26px;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--a-ink-soft);
}

.au-alert {
  margin-bottom: 18px;
  padding: 12px 16px;
  border: 1px solid #f3b6b6;
  border-radius: 12px;
  background: #fdecec;
  font-size: 0.92rem;
  font-weight: 500;
  color: #a12626;
}

.au-field { margin-bottom: 18px; }
.au-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}
.au-input {
  width: 100%;
  box-sizing: border-box;
  padding: 13px 16px;
  border: 1.5px solid var(--a-line);
  border-radius: 12px;
  background: #fff;
  font: inherit;
  font-size: 0.95rem;
  color: var(--a-ink);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.au-input::placeholder { color: #b392a0; }
.au-input:focus {
  outline: none;
  border-color: var(--a-accent);
  box-shadow: 0 0 0 4px rgba(224, 69, 123, 0.15);
}

.au-btn {
  width: 100%;
  margin-top: 6px;
  padding: 14px 22px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #f78fb8, #e0457b);
  color: #fff;
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(224, 69, 123, 0.32);
  cursor: pointer;
  transition: transform 0.12s, background 0.15s;
}
.au-btn:hover:not(:disabled) { background: linear-gradient(135deg, #ee77a6, #b82a5c); }
.au-btn:active:not(:disabled) { transform: translateY(1px); }
.au-btn:disabled { opacity: 0.65; cursor: not-allowed; box-shadow: none; }

.au-link {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--a-line);
  text-align: center;
  font-size: 0.93rem;
  color: var(--a-ink-soft);
}
.au-link a {
  font-weight: 700;
  color: var(--a-accent-deep);
  text-decoration: none;
}
.au-link a:hover { text-decoration: underline; }

.au-btn:focus-visible,
.au-link a:focus-visible {
  outline: 3px solid rgba(224, 69, 123, 0.5);
  outline-offset: 2px;
}
@media (max-width: 480px) {
  .au-card { padding: 30px 22px 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .au * { transition: none !important; }
}
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="au">
      <style>{styles}</style>

      <div className="au-card">
        <h1 className="au-title">Welcome Back!</h1>
        <p className="au-subtitle">Track your wellness journey</p>
        
        {error && (
          <div className="au-alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="au-field">
            <label className="au-label">Email</label>
            <input
              type="email"
              className="au-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="au-field">
            <label className="au-label">Password</label>
            <input
              type="password"
              className="au-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="au-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="au-link">
          Don't have an account? <Link to="/register">Create one here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;