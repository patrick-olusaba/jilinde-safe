import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ui/ScreenHeader';
import type { FamilyMember } from '../types';
import '../styles/FamilyScreen.css';

const ROLE_OPTIONS: FamilyMember['role'][] = ['parent', 'child'];

export default function FamilyScreen() {
  const { state, addFamilyMember, removeFamilyMember, toggleFamilyMember, groupSOS, upgradeToFamily } = useApp();
  const isFamily = state.user.plan === 'family';
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<FamilyMember, 'id'>>({
    name: '', phone: '', role: 'child', isActive: true,
  });

  const handleAdd = () => {
    if (!form.name || !form.phone) return;
    addFamilyMember(form);
    setForm({ name: '', phone: '', role: 'child', isActive: true });
    setShowForm(false);
  };

  const activeCount = state.familyMembers.filter(m => m.isActive).length;

  if (!isFamily) {
    return (
      <div className="family-screen">
        <ScreenHeader title="Family Shield" subtitle="Protect your whole family under one plan" />
        <div className="family-upgrade">
          <div className="family-upgrade__icon">👨‍👩‍👧‍👦</div>
          <h2 className="family-upgrade__title">Family Plan Required</h2>
          <p className="family-upgrade__desc">
            Upgrade to the Family plan (KSh 500/month) to add up to 5 family members, use group SOS, view a family GPS map, and manage safety for everyone under one account.
          </p>
          <div className="family-upgrade__features">
            {['Up to 5 family members', 'Group SOS alerts', 'Family GPS map', 'Shared evidence vault', 'Admin controls for parents', 'Monthly safety report'].map(f => (
              <div key={f} className="family-upgrade__feature">
                <span className="family-upgrade__check">✓</span>
                {f}
              </div>
            ))}
          </div>
          <button className="family-upgrade__btn" onClick={upgradeToFamily}>
            Upgrade to Family — KSh 500/month
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="family-screen">
      <ScreenHeader title="Family Shield" subtitle={`${activeCount} family member${activeCount !== 1 ? 's' : ''} protected`} />

      {/* Group SOS */}
      <button
        className="family-sos-btn"
        onClick={groupSOS}
        disabled={state.familyMembers.filter(m => m.isActive).length === 0}
      >
        <span className="family-sos-btn__icon">🚨</span>
        <span className="family-sos-btn__label">Group SOS</span>
        <span className="family-sos-btn__hint">Alert all family members</span>
      </button>

      {/* Mini map placeholder */}
      <div className="family-map">
        <div className="family-map__header">
          <span className="family-map__title">Family GPS Map</span>
          <span className="family-map__badge">LIVE</span>
        </div>
        <div className="family-map__stage">
          <svg viewBox="0 0 100 60" className="family-map__svg">
            <defs>
              <pattern id="fgrid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.2"/>
              </pattern>
            </defs>
            <rect width="100" height="60" fill="url(#fgrid)" />
            {/* Simulated family member pins */}
            {state.familyMembers.filter(m => m.isActive).map((m, i) => {
              const x = 20 + (i * 25) + Math.random() * 10;
              const y = 15 + Math.random() * 30;
              return (
                <g key={m.id}>
                  <circle cx={x} cy={y} r="2" fill="#4A90D9" />
                  <circle cx={x} cy={y} r="4" fill="none" stroke="#4A90D9" strokeWidth="0.3" opacity="0.5" />
                  <text x={x} y={y - 3} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="3">{m.name.split(' ')[0]}</text>
                </g>
              );
            })}
            {/* User pin */}
            <circle cx="50" cy="30" r="2.5" fill="var(--gold)" />
            <circle cx="50" cy="30" r="5" fill="none" stroke="var(--gold)" strokeWidth="0.4" opacity="0.4">
              <animate attributeName="r" from="5" to="8" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite"/>
            </circle>
            <text x="50" y="27" textAnchor="middle" fill="var(--gold)" fontSize="3" fontWeight="700">You</text>
          </svg>
        </div>
      </div>

      {/* Member list */}
      <div className="family-list">
        {state.familyMembers.map((m, i) => (
          <div key={m.id} className="family-member-card" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="family-member__info">
              <div className="family-member__name">{m.name}</div>
              <div className="family-member__meta">
                <span className={`family-member__role ${m.role}`}>
                  {m.role === 'parent' ? '👑 Parent' : '👶 Child'}
                </span>
                <span className="family-member__phone">{m.phone}</span>
              </div>
            </div>
            <div className="family-member__actions">
              <button
                className="guardian-action-btn"
                onClick={() => toggleFamilyMember(m.id)}
                title={m.isActive ? 'Disable' : 'Enable'}
              >
                {m.isActive ? '✅' : '⬜'}
              </button>
              <button
                className="guardian-action-btn danger"
                onClick={() => removeFamilyMember(m.id)}
                title="Remove member"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {showForm ? (
          <div className="add-form">
            <div className="add-form__title">Add Family Member</div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                placeholder="e.g. Junior Wanjiku"
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
              <label className="form-label">Role</label>
              <select
                className="form-input"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value as FamilyMember['role'] }))}
                style={{ cursor: 'pointer' }}
              >
                {ROLE_OPTIONS.map(r => (
                  <option key={r} value={r} style={{ background: 'var(--bg-card)' }}>{r === 'parent' ? '👑 Parent' : '👶 Child'}</option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button className="form-btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="form-btn primary" onClick={handleAdd}>Add Member</button>
            </div>
          </div>
        ) : (
          <div
            className="add-guardian-card"
            onClick={() => {
              if (state.familyMembers.length >= 5) return;
              setShowForm(true);
            }}
          >
            <div className="add-guardian-icon">＋</div>
            <div>
              <div className="add-guardian-text">Add Family Member</div>
              <div className="add-guardian-subtext">
                {state.familyMembers.length >= 5
                  ? 'Maximum 5 family members reached'
                  : `${5 - state.familyMembers.length} slot${5 - state.familyMembers.length !== 1 ? 's' : ''} remaining`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
