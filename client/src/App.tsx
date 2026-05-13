import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  // Determine the wrapper class based on auth and current route
  let wrapperClass = '';
  if (isAuthenticated) {
    wrapperClass = 'main-content';
  } else if (location.pathname === '/login' || location.pathname === '/register') {
    wrapperClass = 'auth-content';
  }

  return (
    <>
      {isAuthenticated && <Navbar />}
      <div className={wrapperClass} style={!isAuthenticated && wrapperClass !== 'auth-content' ? { width: '100%' } : {}}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={!isAuthenticated ? <Landing /> : <ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
