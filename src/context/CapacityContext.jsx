'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const CapacityContext = createContext(null);

const DEFAULT = { available: false, active: 0, max: 0 };

export function CapacityProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [capacity, setCapacity] = useState({ deep: DEFAULT, fast: DEFAULT });
  const intervalRef = useRef(null);

  const fetchCapacity = useCallback(async () => {
    try {
      const res = await fetch('/api/health/capacity');
      if (res.ok) {
        const data = await res.json();
        setCapacity({
          deep: data.deep || DEFAULT,
          fast: data.fast || DEFAULT,
        });
      }
    } catch {
      // Network error — keep last known state
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchCapacity();
    intervalRef.current = setInterval(fetchCapacity, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, fetchCapacity]);

  const anyAvailable = capacity.deep.available || capacity.fast.available;

  return (
    <CapacityContext.Provider value={{ capacity, anyAvailable }}>
      {children}
    </CapacityContext.Provider>
  );
}

export function useCapacity() {
  const context = useContext(CapacityContext);
  if (!context) {
    throw new Error('useCapacity must be used within a CapacityProvider');
  }
  return context;
}
