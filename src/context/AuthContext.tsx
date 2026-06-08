import { createContext, useContext, useState, type ReactNode } from 'react';

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  initials: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const CREDENTIALS: Record<string, { password: string; user: AuthUser }> = {
  'admin@edutech.com': {
    password: 'admin123',
    user: { name: 'Grace Moyo', email: 'admin@edutech.com', role: 'Head Teacher', initials: 'GM' },
  },
  'teacher@edutech.com': {
    password: 'teacher123',
    user: { name: 'Mr. Farai Ncube', email: 'teacher@edutech.com', role: 'Teacher', initials: 'FN' },
  },
  'secretary@edutech.com': {
    password: 'secretary123',
    user: { name: 'Mrs. Chipo Ndlovu', email: 'secretary@edutech.com', role: 'Secretary', initials: 'CN' },
  },
};

const AuthContext = createContext<AuthContextValue>({
  user: null, login: () => false, logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { return JSON.parse(localStorage.getItem('auth_user') ?? 'null'); }
    catch { return null; }
  });

  const login = (email: string, password: string): boolean => {
    const entry = CREDENTIALS[email.toLowerCase().trim()];
    if (entry && entry.password === password) {
      setUser(entry.user);
      localStorage.setItem('auth_user', JSON.stringify(entry.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
