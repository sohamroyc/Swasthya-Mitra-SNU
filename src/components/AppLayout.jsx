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
  Menu,
  X,
} from 'lucide-react';

const AppLayout = ({ children, activeTab }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState({ name: user?.name || "Loading...", role: "Loading..." });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
              @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
              .animate-slide-in-right {
                animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}} />

            {/* ── HORIZONTAL HEADER ── */}
            <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm select-none">
                
                {/* 1. Left side: Square Logo Box + Premium Brand Typography */}
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    <Link to="/dashboard" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 flex items-center justify-center h-10 w-10 md:h-12 md:w-12 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden shrink-0 shadow-sm">
                        <img src="/logo.png" className="w-full h-full object-contain" alt="Logo" />
                    </Link>
                    <span className="font-extrabold text-lg md:text-xl tracking-tight leading-none select-none flex items-center">
                        <span className="text-[#0057B8] dark:text-white">Swasthya</span>
                        <span className="bg-gradient-to-r from-[#0057B8] to-[#00D4FF] dark:from-white dark:to-[#00D4FF] bg-clip-text text-transparent ml-1">Mitra</span>
                    </span>
                </div>

                {/* 2. Center: Pill navigation container with smooth sliding controls (Desktop only) */}
                <div className="hidden lg:flex flex-1 max-w-4xl mx-4 relative items-center overflow-hidden">
                    
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
                                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1A6FE8]' : 'text-slate-400 dark:text-slate-550'}`} />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Right side: Utilities (Desktop) + SOS (Always) + Hamburger Toggle (Mobile) */}
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    
                    {/* SOS Emergency button - always visible */}
                    <div className="scale-85 md:scale-90">
                        <SOSEmergencyButton />
                    </div>

                    {/* Language selector - Desktop only */}
                    <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors select-none">
                        <Globe className="w-3.5 h-3.5 text-[#1A6FE8]" />
                        <span>EN</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>

                    {/* Theme Toggle - Desktop only */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
                        title="Toggle theme"
                    >
                        {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-[#1A6FE8]" />}
                    </button>

                    {/* Notification bell - Desktop only */}
                    <button
                        className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm relative hover:scale-105 active:scale-95 transition-all"
                        title="Notifications"
                    >
                        <Bell className="w-4 h-4 text-slate-500" />
                        <span className="absolute top-2.5 right-2.5 size-2 bg-[#1A6FE8] rounded-full border border-white dark:border-slate-800"></span>
                    </button>

                    {/* Avatar - Desktop only */}
                    <Link
                        to="/patient-profile-records"
                        className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-pink-400 dark:border-pink-500 text-slate-800 dark:text-white shadow-sm hover:scale-105 transition-all shrink-0 overflow-hidden"
                    >
                        {user?.photoUrl ? (
                            <img src={user.photoUrl} className="h-full w-full object-cover" alt="Profile" />
                        ) : (
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                {user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 1) : 'U'}
                            </span>
                        )}
                    </Link>

                    {/* Logout button - Desktop only */}
                    <button
                        onClick={async () => {
                            await logout();
                            navigate('/');
                        }}
                        className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors select-none"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                    </button>

                    {/* Mobile Hamburger Menu Toggle */}
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
                        aria-label="Open mobile menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* ── MOBILE SLIDING DRAWER DIALOG ── */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300" 
                        onClick={() => setIsDrawerOpen(false)}
                    />
                    
                    {/* Sliding Panel */}
                    <div className="fixed inset-y-0 right-0 w-72 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between animate-slide-in-right z-50">
                        <div className="flex flex-col gap-6">
                            
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0 border border-slate-205 dark:border-slate-705 p-0.5 bg-white dark:bg-slate-800">
                                        <img src="/logo.png" className="w-full h-full object-contain" alt="Logo" />
                                    </div>
                                    <span className="font-extrabold text-base tracking-tight">
                                        <span className="text-[#0057B8] dark:text-white">Swasthya</span>
                                        <span className="text-[#00D4FF] ml-0.5">Mitra</span>
                                    </span>
                                </div>
                                <button 
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="p-1 rounded-full text-slate-400 hover:text-slate-905 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* User Profile Mini Card */}
                            <Link
                                to="/patient-profile-records"
                                onClick={() => setIsDrawerOpen(false)}
                                className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-pink-400 dark:border-pink-500 text-slate-800 dark:text-white shadow-sm overflow-hidden shrink-0">
                                    {user?.photoUrl ? (
                                        <img src={user.photoUrl} className="h-full w-full object-cover" alt="Profile" />
                                    ) : (
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                            {user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 1) : 'U'}
                                        </span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate leading-tight">{profile.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{profile.role}</p>
                                </div>
                            </Link>

                            {/* Drawer Navigation Links */}
                            <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-320px)] pr-1 no-scrollbar">
                                {navLinks.map((link) => {
                                    const isActive = activeTab === link.id || location.pathname === link.path;
                                    const Icon = link.iconComponent;
                                    return (
                                        <Link
                                            key={link.id}
                                            to={link.path}
                                            onClick={() => setIsDrawerOpen(false)}
                                            className={`flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-150 ${
                                                isActive
                                                    ? 'bg-blue-50/70 dark:bg-blue-950/30 text-[#1A6FE8] dark:text-[#4F92F8] border-l-4 border-[#1A6FE8]'
                                                    : 'text-slate-655 dark:text-slate-405 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-[#1A6FE8]' : 'text-slate-400 dark:text-slate-500'}`} />
                                            <span>{link.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Drawer Bottom Actions */}
                        <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col gap-4">
                            
                            {/* Theme switcher + Language Row */}
                            <div className="flex items-center justify-between px-2">
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                >
                                    {darkMode ? (
                                        <>
                                            <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                                            <span>Light Theme</span>
                                        </>
                                    ) : (
                                        <>
                                            <Moon className="w-4 h-4 text-[#1A6FE8]" />
                                            <span>Dark Theme</span>
                                        </>
                                    )}
                                </button>

                                {/* Mini language selector */}
                                <div className="flex gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-700 text-[#1A6FE8] shadow-sm select-none cursor-pointer">EN</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 dark:text-slate-500 select-none cursor-pointer hover:text-slate-600 dark:hover:text-slate-350">HI</span>
                                </div>
                            </div>

                            {/* Sign out */}
                            <button
                                onClick={async () => {
                                    setIsDrawerOpen(false);
                                    await logout();
                                    navigate('/');
                                }}
                                className="w-full py-2.5 bg-slate-50 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/20 text-slate-755 dark:text-slate-355 hover:text-red-655 dark:hover:text-red-405 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MAIN SCROLLABLE CONTAINER ── */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default AppLayout;
