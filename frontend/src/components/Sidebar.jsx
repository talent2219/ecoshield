import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, BarChart3, Settings, LogOut, CreditCard } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin  = user.role === 'admin';

  const userLinks = [
    { path: '/dashboard', icon: <LayoutDashboard size={18}/>, label: 'Dashboard' },
    { path: '/reports',   icon: <BarChart3 size={18}/>,       label: 'Reports'   },
    { path: '/settings',  icon: <Settings size={18}/>,        label: 'Settings'  },
  ];
  const adminLinks = [
    { path: '/admin',    icon: <ShieldAlert size={18}/>, label: 'Admin Panel' },
    { path: '/reports',  icon: <BarChart3 size={18}/>,   label: 'Reports'     },
    { path: '/settings', icon: <Settings size={18}/>,    label: 'Settings'    },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <CreditCard size={22} color="#16a34a"/>
        <span>EcoShield</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <button key={l.path} className={`nav-btn ${location.pathname === l.path ? 'active' : ''}`} onClick={() => navigate(l.path)}>
            {l.icon} {l.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{user.name.charAt(0)}</div>
          <div>
            <div className="uname">{user.name}</div>
            <div className="urole">{user.role === 'admin' ? 'Administrator' : 'EcoCash Visa'}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}><LogOut size={16}/> Logout</button>
      </div>
    </aside>
  );
}
