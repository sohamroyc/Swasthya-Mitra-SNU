import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientProfileService } from '../services/api';
import Footer from './Footer';
import SOSEmergencyButton from './SOSEmergencyButton';
import {
  LayoutDashboard,
  Stethoscope,
  HeartPulse,
  Pill,
  FolderHeart,
  Hospital,
  Brain,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Globe,
  Moon,
  Sun,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

const AppLayout = ({ children, activeTab }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState({ name: user?.name || "Loading...", role: "Loading..." });

    // Sliding navigation menu controls
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    // Live theme switcher state
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await patientProfileService.getProfile();
                setProfile({ name: user?.name || data.name, role: 'Pro Member' });
            } catch (err) {
                console.error("Failed to load profile card details:", err);
            }
        };
        fetchProfile();
    }, [user]);

    const navLinks = [
        { id: 'dashboard', path: '/dashboard', label: 'Dashboard', iconComponent: LayoutDashboard },
        { id: 'consultations', path: '/ai-symptom-checker-interface', label: 'Consultations', iconComponent: Stethoscope },
        { id: 'my-health', path: '/my-health', label: 'My Health', iconComponent: HeartPulse },
        { id: 'medications', path: '/medication-manager-calendar', label: 'Medications', iconComponent: Pill },
        { id: 'records', path: '/patient-profile-records', label: 'Health Records', iconComponent: FolderHeart },
        { id: 'clinics', path: '/emergency-clinic-locator', label: 'Nearby Clinics', iconComponent: Hospital },
        { id: 'xray', path: '/ai-x-ray-analysis-tool', label: 'AI X-Ray', iconComponent: Brain },
        { id: 'doctor', path: '/first-aid-knowledge-base', label: 'AI Doctor Chat', iconComponent: MessageSquare },
        { id: 'dermatologist', path: '/ai-dermatologist', label: 'AI Dermatologist', iconComponent: Sparkles },
        { id: 'schemes', path: '/government-health-schemes', label: 'Health Schemes', iconComponent: ShieldCheck },
    ];

    // Recalculate arrow visibility
    const updateArrows = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 2);
            setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 2);
        }
    };

    useEffect(() => {
        updateArrows();
        // A minor timeout allows DOM to compute dimensions properly on load/tab switch
        const timer = setTimeout(updateArrows, 150);
        
        window.addEventListener('resize', updateArrows);
        return () => {
            window.removeEventListener('resize', updateArrows);
            clearTimeout(timer);
        };
    }, [location.pathname]);

    const handleScrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
        }
    };

    const handleScrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-display flex flex-col">
            <style dangerouslySetInnerHTML={{ __html: `
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}} />

            {/* ── HORIZONTAL HEADER ── */}
            <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-3 flex items-center justify-between shadow-sm select-none">
                
                {/* 1. Left side: Square Logo Box */}
                    <Link to="/dashboard" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 shadow-sm flex items-center justify-center size-12 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden">
                        <img src="/logo.png" className="w-full h-full object-contain" alt="Logo" />
                    </Link>

                {/* 2. Center: Pill navigation container with smooth sliding controls */}
                <div className="flex-1 max-w-4xl mx-4 relative flex items-center overflow-hidden">
                    
                    {/* Left Slide Button */}
                    {showLeftArrow && (
                        <button
                            onClick={handleScrollLeft}
                            className="absolute left-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white shadow-md active:scale-90 transition-all"
                            title="Scroll Left"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    )}

                    {/* Right Slide Button */}
                    {showRightArrow && (
                        <button
                            onClick={handleScrollRight}
                            className="absolute right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white shadow-md active:scale-90 transition-all"
                            title="Scroll Right"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}

                    {/* Scrollable nav bar row */}
                    <div
                        ref={scrollRef}
                        onScroll={updateArrows}
                        className="w-full bg-slate-100/70 dark:bg-slate-800/80 rounded-full border border-slate-200/40 dark:border-slate-700/50 p-1 flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth"
                    >
                        {navLinks.map((link) => {
                            const isActive = activeTab === link.id || location.pathname === link.path;
                            const Icon = link.iconComponent;
                            return (
                                <Link
                                    key={link.id}
                                    to={link.path}
                                    className={`flex items-center gap-2 py-1.5 px-4 rounded-full text-xs font-semibold transition-all duration-200 ${
                                        isActive
                                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200/40 dark:border-slate-600'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-700/40'
                                    }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1A6FE8]' : 'text-slate-400 dark:text-slate-500'}`} />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Right side: Language, theme, notifications, avatar, logout, SOS */}
                <div className="flex items-center gap-3 shrink-0">
                    
                    {/* SOS Emergency button */}
                    <div className="scale-90">
                        <SOSEmergencyButton />
                    </div>

                    {/* Language selector */}
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors select-none">
                        <Globe className="w-3.5 h-3.5 text-[#1A6FE8]" />
                        <span>EN</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
                        title="Toggle theme"
                    >
                        {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-[#1A6FE8]" />}
                    </button>

                    {/* Notification bell */}
                    <button
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm relative hover:scale-105 active:scale-95 transition-all"
                        title="Notifications"
                    >
                        <Bell className="w-4 h-4 text-slate-500" />
                        <span className="absolute top-2.5 right-2.5 size-2 bg-[#1A6FE8] rounded-full border border-white dark:border-slate-800"></span>
                    </button>

                    {/* Avatar with Pink Border */}
                    <Link
                        to="/patient-profile-records"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-pink-400 dark:border-pink-500 text-slate-800 dark:text-white shadow-sm hover:scale-105 transition-all shrink-0 overflow-hidden"
                    >
                        {user?.photoUrl ? (
                            <img src={user.photoUrl} className="h-full w-full object-cover" alt="Profile" />
                        ) : (
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                {user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 1) : 'U'}
                            </span>
                        )}
                    </Link>

                    {/* Logout button */}
                    <button
                        onClick={async () => {
                            await logout();
                            navigate('/');
                        }}
                        className="hidden md:flex items-center gap-1.5 px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors select-none"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            {/* ── MAIN SCROLLABLE CONTAINER ── */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default AppLayout;
