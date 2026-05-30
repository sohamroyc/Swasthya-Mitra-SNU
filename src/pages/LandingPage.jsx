import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const features = [
    {
      path: '/main-wellness-dashboard',
      title: 'Wellness Dashboard',
      description: 'Track vitals, activity, and wellness goals with real-time AI insights.',
      icon: 'dashboard',
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      path: '/ai-symptom-checker-interface',
      title: 'Symptom Checker',
      description: 'Describe symptoms and receive instant AI-powered health guidance.',
      icon: 'stethoscope',
      gradient: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-50',
      text: 'text-rose-600',
    },
    {
      path: '/ai-x-ray-analysis-tool',
      title: 'X-Ray Analysis',
      description: 'Upload medical imaging for rapid AI-assisted diagnostic review.',
      icon: 'radiology',
      gradient: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
    },
    {
      path: '/medication-manager-calendar',
      title: 'Medication Tracker',
      description: 'Never miss a dose with smart scheduling and reminders.',
      icon: 'medication',
      gradient: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      path: '/patient-profile-records',
      title: 'Medical Records',
      description: 'Securely store and access your complete health history anytime.',
      icon: 'folder_shared',
      gradient: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
    },
    {
      path: '/health-reports-analytics',
      title: 'Health Analytics',
      description: 'Visualize trends and patterns in your health data over time.',
      icon: 'monitoring',
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
    {
      path: '/emergency-clinic-locator',
      title: 'Emergency Finder',
      description: 'Locate the nearest clinics and hospitals in seconds.',
      icon: 'emergency',
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-50',
      text: 'text-red-600',
    },
    {
      path: '/first-aid-knowledge-base',
      title: 'First Aid Guide',
      description: 'Step-by-step instructions for common emergencies and injuries.',
      icon: 'local_hospital',
      gradient: 'from-teal-500 to-cyan-600',
      bg: 'bg-teal-50',
      text: 'text-teal-600',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '99.2%', label: 'Accuracy Rate' },
    { value: '24/7', label: 'AI Availability' },
    { value: '500+', label: 'Conditions Covered' },
  ];

  return (
    <div className="min-h-screen bg-white font-display">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Arogya</span><span className="text-blue-600">Setu</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Features</a>
            <a href="#stats" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/main-wellness-dashboard')}
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-4 py-2"
                >
                  Dashboard
                </button>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {(user.name || "User").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{user.name || "User"}</span>
                </div>
                <button
                  onClick={async () => { await logout(); }}
                  className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors px-3 py-2"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-4 py-2"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate('/create-account')}
                  className="text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full px-5 py-2.5 transition-colors shadow-sm"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-blue-50 via-blue-50/50 to-transparent rounded-full blur-3xl opacity-70" />
          <div className="absolute top-40 right-0 w-72 h-72 bg-violet-100 rounded-full blur-3xl opacity-40 animate-float" />
          <div className="absolute top-20 left-10 w-56 h-56 bg-rose-100 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide mb-6">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                AI-POWERED HEALTHCARE
              </span>
            </div>

            <h1 className="animate-fade-in-up stagger-1 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
              Your Health,{' '}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="animate-fade-in-up stagger-2 mt-6 text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Meet your AI health companion — symptom analysis, medical records, medication tracking, and emergency guidance — all in one beautifully crafted platform.
            </p>

            <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <button
                onClick={() => navigate('/create-account')}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-8 py-3.5 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              >
                Start for Free
                <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section id="stats" className="border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 tracking-widest uppercase">Everything You Need</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Powerful tools for your well-being
          </h2>
          <p className="mt-4 text-slate-500 max-w-lg mx-auto">
            From AI diagnostics to emergency guidance — explore a full suite of healthcare tools designed around you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              className={`animate-fade-in-up stagger-${index + 1} group cursor-pointer relative rounded-2xl border border-slate-100 bg-white p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`${feature.bg} h-12 w-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <span className={`material-symbols-outlined ${feature.text} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explore
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-6 mb-20">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-16 md:px-16 text-center relative overflow-hidden">
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Ready to take control of your health?
            </h2>
            <p className="mt-4 text-slate-400 max-w-lg mx-auto">
              Join thousands of users who trust Swasthya Mitra for smarter, faster, and more accessible healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => navigate('/create-account')}
                className="group flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-full px-8 py-3.5 transition-all duration-300 shadow-lg"
              >
                Get Started — It's Free
                <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-full px-8 py-3.5 border border-white/10 transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
};

export default LandingPage;
