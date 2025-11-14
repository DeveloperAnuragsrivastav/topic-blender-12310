import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: { username: string } | null;
  login: (username: string, password: string) => void;
  signup: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('dummyUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string) => {
    const userData = { username };
    setUser(userData);
    localStorage.setItem('dummyUser', JSON.stringify(userData));
  };

  const signup = (username: string, password: string) => {
    const userData = { username };
    setUser(userData);
    localStorage.setItem('dummyUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dummyUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
