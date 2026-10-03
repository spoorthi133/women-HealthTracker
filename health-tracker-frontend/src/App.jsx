import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HormonalHealth from "./pages/HormonalHealth";
import AIInsights from "./pages/AIInsights";
import Cycles from "./pages/Cycles";
import Symptoms from "./pages/Symptoms";

import "./styles/App.css";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/cycles"
            element={
              <PrivateRoute>
                <Cycles />
              </PrivateRoute>
            }
          />

          <Route
            path="/symptoms"
            element={
              <PrivateRoute>
                <Symptoms />
              </PrivateRoute>
            }
          />

          <Route
            path="/ai-insights"
            element={
              <PrivateRoute>
                <AIInsights />
              </PrivateRoute>
            }
          />

          {/* Public route */}
          <Route
            path="/hormonal-health"
            element={<HormonalHealth />}
          />

          {/* Default */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;