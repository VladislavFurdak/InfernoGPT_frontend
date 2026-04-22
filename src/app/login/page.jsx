'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BotAvatar from '../../components/ui/BotAvatar';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Store token
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('auth_token', data.token);
      storage.setItem('auth_email', data.email);

      // Full page reload so AuthContext re-reads the token from storage
      window.location.href = data.role === 'admin' ? '/addUser' : '/';
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-900 text-gray-200 w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BotAvatar size="lg" className="rounded-2xl bg-dark-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">InfernoGPT</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl"
        >
          <div className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Login field */}
            <div>
              <label htmlFor="login-input" className="block text-sm font-medium text-gray-300 mb-2">
                Login
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <i className="fa-solid fa-user"></i>
                </div>
                <input
                  type="text"
                  id="login-input"
                  placeholder="Enter your login"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 text-white rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-brand-500 focus:ring-brand-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Remember me
                </span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_20px_rgba(255,69,0,0.3)] hover:shadow-[0_0_30px_rgba(255,69,0,0.5)] mt-6 cursor-pointer"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              {!loading && <i className="fa-solid fa-arrow-right"></i>}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          &copy; 2026 InfernoGPT. All rights reserved.
        </div>
      </div>
    </div>
  );
}
