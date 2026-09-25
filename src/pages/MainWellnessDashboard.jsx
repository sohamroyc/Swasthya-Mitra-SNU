import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { patientProfileService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';

const MainWellnessDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({ name: user?.name || "Loading..." });

    // States for interactive features
    const [waterGlasses, setWaterGlasses] = useState(4); // default 4 glasses
    const [bp, setBp] = useState("120/80");
    const [sugar, setSugar] = useState("95");
    const [weight, setWeight] = useState("72.5");
    const [isLoggingVitals, setIsLoggingVitals] = useState(false);
    const [tempBp, setTempBp] = useState("120/80");
    const [tempSugar, setTempSugar] = useState("95");
    const [tempWeight, setTempWeight] = useState("72.5");

    // Medication State
    const [meds, setMeds] = useState([
        { id: 1, name: "Lisinopril 10mg", dosage: "1 tablet, Daily", time: "08:00 AM", taken: false, icon: "pill" },
        { id: 2, name: "Omega-3 Fish Oil", dosage: "2 softgels, Morning", time: "09:30 AM", taken: true, icon: "vaccines" },
        { id: 3, name: "Vitamin D3", dosage: "1 tablet, Evening", time: "09:00 PM", taken: false, icon: "medication_liquid" }
    ]);

    // Health Tip of the Day
    const healthTips = [
        "Did you know? Drinking a glass of water first thing in the morning rehydrates your body and fires up your metabolism.",
        "Take a 5-minute stretch break every hour of desk work to keep your spine healthy and blood circulation active.",
        "Include fermented foods like yogurt, kefir, or kimchi in your meals to naturally optimize your gut microbiome and digestion.",
        "Studies show that dimming home lights 1 hour before bed increases melatonin production, helping you sleep significantly deeper.",
        "Cardiovascular exercise for just 20 minutes a day can boost your cognitive health, clear stress hormones, and strengthen your heart."
    ];
    const [dailyTip, setDailyTip] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await patientProfileService.getProfile();
                setProfile({ name: user?.name || data.name });
            } catch (err) {
                console.error("Failed to load dashboard profile:", err);
            }
        };
        fetchProfile();
        // Select a daily tip
        setDailyTip(healthTips[Math.floor(Math.random() * healthTips.length)]);
    }, [user]);

    const handleLogVitals = (e) => {
        e.preventDefault();
        setBp(tempBp);
        setSugar(tempSugar);
        setWeight(tempWeight);
        setIsLoggingVitals(false);
    };

    const toggleMed = (id) => {
        setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
    };

    // Calculate taken meds percent
    const medsTakenCount = meds.filter(m => m.taken).length;
    const medsTotalCount = meds.length;

    // Get current date string
    const getFormattedDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    return (
        <AppLayout activeTab="dashboard">
            <div className="space-y-8 max-w-[1200px] mx-auto pb-10">

                {/* ─── PREMIUM WELCOME HERO BANNER ─── */}
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white p-8 md:p-10 shadow-2xl border border-white/5 group">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 size-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/15 transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 size-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <p className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-blue-400 mb-2">{getFormattedDate()}</p>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-3">
                                Welcome back, <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-white bg-clip-text text-transparent">{(profile.name || "User").split(' ')[0]}</span>! 👋
                            </h2>
                            <p className="text-slate-300 text-xs md:text-sm max-w-xl font-medium leading-relaxed mb-6">
                                Your vitals are stable. You have completed <span className="text-emerald-400 font-bold">{medsTakenCount} of {medsTotalCount}</span> daily medication reminders and have 1 upcoming cardiology teleconsultation today.
                            </p>
                            
                            {/* Interactive Wellness Tip banner */}
                            <div className="bg-white/10 border border-white/10 backdrop-blur-md px-4 py-3 rounded-2xl flex items-start gap-3 max-w-xl">
                                <span className="material-symbols-outlined text-amber-300 shrink-0 select-none animate-pulse">lightbulb</span>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-amber-300 tracking-wider">Health Tip of the Day</p>
                                    <p className="text-xs text-slate-100 font-semibold mt-0.5 leading-relaxed">{dailyTip}</p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Circular Checklist Progress widget */}
                        <div className="flex flex-col items-center shrink-0 self-center md:self-auto bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl w-full md:w-auto">
                            <div className="relative size-24 flex items-center justify-center mb-3">
                                <svg className="size-full -rotate-90">
                                    <circle cx="48" cy="48" r="40" className="stroke-white/10 fill-none" strokeWidth="8" />
                                    <circle cx="48" cy="48" r="40" className="stroke-emerald-500 fill-none transition-all duration-1000" strokeWidth="8" 
                                            strokeDasharray="251.2"
                                            strokeDashoffset={251.2 - (251.2 * medsTakenCount) / medsTotalCount} 
                                            strokeLinecap="round" />
                                </svg>
                                <div className="absolute text-center">
                                    <p className="text-xl font-black">{Math.round((medsTakenCount / medsTotalCount) * 100)}%</p>
                                    <p className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Meds Taken</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-300">Medication Routine</span>
                        </div>
                    </div>
                </div>

                {/* ─── QUICK ACTIONS GRID (PREMIUM WEB LOOK) ─── */}
                <section>
                    <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <span className="material-symbols-outlined text-primary">bolt</span>
                        Clinical AI Wellness Tools
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                        
                        <Link to="/ai-symptom-checker-interface" className="group relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/30 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl font-light">psychology</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-600 transition-colors">arrow_forward</span>
                            </div>
                            <h4 className="font-black text-slate-800 dark:text-slate-200 text-md leading-tight mb-1">AI Consultations</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                                Get domain-expert diagnosis from cardiology, neurology &amp; orthopedic virtual agents.
                            </p>
                        </Link>

                        <Link to="/ai-x-ray-analysis-tool" className="group relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="size-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/30 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl font-light">radiology</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-purple-600 transition-colors">arrow_forward</span>
                            </div>
                            <h4 className="font-black text-slate-800 dark:text-slate-200 text-md leading-tight mb-1">AI X-Ray Insights</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                                Upload and analyze clinical scan reports or chest X-rays for explainable AI summaries.
                            </p>
                        </Link>

                        <Link to="/first-aid-knowledge-base" className="group relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="size-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-900/30 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl font-light">chat</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-teal-600 transition-colors">arrow_forward</span>
                            </div>
                            <h4 className="font-black text-slate-800 dark:text-slate-200 text-md leading-tight mb-1">Doctor &amp; Facility finder</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                                View location-aware nearby hospitals, pharmacies, clinics, and health centers live.
                            </p>
                        </Link>

                        <Link to="/ai-dermatologist" className="group relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-1 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="size-12 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center border border-pink-100 dark:border-pink-900/30 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl font-light">face</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-pink-600 transition-colors">arrow_forward</span>
                            </div>
                            <h4 className="font-black text-slate-800 dark:text-slate-200 text-md leading-tight mb-1">AI Dermatologist</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                                Visual analysis of skin spots or hair metrics with rapid diagnostic AI reports.
                            </p>
                        </Link>

                        <Link to="/government-health-schemes" className="group relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="size-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/30 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl font-light">verified_user</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-amber-600 transition-colors">arrow_forward</span>
                            </div>
                            <h4 className="font-black text-slate-800 dark:text-slate-200 text-md leading-tight mb-1">Govt Schemes</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                                Instantly check eligibility for national health schemes like PM-JAY and PMBJP.
                            </p>
                        </Link>

                    </div>
                </section>

                {/* ─── MAIN TWO-COLUMN DASHBOARD CONTENT ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Health Vitals, Analytics, & Hydration */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* ─── Section: Vitals Indicators (Dynamic) ─── */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">favorite</span>
                                    Vitals &amp; Health Metrics
                                </h3>
                                <button 
                                    onClick={() => {
                                        setTempBp(bp);
                                        setTempSugar(sugar);
                                        setTempWeight(weight);
                                        setIsLoggingVitals(!isLoggingVitals);
                                    }}
                                    className="text-xs font-bold text-primary hover:bg-primary/5 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[15px]">edit</span>
                                    {isLoggingVitals ? "Cancel" : "Update Vitals"}
                                </button>
                            </div>

                            {/* Vitals Logging Panel */}
                            {isLoggingVitals && (
                                <form onSubmit={handleLogVitals} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl mb-5 flex flex-wrap gap-4 items-end animate-in fade-in slide-in-from-top-3">
                                    <div className="flex-1 min-w-[120px]">
                                        <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Blood Pressure (mmHg)</label>
                                        <input 
                                            type="text" 
                                            value={tempBp} 
                                            onChange={e => setTempBp(e.target.value)} 
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white outline-none focus:border-blue-500 font-bold"
                                            placeholder="e.g. 120/80"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[120px]">
                                        <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Blood Sugar (mg/dL)</label>
                                        <input 
                                            type="text" 
                                            value={tempSugar} 
                                            onChange={e => setTempSugar(e.target.value)} 
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white outline-none focus:border-blue-500 font-bold"
                                            placeholder="e.g. 95"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[120px]">
                                        <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Weight (kg)</label>
                                        <input 
                                            type="text" 
                                            value={tempWeight} 
                                            onChange={e => setTempWeight(e.target.value)} 
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white outline-none focus:border-blue-500 font-bold"
                                            placeholder="e.g. 70"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors shrink-0">
                                        Save Log
                                    </button>
                                </form>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {/* BP Widget */}
                                <div className="group relative bg-white dark:bg-slate-900 p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-900/50 shadow-sm hover:shadow-xl transition-all overflow-hidden duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="size-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center border border-red-100/50 dark:border-red-900/20 group-hover:scale-105 transition-transform duration-300">
                                                <span className="material-symbols-outlined font-light text-[22px]">blood_pressure</span>
                                            </div>
                                            <span className="text-[9px] font-black uppercase bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                                                Optimal
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Blood Pressure</p>
                                        <div className="flex items-baseline gap-1 mt-3">
                                            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">{bp}</span>
                                            <span className="text-slate-400 font-bold text-[11px]">mmHg</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-semibold mt-4 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px] text-emerald-500">check_circle</span>
                                            Normal systolic &amp; diastolic
                                        </p>
                                    </div>
                                </div>

                                {/* Sugar Widget */}
                                <div className="group relative bg-white dark:bg-slate-900 p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-900/50 shadow-sm hover:shadow-xl transition-all overflow-hidden duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="size-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center border border-amber-100/50 dark:border-amber-900/20 group-hover:scale-105 transition-transform duration-300">
                                                <span className="material-symbols-outlined font-light text-[22px]">water_drop</span>
                                            </div>
                                            <span className="text-[9px] font-black uppercase bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/30">
                                                Fasting
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Blood Sugar</p>
                                        <div className="flex items-baseline gap-1 mt-3">
                                            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">{sugar}</span>
                                            <span className="text-slate-400 font-bold text-[11px]">mg/dL</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-semibold mt-4 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px] text-emerald-500">check_circle</span>
                                            Excellent glycemic control
                                        </p>
                                    </div>
                                </div>

                                {/* Weight Widget */}
                                <div className="group relative bg-white dark:bg-slate-900 p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-900/50 shadow-sm hover:shadow-xl transition-all overflow-hidden duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="size-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/20 group-hover:scale-105 transition-transform duration-300">
                                                <span className="material-symbols-outlined font-light text-[22px]">weight</span>
                                            </div>
                                            <span className="text-[9px] font-black uppercase bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                                                BMI 23.1
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Body Weight</p>
                                        <div className="flex items-baseline gap-1 mt-3">
                                            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{weight}</span>
                                            <span className="text-slate-400 font-bold text-[11px]">kg</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-semibold mt-4 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px] text-blue-500">trending_down</span>
                                            Stable (-0.4kg vs last week)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── Section: Activity History Flex Chart ─── */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">timeline</span>
                                    Fasting Glycemic Trend
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="size-2.5 rounded-full bg-blue-500"></span>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Target Range: 70-100 mg/dL</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="h-56 flex items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3 relative">
                                    {/* Y Axis Guides */}
                                    <div className="absolute left-0 right-0 top-0 border-t border-slate-100 dark:border-slate-800/40 pointer-events-none">
                                        <span className="absolute -top-2.5 left-0 text-[9px] font-black text-slate-300">120 mg/dL</span>
                                    </div>
                                    <div className="absolute left-0 right-0 top-1/3 border-t border-slate-100 dark:border-slate-800/40 pointer-events-none">
                                        <span className="absolute -top-2.5 left-0 text-[9px] font-black text-slate-300">100 mg/dL (Limit)</span>
                                    </div>
                                    <div className="absolute left-0 right-0 top-2/3 border-t border-slate-100 dark:border-slate-800/40 pointer-events-none">
                                        <span className="absolute -top-2.5 left-0 text-[9px] font-black text-slate-300">80 mg/dL</span>
                                    </div>

                                    {/* Bars */}
                                    {[
                                        { day: "Mon", val: 92, pct: "76%" },
                                        { day: "Tue", val: 98, pct: "81%" },
                                        { day: "Wed", val: 104, pct: "86%" }, // high spike
                                        { day: "Thu", val: 90, pct: "75%" },
                                        { day: "Fri", val: 95, pct: "79%" },
                                        { day: "Sat", val: 89, pct: "74%" },
                                        { day: "Sun", val: sugar, pct: `${Math.min((parseFloat(sugar) / 120) * 100, 100)}%` }
                                    ].map((bar, idx) => {
                                        const isHigh = parseFloat(bar.val) > 100;
                                        return (
                                            <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer z-10">
                                                {/* Tooltip on hover */}
                                                <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-slate-950 dark:bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-transform duration-200 shadow-md flex items-center gap-1 z-20">
                                                    <span className="font-bold">{bar.val}</span>
                                                    <span className="text-[8px] text-slate-300">mg/dL</span>
                                                </div>
                                                {/* Bar cylinder */}
                                                <div 
                                                    style={{ height: bar.pct }} 
                                                    className={`w-full max-w-[24px] rounded-t-lg transition-all duration-700 ease-out relative overflow-hidden ${isHigh ? 'bg-gradient-to-t from-amber-400 to-amber-500 shadow-lg shadow-amber-500/10' : 'bg-gradient-to-t from-blue-500 to-blue-600 shadow-lg shadow-blue-500/10'}`}
                                                >
                                                    {/* Glowing top line */}
                                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/40"></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between gap-4 mt-3 px-1.5">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                                        <span key={i} className="flex-1 text-center text-[10px] font-black text-slate-400">{day}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ─── Section: Interactive Hydration Tracker Widget ─── */}
                        <div className="bg-gradient-to-r from-blue-500/5 via-blue-500/10 to-indigo-500/5 dark:from-blue-950/20 dark:to-indigo-950/10 rounded-3xl p-6 border border-blue-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="size-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/50">
                                    <span className="material-symbols-outlined text-3xl select-none fill-1">local_drink</span>
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-[16px] leading-tight">Hydration Tracker</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-0.5">Keep your cognitive alertness and digestion optimized. Target: 8 glasses daily.</p>
                                    <div className="flex gap-1.5 mt-3">
                                        {[...Array(8)].map((_, i) => (
                                            <span 
                                                key={i} 
                                                className={`material-symbols-outlined text-[20px] transition-colors select-none ${i < waterGlasses ? 'text-blue-500 fill-1' : 'text-slate-300 dark:text-slate-700'}`}
                                            >
                                                local_drink
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-end">
                                <div className="text-right">
                                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">{waterGlasses} <span className="text-xs text-slate-400">/ 8 glasses</span></p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{waterGlasses >= 8 ? "Goal Completed! 🎉" : `${8 - waterGlasses} glasses left`}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setWaterGlasses(prev => Math.max(prev - 1, 0))}
                                        className="size-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-lg select-none">remove</span>
                                    </button>
                                    <button 
                                        onClick={() => setWaterGlasses(prev => Math.min(prev + 1, 10))}
                                        className="size-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 shadow-md shadow-blue-500/10 active:scale-95 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-lg select-none">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Reminders & Active Telemedicine Countdown */}
                    <div className="space-y-8">
                        
                        {/* ─── Section: Interactive Medication Reminders ─── */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">medication</span>
                                    Today's Medications
                                </h3>
                                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/30 px-2 py-0.5 rounded uppercase">
                                    {medsTakenCount} of {medsTotalCount} Done
                                </span>
                            </div>
                            
                            <div className="p-5 space-y-4">
                                {meds.map(med => (
                                    <div 
                                        key={med.id}
                                        onClick={() => toggleMed(med.id)}
                                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer group ${med.taken 
                                            ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/20' 
                                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 hover:border-indigo-400 dark:hover:border-indigo-500'}`}
                                    >
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${med.taken
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200'
                                                : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200/50 dark:border-slate-800'}`}>
                                                <span className="material-symbols-outlined text-xl">{med.icon}</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className={`text-[14px] font-bold truncate leading-tight ${med.taken ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-300' : 'text-slate-800 dark:text-slate-100'}`}>
                                                    {med.name}
                                                </p>
                                                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{med.dosage}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 ml-3">
                                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${med.taken
                                                ? 'bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                                                : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400'}`}>
                                                {med.time}
                                            </span>
                                            <span className={`material-symbols-outlined text-[22px] transition-colors select-none ${med.taken ? 'text-emerald-500 fill-1' : 'text-slate-300'}`}>
                                                {med.taken ? 'check_circle' : 'radio_button_unchecked'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="px-5 pb-5">
                                <button 
                                    onClick={() => navigate('/medication-manager-calendar')}
                                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-200 rounded-2xl py-3.5 text-xs font-black transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                    Open Medication Schedule
                                </button>
                            </div>
                        </div>

                        {/* ─── Section: Telemedicine Appointment countdown ─── */}
                        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-[2rem] p-7 relative overflow-hidden shadow-2xl border border-white/5 group">
                            {/* Decorative glowing gradient ring */}
                            <div className="absolute top-0 right-0 -mt-16 -mr-16 size-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500"></div>

                            <div className="relative z-10 flex flex-col gap-6">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-extrabold text-lg text-white/95">Teleconsultation</h4>
                                    <span className="bg-red-500/20 text-red-400 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest border border-red-500/20 animate-pulse uppercase shadow-sm flex items-center gap-1">
                                        <span className="size-1.5 rounded-full bg-red-500 inline-block"></span>
                                        Live in 15 mins
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <div className="size-14 rounded-full border-2 border-white/30 overflow-hidden shrink-0 shadow-inner">
                                        <img className="w-full h-full object-cover" alt="Doctor portrait" src="https://ui-avatars.com/api/?name=Dr+Sarah+Miller&background=4f46e5&color=fff" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[16px] font-black text-white leading-tight truncate">Dr. Sarah Miller</p>
                                        <p className="text-xs text-indigo-300 flex items-center gap-1 mt-0.5">
                                            <span className="material-symbols-outlined text-[13px]">monitor_heart</span> 
                                            Cardiology Specialist
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-slate-950/40 rounded-xl p-4 flex justify-between items-center border border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white/5 p-2 rounded-lg text-indigo-300">
                                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-200">Today</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/10"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white/5 p-2 rounded-lg text-indigo-300">
                                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-200">10:30 AM</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => alert("Launching Secure Zoom Consultation Portal...")}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 group-hover:-translate-y-1 select-none"
                                >
                                    <span className="material-symbols-outlined text-[18px]">video_camera_front</span>
                                    JOIN SECURE VIDEO CALL
                                </button>
                            </div>
                            <span className="material-symbols-outlined absolute -bottom-16 -right-16 text-[180px] text-white/5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700 pointer-events-none select-none">cardiology</span>
                        </div>

                    </div>

                </div>

            </div>
        </AppLayout>
    );
};

export default MainWellnessDashboard;
