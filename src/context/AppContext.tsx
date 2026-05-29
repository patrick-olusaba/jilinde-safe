import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AppState, Guardian, Alert, Screen, AuthScreen, FamilyMember } from '../types';

interface AppContextType {
  state: AppState;
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  setSosMessage: (msg: string) => void;
  addGuardian: (g: Omit<Guardian, 'id'>) => void;
  removeGuardian: (id: string) => void;
  toggleGuardian: (id: string) => void;
  addAlert: (a: Omit<Alert, 'id'>) => void;
  resolveAlert: (id: string) => void;
  setTimer: (minutes: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  upgradePlan: () => void;
  upgradeToFamily: () => void;
  login: (phone: string, password: string) => { success: boolean; error?: string };
  signUp: (name: string, phone: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  switchAuthScreen: (screen: AuthScreen) => void;
  addFamilyMember: (m: Omit<FamilyMember, 'id'>) => void;
  removeFamilyMember: (id: string) => void;
  toggleFamilyMember: (id: string) => void;
  groupSOS: () => void;
  toggleSiren: () => void;
  toggleBatteryAlerts: () => void;
  toggleOfflineAlerts: () => void;
  simulatePhoneOffline: () => void;
  requestNotificationPermission: () => void;
  sendNotification: (title: string, body: string) => void;
  getMapsLink: () => string;
}

const defaultGuardians: Guardian[] = [
  { id: '1', name: 'Mama Wanjiku', phone: '+254 712 345 678', relation: 'Mother', avatar: '👩🏾', isActive: true },
  { id: '2', name: 'Bro Kamau',    phone: '+254 722 876 543', relation: 'Brother', avatar: '👨🏾', isActive: true },
  { id: '3', name: 'Amina Odhiambo', phone: '+254 700 111 222', relation: 'Friend', avatar: '👩🏾‍🦱', isActive: true },
];

const defaultAlerts: Alert[] = [
  {
    id: 'a1',
    type: 'sos',
    message: 'SOS triggered near CBD',
    location: 'Kenyatta Ave, Nairobi CBD',
    timestamp: new Date(Date.now() - 1000 * 60 * 32),
    resolved: true,
  },
  {
    id: 'a2',
    type: 'timer',
    message: 'Safe timer expired',
    location: 'Westlands, Nairobi',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    resolved: true,
  },
  {
    id: 'a3',
    type: 'safe',
    message: 'Arrived home safely',
    location: 'Kasarani, Nairobi',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    resolved: true,
  },
];

const AppContext = createContext<AppContextType | null>(null);

interface StoredUser {
  name: string;
  phone: string;
  password: string;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [users, setUsers] = useState<StoredUser[]>([]);

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    authScreen: 'login',
    user: { name: '', phone: '', plan: 'free' },
    sosMessage: "I'm in danger. Please track my location and call the police!",
    guardians: defaultGuardians,
    familyMembers: [],
    alerts: defaultAlerts,
    timerActive: false,
    timerMinutes: 30,
    timerEndTime: null,
    batteryLevel: 85,
    isPhoneOffline: false,
    sirenEnabled: true,
    batteryAlertsEnabled: true,
    offlineAlertsEnabled: true,
    userLocation: null,
    notificationsEnabled: false,
  });

  const setSosMessage = (msg: string) =>
    setState(s => ({ ...s, sosMessage: msg }));

  const addGuardian = (g: Omit<Guardian, 'id'>) =>
    setState(s => ({
      ...s,
      guardians: [...s.guardians, { ...g, id: Date.now().toString() }],
    }));

  const removeGuardian = (id: string) =>
    setState(s => ({ ...s, guardians: s.guardians.filter(g => g.id !== id) }));

  const toggleGuardian = (id: string) =>
    setState(s => ({
      ...s,
      guardians: s.guardians.map(g =>
        g.id === id ? { ...g, isActive: !g.isActive } : g
      ),
    }));

  const addAlert = (a: Omit<Alert, 'id'>) =>
    setState(s => ({
      ...s,
      alerts: [{ ...a, id: Date.now().toString() }, ...s.alerts],
    }));

  const resolveAlert = (id: string) =>
    setState(s => ({
      ...s,
      alerts: s.alerts.map(a => (a.id === id ? { ...a, resolved: true } : a)),
    }));

  const setTimer = (minutes: number) =>
    setState(s => ({ ...s, timerMinutes: minutes }));

  const startTimer = () =>
    setState(s => ({
      ...s,
      timerActive: true,
      timerEndTime: new Date(Date.now() + s.timerMinutes * 60 * 1000),
    }));

  const stopTimer = () =>
    setState(s => ({ ...s, timerActive: false, timerEndTime: null }));

  const upgradePlan = () =>
    setState(s => ({ ...s, user: { ...s.user, plan: 'premium' } }));

  const upgradeToFamily = () =>
    setState(s => ({ ...s, user: { ...s.user, plan: 'family' } }));

