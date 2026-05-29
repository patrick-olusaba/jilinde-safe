import { useState } from 'react';
import { useApp } from '../context/AppContext';
import '../styles/AuthScreen.css';

export default function SignUpScreen() {
  const { signUp, switchAuthScreen } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim() || !password.trim() || !confirm.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    const result = signUp(name, phone, password);
    if (!result.success) setError(result.error!);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 className="auth-brand__title">Jilinde Safe</h1>
          <p className="auth-brand__tagline">Create your account and stay protected.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-field__label">Full Name</label>
            <input
              className="auth-field__input"
              type="text"
              placeholder="e.g. Aisha Wanjiru"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-field__label">Phone Number</label>
            <input
              className="auth-field__input"
              type="tel"
              placeholder="+254 7XX XXX XXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-field__label">Password</label>
            <input
              className="auth-field__input"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-field__label">Confirm Password</label>
            <input
              className="auth-field__input"
              type="password"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-btn">Create Account</button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button className="auth-switch__link" onClick={() => switchAuthScreen('login')}>
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}
