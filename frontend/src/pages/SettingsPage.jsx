import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { CreditCard, Bell, ShieldCheck, User } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage({ user, onLogout }) {
  const [alerts, setAlerts] = useState({ email: true, sms: true, push: false });
  const [saved,  setSaved]  = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="page-layout">
      <Sidebar user={user} onLogout={onLogout}/>
      <main className="main">
        <div className="page-header">
          <div><h2>Settings</h2><p>Manage your EcoShield account preferences</p></div>
        </div>
        <div className="card">
          <div className="settings-section-title"><User size={16}/> Profile</div>
          <div className="settings-row"><label>Full Name</label><input defaultValue={user.name} className="settings-input"/></div>
          <div className="settings-row"><label>Phone</label><input defaultValue={user.phone} className="settings-input"/></div>
          <div className="settings-row"><label>Email</label><input defaultValue={user.email} className="settings-input"/></div>
        </div>
        {user.cardType && (
          <div className="card">
            <div className="settings-section-title"><CreditCard size={16}/> EcoCash Visa Card</div>
            <div className="settings-row"><label>Card Number</label><input defaultValue={user.cardNumber} disabled className="settings-input"/></div>
            <div className="settings-row"><label>Expiry Date</label><input defaultValue={user.cardExpiry} disabled className="settings-input"/></div>
            <div className="settings-row"><label>Card Status</label><span style={{ background:'#f0fdf4', color:'#16a34a', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600 }}>Active</span></div>
          </div>
        )}
        <div className="card">
          <div className="settings-section-title"><Bell size={16}/> Alert Preferences</div>
          {[['email','Email Alerts'],['sms','SMS Alerts'],['push','Push Notifications']].map(([key,label]) => (
            <div key={key} className="settings-row">
              <label>{label}</label>
              <div className={`toggle ${alerts[key] ? 'on' : ''}`} onClick={() => setAlerts(p => ({ ...p, [key]: !p[key] }))}>
                <div className="toggle-thumb"/>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="settings-section-title"><ShieldCheck size={16}/> Security</div>
          <div className="settings-row"><label>Fraud Sensitivity</label>
            <select className="settings-input" style={{ width:'auto' }}>
              <option>High (recommended)</option><option>Medium</option><option>Low</option>
            </select>
          </div>
          <div className="settings-row"><label>Two-Factor Auth</label><span style={{ background:'#f0fdf4', color:'#16a34a', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600 }}>Enabled</span></div>
        </div>
        <button className="save-btn" onClick={save}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </main>
    </div>
  );
}
