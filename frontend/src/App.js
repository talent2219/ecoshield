import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) return (
    <Router>
      <Routes>
        <Route path="*" element={<LoginPage onLogin={setUser} />} />
      </Routes>
    </Router>
  );

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage user={user} onLogout={() => setUser(null)} />} />
        <Route path="/admin"     element={user.role === 'admin' ? <AdminPage user={user} onLogout={() => setUser(null)} /> : <Navigate to="/dashboard" />} />
        <Route path="/reports"   element={<ReportsPage user={user} onLogout={() => setUser(null)} />} />
        <Route path="/settings"  element={<SettingsPage user={user} onLogout={() => setUser(null)} />} />
        <Route path="*"          element={<Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />} />
      </Routes>
    </Router>
  );
}
