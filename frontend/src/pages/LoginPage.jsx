import React, { useState } from 'react';
import { login, register } from '../api/api';
import { CreditCard, ShieldCheck, User, Phone, Lock, Hash } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [mode,     setMode]     = useState('login');
  const [step,     setStep]     = useState(1);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState({
    fullName: '', ecocashNumber: '', email: '',
    cardNumber: '', accountHolder: '',
    password: '', confirmPass: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await login(phone, password);
      onLogin(res.data.user);
    } catch {
      setError('Invalid phone number or password.');
    } finally { setLoading(false); }
  };

  const handleSignupNext = (e) => {
    e.preventDefault(); setError('');
    if (!form.fullName || !form.ecocashNumber || !form.email || !form.password) {
      setError('Please fill in all fields.'); return;
    }
    if (form.password !== form.confirmPass) { setError('Passwords do not match.'); return; }
    if (form.ecocashNumber.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid EcoCash number.'); return;
    }
    setStep(2);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault(); setError('');
    const rawCard = form.cardNumber.replace(/\s/g, '');
    if (rawCard.length !== 16) {
      setError('Please enter a valid 16-digit Econet Visa card number.'); return;
    }
    if (!form.accountHolder) {
      setError('Please enter the name on your card.'); return;
    }
    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
    } catch {
      setError('Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const update = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleCardNumber = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setForm(p => ({ ...p, cardNumber: formatted }));
  };

  if (success) return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand"><CreditCard size={36} color="#60a5fa"/><h1>EcoShield</h1></div>
        <h2>Secure your Econet Visa transactions</h2>
        <p>Real-time fraud detection powered by machine learning — built for Zimbabwe.</p>
        <div className="features">
          {['Real-time fraud alerts','ML-powered risk scoring','Instant transaction blocking','Secure admin dashboard'].map(f => (
            <div key={f} className="feature-item"><ShieldCheck size={16} color="#60a5fa"/> {f}</div>
          ))}
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <div className="success-icon">✅</div>
          <h3 style={{ textAlign: 'center' }}>Account Created!</h3>
          <p className="login-sub" style={{ textAlign: 'center' }}>
            Your EcoShield account has been registered. You can now sign in with your EcoCash number and password.
          </p>
          <button className="login-btn" onClick={() => { setMode('login'); setSuccess(false); setStep(1); }}>
            Go to Sign In
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand"><CreditCard size={36} color="#60a5fa"/><h1>EcoShield</h1></div>
        <h2>Secure your Econet Visa transactions</h2>
        <p>Real-time fraud detection powered by machine learning — built for Zimbabwe.</p>
        <div className="features">
          {['Real-time fraud alerts','ML-powered risk scoring','Instant transaction blocking','Secure admin dashboard'].map(f => (
            <div key={f} className="feature-item"><ShieldCheck size={16} color="#60a5fa"/> {f}</div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === 'login'  ? 'active' : ''}`} onClick={() => { setMode('login');  setError(''); setStep(1); }}>Sign In</button>
            <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError(''); setStep(1); }}>Create Account</button>
          </div>

          {/* LOGIN */}
          {mode === 'login' && (
            <>
              <p className="login-sub">Access your EcoShield dashboard</p>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label><Phone size={13}/> EcoCash Phone Number</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+263 77 123 4567" required />
                </div>
                <div className="form-group">
                  <label><Lock size={13}/> Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
                </div>
                {error && <div className="error-box">{error}</div>}
                <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
              </form>
            </>
          )}

          {/* SIGN UP STEP 1 */}
          {mode === 'signup' && step === 1 && (
            <>
              <p className="login-sub">Step 1 of 2 — Personal & EcoCash Details</p>
              <div className="step-bar"><div className="step-fill" style={{ width: '50%' }}/></div>
              <form onSubmit={handleSignupNext}>
                <div className="form-group">
                  <label><User size={13}/> Full Name</label>
                  <input type="text" value={form.fullName} onChange={update('fullName')} placeholder="e.g. Tendai Moyo" required />
                </div>
                <div className="form-group">
                  <label><Phone size={13}/> EcoCash Number</label>
                  <input type="tel" value={form.ecocashNumber} onChange={update('ecocashNumber')} placeholder="+263 77 123 4567" required />
                </div>
                <div className="form-group">
                  <label><Hash size={13}/> Email Address</label>
                  <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label><Lock size={13}/> Password</label>
                    <input type="password" value={form.password} onChange={update('password')} placeholder="Create password" required />
                  </div>
                  <div className="form-group">
                    <label><Lock size={13}/> Confirm</label>
                    <input type="password" value={form.confirmPass} onChange={update('confirmPass')} placeholder="Repeat password" required />
                  </div>
                </div>
                {error && <div className="error-box">{error}</div>}
                <button type="submit" className="login-btn">Continue to Card Details →</button>
              </form>
            </>
          )}

          {/* SIGN UP STEP 2 */}
          {mode === 'signup' && step === 2 && (
            <>
              <p className="login-sub">Step 2 of 2 — Econet Visa Card Details</p>
              <div className="step-bar"><div className="step-fill" style={{ width: '100%' }}/></div>
              <div className="card-only-notice">
                <CreditCard size={18} color="#1d4ed8"/>
                <span>EcoShield only accepts <strong>Econet Visa cards</strong></span>
              </div>
              <div className="mini-visa-card">
                <div className="mini-visa-top"><CreditCard size={20} color="#fff"/><span>Econet Visa</span></div>
                <div className="mini-visa-num">{form.cardNumber || '0000 0000 0000 0000'}</div>
                <div className="mini-visa-bot"><span>{form.accountHolder || 'CARDHOLDER NAME'}</span></div>
              </div>
              <form onSubmit={handleSignupSubmit}>
                <div className="form-group">
                  <label>Card Type</label>
                  <input type="text" value="Econet Visa" disabled style={{ background: '#eff6ff', color: '#1d4ed8', fontWeight: 600, cursor: 'not-allowed' }} />
                </div>
                <div className="form-group">
                  <label><CreditCard size={13}/> Card Number</label>
                  <input type="text" value={form.cardNumber} onChange={handleCardNumber} placeholder="0000 0000 0000 0000" maxLength={19} required />
                </div>
                <div className="form-group">
                  <label><User size={13}/> Name on Card</label>
                  <input type="text" value={form.accountHolder} onChange={update('accountHolder')} placeholder="As it appears on your Econet Visa card" required />
                </div>
                {error && <div className="error-box">{error}</div>}
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create My Account'}
                </button>
                <button type="button" className="back-btn" onClick={() => { setStep(1); setError(''); }}>← Back</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
