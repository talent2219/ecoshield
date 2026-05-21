import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getTransactions, getStats, getAlerts, markAlertRead } from '../api/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldX, ShieldAlert, Activity, DollarSign, X, CreditCard } from 'lucide-react';
import './DashboardPage.css';

const riskColor = { low: '#16a34a', medium: '#d97706', high: '#ea580c', critical: '#dc2626' };
const statusStyle = {
  completed: { bg: '#f0fdf4', color: '#16a34a', label: 'Completed' },
  flagged:   { bg: '#fffbeb', color: '#d97706', label: 'Flagged'   },
  blocked:   { bg: '#fef2f2', color: '#dc2626', label: 'Blocked'   },
};

export default function DashboardPage({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [stats,        setStats]        = useState(null);
  const [alerts,       setAlerts]       = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([getTransactions(user.id), getStats(), getAlerts(user.id)]).then(([tx, st, al]) => {
      setTransactions(tx.data); setStats(st.data); setAlerts(al.data);
    }).finally(() => setLoading(false));
  }, [user.id]);

  const dismiss = async (id) => {
    await markAlertRead(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  if (loading) return <div className="loading"><div className="spinner"/></div>;

  const chartData = [
    { name: 'Low',      count: transactions.filter(t => t.riskLevel === 'low').length,      fill: '#16a34a' },
    { name: 'Medium',   count: transactions.filter(t => t.riskLevel === 'medium').length,   fill: '#d97706' },
    { name: 'High',     count: transactions.filter(t => t.riskLevel === 'high').length,     fill: '#ea580c' },
    { name: 'Critical', count: transactions.filter(t => t.riskLevel === 'critical').length, fill: '#dc2626' },
  ];

  return (
    <div className="page-layout">
      <Sidebar user={user} onLogout={onLogout}/>
      <main className="main">
        <div className="page-header">
          <div>
            <h2>Welcome back, {user.name.split(' ')[0]}</h2>
            <p>EcoCash Visa · {user.cardNumber} · Expires {user.cardExpiry}</p>
          </div>
          <div className="balance-chip"><DollarSign size={16}/> ${user.balance.toFixed(2)}</div>
        </div>

        {alerts.filter(a => !a.isRead).map(a => (
          <div key={a.id} className={`alert-bar sev-${a.severity}`}>
            <ShieldAlert size={18}/>
            <div className="alert-text"><strong>{a.title}</strong> — {a.message}</div>
            <button onClick={() => dismiss(a.id)}><X size={16}/></button>
          </div>
        ))}

        {stats && (
          <div className="stats-row">
            {[
              { icon: <Activity size={20} color="#2563eb"/>,    bg: '#eff6ff', label: 'Total Transactions', value: stats.total        },
              { icon: <ShieldAlert size={20} color="#d97706"/>, bg: '#fffbeb', label: 'Flagged',            value: stats.flagged      },
              { icon: <ShieldX size={20} color="#dc2626"/>,     bg: '#fef2f2', label: 'Blocked',            value: stats.blocked      },
              { icon: <DollarSign size={20} color="#16a34a"/>,  bg: '#f0fdf4', label: 'Amount Saved',       value: '$' + stats.saved  },
            ].map(c => (
              <div key={c.label} className="stat-card">
                <div className="stat-icon" style={{ background: c.bg }}>{c.icon}</div>
                <div><div className="stat-val">{c.value}</div><div className="stat-lbl">{c.label}</div></div>
              </div>
            ))}
          </div>
        )}

        <div className="two-col">
          <div className="card">
            <h3>Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
                <YAxis tick={{ fontSize: 12 }}/>
                <Tooltip/>
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {chartData.map((e,i) => <Cell key={i} fill={e.fill}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3>Your Card</h3>
            <div className="visa-card">
              <div className="visa-top"><CreditCard size={28} color="#fff"/><span>EcoCash Visa</span></div>
              <div className="visa-num">{user.cardNumber}</div>
              <div className="visa-bot">
                <div><div className="visa-lbl">Cardholder</div><div>{user.name}</div></div>
                <div><div className="visa-lbl">Expires</div><div>{user.cardExpiry}</div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Recent Transactions</h3>
          <table className="tx-table">
            <thead><tr><th>Merchant</th><th>Location</th><th>Amount</th><th>Risk Score</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {transactions.map(tx => {
                const s = statusStyle[tx.status] || statusStyle.completed;
                return (
                  <tr key={tx.id} className={tx.isFlagged ? 'flagged-row' : ''}>
                    <td><strong>{tx.merchant}</strong></td>
                    <td>{tx.location}</td>
                    <td><strong>${tx.amount.toFixed(2)}</strong></td>
                    <td>
                      <div className="risk-bar-wrap">
                        <div className="risk-bar" style={{ width: tx.fraudScore + '%', background: riskColor[tx.riskLevel] }}/>
                        <span style={{ color: riskColor[tx.riskLevel] }}>{tx.fraudScore}</span>
                      </div>
                    </td>
                    <td><span className="status-badge" style={{ background: s.bg, color: s.color }}>{s.label}</span></td>
                    <td>{new Date(tx.timestamp).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
