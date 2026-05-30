import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientProfileService } from '../services/api';
import HeaderActions from './HeaderActions';
import Footer from './Footer';

const AppLayout = ({ children, activeTab }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState({ name: user?.name || "Loading...", role: "Loading..." });
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'consultations', path: '/ai-symptom-checker-interface', label: 'Consultations', icon: 'stethoscope' },
        { id: 'my-health', path: '/my-health', label: 'My Health', icon: 'monitoring' },
        { id: 'medications', path: '/medication-manager-calendar', label: 'Medications', icon: 'pill' },
        { id: 'records', path: '/patient-profile-records', label: 'Health Records', icon: 'folder_shared' },
        { id: 'clinics', path: '/emergency-clinic-locator', label: 'Nearby Clinics', icon: 'local_hospital' },
        { id: 'xray', path: '/ai-x-ray-analysis-tool', label: 'AI X-Ray', icon: 'radiology' },
        { id: 'doctor', path: '/first-aid-knowledge-base', label: 'AI Doctor Chat', icon: 'chat' },
        { id: 'dermatologist', path: '/ai-dermatologist', label: 'AI Dermatologist', icon: 'face' },
        { id: 'schemes', path: '/government-health-schemes', label: 'Health Schemes', icon: 'verified_user' },
    ];

    const getLinkClass = (linkId) => {
        const baseClass = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors";
        if (activeTab === linkId || location.pathname === navLinks.find(l => l.id === linkId)?.path) {
            return `${baseClass} bg-primary/10 text-primary`;
        }
        return `${baseClass} text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800`;
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            <div className="flex h-screen overflow-hidden">
                {/* ── SIDEBAR NAVIGATION ── */}
                <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                    <Link to="/dashboard" className="p-5 flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">health_and_safety</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-base leading-tight">Swasthya Mitra</h1>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">AI Wellness Hub</p>
                        </div>
                    </Link>
                    
                    <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
                        {navLinks.map(link => (
                            <Link key={link.id} className={getLinkClass(link.id)} to={link.path}>
                                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3 px-1">
                            <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-black text-white bg-cover bg-center" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDdROacabQcsgkHNRU9h3DjZRhBrqKeRWRfDh7W6ySZ7f1VaSESWTzydRxPYS5AKSG9lFTKidvp-_GwA5en2WRCT4ZCSajS5TI4MgzQEB2Ae4oeESmt5AknBD7hNhuyl6kn68PiaFPXYVkBw7BXcJBs4874o1zUQQ7H-j3F2VptTSS9hGTiruLTCAMrTyt2iA3hkYqihOn6QGRuAKGwBEeKpKmiXY0qL6e6bAEDZgKg4idmrbyfwl_ofr8AZqdE8oGIV03k7fq4GwM)' }}></div>
                            <Link to="/patient-profile-records" className="flex-1 min-w-0 pr-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1 transition-colors">
                                <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">{profile.name}</p>
                                <p className="text-[10px] text-slate-500 truncate">{profile.role}</p>
                            </Link>
                            <div className="flex items-center gap-1.5">
                                <Link to="/patient-profile-records" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <span className="material-symbols-outlined text-[18px]">settings</span>
                                </Link>
                                <a title="Logout" href="#" onClick={async (e) => { e.preventDefault(); await logout(); navigate('/'); }} className="text-slate-400 hover:text-red-500">
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── MAIN CONTENT CONTAINER ── */}
                <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark flex flex-col">
                    {/* Sticky Header */}
                    <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
                        <div className="flex-1 max-w-xl">
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                                <input
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm focus:shadow-md"
                                    placeholder="Search health records, symptoms, or doctors..."
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <HeaderActions />
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white dark:border-slate-900"></span>
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Children */}
                    <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
                        {children}
                    </div>

                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
