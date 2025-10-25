import React, { createContext, useState, useContext, ReactNode } from 'react';
import api from '../api/axiosClient';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface User {
  name: string;
  role: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Toggle this to false when backend is ready
const TEST_BYPASS = true;

function safeParseUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    const parsed = safeParseUser(saved);
    if (parsed) return parsed;

    if (TEST_BYPASS) {
      const defaultUser: User = { name: 'Sam Super', email: 'sam@medaithon.test', role: 'SuperAdmin' };
      localStorage.setItem('user', JSON.stringify(defaultUser));
      localStorage.setItem('token', 'test-token');
      return defaultUser;
    }
    return null;
  });

  const login = async (email: string, password: string) => {
    if (TEST_BYPASS) {
      const testUser: User = { name: 'Sam Super', email, role: 'SuperAdmin' };
      localStorage.setItem('user', JSON.stringify(testUser));
      localStorage.setItem('token', 'test-token');
      setUser(testUser);
      return true;
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const url = ()=>{
  return apiUrl;
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
