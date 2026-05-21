import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getReports } from '../api/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function ReportsPage({ user, onLogout }) {
  const [data, setData] = useState(null);
  useEffect(() => { getReports().then(r => setData(r.data)); }, []);
  if (!data) return <div className="loading"><div className="spinner"/></div>;

  const riskPie = [
    { name: 'Low',      value: data.byRisk.low,      color: '#16a34a' },
    { name: 'Medium',   value: data.byRisk.medium,   color: '#d97706' },
    { name: 'High',     value: data.byRisk.high,     color: '#ea580c' },
    { name: 'Critical', value: data.byRisk.critical, color: '#dc2626' },
  ];
  const dayBars = data.byDay.map(d => ({ ...d, amount: parseFloat(d.amount.toFixed(2)) }));

  return (
    <div className="page-layout">
      <Sidebar user={user} onLogout={onLogout}/>
      <main className="main">
        <div className="page-header">
          <div><h2>Reports</h2><p>Fraud analytics and transaction summaries</p></div>
        </div>
        <div className="two-col">
          <div className="card">
            <h3>Risk Level Breakdown</h3>
            <PieChart width={300} height={220}>
              <Pie data={riskPie} cx={140} cy={100} outerRadius={80} dataKey="value" label>
                {riskPie.map((e,i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Legend/>
            </PieChart>
          </div>
          <div className="card">
            <h3>Daily Transaction Volume ($)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dayBars}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }}/>
                <YAxis tick={{ fontSize: 11 }}/>
                <Tooltip/>
                <Bar dataKey="amount" fill="#16a34a" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3>Daily Summary Table</h3>
          <table className="tx-table">
            <thead><tr><th>Date</th><th>Total Transactions</th><th>Flagged</th><th>Total Amount ($)</th></tr></thead>
            <tbody>
              {dayBars.map(d => (
                <tr key={d.date}>
                  <td>{d.date}</td>
                  <td>{d.total}</td>
                  <td style={{ color: d.flagged > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{d.flagged}</td>
                  <td>${d.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
