import { create } from 'zustand';
import { UserProfile, Athlete, Match, Role } from '@/types';

export interface RegisteredAccount {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  teamName: string;
  sport: string;
  athlete: Athlete;
}

const getStoredAccounts = (): Record<string, RegisteredAccount> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('athletisis_registered_accounts');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const saveStoredAccounts = (accounts: Record<string, RegisteredAccount>) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('athletisis_registered_accounts', JSON.stringify(accounts));
  }
};

const buildDefaultAthlete = (id: number, fullName: string, role: Role, sport: string, teamName: string): Athlete => {
  return {
    id,
    userId: id,
    name: fullName,
    age: role === 'COACH' ? 32 : 21,
    sport: sport || 'Football',
    position: role === 'COACH' ? 'Head Tactical Coach' : 'Center Midfielder',
    teamName: teamName || 'My Team',
    preferredRole: role === 'COACH' ? 'Tactician' : 'Playmaker',
    experienceLevel: role === 'COACH' ? 'Head Coach' : 'Athlete',
    matchesAnalyzedCount: 0,
    dna: {
      technicalScore: 0,
      tacticalScore: 0,
      physicalScore: 0,
      decisionMakingScore: 0,
      consistencyScore: 0,
      overallScore: 0,
    },
  };
};

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  athlete: Athlete | null;
  registerAccount: (fullName: string, email: string, role: Role, sport: string, teamName: string) => boolean;
  loginWithCredentials: (email: string, fullNameInput?: string) => boolean;
  logout: () => void;
}

const getInitialAuthState = (): { token: string | null; user: UserProfile | null; athlete: Athlete | null } => {
  if (typeof window === 'undefined') {
    return { token: null, user: null, athlete: null };
  }
  
  const token = localStorage.getItem('athletisis_token') || 'demo-token-athletisis';
  const storedEmail = localStorage.getItem('athletisis_user_email') || 'rishi.tiwari@athletisis.ai';

  const accounts = getStoredAccounts();
  const accountKey = storedEmail.toLowerCase().trim();
  const account = accounts[accountKey];

  if (account) {
    const userRole: Role = account.role === 'COACH' ? 'COACH' : account.role === 'ADMIN' ? 'ADMIN' : 'ATHLETE';
    return {
      token,
      user: {
        id: account.id,
        email: account.email,
        fullName: account.fullName,
        role: userRole,
      },
      athlete: account.athlete,
    };
  }

  // Fallback for direct token with formatted name
  const nameParts = storedEmail.split('@')[0].split(/[\._-]/);
  const derivedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  const fallbackAthlete = buildDefaultAthlete(Date.now(), derivedName || 'User', 'ATHLETE', 'Football', 'My Team');

  return {
    token,
    user: {
      id: fallbackAthlete.id,
      email: storedEmail,
      fullName: derivedName,
      role: 'ATHLETE' as Role,
    },
    athlete: fallbackAthlete,
  };
};

const initialAuth = getInitialAuthState();

export const useAuthStore = create<AuthState>((set) => ({
  token: initialAuth.token,
  user: initialAuth.user,
  athlete: initialAuth.athlete,

  registerAccount: (fullName: string, email: string, role: Role, sport: string, teamName: string) => {
    const emailKey = email.toLowerCase().trim();
    const accounts = getStoredAccounts();
    const newId = Date.now();
    const athlete = buildDefaultAthlete(newId, fullName, role, sport, teamName);

    const newAccount: RegisteredAccount = {
      id: newId,
      email,
      fullName,
      role,
      teamName: teamName || 'My Team',
      sport: sport || 'Football',
      athlete,
    };

    accounts[emailKey] = newAccount;
    saveStoredAccounts(accounts);

    const fakeToken = `jwt_${newId}_${role.toLowerCase()}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('athletisis_token', fakeToken);
      localStorage.setItem('athletisis_user_email', email);
    }

    set({
      token: fakeToken,
      user: { id: newId, email, fullName, role },
      athlete,
    });

    return true;
  },

  loginWithCredentials: (email: string, fullNameInput?: string) => {
    const emailKey = email.toLowerCase().trim();
    const accounts = getStoredAccounts();
    let account = accounts[emailKey];

    if (!account) {
      const nameParts = emailKey.split('@')[0].split(/[\._-]/);
      const derivedName = fullNameInput || nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || 'Athlete User';
      const newId = Date.now();
      const athlete = buildDefaultAthlete(newId, derivedName, 'ATHLETE', 'Football', 'My Team');
      
      account = {
        id: newId,
        email: emailKey,
        fullName: derivedName,
        role: 'ATHLETE',
        teamName: 'My Team',
        sport: 'Football',
        athlete,
      };
      accounts[emailKey] = account;
      saveStoredAccounts(accounts);
    }

    const fakeToken = `jwt_${account.id}_${account.role.toLowerCase()}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('athletisis_token', fakeToken);
      localStorage.setItem('athletisis_user_email', account.email);
    }

    set({
      token: fakeToken,
      user: { id: account.id, email: account.email, fullName: account.fullName, role: account.role },
      athlete: account.athlete,
    });

    return true;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('athletisis_token');
      localStorage.removeItem('athletisis_user_email');
    }
    set({ token: null, user: null, athlete: null });
  },
}));

