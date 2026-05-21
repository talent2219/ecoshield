import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getAdminOverview, getAdminTx, approveTx, blockTx } from '../api/api';
import { Users, ShieldX, ShieldAlert, DollarSign, Check, Ban } from 'lucide-react';
import './AdminPage.css';

export default function AdminPage({ user, onLogout }) {
  const [overview, setOverview] = useState(null);
  const [txList,   setTxList]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([getAdminOverview(), getAdminTx()]).then(([ov, tx]) => {
      setOverview(ov.data); setTxList(tx.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => { const res = await approveTx(id); setTxList(prev => prev.map(t => t.id === id ? res.data : t)); };
  const handleBlock   = async (id) => { const res = await blockTx(id);   setTxList(prev => prev.map(t => t.id === id ? res.data : t)); };

  if (loading) return <div className="loading"><div className="spinner"/></div>;

  return (
    <div className="page-layout">
      <Sidebar user={user} onLogout={onLogout}/>
      <main className="main">
        <div className="page-header">
          <div><h2>Admin Panel</h2><p>Case management and transaction monitoring</p></div>
        </div>

        <div className="stats-row">
          {[
            { icon: <Users size={20} color="#2563eb"/>,        bg: '#eff6ff', label: 'Total Users',  value: overview.totalUsers      },
            { icon: <ShieldAlert size={20} color="#d97706"/>,  bg: '#fffbeb', label: 'Flagged',      value: overview.flaggedTx       },
            { icon: <ShieldX size={20} color="#dc2626"/>,      bg: '#fef2f2', label: 'Blocked',      value: overview.blockedTx       },
            { icon: <DollarSign size={20} color="#16a34a"/>,   bg: '#f0fdf4', label: 'Amount Saved', value: '$' + overview.amountSaved },
          ].map(c => (
            <div key={c.label} className="stat-card">
              <div className="stat-icon" style={{ background: c.bg }}>{c.icon}</div>
              <div><div className="stat-val">{c.value}</div><div className="stat-lbl">{c.label}</div></div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>All Transactions — Case Management</h3>
          <table className="tx-table">
            <thead><tr><th>Merchant</th><th>Location</th><th>Amount</th><th>Risk</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {txList.map(tx => (
                <tr key={tx.id} className={tx.isFlagged ? 'flagged-row' : ''}>
                  <td><strong>{tx.merchant}</strong></td>
                  <td>{tx.location}</td>
                  <td>${tx.amount.toFixed(2)}</td>
                  <td><span style={{ color: tx.riskLevel === 'critical' ? '#dc2626' : tx.riskLevel === 'high' ? '#ea580c' : tx.riskLevel === 'medium' ? '#d97706' : '#16a34a', fontWeight: 600 }}>{tx.riskLevel} · {tx.fraudScore}</span></td>
                  <td><span className={`status-badge status-${tx.status}`}>{tx.status}</span></td>
                  <td>{new Date(tx.timestamp).toLocaleDateString()}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-approve" onClick={() => handleApprove(tx.id)} title="Approve"><Check size={14}/></button>
                      <button className="btn-block"   onClick={() => handleBlock(tx.id)}   title="Block"><Ban size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
