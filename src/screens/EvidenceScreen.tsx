import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ui/ScreenHeader';
import InfoBox from '../components/ui/InfoBox';
import '../styles/EvidenceScreen.css';

interface MockClip {
  id: string;
  type: 'audio' | 'video' | 'photo';
  label: string;
  location: string;
  duration: string;
  date: string;
  icon: string;
}

const MOCK_CLIPS: MockClip[] = [
  {
    id: 'e1',
    type: 'audio',
    label: 'SOS Audio Recording',
    location: 'Kenyatta Ave, Nairobi CBD',
    duration: '2:34',
    date: '12 May 2026, 23:14',
    icon: '🎙️',
  },
  {
    id: 'e2',
    type: 'video',
    label: 'Front Camera Capture',
    location: 'Moi Avenue, Nairobi CBD',
    duration: '0:47',
    date: '8 May 2026, 21:52',
    icon: '📹',
  },
  {
    id: 'e3',
    type: 'photo',
    label: 'Auto Photo Capture',
    location: 'Westlands, Nairobi',
    duration: '—',
    date: '3 May 2026, 22:08',
    icon: '📸',
  },
];

export default function EvidenceScreen() {
  const { state } = useApp();
  const isPremium = state.user.plan === 'premium' || state.user.plan === 'family';

  return (
    <div className="evidence-screen">
      <ScreenHeader title="Evidence Vault" subtitle="Auto-captured media when SOS is triggered" />

      {!isPremium && (
        <div className="evidence-upgrade-banner">
          <div className="evidence-upgrade-banner__icon">🔒</div>
          <div className="evidence-upgrade-banner__text">
            <span className="evidence-upgrade-banner__title">Premium Feature</span>
            <span className="evidence-upgrade-banner__desc">
              Upgrade to Premium to enable automatic audio & video recording when SOS is triggered.
              Your evidence is securely backed up to the cloud.
            </span>
          </div>
        </div>
      )}

      {isPremium ? (
        <div className="evidence-list">
          {MOCK_CLIPS.map((clip, i) => (
            <div
              key={clip.id}
              className="evidence-card"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className={`evidence-card__icon-wrap ${clip.type}`}>
                <span>{clip.icon}</span>
              </div>
              <div className="evidence-card__info">
                <div className="evidence-card__label">{clip.label}</div>
                <div className="evidence-card__meta">
                  <span>📍 {clip.location}</span>
                </div>
                <div className="evidence-card__meta">
                  <span>🕐 {clip.date}</span>
                  <span className="evidence-card__duration">{clip.duration}</span>
                </div>
              </div>
              <button className="evidence-card__play" aria-label="Play recording">
                ▶
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="evidence-list evidence-list--locked">
          {MOCK_CLIPS.map((clip, i) => (
            <div
              key={clip.id}
              className="evidence-card locked"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="evidence-card__icon-wrap locked-icon">
                <span>🔒</span>
              </div>
              <div className="evidence-card__info">
                <div className="evidence-card__label locked-text">Locked Recording</div>
                <div className="evidence-card__meta locked-text">
                  <span>Upgrade to view</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="evidence-stats">
        <div className="evidence-stat">
          <span className="evidence-stat__value">0</span>
          <span className="evidence-stat__label">Recordings Today</span>
        </div>
        <div className="evidence-stat">
          <span className="evidence-stat__value">{isPremium ? '3' : '—'}</span>
          <span className="evidence-stat__label">Total Clips</span>
        </div>
        <div className="evidence-stat">
          <span className="evidence-stat__value">{isPremium ? '128 MB' : '—'}</span>
          <span className="evidence-stat__label">Cloud Storage</span>
        </div>
      </div>

      <InfoBox icon="🛡️">
        Evidence is encrypted end-to-end and only accessible by you. In a legal situation, you can export timestamped recordings as proof — this could be the difference between a case succeeding or failing.
      </InfoBox>
    </div>
  );
}
