import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

const LogoIcon = ({ className = 'w-7 h-7' }) => (
  <svg
    className={className}
    viewBox="0 0 256 256"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M 128 32 C 128 32 96 64 64 96 L 64 128 L 96 128 L 96 192 L 160 192 L 160 128 L 192 128 L 192 96 C 160 64 128 32 128 32 Z M 48 112 L 16 112 L 16 144 L 48 144 Z M 208 112 L 240 112 L 240 144 L 208 144 Z" />
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    navigate(user ? '/main-wellness-dashboard' : '/create-account');
  };

  const handleOpenApp = () => {
    navigate(user ? '/main-wellness-dashboard' : '/login');
  };

  // Hero Marquee Modules
  const heroModules = [
    { text: 'AI Symptom Checker', style: { fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: '-0.02em', fontSize: '15px' } },
    { text: 'X-Ray Analyser', style: { fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: '0.06em', fontSize: '13px', textTransform: 'uppercase' } },
    { text: 'AI Dermatologist', style: { fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: '0.01em', fontSize: '15px', fontStyle: 'italic' } },
    { text: 'Medication Manager', style: { fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: '0.10em', fontSize: '13px', textTransform: 'uppercase' } },
    { text: 'Govt. Schemes Finder', style: { fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: '-0.01em', fontSize: '16px' } },
    { text: 'Emergency Locator', style: { fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: '0.04em', fontSize: '14px' } },
    { text: 'Wellness Dashboard', style: { fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: '-0.03em', fontSize: '13px' } },
  ];

  // Backers Marquee Partners
  const partners = [
    { text: 'IndiaAI Mission', style: { fontFamily: "'Times New Roman', Times, serif", fontWeight: 400, letterSpacing: '0.02em', fontSize: '14px' } },
    { text: 'Ayushman Bharat', style: { fontFamily: "'Arial Black', Gadget, sans-serif", fontWeight: 900, letterSpacing: '0.06em', fontSize: '16px' } },
    { text: 'e-Sanjeevani', style: { fontFamily: 'Impact, Charcoal, sans-serif', fontWeight: 700, letterSpacing: '0.05em', fontSize: '18px' } },
    { text: 'ABDM', style: { fontFamily: 'Georgia, serif', fontWeight: 600, letterSpacing: '-0.02em', fontSize: '17px' } },
    { text: 'Jan Aushadhi', style: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 700, letterSpacing: '-0.01em', fontSize: '15px' } },
    { text: 'NHA', style: { fontFamily: 'Verdana, Geneva, sans-serif', fontWeight: 700, letterSpacing: '0.06em', fontSize: '14px', textTransform: 'uppercase' } },
    { text: 'PM-JAY', style: { fontFamily: "'Courier New', Courier, monospace", fontWeight: 700, letterSpacing: '0.16em', fontSize: '14px' } },
    { text: 'Qure.ai', style: { fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", fontWeight: 500, letterSpacing: '0.03em', fontSize: '15px' } },
  ];

  return (
    <div className="flex flex-col bg-[#F8FAFF] min-h-screen">
      {/* Dynamic Marquee CSS keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes backers-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 22s linear infinite;
        }
        .backers-track {
          display: flex;
          width: max-content;
          animation: backers-marquee 30s linear infinite;
        }
      `}} />

      {/* ── 1. Navbar + Hero wrapper (h-screen container) ── */}
      <div className="h-screen w-full relative flex flex-col overflow-hidden container mx-auto">
        
        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
          <div className="max-w-[88rem] mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <LogoIcon className="w-7 h-7 text-[#1A6FE8]" />
              <span className="text-2xl font-medium tracking-tight text-[#0A1628]">Swasthya Mitra</span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-8">
              {['Platform', 'Modules', 'Eligibility', 'Emergency', 'About'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-base text-[#4A5568] hover:text-[#1A6FE8] font-medium transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Open App */}
            <button
              onClick={handleOpenApp}
              className="bg-[#1A6FE8] text-white text-base font-medium px-7 py-2.5 rounded-full hover:bg-[#1558C0] transition-colors duration-200 shadow-md shadow-blue-500/10 active:scale-95 transform"
            >
              Open App
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 px-6 pt-20 pb-6 flex items-end">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 96px)' }}>
            
            {/* Background Medical Video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="object-cover absolute inset-0 w-full h-full z-0"
              poster="https://images.pexels.com/photos/4056816/pexels-photo-4056816.jpeg?auto=compress&cs=tinysrgb&w=1600"
              src="https://assets.mixkit.co/videos/preview/mixkit-doctor-explaining-something-to-a-patient-41872-large.mp4"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#EBF2FF]/60 to-[#DBEAFE]/40 z-10" />

            {/* Content Over Overlay */}
            <div className="relative z-20 flex flex-col items-start justify-start h-full p-8 md:p-12 pt-36 max-w-[88rem] mx-auto w-full">
              
              <h1 className="text-[#0A1628] text-5xl md:text-6xl lg:text-7xl font-black max-w-xl mb-6 font-display leading-[1.05]" style={{ letterSpacing: '-0.04em' }}>
                Your Health,<br />
                <span className="bg-gradient-to-r from-[#1A6FE8] via-[#0f6df0] to-[#0A3D8F] bg-clip-text text-transparent">
                  Guided by AI
                </span>
              </h1>
              
              <p className="text-[#0A1628]/70 text-base md:text-lg max-w-md mb-8 leading-relaxed" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
                AI-powered multimodal healthcare guidance — symptom checking, X-ray analysis, dermatology, medication management, government scheme discovery, and emergency access. Built for India.
              </p>

              {/* Get Started Button */}
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-3 bg-[#1A6FE8] text-white text-base md:text-lg font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#1558C0] transition-colors duration-200 group shadow-lg shadow-blue-500/20 active:scale-95 transform"
              >
                Get Started
                <span className="bg-white rounded-full p-2 group-hover:translate-x-1 transition-transform duration-200 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-[#1A6FE8]" />
                </span>
              </button>

              {/* Module Marquee */}
              <div className="mt-auto w-full max-w-lg overflow-hidden py-4 border-t border-blue-500/10">
                <div className="marquee-track">
                  {/* First render */}
                  {heroModules.map((item, idx) => (
                    <span key={`m1-${idx}`} className="mx-7 shrink-0 text-[#0A1628]/60 whitespace-nowrap" style={item.style}>
                      {item.text}
                    </span>
                  ))}
                  {/* Seamless loop render */}
                  {heroModules.map((item, idx) => (
                    <span key={`m2-${idx}`} className="mx-7 shrink-0 text-[#0A1628]/60 whitespace-nowrap" style={item.style}>
                      {item.text}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>

      {/* ── 2. Info Section ("Meet ArogyaSetu.") ── */}
      <section id="platform" className="bg-[#F8FAFF] px-6 py-24">
        <div className="max-w-[88rem] mx-auto">
          
          {/* Row 1: 2-col header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
            <div>
              <h2 className="text-[#0A1628] text-4xl md:text-5xl font-medium leading-tight mb-8" style={{ letterSpacing: '-0.03em' }}>
                Meet ArogyaSetu.
              </h2>
              {/* Explore Button */}
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-3 bg-[#1A6FE8] text-white text-base font-medium pl-6 pr-2 py-1.5 rounded-full hover:bg-[#1558C0] transition-colors duration-200 group shadow-md"
              >
                Explore Platform
                <span className="bg-white rounded-full p-1.5 group-hover:translate-x-1 transition-transform duration-200 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-[#1A6FE8]" />
                </span>
              </button>
            </div>
            <div>
              <p className="text-[#0A1628]/70 text-2xl md:text-3xl leading-relaxed font-light">
                ArogyaSetu is a unified AI healthcare guidance platform that brings symptom checking, medical imaging, dermatology, medication tracking, government scheme discovery, and emergency clinic location together — built specifically for Indian users across all socioeconomic backgrounds.
              </p>
            </div>
          </div>

          {/* Row 2: 4-col card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1 (spans 2 cols on lg) */}
            <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-[#1A6FE8] to-[#0A3D8F] p-7 min-h-80 flex flex-col justify-between shadow-lg shadow-blue-500/10 hover:scale-[1.01] transition-transform duration-300">
              <h3 className="text-white text-2xl font-medium leading-snug" style={{ letterSpacing: '-0.02em' }}>
                AI that understands<br />your symptoms
              </h3>
              <p className="text-white/70 text-base max-w-xs leading-relaxed font-light">
                Conversational AI gathers your full medical history and context — not just surface-level questions — before guiding you.
              </p>
            </div>

            {/* Card 2: Solid #0A1628 */}
            <div className="rounded-2xl bg-[#0A1628] p-7 min-h-80 flex flex-col justify-between shadow-lg hover:scale-[1.01] transition-transform duration-300">
              <h3 className="text-white text-2xl font-medium leading-snug">
                Built for<br />Indian skin.
              </h3>
              <p className="text-white/60 text-base leading-relaxed font-light">
                Our dermatology module is trained and tested for Fitzpatrick IV–VI skin tones — accuracy for South Asian users, not an afterthought.
              </p>
            </div>

            {/* Card 3: Solid #1A6FE8 */}
            <div className="rounded-2xl bg-[#1A6FE8] p-7 min-h-80 flex flex-col justify-between shadow-lg hover:scale-[1.01] transition-transform duration-300">
              <h3 className="text-white text-2xl font-medium leading-snug">
                Your schemes,<br />discovered.
              </h3>
              <p className="text-white/70 text-base leading-relaxed font-light">
                No more missing out on Ayushman Bharat PM-JAY or state health cards. ArogyaSetu finds the schemes you're actually eligible for.
              </p>
            </div>

            {/* Card 4: bg-white border border-[#DBEAFE] */}
            <div className="rounded-2xl bg-white border border-[#DBEAFE] p-7 min-h-80 flex flex-col justify-between shadow-sm hover:scale-[1.01] transition-transform duration-300">
              <h3 className="text-[#0A1628] text-2xl font-medium leading-snug">
                Last mile<br />care access.
              </h3>
              <p className="text-[#4A5568] text-base leading-relaxed font-light">
                From diagnosis to the nearest clinic or SOS emergency — ArogyaSetu connects advice to actual care.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. Trusted By Section ── */}
      <section className="bg-[#F8FAFF] px-6 py-16 border-t border-slate-100">
        <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          
          {/* Left Col (1/4) */}
          <div className="text-[#0A1628]/70 text-base leading-relaxed font-medium">
            Aligned with India's<br />national health initiatives.
          </div>

          {/* Right Col (3/4) */}
          <div className="md:col-span-3 overflow-hidden py-2">
            <div className="backers-track">
              {/* First render */}
              {partners.map((partner, idx) => (
                <span key={`p1-${idx}`} className="mx-10 shrink-0 text-[#0A1628]/50 whitespace-nowrap flex items-center justify-center" style={partner.style}>
                  {partner.text}
                </span>
              ))}
              {/* Seamless loop render */}
              {partners.map((partner, idx) => (
                <span key={`p2-${idx}`} className="mx-10 shrink-0 text-[#0A1628]/50 whitespace-nowrap flex items-center justify-center" style={partner.style}>
                  {partner.text}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. Use Cases Section ── */}
      <section id="modules" className="bg-[#F8FAFF] px-6 py-24 border-t border-slate-100">
        <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left column */}
          <div className="md:pr-12 md:pt-2">
            <span className="text-[#1A6FE8] text-sm font-medium mb-2 block uppercase tracking-wider">
              ArogyaSetu in Practice
            </span>
            <h2 className="text-5xl md:text-6xl font-medium leading-none mb-6 text-[#0A1628]" style={{ letterSpacing: '-0.04em' }}>
              Use cases
            </h2>
            <p className="text-[#0A1628]/60 text-base md:text-lg leading-relaxed max-w-sm font-light">
              ArogyaSetu powers healthcare access for individuals in rural and semi-urban India, ASHA workers, Jan Aushadhi pharmacy networks, telemedicine operators, and anyone navigating India's public health system.
            </p>
          </div>

          {/* Right column */}
          <div className="relative rounded-3xl overflow-hidden min-h-[720px] bg-gradient-to-br from-[#1A6FE8] to-[#0A3D8F] shadow-2xl flex flex-col justify-end">
            {/* Background Medical Video Backdrop */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="object-cover absolute inset-0 w-full h-full opacity-60 z-0"
              poster="https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=1600"
              src="https://assets.mixkit.co/videos/preview/mixkit-medical-consultation-with-a-tablet-41874-large.mp4"
            />
            
            {/* Dark vignette overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent z-10" />

            {/* Overlay Content */}
            <div className="relative z-20 p-10 md:p-12">
              <h3 className="text-4xl md:text-5xl font-medium leading-tight mb-5 text-white" style={{ letterSpacing: '-0.03em' }}>
                Rural Healthcare
              </h3>
              <p className="text-white/70 text-base max-w-md mb-8 leading-relaxed font-light">
                Swasthya Mitra gives someone in a small town or village what currently doesn't exist — a dependable AI-backed first point of contact that triages smartly, surfaces government entitlements, and points them to the nearest clinic.
              </p>
              
              {/* Explore Link with circle */}
              <div className="flex items-center gap-4 cursor-pointer group" onClick={handleStart}>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/40 group-hover:scale-105 transition-all duration-200">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-medium text-base">Explore modules</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-100 py-12 px-6">
        <div className="max-w-[88rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-6 h-6 text-[#1A6FE8]" />
            <span className="font-semibold text-slate-800 text-lg">Swasthya Mitra</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 text-sm">ArogyaSetu AI</span>
          </div>
          <p className="text-slate-400 text-sm font-light">
            © {new Date().getFullYear()} Swasthya Mitra. Crafted for healthcare accessibility.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
