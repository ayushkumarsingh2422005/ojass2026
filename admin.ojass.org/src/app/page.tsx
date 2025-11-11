'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login - use username or email field as email
        const loginEmail = username.trim() || email.trim();
        if (!loginEmail || !password) {
          setError('Please enter email and password');
          setLoading(false);
          return;
        }

        await authAPI.login(loginEmail, password);
        router.push('/dashboard');
      } else {
        // Signup is not supported for admin panel
        setError('Admin signup is not available. Please contact system administrator.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const isFormValid = isLogin
    ? (username.trim() !== '' || email.trim() !== '') && password.length >= 6
    : username.trim() !== '' && email.trim() !== '' && password.length >= 6;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-950 via-gray-950 to-black flex items-center justify-center">
      {/* Cyberpunk Cityscape Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Atmospheric Haze Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-gray-950/90 z-10" />
        
        {/* Sky with slight fog */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-gray-950 to-black" />

        {/* Left Skyscraper with Neon Signs */}
        <div className="absolute left-0 bottom-0 w-80 h-full bg-gradient-to-t from-gray-900 via-gray-800 to-slate-900 opacity-90">
          {/* Building structure */}
          <div className="absolute inset-0">
            {/* Vertical neon signs - Pink and Blue */}
            <div className="absolute left-12 top-32 w-3 h-32 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full blur-sm animate-pulse shadow-[0_0_20px_pink]" />
            <div className="absolute left-20 top-20 w-3 h-40 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full blur-sm animate-pulse shadow-[0_0_20px_cyan]" style={{ animationDelay: '0.5s' }} />
            <div className="absolute left-28 top-40 w-3 h-28 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full blur-sm animate-pulse shadow-[0_0_20px_pink]" style={{ animationDelay: '1s' }} />
            
            {/* Horizontal screens */}
            <div className="absolute left-8 top-64 w-24 h-4 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 blur-sm rounded" />
            <div className="absolute left-8 top-80 w-32 h-3 bg-gradient-to-r from-pink-500/50 to-cyan-500/50 blur-sm rounded" />
            
            {/* Window lights */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={`left-${i}`}
                className="absolute w-2 h-3 bg-cyan-400/60 rounded-sm blur-[1px] animate-pulse"
                style={{
                  left: `${20 + (i % 5) * 12}%`,
                  top: `${40 + Math.floor(i / 5) * 15}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Skyscraper with Holographic Displays */}
        <div className="absolute right-0 bottom-0 w-96 h-full bg-gradient-to-t from-gray-900 via-slate-800 to-gray-800 opacity-90">
          <div className="absolute inset-0">
            {/* Large holographic screen - Cyan circular patterns */}
            <div className="absolute right-16 top-32 w-48 h-32 bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-transparent rounded-lg border border-cyan-500/50 backdrop-blur-sm">
              {/* Circular pattern */}
              <div className="absolute inset-4 rounded-full border-2 border-cyan-400/60 animate-pulse" />
              <div className="absolute inset-8 rounded-full border border-cyan-300/40" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-400/40 rounded-full blur-sm" />
            </div>
            
            {/* Second holographic screen */}
            <div className="absolute right-8 top-72 w-40 h-24 bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-transparent rounded-lg border border-blue-400/50 backdrop-blur-sm">
              <div className="absolute inset-3 rounded-full border border-blue-400/60" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-400/50 rounded-full" />
            </div>
            
            {/* Window lights */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={`right-${i}`}
                className="absolute w-2 h-3 bg-blue-400/60 rounded-sm blur-[1px] animate-pulse"
                style={{
                  right: `${15 + (i % 6) * 10}%`,
                  top: `${35 + Math.floor(i / 6) * 12}%`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Background buildings (farther back) */}
        <div className="absolute left-1/4 bottom-0 w-40 h-3/4 bg-gradient-to-t from-gray-900 to-gray-800 opacity-60 blur-sm">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`bg-${i}`} className="absolute w-1 h-2 bg-cyan-400/40 rounded-sm blur-[1px]" style={{ left: `${20 + i * 15}%`, top: `${30 + i * 8}%` }} />
          ))}
        </div>

        <div className="absolute right-1/3 bottom-0 w-32 h-2/3 bg-gradient-to-t from-gray-900 to-slate-800 opacity-50 blur-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`bg2-${i}`} className="absolute w-1 h-2 bg-pink-400/40 rounded-sm blur-[1px]" style={{ right: `${20 + i * 12}%`, top: `${35 + i * 10}%` }} />
          ))}
        </div>

        {/* Flying Vehicles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`vehicle-${i}`}
            className="absolute w-16 h-8 bg-gray-800 rounded-lg border border-gray-700 animate-fly-across"
            style={{
              top: `${20 + i * 15}%`,
              left: `${-10 + i * 25}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 3}s`,
            }}
          >
            {/* Vehicle lights */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full blur-sm animate-pulse shadow-[0_0_10px_red]" />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full blur-sm animate-pulse shadow-[0_0_10px_blue]" style={{ animationDelay: '0.3s' }} />
          </div>
        ))}

        {/* Ground Level - Wet Reflective Surface */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-900/90 via-gray-800/80 to-transparent">
          {/* Reflective puddles with neon reflections */}
          <div className="absolute bottom-8 left-[20%] w-24 h-2 bg-cyan-500/30 blur-md rounded-full" />
          <div className="absolute bottom-12 right-[30%] w-32 h-3 bg-pink-500/30 blur-lg rounded-full" />
          <div className="absolute bottom-6 left-[60%] w-20 h-2 bg-blue-500/30 blur-md rounded-full" />
          
          {/* Ground neon circles */}
          <div className="absolute bottom-16 left-[15%] w-16 h-16 border-2 border-orange-500/50 rounded-full blur-sm animate-pulse" />
          <div className="absolute bottom-20 right-[25%] w-12 h-12 border-2 border-cyan-500/50 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Additional atmospheric neon glows */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* Login Modal with Cyberpunk Theme */}
      <div className="relative z-20 w-full max-w-md mx-auto px-4">
        <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/20">
          {/* Neon title with glow */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              Login
            </h1>
            <p className="text-gray-400 text-sm">
              Sign in to your admin account
            </p>
          </div>


          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-cyan-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Email or Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-800/70 border-b-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-cyan-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-20 bg-gray-800/70 border-b-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                required
                disabled={loading}
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/60 hover:text-cyan-400 focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m13.42 13.42L21 21M12 12l.01.01" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {/* Remember me and Forgot Password */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-sm text-gray-400">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-cyan-400/80 hover:text-cyan-400 transition-colors"
                >
                  Forget Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-3 rounded-lg text-sm font-semibold mt-6 transition-all relative overflow-hidden ${
                isFormValid && !loading
                  ? 'bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-white hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
              }`}
            >
              <span className="relative z-10">
                {loading ? 'Logging in...' : 'Login'}
              </span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}