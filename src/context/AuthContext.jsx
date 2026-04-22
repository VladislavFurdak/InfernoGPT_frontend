'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext(null);

const PUBLIC_PATHS = ['/login', '/admin', '/addUser'];

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const t = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
    const e = sessionStorage.getItem('auth_email') || localStorage.getItem('auth_email');

    if (t) {
      // Check if token is expired
      try {
        const payload = JSON.parse(atob(t));
        if (payload.exp && payload.exp > Date.now()) {
          setToken(t);
          setEmail(e);
        } else {
          // Token expired
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_email');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_email');
        }
      } catch {
        // Invalid token
      }
    }
    setChecked(true);
  }, []);

  useEffect(() => {
    if (checked && !token && !PUBLIC_PATHS.includes(pathname)) {
      router.replace('/login');
    }
  }, [checked, token, pathname, router]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_email');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
    setToken(null);
    setEmail(null);
    router.replace('/login');
  }, [router]);

  const value = useMemo(() => ({
    token,
    email,
    isAuthenticated: !!token,
    checked,
    logout,
  }), [token, email, checked, logout]);

  // Don't render protected content until auth check is done
  if (!checked) {
    return (
      <div className="bg-dark-900 w-full h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Don't render protected content if not authenticated (unless on public path)
  if (!token && !PUBLIC_PATHS.includes(pathname)) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