// DYNAMIC MATCHES STORE
interface MatchState {
  matches: Match[];
  addMatch: (match: Omit<Match, 'id'>) => Match;
  getMatchesForUser: (userEmail: string) => Match[];
}

const DEFAULT_DEMO_MATCHES: Match[] = [
  {
    id: 101,
    matchName: 'FC Barcelona vs Real Madrid - El Clasico 2026',
    sport: 'Football',
    matchDate: '2026-09-08',
    teamName: 'FC Barcelona',
    opponentName: 'Real Madrid CF',
    venue: 'Camp Nou',
    matchType: 'Competitive',
    athleteId: 101,
    athleteName: 'Pedri Gonzalez',
    notes: 'Spatial heatmap positioning & high-intensity sprint tracking',
    videoUrl: '/sample-match.mp4',
    analysisFocus: 'PLAYER',
    status: 'COMPLETED',
  },
  {
    id: 201,
    matchName: 'India vs Australia - T20 World Cup Final 2026',
    sport: 'Cricket',
    matchDate: '2026-09-05',
    teamName: 'India',
    opponentName: 'Australia',
    venue: 'Narendra Modi Stadium',
    matchType: 'Competitive',
    athleteId: 201,
    athleteName: 'Virat Kohli',
    notes: 'Cover drive biomechanics & crease length distribution',
    videoUrl: '/sample-match2.mp4',
    analysisFocus: 'PLAYER',
    status: 'COMPLETED',
  },
  {
    id: 301,
    matchName: 'Poland vs Italy - FIVB Volleyball Nations League',
    sport: 'Volleyball',
    matchDate: '2026-09-02',
    teamName: 'Poland',
    opponentName: 'Italy',
    venue: 'Spodek Arena',
    matchType: 'Competitive',
    athleteId: 301,
    athleteName: 'Wilfredo Leon',
    notes: 'Spike jump height & net block defense coverage',
    videoUrl: '/sample-match.mp4',
    analysisFocus: 'PLAYER',
    status: 'COMPLETED',
  },
];

const getStoredMatches = (email?: string): Match[] => {
  if (typeof window === 'undefined') return DEFAULT_DEMO_MATCHES;
  const activeEmail = email || localStorage.getItem('athletisis_user_email') || 'rishi.tiwari@athletisis.ai';
  try {
    const raw = localStorage.getItem(`athletisis_matches_${activeEmail.toLowerCase().trim()}`);
    const parsed = raw ? JSON.parse(raw) : [];
    return parsed.length > 0 ? parsed : DEFAULT_DEMO_MATCHES;
  } catch (e) {
    return DEFAULT_DEMO_MATCHES;
  }
};

const saveStoredMatches = (email: string, matches: Match[]) => {
  if (typeof window !== 'undefined' && email) {
    localStorage.setItem(`athletisis_matches_${email.toLowerCase().trim()}`, JSON.stringify(matches));
  }
};

export const useMatchStore = create<MatchState>((set) => ({
  matches: typeof window !== 'undefined' ? getStoredMatches(localStorage.getItem('athletisis_user_email') || '') : [],

  addMatch: (matchData) => {
    const activeEmail = localStorage.getItem('athletisis_user_email') || 'user@athletisis.com';
    const existing = getStoredMatches(activeEmail);
    const newMatch: Match = {
      ...matchData,
      id: Date.now(),
      status: 'COMPLETED',
    };
    const updated = [newMatch, ...existing];
    saveStoredMatches(activeEmail, updated);
    set({ matches: updated });
    return newMatch;
  },

  getMatchesForUser: (userEmail) => {
    return getStoredMatches(userEmail);
  },
}));
