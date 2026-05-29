import { useApp } from '../../context/AppContext';

const TopNav = () => {
  const { state, navigate } = useApp();
  const { batteryLevel, isPhoneOffline } = state;
  const batteryColor = batteryLevel > 50 ? 'var(--safe-green)' : batteryLevel > 15 ? 'var(--gold)' : 'var(--sos-red)';

  return (
    <div className="top-nav">
      <div className="top-nav__brand" onClick={() => navigate('home')}>
        <div className="top-nav__logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <span className="top-nav__title">Jilinde Safe</span>
      </div>

      <div className="top-nav__actions">
        {isPhoneOffline && (
          <span className="top-nav__offline" title="Phone offline">📵</span>
        )}
        <div className="battery-indicator" title={`Battery: ${batteryLevel}%`}>
          <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
            <rect x="0" y="0" width="19" height="11" rx="2" stroke={batteryColor} strokeWidth="1" fill="none" />
            <rect x="19" y="3" width="2.5" height="5" rx="1" fill={batteryColor} />
            <rect x="2" y="2" width={`${(batteryLevel / 100) * 15}`} height="7" rx="1" fill={batteryColor} />
          </svg>
          <span className="battery-indicator__pct">{batteryLevel}%</span>
        </div>
        <button className="top-nav__avatar" onClick={() => navigate('profile')} aria-label="Profile">
          👩🏾
        </button>
      </div>
    </div>
  );
};

export default TopNav;
