import { useState } from 'react';
import { useApp } from '../context/AppContext';
import '../styles/OtherScreens.css';

const PREMIUM_FEATURES = [
  'Unlimited guardians',
  'Live location tracking',
  'Audio & video recording',
  'Cloud evidence backup',
  'Fake call feature',
  'Safe timer auto-SOS',
  'Battery/offline alerts',
];

export default function ProfileScreen() {
  const { state, upgradePlan, logout, toggleSiren, toggleBatteryAlerts, toggleOfflineAlerts, simulatePhoneOffline } = useApp();
  const [silentMode, setSilentMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoRecord, setAutoRecord] = useState(false);
  const planLabel = state.user.plan === 'family' ? 'Family Plan' : state.user.plan === 'premium' ? 'Premium' : 'Free Plan';
  const planIcon = state.user.plan === 'family' ? '👨‍👩‍👧‍👦' : state.user.plan === 'premium' ? '⭐' : '🛡️';

  const resolvedAlerts = state.alerts.filter(a => a.resolved).length;

  return (
    <div className="profile-screen">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">
          <span>👩🏾</span>
          <div className="profile-avatar__edit">✏️</div>
        </div>
        <div className="profile-name">{state.user.name}</div>
        <div className="profile-phone">{state.user.phone}</div>
        <div className="profile-plan-badge">
          <span>{planIcon}</span>
          {planLabel}
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-card">
          <span className="stat-card__value">{state.guardians.length}</span>
          <span className="stat-card__label">Guardians</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{resolvedAlerts}</span>
          <span className="stat-card__label">Alerts Sent</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">12</span>
          <span className="stat-card__label">Days Safe</span>
        </div>
      </div>

      {/* Security settings */}
      <div className="settings-section">
        <div className="settings-section__title">Security</div>
        <div className="settings-card">
          <div className="settings-item">
            <div className="settings-item__icon gold">🔇</div>
            <div className="settings-item__text">
              <div className="settings-item__label">Silent SOS Mode</div>
              <div className="settings-item__desc">Vol × 3 triggers silent alert</div>
            </div>
            <button
              className={`toggle${silentMode ? ' on' : ''}`}
              onClick={() => setSilentMode(v => !v)}
            >
              <div className="toggle__thumb" />
            </button>
          </div>
          <div className="settings-item">
            <div className="settings-item__icon green">🔔</div>
            <div className="settings-item__text">
              <div className="settings-item__label">Guardian Notifications</div>
              <div className="settings-item__desc">Alert when guardians are offline</div>
            </div>
            <button
              className={`toggle${notifications ? ' on' : ''}`}
              onClick={() => setNotifications(v => !v)}
            >
              <div className="toggle__thumb" />
            </button>
          </div>
          <div className="settings-item">
            <div className="settings-item__icon red">🎥</div>
            <div className="settings-item__text">
              <div className="settings-item__label">Auto-Record on SOS</div>
              <div className="settings-item__desc">Camera & mic start automatically</div>
            </div>
            <button
              className={`toggle${autoRecord ? ' on' : ''}`}
              onClick={() => setAutoRecord(v => !v)}
            >
              <div className="toggle__thumb" />
            </button>
          </div>
          <div className="settings-item">
            <div className="settings-item__icon red">🚨</div>
            <div className="settings-item__text">
              <div className="settings-item__label">Loud Siren on SOS</div>
              <div className="settings-item__desc">Play alarm sound when SOS triggers</div>
            </div>
            <button
              className={`toggle${state.sirenEnabled ? ' on' : ''}`}
              onClick={toggleSiren}
            >
              <div className="toggle__thumb" />
            </button>
          </div>
          <div className="settings-item">
            <div className="settings-item__icon gold">🔋</div>
            <div className="settings-item__text">
              <div className="settings-item__label">Battery Alerts</div>
              <div className="settings-item__desc">Alert guardians when battery dies</div>
            </div>
            <button
              className={`toggle${state.batteryAlertsEnabled ? ' on' : ''}`}
              onClick={toggleBatteryAlerts}
            >
              <div className="toggle__thumb" />
            </button>
          </div>
          <div className="settings-item">
            <div className="settings-item__icon blue">📡</div>
            <div className="settings-item__text">
              <div className="settings-item__label">Offline Alerts</div>
              <div className="settings-item__desc">Alert when phone loses connection</div>
            </div>
            <button
              className={`toggle${state.offlineAlertsEnabled ? ' on' : ''}`}
              onClick={toggleOfflineAlerts}
            >
              <div className="toggle__thumb" />
            </button>
          </div>
          <div className="settings-item" style={{ cursor: 'pointer' }} onClick={simulatePhoneOffline}>
            <div className="settings-item__icon red">📵</div>
            <div className="settings-item__text">
              <div className="settings-item__label">Simulate Phone Offline</div>
              <div className="settings-item__desc">Test offline alert — triggers now</div>
            </div>
            <span className="settings-item__arrow">›</span>
          </div>
        </div>
      </div>

      {/* Account settings */}
      <div className="settings-section">
        <div className="settings-section__title">Account</div>
        <div className="settings-card">
          {[
            { icon: '👤', color: 'blue', label: 'Edit Profile', desc: 'Name, phone, photo' },
            { icon: '🔒', color: 'gold', label: 'Privacy & Data', desc: 'What we store and why' },
            { icon: '🤝', color: 'green', label: 'Refer a Friend', desc: 'Get 1 month free' },
            { icon: '💬', color: 'blue', label: 'Help & Support', desc: 'Chat with our team' },
          ].map(item => (
            <div key={item.label} className="settings-item">
              <div className={`settings-item__icon ${item.color}`}>{item.icon}</div>
              <div className="settings-item__text">
                <div className="settings-item__label">{item.label}</div>
                <div className="settings-item__desc">{item.desc}</div>
              </div>
              <span className="settings-item__arrow">›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade banner — only for free users */}
      {state.user.plan === 'free' && (
        <div className="upgrade-banner">
          <div className="upgrade-banner__header">
            <span className="upgrade-banner__badge">⭐ Premium</span>
            <div className="upgrade-banner__price">
              <div className="upgrade-banner__amount">KSh 200</div>
              <div className="upgrade-banner__period">per month</div>
            </div>
          </div>
          <div className="upgrade-banner__title">No Kenyan should disappear without a trace.</div>
          <div className="upgrade-banner__features">
            {PREMIUM_FEATURES.map(f => (
              <div key={f} className="upgrade-feature">
                <div className="upgrade-feature__check">✓</div>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <button className="upgrade-btn" onClick={upgradePlan}>
            Upgrade to Premium
          </button>
        </div>
      )}

      {/* Logout */}
      <div className="settings-section">
        <div className="settings-section__title">Session</div>
        <div className="settings-card">
          <button className="logout-btn" onClick={logout}>
            Log Out
          </button>
        </div>
      </div>

      <div style={{ height: 8 }} />
    </div>
  );
}
