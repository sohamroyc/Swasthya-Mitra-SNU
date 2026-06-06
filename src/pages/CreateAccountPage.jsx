import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Brain,
  Stethoscope,
  Activity,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
} from 'lucide-react';

/* ── Inline SVG logo (same as LandingPage) ── */
const LogoIcon = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M 128 32 C 128 32 96 64 64 96 L 64 128 L 96 128 L 96 192 L 160 192 L 160 128 L 192 128 L 192 96 C 160 64 128 32 128 32 Z M 48 112 L 16 112 L 16 144 L 48 144 Z M 208 112 L 240 112 L 240 144 L 208 144 Z" />
  </svg>
);

/* ── Password strength indicator ── */
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: 'Too short',   color: '#ef4444' },
    { label: 'Weak',        color: '#f97316' },
    { label: 'Fair',        color: '#eab308' },
    { label: 'Good',        color: '#22c55e' },
    { label: 'Strong',      color: '#1A6FE8' },
  ];
  return { score, ...map[score] };
};

/* ── Feature highlight row on left panel ── */
const Feature = ({ icon: Icon, title, desc, accent }) => (
  <div className="flex items-start gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-white text-sm font-bold mb-0.5">{title}</p>
      <p className="text-white/50 text-xs font-light leading-relaxed">{desc}</p>
    </div>
  </div>
);

