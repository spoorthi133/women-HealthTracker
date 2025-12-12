import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
// import Navbar from "./components/Navbar";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './styles/App.css';
import HormonalHealth from './pages/HormonalHealth';

import AIInsights from './pages/AIInsights';

import Cycles from "./pages/Cycles";
import Symptoms from "./pages/Symptoms";
// import AI from "./pages/AI";
import ProtectedRoute from "./components/ProtectedRoute";
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
       {/* <Navbar /> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />

          <Route path="/hormonal-health" element={<HormonalHealth />} />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />

                  <Route path="/cycles" element={<ProtectedRoute><Cycles /></ProtectedRoute>} />
        <Route path="/symptoms" element={<ProtectedRoute><Symptoms /></ProtectedRoute>} />
        {/* <Route path="/ai" element={<ProtectedRoute><AI /></ProtectedRoute>} /> */}

<Route path="/hormonal-health" element={<HormonalHealth />} />

        <Route 
  path="/ai-insights" 
  element={
    <PrivateRoute>
      <AIInsights />
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


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;