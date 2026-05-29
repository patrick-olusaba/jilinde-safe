export type Screen = 'home' | 'guardians' | 'timer' | 'alerts' | 'profile' | 'fakecall' | 'evidence' | 'plan' | 'family';
export type AuthScreen = 'login' | 'signup';

export interface Guardian {
  id: string;
  name: string;
  phone: string;
  relation: string;
  avatar: string;
  isActive: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  phone: string;
  role: 'parent' | 'child';
  isActive: boolean;
}

export interface Alert {
  id: string;
  type: 'sos' | 'timer' | 'safe' | 'battery' | 'phoneoff';
  message: string;
  location: string;
  timestamp: Date;
  resolved: boolean;
}

export interface AppState {
  isAuthenticated: boolean;
  authScreen: AuthScreen;
  user: {
    name: string;
    phone: string;
    plan: 'free' | 'premium' | 'family';
  };
  sosMessage: string;
  guardians: Guardian[];
  familyMembers: FamilyMember[];
  alerts: Alert[];
  timerActive: boolean;
  timerMinutes: number;
  timerEndTime: Date | null;
  batteryLevel: number;
  isPhoneOffline: boolean;
  sirenEnabled: boolean;
  batteryAlertsEnabled: boolean;
  offlineAlertsEnabled: boolean;
  userLocation: { lat: number; lng: number } | null;
  notificationsEnabled: boolean;
}