/* ── Labeled form input with leading icon ── */
const FormField = ({ id, label, icon: Icon, error, children, hint }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-bold text-[#0A1628] mb-2 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <Icon className="w-4 h-4" />
      </div>
      {children}
    </div>
    {hint && <p className="mt-1.5 text-[11px] text-slate-400 font-medium">{hint}</p>}
    {error && <p className="mt-1.5 text-[11px] text-red-500 font-semibold">{error}</p>}
  </div>
);

const inputClass =
  'w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-[#0A1628] placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#1A6FE8] focus:ring-4 focus:ring-[#1A6FE8]/10 shadow-sm';

const CreateAccountPage = () => {
  const [name,        setName]        = useState('');
  const [email,       setEmail]       = useState('');
  const [phone,       setPhone]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPwd,     setShowPwd]     = useState(false);
  const [agreed,      setAgreed]      = useState(false);
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const strength = getStrength(password);

  const validate = () => {
    const errs = {};
    if (!name.trim())                                  errs.name     = 'Full name is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email    = 'Enter a valid email address.';
    if (!phone.trim())                                 errs.phone    = 'Phone number is required.';
    if (password.length < 8)                           errs.password = 'Password must be at least 8 characters.';
    if (!agreed)                                       errs.agreed   = 'You must agree to the terms.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setError('');
    setLoading(true);
    const result = await signup({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
    setLoading(false);
    if (result.success) {
      navigate('/main-wellness-dashboard');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setError(result?.error || 'Google sign-up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex font-display" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex w-[45%] xl:w-[42%] relative flex-col overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0A1628 0%, #0d1f3c 60%, #0f2d54 100%)' }}
      >
        {/* Decorative glows */}
        <div
          className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(26,111,232,0.16) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-5%] left-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(79,146,248,0.10) 0%, transparent 70%)' }}
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <LogoIcon className="w-7 h-7 text-[#4F92F8]" />
            <span className="text-xl font-bold tracking-tight text-white">Swasthya Mitra</span>
          </div>

          {/* Main copy */}
          <div className="mt-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold tracking-wide">Free · No credit card needed</span>
            </div>

            <h1
              className="text-white font-extrabold leading-[1.06] mb-6"
              style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.75rem)', letterSpacing: '-0.04em' }}
            >
              Start your<br />
              <span className="text-[#4F92F8]">wellness journey.</span>
            </h1>

            <p className="text-white/60 text-sm leading-relaxed max-w-xs font-light">
              Join thousands of Indians who manage their health smarter with AI-powered diagnostics and real-time care.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-5 mb-10">
            <Feature
              icon={HeartPulse}
              title="AI Symptom Checker"
              desc="Clinical-grade triage powered by multimodal language models."
              accent="bg-[#1A6FE8]/20 text-[#4F92F8]"
            />
            <Feature
              icon={Brain}
              title="Skin & X-Ray Analysis"
              desc="Upload photos or scans for instant AI-assisted interpretation."
              accent="bg-purple-500/20 text-purple-400"
            />
            <Feature
              icon={ShieldCheck}
              title="Ayushman Bharat Ready"
              desc="Instant eligibility checks for PM-JAY and state schemes."
              accent="bg-emerald-500/20 text-emerald-400"
            />
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 bg-white/6 border border-white/10 rounded-2xl p-4">
            <div className="flex -space-x-2.5 shrink-0">
              {['Arjun+S', 'Priya+M', 'Ravi+K'].map((n, i) => (
                <img
                  key={i}
                  src={`https://ui-avatars.com/api/?name=${n}&background=1A6FE8&color=fff&size=32`}
                  className="w-8 h-8 rounded-full border-2 border-[#0A1628]"
                  alt={n}
                />
              ))}
            </div>
            <div>
              <p className="text-white text-xs font-bold">10,000+ people joined</p>
              <p className="text-white/40 text-[11px] font-light">this month alone</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col bg-[#F8FAFF] overflow-y-auto">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-6 h-6 text-[#1A6FE8]" />
            <span className="font-bold text-[#0A1628] text-lg tracking-tight">Swasthya Mitra</span>
          </div>
          <Link to="/login" className="text-[#1A6FE8] text-sm font-semibold">
            Sign in
          </Link>
        </div>

        {/* Form wrapper */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg">

            {/* Heading */}
            <div className="mb-8">
              <h2
                className="font-extrabold text-[#0A1628] mb-2"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', letterSpacing: '-0.03em' }}
              >
                Create your account
              </h2>
              <p className="text-[#4A5568] text-sm font-light">
                Get started in seconds. Already have an account?{' '}
                <Link to="/login" className="text-[#1A6FE8] font-semibold hover:text-[#1558C0] transition-colors">
                  Sign in
                </Link>
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
              <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">or with email</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Global error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3.5">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Name + Phone row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField id="signup-name" label="Full Name" icon={User} error={fieldErrors.name}>
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Arjun Sharma"
                    className={inputClass}
                  />
                </FormField>

                <FormField id="signup-phone" label="Phone" icon={Phone} error={fieldErrors.phone}>
                  <input
                    id="signup-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </FormField>
              </div>

              {/* Email */}
              <FormField id="signup-email" label="Email Address" icon={Mail} error={fieldErrors.email}>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="arjun@example.com"
                  className={inputClass}
                />
              </FormField>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="block text-xs font-bold text-[#0A1628] mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-password"
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className={`${inputClass} pr-12 tracking-widest`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength bar */}
                {password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: i <= strength.score ? strength.color : '#e2e8f0'
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] font-semibold" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </div>
                )}
                {fieldErrors.password && (
                  <p className="mt-1.5 text-[11px] text-red-500 font-semibold">{fieldErrors.password}</p>
                )}
              </div>

              {/* Terms checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <div
                    onClick={() => setAgreed(v => !v)}
                    className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${agreed ? 'bg-[#1A6FE8] border-[#1A6FE8]' : 'bg-white border-slate-300'}`}
                  >
                    {agreed && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-[#4A5568] font-medium leading-snug">
                    I agree to the{' '}
                    <a href="#" className="text-[#1A6FE8] font-semibold hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#1A6FE8] font-semibold hover:underline">Privacy Policy</a>
                  </span>
                </label>
                {fieldErrors.agreed && (
                  <p className="mt-1.5 ml-8 text-[11px] text-red-500 font-semibold">{fieldErrors.agreed}</p>
                )}
              </div>

              {/* Submit */}
              <button
                id="signup-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#1A6FE8] hover:bg-[#1558C0] text-white font-semibold rounded-2xl py-3.5 text-sm transition-all duration-200 shadow-lg shadow-[#1A6FE8]/25 hover:shadow-[#1A6FE8]/40 active:scale-[0.98] disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Trust badges */}
            <div className="mt-8 pt-7 border-t border-slate-200 flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
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

export default CreateAccountPage;
