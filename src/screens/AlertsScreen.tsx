import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ui/ScreenHeader';
import type { Alert } from '../types';
import '../styles/OtherScreens.css';

type Filter = 'all' | 'sos' | 'timer' | 'safe' | 'battery' | 'phoneoff';

const TYPE_META: Record<Alert['type'], { icon: string; label: string }> = {
  sos:      { icon: '🚨', label: 'SOS Alert' },
  timer:    { icon: '⏱️', label: 'Timer Expired' },
  safe:     { icon: '✅', label: 'Arrived Safely' },
  battery:  { icon: '🔋', label: 'Battery Died' },
  phoneoff: { icon: '📵', label: 'Phone Offline' },
};

function timeAgo(date: Date): string {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60)  return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AlertsScreen() {
  const { state, resolveAlert } = useApp();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = state.alerts.filter(a => filter === 'all' || a.type === filter);

  return (
    <div className="alerts-screen">
      <ScreenHeader title="Alert History" subtitle={`${state.alerts.length} events recorded`} />

      <div className="alerts-filter">
        {(['all', 'sos', 'timer', 'safe', 'battery', 'phoneoff'] as Filter[]).map(f => (
          <button
            key={f}
            className={`filter-chip${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All Events' : TYPE_META[f as Alert['type']].label}
          </button>
        ))}
      </div>

      <div className="alerts-list">
        {filtered.length === 0 && (
          <div className="alerts-empty">
            <span className="alerts-empty__icon">🛡️</span>
            <div className="alerts-empty__title">No events yet</div>
            <div className="alerts-empty__text">Your alert history will appear here</div>
          </div>
        )}
        {filtered.map((alert, i) => {
          const meta = TYPE_META[alert.type];
          return (
            <div
              key={alert.id}
              className={`alert-card ${alert.type}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`alert-icon-wrap ${alert.type}`}>
                <span>{meta.icon}</span>
              </div>
              <div className="alert-content">
                <div className="alert-title">{meta.label}</div>
                <div className="alert-location">
                  <span>📍</span> {alert.location}
                </div>
                <div className="alert-meta">
                  <span className="alert-time">{timeAgo(alert.timestamp)}</span>
                  {alert.resolved ? (
                    <span className="alert-badge resolved">Resolved</span>
                  ) : (
                    <button
                      className="alert-badge active"
                      onClick={() => resolveAlert(alert.id)}
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      Tap to resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
