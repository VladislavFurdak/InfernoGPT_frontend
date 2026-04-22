'use client';

import { AuthProvider } from '../context/AuthContext';
import { CapacityProvider } from '../context/CapacityContext';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CapacityProvider>
        {children}
      </CapacityProvider>
    </AuthProvider>
  );
}
