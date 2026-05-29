import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ui/ScreenHeader';
import type { Guardian } from '../types';
import '../styles/GuardiansScreen.css';

const RELATION_OPTIONS = ['Mother', 'Father', 'Brother', 'Sister', 'Friend', 'Partner', 'Colleague'];
const AVATAR_OPTIONS = ['👩🏾', '👨🏾', '👩🏾‍🦱', '👨🏾‍🦲', '👩🏽', '👨🏽', '🧑🏾'];

export default function GuardiansScreen() {
  const { state, addGuardian, removeGuardian, toggleGuardian } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Guardian, 'id'>>({
    name: '', phone: '', relation: 'Friend', avatar: '👩🏾', isActive: true,
  });

  const activeCount = state.guardians.filter(g => g.isActive).length;
  const maxFree = 2;
  const isPremium = state.user.plan === 'premium' || state.user.plan === 'family';

  const handleAdd = () => {
    if (!form.name || !form.phone) return;
    addGuardian(form);
    setForm({ name: '', phone: '', relation: 'Friend', avatar: '👩🏾', isActive: true });
    setShowForm(false);
  };

  return (
    <div className="guardians-screen">
      <ScreenHeader title="Safety Circle" subtitle={`${activeCount} guardian${activeCount !== 1 ? 's' : ''} watching over you`} />

      {!isPremium && (
        <div className="plan-banner">
          <div className="plan-banner__info">
            <span className="plan-banner__label">Free Plan</span>
            <span className="plan-banner__text">
              {maxFree - Math.min(activeCount, maxFree)} of {maxFree} free guardian slots remaining
            </span>
          </div>
          <button className="plan-banner__btn">Upgrade ↑</button>
        </div>
      )}

      <div className="guardian-list">
        {state.guardians.map((g, i) => (
          <div
            key={g.id}
            className="guardian-card"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="guardian-avatar">
              <span style={{ fontSize: 22 }}>{g.avatar}</span>
              {g.isActive && <div className="guardian-status-dot" />}
            </div>
            <div className="guardian-info">
              <div className="guardian-name">{g.name}</div>
              <div className="guardian-meta">
                <span className="guardian-relation">{g.relation}</span>
                <span className="guardian-phone">{g.phone}</span>
              </div>
            </div>
            <div className="guardian-actions">
              <a href={`sms:${g.phone}`} className="guardian-action-btn sms-link" title="Send SMS">
                💬
              </a>
              <a href={`tel:${g.phone}`} className="guardian-action-btn call-link" title="Call">
                📞
              </a>
              <button
                className="guardian-action-btn"
                onClick={() => toggleGuardian(g.id)}
                title={g.isActive ? 'Disable' : 'Enable'}
              >
                {g.isActive ? '✅' : '⬜'}
              </button>
              <button
                className="guardian-action-btn danger"
                onClick={() => removeGuardian(g.id)}
                title="Remove guardian"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {showForm ? (
          <div className="add-form">
            <div className="add-form__title">New Guardian</div>

            <div className="form-row">
              {AVATAR_OPTIONS.map(av => (
                <button
                  key={av}
                  onClick={() => setForm(f => ({ ...f, avatar: av }))}
                  style={{
                    fontSize: 22,
                    padding: '4px 8px',
                    background: form.avatar === av ? 'var(--gold-glow)' : 'transparent',
                    border: `1px solid ${form.avatar === av ? 'var(--border-gold)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                  }}
                >
                  {av}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                placeholder="e.g. Mama Wanjiku"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                placeholder="+254 7XX XXX XXX"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Relation</label>
              <select
                className="form-input"
                value={form.relation}
                onChange={e => setForm(f => ({ ...f, relation: e.target.value }))}
                style={{ cursor: 'pointer' }}
              >
                {RELATION_OPTIONS.map(r => (
                  <option key={r} value={r} style={{ background: 'var(--bg-card)' }}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button className="form-btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="form-btn primary" onClick={handleAdd}>Add Guardian</button>
            </div>
          </div>
        ) : (
          <div
            className="add-guardian-card"
            onClick={() => {
              if (!isPremium && state.guardians.length >= maxFree) return;
              setShowForm(true);
            }}
          >
            <div className="add-guardian-icon">＋</div>
            <div>
              <div className="add-guardian-text">Add Guardian</div>
              <div className="add-guardian-subtext">
                {!isPremium && state.guardians.length >= maxFree
                  ? 'Upgrade to Premium for unlimited guardians'
                  : 'Add someone who will watch over you'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
