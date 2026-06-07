import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Brain,
  AlertCircle,
  Loader2,
} from 'lucide-react';

/* ── Inline SVG logo (same as LandingPage) ── */
const LogoIcon = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M 128 32 C 128 32 96 64 64 96 L 64 128 L 96 128 L 96 192 L 160 192 L 160 128 L 192 128 L 192 96 C 160 64 128 32 128 32 Z M 48 112 L 16 112 L 16 144 L 48 144 Z M 208 112 L 240 112 L 240 144 L 208 144 Z" />
  </svg>
);

/* ── Animated stat pill shown on the left panel ── */
const StatPill = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-3 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-white text-sm font-bold leading-none">{value}</p>
      <p className="text-white/50 text-[11px] font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

const LoginPage = () => {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [remember, setRemember]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/main-wellness-dashboard');
    } else {
      setError(result.error || 'Sign in failed. Please try again.');
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);
    if (result?.success) {
      navigate('/main-wellness-dashboard');
    } else {
      setError(result?.error || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex font-display" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex w-[45%] xl:w-[42%] relative flex-col overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0A1628 0%, #0d1f3c 60%, #0f2d54 100%)' }}
      >
        {/* Decorative radial glow */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(26,111,232,0.18) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-5%] right-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(79,146,248,0.12) 0%, transparent 70%)' }}
        />

        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="w-12 h-12 object-contain bg-white rounded-xl p-1 shadow-md" alt="Logo" />
            <span className="text-2xl font-extrabold tracking-tight leading-none select-none flex items-center">
              <span className="text-white">Swasthya</span>
              <span className="bg-gradient-to-r from-white to-[#00D4FF] bg-clip-text text-transparent ml-1.5">Mitra</span>
            </span>
          </div>

          {/* Main copy */}
          <div className="mt-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-[#1A6FE8]/20 border border-[#1A6FE8]/30 rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F92F8] animate-pulse" />
              <span className="text-[#4F92F8] text-xs font-semibold tracking-wide">AI-Powered Health Platform</span>
            </div>

            <h1
              className="text-white font-extrabold leading-[1.06] mb-6"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.04em' }}
            >
              Your health,<br />
              <span className="text-[#4F92F8]">powered by AI.</span>
            </h1>

            <p className="text-white/60 text-sm leading-relaxed max-w-xs font-light">
              Clinical-grade diagnostics, medication tracking, and real-time emergency care — all in one place.
            </p>
          </div>

          {/* Stat pills */}
          <div className="grid grid-cols-1 gap-3 mb-10">
            <StatPill icon={HeartPulse}   value="10,000+"       label="Active patients"          color="bg-[#1A6FE8]/30 text-[#4F92F8]" />
            <StatPill icon={Brain}        value="95.4% Accuracy" label="Symptom analysis accuracy" color="bg-emerald-500/20 text-emerald-400" />
            <StatPill icon={ShieldCheck}  value="ABDM Compliant" label="Government verified"       color="bg-purple-500/20 text-purple-400" />
          </div>

          {/* Quote */}
          <div className="border-l-2 border-[#1A6FE8]/50 pl-5">
            <p className="text-white/70 text-sm italic leading-relaxed font-light">
              "The greatest wealth is health."
            </p>
            <p className="text-white/30 text-xs font-bold mt-1 tracking-widest uppercase">— Virgil</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col bg-[#F8FAFF] overflow-y-auto">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" className="w-10 h-10 object-contain bg-slate-50 rounded-xl p-1 border border-slate-200" alt="Logo" />
            <span className="font-extrabold text-xl tracking-tight leading-none select-none flex items-center">
              <span className="text-[#0057B8]">Swasthya</span>
              <span className="bg-gradient-to-r from-[#0057B8] to-[#00D4FF] bg-clip-text text-transparent ml-1">Mitra</span>
            </span>
          </div>
          <Link to="/create-account" className="text-[#1A6FE8] text-sm font-semibold">
            Create account
          </Link>
        </div>

        {/* Form wrapper */}
        <div className="flex-1 flex items-center justify-center px-6 py-14">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-8">
              <h2
                className="font-extrabold text-[#0A1628] mb-2"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', letterSpacing: '-0.03em' }}
              >
                Welcome back
              </h2>
              <p className="text-[#4A5568] text-sm font-light">
                Sign in to your account to continue your wellness journey.
              </p>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-[#0A1628] shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 active:scale-[0.98] mb-4 disabled:opacity-60"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative flex items-center my-6">
              <div className="flex-1 border-t border-slate-200" />
              <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">or continue with email</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3.5">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#0A1628] mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-[#0A1628] placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#1A6FE8] focus:ring-4 focus:ring-[#1A6FE8]/10 shadow-sm"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#0A1628] uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-[#1A6FE8] hover:text-[#1558C0] transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 pr-12 text-sm text-[#0A1628] placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#1A6FE8] focus:ring-4 focus:ring-[#1A6FE8]/10 shadow-sm tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setRemember(v => !v)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 shrink-0 ${remember ? 'bg-[#1A6FE8] border-[#1A6FE8]' : 'bg-white border-slate-300'}`}
                >
                  {remember && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-[#4A5568] font-medium">Remember me for 30 days</span>
              </label>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#1A6FE8] hover:bg-[#1558C0] text-white font-semibold rounded-2xl py-3.5 text-sm transition-all duration-200 shadow-lg shadow-[#1A6FE8]/25 hover:shadow-[#1A6FE8]/40 active:scale-[0.98] disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to sign up */}
            <p className="text-center text-sm text-[#4A5568] font-medium mt-8">
              Don't have an account?{' '}
              <Link to="/create-account" className="text-[#1A6FE8] font-semibold hover:text-[#1558C0] transition-colors">
                Create one free
              </Link>
            </p>

            {/* Trust badges */}
            <div className="mt-10 pt-8 border-t border-slate-200 flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold">ABDM Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Activity className="w-4 h-4 text-[#1A6FE8]" />
                <span className="text-xs font-semibold">256-bit Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Stethoscope className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-semibold">Medical Grade AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-8 text-center">
          <p className="text-xs text-slate-400">
            © 2026 Swasthya Mitra · <a href="#" className="hover:text-[#1A6FE8] transition-colors">Privacy</a> · <a href="#" className="hover:text-[#1A6FE8] transition-colors">Terms</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
