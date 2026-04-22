'use client';

import { useAuth } from '../../context/AuthContext';

export default function UserProfile() {
  const { email, logout } = useAuth();

  const initials = email
    ? email.slice(0, 2).toUpperCase()
    : '??';

  return (
    <div className="p-4 border-t border-dark-700">
      <div className="flex items-center gap-3 p-2 rounded-lg">
        <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{email || 'User'}</p>
        </div>
        <button
          onClick={logout}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Logout"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </div>
  );
}
