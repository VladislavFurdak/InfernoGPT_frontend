'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

function generatePassword(length = 16) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export default function AddUserPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState(() => generatePassword());
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Check admin auth
  useEffect(() => {
    const t = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
    if (!t) {
      router.replace('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(t));
      if (payload.role !== 'admin' || payload.exp < Date.now()) {
        router.replace('/login');
        return;
      }
      setToken(t);
    } catch {
      router.replace('/login');
    }
  }, [router]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    const res = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setLoading(true);

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: newEmail, password: newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setFormError(data.error);
      return;
    }

    setFormSuccess(`User "${data.user.email}" created with password: ${newPassword}`);
    setNewEmail('');
    setNewPassword(generatePassword());
    fetchUsers();
  };

  const handleDelete = async (id, email) => {
    if (!confirm(`Delete user ${email}?`)) return;

    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) fetchUsers();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_email');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
    router.replace('/login');
  };

  if (!token) return null;

  return (
    <div className="bg-dark-900 text-gray-200 w-full min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket mr-2"></i>
            Logout
          </button>
        </div>

        {/* Add user form */}
        <form onSubmit={handleAddUser} className="bg-dark-800 border border-dark-700 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Add New User</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email / Login</label>
              <input
                type="text"
                placeholder="user@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password (generated)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 bg-dark-700 border border-dark-600 text-white font-mono rounded-xl py-2.5 px-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setNewPassword(generatePassword())}
                  className="bg-dark-600 hover:bg-dark-700 text-gray-300 rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
                  title="Generate new password"
                >
                  <i className="fa-solid fa-rotate"></i>
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition-colors cursor-pointer"
            >
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
          {formError && (
            <div className="mt-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="mt-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 font-mono break-all">
              {formSuccess}
            </div>
          )}
        </form>

        {/* Users list */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-700">
            <h2 className="text-lg font-semibold text-white">
              Users ({users.length})
            </h2>
          </div>
          {users.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No users yet. Add one above.
            </div>
          ) : (
            <div className="divide-y divide-dark-700">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="text-white font-medium">{user.email}</div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      Created: {new Date(user.created_at).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(user.id, user.email)}
                    className="text-red-400 hover:text-red-300 transition-colors text-sm cursor-pointer"
                  >
                    <i className="fa-solid fa-trash-can mr-1"></i>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
