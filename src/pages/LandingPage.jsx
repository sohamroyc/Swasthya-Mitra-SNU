import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  Stethoscope, 
  Sparkles, 
  FileSpreadsheet, 
  Flame, 
  FolderHeart, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Home, 
  Leaf, 
  Globe, 
  Rss 
} from 'lucide-react';

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

  // Partners Marquee Partners
  const partners = [
    'IndiaAI Mission',
    'Ayushman Bharat',
    'ABDM',
    'NHA India',
    'MeitY',
    'Startup India'
  ];

  return (
    <div className="flex flex-col bg-[#F8FAFF] min-h-screen font-display">
      {/* Dynamic Marquee CSS keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes backers-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .backers-track {
          display: flex;
          width: max-content;
          animation: backers-marquee 25s linear infinite;
        }
      `}} />

      {/* ── 1. Navbar + Hero wrapper (h-screen container) ── */}
      <div className="h-screen w-full relative flex flex-col overflow-hidden container mx-auto px-4 md:px-6">
        
        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-30 px-6 py-6">
          <div className="max-w-[88rem] mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <LogoIcon className="w-7 h-7 text-[#1A6FE8]" />
              <span className="text-2xl font-bold tracking-tight text-[#0A1628]">Swasthya Mitra</span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#platform" className="text-sm text-[#1A6FE8] font-bold border-b-2 border-[#1A6FE8] pb-1 transition-all">Platform</a>
              <a href="#modules" className="text-sm text-[#4A5568] hover:text-[#1A6FE8] font-medium transition-colors">Modules</a>
              <a href="#eligibility" className="text-sm text-[#4A5568] hover:text-[#1A6FE8] font-medium transition-colors">Eligibility</a>
              <a href="#emergency" className="text-sm text-[#4A5568] hover:text-[#1A6FE8] font-medium transition-colors">Emergency</a>
              <a href="#about" className="text-sm text-[#4A5568] hover:text-[#1A6FE8] font-medium transition-colors">About</a>
            </div>

            {/* Open App */}
            <button
              onClick={handleOpenApp}
              className="bg-[#1A6FE8] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#1558C0] transition-all shadow-md shadow-blue-500/10 active:scale-95 transform"
            >
              Open App
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 pt-24 pb-6 flex items-end">
          <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/15" style={{ height: 'calc(100vh - 120px)' }}>
            
            {/* Background Hero Video */}
            <video
              className="object-cover absolute inset-0 w-full h-full"
              autoPlay
              muted
              loop
              playsInline
              poster="/hero_hologram_lungs.png"
            >
              {/* Primary: Pexels medical/healthcare video */}
              <source
                src="https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4"
                type="video/mp4"
              />
              {/* Fallback 1 */}
              <source
                src="https://videos.pexels.com/video-files/4114012/4114012-hd_1920_1080_25fps.mp4"
                type="video/mp4"
              />
              {/* Fallback 2: smaller */}
              <source
                src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4"
                type="video/mp4"
              />
            </video>

            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/50 to-slate-950/20 z-0" />

            {/* Content Over Overlay */}
            <div className="relative z-10 flex flex-col items-start justify-between h-full p-8 md:p-14 max-w-[88rem] mx-auto w-full">
              
              {/* Central Title Area */}
              <div className="max-w-2xl mt-12 md:mt-20">
                <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 font-display" style={{ letterSpacing: '-0.04em' }}>
                  Your Health,<br />
                  <span className="text-[#4F92F8]">
                    Guided by AI.
                  </span>
                </h1>
                
                <p className="text-white/80 text-sm md:text-base lg:text-lg max-w-xl mb-10 leading-relaxed font-light">
                  ArogyaSetu integrates multimodal clinical AI with public health intelligence to provide precision care pathways for every citizen across the subcontinent.
                </p>

                {/* Hero Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={handleStart}
                    className="inline-flex items-center gap-3 bg-[#1A6FE8] text-white text-sm font-semibold pl-6 pr-2 py-2 rounded-full hover:bg-[#1558C0] transition-all group shadow-lg shadow-blue-500/20 active:scale-95 transform"
                  >
                    Get Started
                    <span className="bg-white rounded-full p-1.5 group-hover:translate-x-1 transition-transform flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-[#1A6FE8]" />
                    </span>
                  </button>
                  <button
                    onClick={handleStart}
                    className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold backdrop-blur transition-all active:scale-95 transform"
                  >
                    Clinical Safety
                  </button>
                </div>
              </div>

              {/* Lower Frosted-Glass Pill Tab Bar */}
              <div className="w-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 mt-8 flex flex-wrap items-center justify-between gap-4">
                
                <div className="flex items-center gap-2.5 text-white/90 text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                  <Stethoscope className="w-4.5 h-4.5 text-[#4F92F8]" />
                  <span>AI Symptom Checker</span>
                </div>
                
                <div className="flex items-center gap-2.5 text-white/90 text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                  <Sparkles className="w-4.5 h-4.5 text-[#4F92F8]" />
                  <span>Derm-Scan Pro</span>
                </div>

                <div className="flex items-center gap-2.5 text-white/90 text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                  <FileSpreadsheet className="w-4.5 h-4.5 text-[#4F92F8]" />
                  <span>Scheme Eligibility</span>
                </div>

                <div className="flex items-center gap-2.5 text-white/90 text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                  <Flame className="w-4.5 h-4.5 text-[#4F92F8]" />
                  <span>Emergency Response</span>
                </div>

                <div className="flex items-center gap-2.5 text-white/90 text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                  <FolderHeart className="w-4.5 h-4.5 text-[#4F92F8]" />
                  <span>ABHA Record</span>
                </div>

              </div>

            </div>
          </div>
        </section>

      </div>

      {/* ── 2. Info Section ("Meet ArogyaSetu") ── */}
      <section id="platform" className="bg-[#F8FAFF] px-6 py-24 border-t border-slate-100">
        <div className="max-w-[88rem] mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-[#0A1628] text-4xl font-extrabold mb-4 font-display" style={{ letterSpacing: '-0.02em' }}>
              Meet ArogyaSetu
            </h2>
            <p className="text-[#4A5568] text-base md:text-lg leading-relaxed font-light">
              A unified digital health architecture designed to empower citizens with clinical-grade diagnostics, localized government scheme identification, and instant emergency connectivity.
            </p>
          </div>

          {/* Grid Row 1: 3-column cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Blue background */}
            <div className="rounded-3xl bg-[#1A6FE8] p-8 min-h-80 flex flex-col justify-between shadow-xl shadow-blue-500/10 hover:scale-[1.01] transition-transform duration-300">
              <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold mb-3">
                  Multimodal Diagnostics
                </h3>
                <p className="text-white/80 text-sm leading-relaxed font-light">
                  Conversational AI that understands regional nuances to provide clinical triage and symptom guidance.
                </p>
              </div>
            </div>

            {/* Card 2: Dark Slate */}
            <div className="rounded-3xl bg-[#0D1627] p-8 min-h-80 flex flex-col justify-between shadow-xl hover:scale-[1.01] transition-transform duration-300">
              <div className="size-12 rounded-2xl bg-teal-400/10 flex items-center justify-center text-teal-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold mb-3">
                  Skin Health
                </h3>
                <p className="text-white/70 text-sm leading-relaxed font-light">
                  Localized AI trained on 500k+ diverse Indian skin clinical samples.
                </p>
              </div>
            </div>

            {/* Card 3: White card with border */}
            <div className="rounded-3xl bg-white border border-[#EBF2FF] p-8 min-h-80 flex flex-col justify-between shadow-sm hover:scale-[1.01] transition-transform duration-300">
              <div className="size-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1A6FE8] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[#0A1628] text-2xl font-bold mb-3">
                  Ayushman Bharat
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed font-light">
                  Instant eligibility check for PM-JAY and other state-sponsored schemes.
                </p>
              </div>
            </div>

          </div>

          {/* Grid Row 2: Full-width horizontal wide card */}
          <div className="mt-6 rounded-3xl bg-white border border-[#EBF2FF] p-8 md:p-10 shadow-sm flex flex-col lg:flex-row items-center gap-8 justify-between hover:shadow-md transition-shadow duration-300">
            <div className="flex-1 max-w-2xl">
              <span className="text-[#1A6FE8] text-xs font-bold uppercase tracking-wider mb-2 block">
                EQUITY IN ACCESS
              </span>
              <h3 className="text-[#0A1628] text-2xl md:text-3xl font-extrabold mb-4 font-display">
                Last Mile Care Access
              </h3>
              <p className="text-[#4A5568] text-sm md:text-base font-light leading-relaxed">
                Bridging the rural-urban divide by bringing premium clinical screening tools to the most remote corners of the nation via low-bandwidth interfaces.
              </p>
            </div>
            
            {/* Visual Phone Graphics Asset */}
            <div className="w-full lg:w-96 h-48 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-slate-100">
              <img
                src="/phone_field_health.png"
                alt="Health Charts on Phone"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. Partners Section ── */}
      <section className="bg-[#F8FAFF] px-6 py-16 border-t border-slate-100">
        <div className="max-w-[88rem] mx-auto">
          <h4 className="text-[#0A1628]/40 text-xs font-extrabold uppercase tracking-widest text-center mb-10">
            PARTNERING FOR A HEALTHIER BHARAT
          </h4>
          
          <div className="overflow-hidden py-2">
            <div className="backers-track">
              {/* Render twice for seamless loop */}
              {partners.map((partner, idx) => (
                <span key={`p1-${idx}`} className="mx-16 shrink-0 text-xl font-bold text-[#0A1628]/35 tracking-tight whitespace-nowrap">
                  {partner}
                </span>
              ))}
              {partners.map((partner, idx) => (
                <span key={`p2-${idx}`} className="mx-16 shrink-0 text-xl font-bold text-[#0A1628]/35 tracking-tight whitespace-nowrap">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Use Cases Section (Clinical Journey) ── */}
      <section id="modules" className="bg-[#F8FAFF] px-6 py-24 border-t border-slate-100">
        <div className="max-w-[88rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Outreach details */}
          <div>
            <span className="text-[#1A6FE8] text-xs font-bold uppercase tracking-wider mb-2 block">
              AROGYASETU IN PRACTICE
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A1628] leading-tight mb-12 font-display" style={{ letterSpacing: '-0.03em' }}>
              Transforming the Clinical<br />Journey.
            </h2>

            {/* List items */}
            <div className="space-y-8">
              
              {/* Item 1 */}
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A6FE8] shrink-0 shadow-sm">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1 font-display">Real-time Triage</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-light max-w-md">
                    Instant assessment of symptoms using localized language models, reducing wait times at Primary Health Centers (PHCs).
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A6FE8] shrink-0 shadow-sm">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1 font-display">Rural Outreach</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-light max-w-md">
                    Offline-first capabilities allow ASHAs and front-line health workers to deliver quality screenings in regions with zero connectivity.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1 font-display">Predictive Wellness</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-light max-w-md">
                    Analysis of aggregate health trends to predict and prevent seasonal outbreaks at a district level.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Doctors Testimonial Card */}
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl min-h-[580px] flex flex-col justify-end">
            <img
              src="/two_doctors_clinic.png"
              alt="Two Indian Doctors Reviewing Data"
              className="object-cover absolute inset-0 w-full h-full"
            />
            
            {/* Dark contrast gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-0" />

            {/* Testimonial floating container */}
            <div className="relative z-10 p-8 m-6 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-white/10 text-white">
              <h4 className="text-white text-lg font-bold mb-2.5 font-display">
                Empowering Rural Healthcare
              </h4>
              <p className="text-white/80 text-sm leading-relaxed font-light italic mb-5">
                "Swasthya Mitra has enabled us to reach patients in the most remote areas, providing diagnostic accuracy that was previously only available in major cities."
              </p>
              
              {/* Doctor Details */}
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-xs shrink-0 font-display">
                  Dr
                </div>
                <div>
                  <p className="text-xs font-bold text-white font-display">Dr. Anjali Verma</p>
                  <p className="text-[10px] text-white/50">Public Health Administrator</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. Footer Section ── */}
      <footer className="bg-white border-t border-slate-100 py-16 px-6">
        <div className="max-w-[88rem] mx-auto">
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-12 pb-12 border-b border-slate-100">
            {/* Left */}
            <div>
              <div className="flex items-center gap-2">
                <LogoIcon className="w-6 h-6 text-[#1A6FE8]" />
                <span className="font-bold text-slate-900 text-lg tracking-tight">Swasthya Mitra</span>
              </div>
              <p className="text-[#4A5568] text-sm mt-4 max-w-xs leading-relaxed font-light">
                Leveraging clinical-grade AI to democratize quality healthcare across the nation.
              </p>
              <p className="text-slate-400 text-xs mt-8">
                © 2026 Swasthya Mitra. Precision Healthcare AI.
              </p>
            </div>

            {/* Right Links */}
            <div className="flex flex-col items-start md:items-end gap-6">
              <div className="flex flex-wrap gap-4 text-xs font-medium text-[#4A5568]">
                <a href="#privacy" className="hover:text-[#1A6FE8] transition-colors">Privacy Policy</a>
                <span className="text-slate-200">•</span>
                <a href="#terms" className="hover:text-[#1A6FE8] transition-colors">Terms of Service</a>
                <span className="text-slate-200">•</span>
                <a href="#safety" className="hover:text-[#1A6FE8] transition-colors">Clinical Safety</a>
                <span className="text-slate-200">•</span>
                <a href="#contact" className="hover:text-[#1A6FE8] transition-colors">Contact Us</a>
              </div>

              {/* Icons */}
              <div className="flex items-center gap-4 text-[#4A5568]/60 mt-2">
                <Globe className="w-5 h-5 hover:text-[#1A6FE8] cursor-pointer transition-colors" />
                <Rss className="w-5 h-5 hover:text-[#1A6FE8] cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
