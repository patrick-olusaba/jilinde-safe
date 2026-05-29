import { useState, useEffect, useRef } from 'react';
import './EmergencyCallOverlay.css';

interface GuardianInfo {
  id: string;
  name: string;
  avatar: string;
}

type CallStatus = 'dialing' | 'connected' | 'no-answer' | 'pending';

interface CallState {
  guardian: GuardianInfo;
  status: CallStatus;
}

const OUTCOMES: CallStatus[] = ['connected', 'connected', 'no-answer'];

interface Props {
  guardians: GuardianInfo[];
  mapsLink: string;
  onComplete: () => void;
  onCancel: () => void;
}

export default function EmergencyCallOverlay({ guardians, mapsLink, onComplete, onCancel }: Props) {
  const [calls, setCalls] = useState<CallState[]>(
    guardians.map(g => ({ guardian: g, status: 'pending' }))
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'calling' | 'summary'>('calling');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (guardians.length === 0) {
      onComplete();
      return;
    }

    const runCalls = async () => {
      for (let i = 0; i < guardians.length; i++) {
        setCurrentIdx(i);
        // Dialing
        setCalls(prev => prev.map((c, j) => j === i ? { ...c, status: 'dialing' } : c));
        await new Promise(r => { timerRef.current = setTimeout(r, 1500); });

        // Result
        const outcome = OUTCOMES[Math.floor(Math.random() * OUTCOMES.length)];
        setCalls(prev => prev.map((c, j) => j === i ? { ...c, status: outcome } : c));
        await new Promise(r => { timerRef.current = setTimeout(r, 1200); });
      }
      setPhase('summary');
    };

    runCalls();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const currentCall = calls[currentIdx];
  const connectedCount = calls.filter(c => c.status === 'connected').length;

  return (
    <div className="ec-overlay">
      <div className="ec-overlay__flash" />

      {phase === 'calling' && currentCall ? (
        <div className="ec-calling">
          <div className="ec-calling__ripple">
            <div className="ec-calling__ripple-ring" />
            <div className="ec-calling__ripple-ring" style={{ animationDelay: '0.5s' }} />
            <div className="ec-calling__ripple-ring" style={{ animationDelay: '1s' }} />
          </div>

          <div className="ec-calling__avatar" style={{
            background: currentCall.status === 'connected'
              ? 'rgba(34, 197, 94, 0.2)'
              : currentCall.status === 'no-answer'
                ? 'rgba(232, 41, 26, 0.15)'
                : 'rgba(245, 197, 24, 0.15)',
          }}>
            <span>{currentCall.guardian.avatar}</span>
          </div>

          <div className="ec-calling__name">{currentCall.guardian.name}</div>
          <div className="ec-calling__status">
            {currentCall.status === 'dialing' && 'Calling...'}
            {currentCall.status === 'connected' && 'Connected ✓'}
            {currentCall.status === 'no-answer' && 'No answer'}
          </div>
        </div>
      ) : (
        <div className="ec-summary">
          <div className="ec-summary__icon">🚨</div>
          <h2 className="ec-summary__title">SOS Sent</h2>
          <p className="ec-summary__count">
            {connectedCount} of {guardians.length} guardians notified
          </p>
          <div className="ec-summary__list">
            {calls.map(c => (
              <div key={c.guardian.id} className={`ec-summary__item ${c.status}`}>
                <span>{c.guardian.avatar}</span>
                <span className="ec-summary__item-name">{c.guardian.name}</span>
                <span className="ec-summary__item-status">
                  {c.status === 'connected' ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
          <div className="ec-summary__actions">
            <a href={`sms:?body=EMERGENCY: I need help! My live location: ${mapsLink}`} className="ec-action-btn sms">
              📱 SMS
            </a>
            <a href={`https://wa.me/?text=EMERGENCY:%20I%20need%20help!%20My%20live%20location:%20${encodeURIComponent(mapsLink)}`} target="_blank" rel="noopener" className="ec-action-btn wa">
              💬 WhatsApp
            </a>
            <a href={mapsLink} target="_blank" rel="noopener" className="ec-action-btn map">
              🗺️ Map
            </a>
          </div>
          <button className="ec-summary__dismiss" onClick={onComplete}>
            OK
          </button>
        </div>
      )}

      <button className="ec-overlay__cancel" onClick={onCancel}>
        Cancel SOS
      </button>
    </div>
  );
}