  const addFamilyMember = (m: Omit<FamilyMember, 'id'>) =>
    setState(s => ({
      ...s,
      familyMembers: [...s.familyMembers, { ...m, id: Date.now().toString() }],
    }));

  const removeFamilyMember = (id: string) =>
    setState(s => ({ ...s, familyMembers: s.familyMembers.filter(m => m.id !== id) }));

  const toggleFamilyMember = (id: string) =>
    setState(s => ({
      ...s,
      familyMembers: s.familyMembers.map(m =>
        m.id === id ? { ...m, isActive: !m.isActive } : m
      ),
    }));

  const groupSOS = () => {
    const activeMembers = state.familyMembers.filter(m => m.isActive);
    activeMembers.forEach(m => {
      addAlert({
        type: 'sos',
        message: `Group SOS: ${m.name} may be in danger!`,
        location: 'Nairobi CBD',
        timestamp: new Date(),
        resolved: false,
      });
    });
  };

  const toggleSiren = () =>
    setState(s => ({ ...s, sirenEnabled: !s.sirenEnabled }));

  const toggleBatteryAlerts = () =>
    setState(s => ({ ...s, batteryAlertsEnabled: !s.batteryAlertsEnabled }));

  const toggleOfflineAlerts = () =>
    setState(s => ({ ...s, offlineAlertsEnabled: !s.offlineAlertsEnabled }));

  const simulatePhoneOffline = () => {
    setState(s => ({ ...s, isPhoneOffline: true }));
    addAlert({
      type: 'phoneoff',
      message: 'Connection lost — phone may be off or in an area with no signal.',
      location: 'Last known: Nairobi CBD',
      timestamp: new Date(),
      resolved: false,
    });
  };

  // Geolocation tracking
  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      pos => {
        setState(s => ({
          ...s,
          userLocation: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        }));
      },
      () => {
        // Fallback to Nairobi CBD if geolocation fails
        setState(s => ({
          ...s,
          userLocation: s.userLocation ?? { lat: -1.2921, lng: 36.8219 },
        }));
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // Notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') setState(s => ({ ...s, notificationsEnabled: true }));
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      setState(s => ({ ...s, notificationsEnabled: true }));
    }
  };

  const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/vite.svg', tag: 'sos' });
    }
  };

  const getMapsLink = () => {
    const loc = state.userLocation;
    if (!loc) return 'https://maps.google.com/?q=Nairobi+CBD';
    return `https://maps.google.com/?q=${loc.lat},${loc.lng}`;
  };

  // Battery simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setState(s => {
        if (!s.isAuthenticated) return s;
        const newLevel = Math.max(0, s.batteryLevel - 1);
        if (newLevel === 0 && s.batteryLevel > 0 && s.batteryAlertsEnabled) {
          setTimeout(() => {
            addAlert({
              type: 'battery',
              message: 'Phone battery died — last known location: Nairobi CBD',
              location: 'Nairobi CBD',
              timestamp: new Date(),
              resolved: false,
            });
          }, 100);
        }
        return { ...s, batteryLevel: newLevel };
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const login = (phone: string, password: string) => {
    if (!phone.trim() || !password.trim()) return { success: false, error: 'Please fill in all fields.' };
    const match = users.find(u => u.phone === phone.trim() && u.password === password);
    if (!match) return { success: false, error: 'Invalid phone number or password.' };
    setState(s => ({ ...s, isAuthenticated: true, user: { ...s.user, name: match.name, phone: match.phone } }));
    return { success: true };
  };

  const signUp = (name: string, phone: string, password: string) => {
    if (!name.trim() || !phone.trim() || !password.trim()) return { success: false, error: 'Please fill in all fields.' };
    if (users.some(u => u.phone === phone.trim())) return { success: false, error: 'An account with this phone number already exists.' };
    const newUser: StoredUser = { name: name.trim(), phone: phone.trim(), password };
    setUsers(prev => [...prev, newUser]);
    setState(s => ({
      ...s,
      isAuthenticated: true,
      user: { ...s.user, name: name.trim(), phone: phone.trim() },
    }));
    return { success: true };
  };

  const logout = () =>
    setState(s => ({ ...s, isAuthenticated: false, authScreen: 'login' }));

  const switchAuthScreen = (screen: AuthScreen) =>
    setState(s => ({ ...s, authScreen: screen }));

  return (
    <AppContext.Provider
      value={{
        state,
        currentScreen,
        navigate,
        setSosMessage,
        addGuardian,
        removeGuardian,
        toggleGuardian,
        addAlert,
        resolveAlert,
        setTimer,
        startTimer,
        stopTimer,
        upgradePlan,
        upgradeToFamily,
        login,
        signUp,
        logout,
        switchAuthScreen,
        addFamilyMember,
        removeFamilyMember,
        toggleFamilyMember,
        groupSOS,
        toggleSiren,
        toggleBatteryAlerts,
        toggleOfflineAlerts,
        simulatePhoneOffline,
        requestNotificationPermission,
        sendNotification,
        getMapsLink,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
