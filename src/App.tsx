import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
            <h1 className="font-display text-2xl font-bold text-primary mb-4">Dashboard</h1>
            <p className="text-on-surface-variant font-body">Welcome to The Clinical Curator</p>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
