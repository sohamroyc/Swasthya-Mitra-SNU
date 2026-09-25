import React, { useState } from 'react';
import { X, Check, ArrowRight, UserPlus, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const PRESET_ACCOUNTS = [
  {
    name: 'Soham Roy',
    email: 'sohamroyc@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Soham+Roy&background=0f6df0&color=fff',
  },
  {
    name: 'Dr. Arjun Sharma',
    email: 'arjun.sharma@health.in',
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Sharma&background=10b981&color=fff',
  },
];

const GoogleSignInModal = ({ isOpen, onClose }) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [useCustom, setUseCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectAccount = async (account) => {
    setLoading(true);
    try {
      const result = await loginWithGoogle(account);
      if (result?.success) {
        onClose();
        navigate('/main-wellness-dashboard');
      }
    } catch (err) {
      console.error('Google sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    const name = customName.trim() || customEmail.split('@')[0];
    const account = {
      name,
      email: customEmail.trim().toLowerCase(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f6df0&color=fff`,
    };

    await handleSelectAccount(account);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in font-display">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 shadow-xs">
            <GoogleIcon />
          </div>
          <h3 className="text-xl font-black tracking-tight">Sign in with Google</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Choose an account to continue to <strong className="text-[#0057B8] dark:text-[#00D4FF]">Swasthya Mitra</strong>
          </p>
        </div>

        {/* Preset Google Accounts */}
        {!useCustom ? (
          <div className="space-y-2.5 my-4">
            {PRESET_ACCOUNTS.map((acc, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSelectAccount(acc)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#1A6FE8] hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#1A6FE8]">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {acc.email}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1A6FE8] shrink-0" />
              </button>
            ))}

            {/* Custom Google Account Option */}
            <button
              onClick={() => setUseCustom(true)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#1A6FE8] text-slate-600 dark:text-slate-300 hover:text-[#1A6FE8] transition-all text-xs font-bold"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
              <span>Use another Google account</span>
            </button>
          </div>
        ) : (
          /* Custom Google Account Form */
          <form onSubmit={handleCustomSubmit} className="space-y-4 my-4 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Google Display Name
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#1A6FE8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Google Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="you@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#1A6FE8]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUseCustom(false)}
                className="w-1/3 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-full bg-[#1A6FE8] hover:bg-[#1558C0] text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                {loading ? 'Signing In...' : 'Continue with this Account'}
              </button>
            </div>
          </form>
        )}

        {/* Security / Privacy Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure 256-bit OAuth</span>
          </span>
          <span>Google Identity</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleSignInModal;
