import { useApp } from '../../context/AppContext';
import type { Screen } from '../../types';

const NAV_ITEMS: { id: Screen; label: string }[] = [
  { id: 'home',      label: 'Home' },
  { id: 'guardians', label: 'Circle' },
  { id: 'alerts',    label: 'Alerts' },
  { id: 'profile',   label: 'Profile' },
];

const NavIcon: React.FC<{ id: Screen; active: boolean }> = ({ id, active }) => {
  const stroke = active ? 'var(--gold)' : 'var(--text-muted)';
  switch (id) {
    case 'home':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
    case 'guardians':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      );
    case 'alerts':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      );
    case 'profile':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      );
    default:
      return null;
  }
};

const BottomNav = () => {
  const { state, currentScreen, navigate } = useApp();
  const unresolved = state.alerts.filter(a => !a.resolved).length;

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.slice(0, 2).map(item => (
        <button
          key={item.id}
          className={`bottom-nav__item${currentScreen === item.id ? ' active' : ''}`}
          onClick={() => navigate(item.id)}
        >
          <NavIcon id={item.id} active={currentScreen === item.id} />
          <span className="bottom-nav__label">{item.label}</span>
        </button>
      ))}

      <button
        className={`bottom-nav__shield${state.timerActive ? ' active' : ''}`}
        onClick={() => navigate('timer')}
        aria-label="Safety timer"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </button>

      {NAV_ITEMS.slice(2).map(item => (
        <button
          key={item.id}
          className={`bottom-nav__item${currentScreen === item.id ? ' active' : ''}`}
          onClick={() => navigate(item.id)}
        >
          <NavIcon id={item.id} active={currentScreen === item.id} />
          <span className="bottom-nav__label">{item.label}</span>
          {item.id === 'alerts' && unresolved > 0 && (
            <span className="nav-badge">{unresolved}</span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
