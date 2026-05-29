import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import LiveMap from '../components/ui/LiveMap';
import EmergencyCallOverlay from '../components/ui/EmergencyCallOverlay';
import useSiren from '../hooks/useSiren';
import '../styles/HomeScreen.css';

export default function HomeScreen() {
  const { state, setSosMessage, addAlert, navigate, requestNotificationPermission, sendNotification, getMapsLink } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(state.sosMessage);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [showCallOverlay, setShowCallOverlay] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const siren = useSiren();

  useEffect(() => {
    if (editing && textareaRef.current) textareaRef.current.focus();
  }, [editing]);

  useEffect(() => {
    if (sosTriggered) {
      setCountdown(5);
      countdownRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(countdownRef.current!);
            const mapsLink = getMapsLink();
            const loc = state.userLocation
              ? `${state.userLocation.lat.toFixed(4)}, ${state.userLocation.lng.toFixed(4)}`
              : 'Nairobi CBD';
            addAlert({
              type: 'sos',
              message: state.sosMessage,
              location: loc,
              timestamp: new Date(),
              resolved: false,
            });
            sendNotification('SOS Alert Triggered', `Live location: ${mapsLink}`);
            if (state.sirenEnabled) siren.start();
            setShowCallOverlay(true);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [sosTriggered]);

  const handleCancelSOS = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    siren.stop();
    setSosTriggered(false);
    setShowCallOverlay(false);
  };

  const handleCallComplete = () => {
    siren.stop();
    setSosTriggered(false);
    setShowCallOverlay(false);
  };

  const handleSaveMessage = () => {
    setSosMessage(draft);
    setEditing(false);
  };

  return (
    <div className="home-screen">
      {/* Hero tagline */}
      <div className="home-hero">
        <h2 className="home-hero__tagline">
          No Kenyan should disappear without a trace.
        </h2>
        <p className="home-hero__subtext">
          Speed. Proof. Automation. Location accuracy. Panic response. A complete safety ecosystem in your pocket.
        </p>
      </div>

      {/* SOS button */}
      <div className="sos-stage">
        <div className="sos-wrapper">
          <div className="sos-ring" />
          <div className="sos-ring" />
          <button
            className={`sos-btn${sosTriggered ? ' triggered' : ''}`}
            onClick={() => { requestNotificationPermission(); setSosTriggered(true); }}
            aria-label="Send SOS alert"
          >
            <span className="sos-btn__label">SOS</span>
          </button>
        </div>
        <p className="sos-hint">Hold for 1 second to activate · Silent mode available</p>
      </div>

      {/* Message card */}
      <div className="message-card">
        <div className="message-card__header">
          <div className="message-card__text">
            {editing ? (
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={3}
              />
            ) : (
              <span>{state.sosMessage}</span>
            )}
          </div>
          <button
            className="message-card__edit-btn"
            onClick={() => editing ? handleSaveMessage() : setEditing(true)}
            aria-label={editing ? 'Save message' : 'Edit message'}
          >
            {editing ? '✓' : '✏️'}
          </button>
        </div>
        <div className="message-card__tags">
          <span className="message-tag">📍 {'{location}'}</span>
          <span className="message-tag">🕐 {'{time}'}</span>
          <span className="message-tag">🔋 {'{battery}'}</span>
        </div>
        <div className="message-hint">
          <span className="hint-dot">i</span>
          <span>Your location & time will be automatically included</span>
        </div>
      </div>

      {/* Live Map */}
      <LiveMap />

      {/* Quick actions */}
      <div className="quick-actions">
        <div className="quick-card gold-accent" onClick={() => navigate('timer')}>
          <span className="quick-card__icon">⏱️</span>
          <div className="quick-card__title">Safe Timer</div>
          <div className="quick-card__desc">Auto-SOS if you don't check in</div>
        </div>
        <div className="quick-card" onClick={() => navigate('fakecall')}>
          <span className="quick-card__icon">📞</span>
          <div className="quick-card__title">Fake Call</div>
          <div className="quick-card__desc">Escape any uncomfortable situation</div>
        </div>
        <div className="quick-card" onClick={() => navigate('evidence')}>
          <span className="quick-card__icon">🎥</span>
          <div className="quick-card__title">Evidence Vault</div>
          <div className="quick-card__desc">Auto-recorded proof on SOS trigger</div>
        </div>
        <div className="quick-card" onClick={() => navigate('plan')}>
          <span className="quick-card__icon">⭐</span>
          <div className="quick-card__title">Upgrade Plan</div>
          <div className="quick-card__desc">Unlock Premium & Family features</div>
        </div>
        <div className="quick-card gold-accent" onClick={() => navigate('family')}>
          <span className="quick-card__icon">👨‍👩‍👧‍👦</span>
          <div className="quick-card__title">Family Shield</div>
          <div className="quick-card__desc">Manage family safety & group SOS</div>
        </div>
      </div>

      {/* SOS Countdown overlay */}
      {sosTriggered && !showCallOverlay && (
        <div className="sos-overlay">
          <span className="sos-overlay__icon">🚨</span>
          <div className="sos-countdown">{countdown}</div>
          <h2 className="sos-overlay__title">Sending SOS Alert</h2>
          <p className="sos-overlay__subtitle">
            Notifying your guardians and sharing your live location
          </p>
          <button className="sos-overlay__cancel" onClick={handleCancelSOS}>
            Cancel
          </button>
        </div>
      )}

      {/* Emergency Call overlay */}
      {showCallOverlay && (
        <EmergencyCallOverlay
          guardians={state.guardians.filter(g => g.isActive).map(g => ({
            id: g.id,
            name: g.name,
            avatar: g.avatar,
          }))}
          mapsLink={getMapsLink()}
          onComplete={handleCallComplete}
          onCancel={handleCancelSOS}
        />
      )}
    </div>
  );
}
