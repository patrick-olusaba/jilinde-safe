import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ui/ScreenHeader';
import InfoBox from '../components/ui/InfoBox';
import '../styles/FakeCallScreen.css';

const CALLERS = [
  { id: 'dad', label: 'Dad Calling', icon: '👨🏾', color: '#4A90D9' },
  { id: 'police', label: 'Police Calling', icon: '👮🏾', color: '#1a3a5c' },
  { id: 'office', label: 'Office Calling', icon: '🏢', color: '#5a6e8a' },
];

const DELAYS = [
  { sec: 0, label: 'Now' },
  { sec: 30, label: '30s' },
  { sec: 60, label: '1m' },
  { sec: 120, label: '2m' },
];

export default function FakeCallScreen() {
  const { addAlert } = useApp();
  const [selected, setSelected] = useState(CALLERS[0]);
  const [delay, setDelay] = useState(DELAYS[0]);
  const [ringing, setRinging] = useState(false);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const triggerCall = () => {
    if (delay.sec === 0) {
      setRinging(true);
    } else {
      setRinging(true);
      timerRef.current = setTimeout(() => {
        setRinging(true);
      }, delay.sec * 1000);
    }
  };

  const handleAnswer = () => {
    setRinging(false);
    setAnswered(true);
    addAlert({
      type: 'safe',
      message: `Fake call from "${selected.label}" used`,
      location: 'Nairobi',
      timestamp: new Date(),
      resolved: true,
    });
  };

  const handleDecline = () => {
    setRinging(false);
  };

  const reset = () => {
    setRinging(false);
    setAnswered(false);
  };

  return (
    <div className="fakecall-screen">
      <ScreenHeader title="Fake Call Escape" subtitle="Get out of uncomfortable situations with a realistic incoming call" />

      {!ringing && !answered ? (
        <>
          {/* Caller identity picker */}
          <div className="caller-section">
            <span className="section-label-sm">Who's calling?</span>
            <div className="caller-options">
              {CALLERS.map(c => (
                <button
                  key={c.id}
                  className={`caller-card${selected.id === c.id ? ' selected' : ''}`}
                  onClick={() => setSelected(c)}
                  style={selected.id === c.id ? { borderColor: c.color, background: `${c.color}15` } : undefined}
                >
                  <span className="caller-card__icon">{c.icon}</span>
                  <span className="caller-card__label">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Delay picker */}
          <div className="delay-section">
            <span className="section-label-sm">Ring in...</span>
            <div className="delay-options">
              {DELAYS.map(d => (
                <button
                  key={d.sec}
                  className={`delay-chip${delay.sec === d.sec ? ' selected' : ''}`}
                  onClick={() => setDelay(d)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger */}
          <button className="trigger-call-btn" onClick={triggerCall}>
            📞 Simulate Incoming Call
          </button>
        </>
      ) : ringing ? (
        /* Incoming call UI */
        <div className="incoming-call">
          <div className="incoming-call__ring" />
          <div className="incoming-call__ring" style={{ animationDelay: '0.4s' }} />
          <div className="incoming-call__ring" style={{ animationDelay: '0.8s' }} />

          <div className="incoming-call__avatar" style={{ background: selected.color }}>
            <span>{selected.icon}</span>
          </div>
          <div className="incoming-call__name">{selected.label}</div>
          <div className="incoming-call__status">Incoming call...</div>

          <div className="incoming-call__actions">
            <button className="call-action decline" onClick={handleDecline}>
              <span className="call-action__icon">📵</span>
              Decline
            </button>
            <button className="call-action answer" onClick={handleAnswer}>
              <span className="call-action__icon">📞</span>
              Answer
            </button>
          </div>
        </div>
      ) : (
        /* Answered / done state */
        <div className="call-done">
          <div className="call-done__check">✓</div>
          <h2 className="call-done__title">Call Ended</h2>
          <p className="call-done__text">
            You escaped the situation. This call has been logged in your alert history.
          </p>
          <button className="trigger-call-btn" onClick={reset}>
            Set Up Another Call
          </button>
        </div>
      )}

      <InfoBox>
        Use this when you feel unsafe or uncomfortable. The fake call looks and sounds like a real incoming call, giving you a natural reason to leave.
      </InfoBox>
    </div>
  );
}
