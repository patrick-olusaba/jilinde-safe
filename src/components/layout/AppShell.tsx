import { useApp } from '../../context/AppContext';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import HomeScreen from '../../screens/HomeScreen';
import GuardiansScreen from '../../screens/GuardiansScreen';
import TimerScreen from '../../screens/TimerScreen';
import AlertsScreen from '../../screens/AlertsScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import FakeCallScreen from '../../screens/FakeCallScreen';
import EvidenceScreen from '../../screens/EvidenceScreen';
import PlanScreen from '../../screens/PlanScreen';
import FamilyScreen from '../../screens/FamilyScreen';
import LoginScreen from '../../screens/LoginScreen';
import SignUpScreen from '../../screens/SignUpScreen';

const renderScreen = (screen: string) => {
  switch (screen) {
    case 'home':      return <HomeScreen />;
    case 'guardians': return <GuardiansScreen />;
    case 'timer':     return <TimerScreen />;
    case 'alerts':    return <AlertsScreen />;
    case 'profile':   return <ProfileScreen />;
    case 'fakecall':  return <FakeCallScreen />;
    case 'evidence':  return <EvidenceScreen />;
    case 'plan':      return <PlanScreen />;
    case 'family':    return <FamilyScreen />;
    default:          return <HomeScreen />;
  }
};

const AppShell = () => {
  const { state, currentScreen } = useApp();

  if (!state.isAuthenticated) {
    return state.authScreen === 'login' ? <LoginScreen /> : <SignUpScreen />;
  }

  return (
    <div className="app-shell">
      <TopNav />
      <div className="screen-container">
        {renderScreen(currentScreen)}
      </div>
      <BottomNav />
    </div>
  );
};

export default AppShell;
