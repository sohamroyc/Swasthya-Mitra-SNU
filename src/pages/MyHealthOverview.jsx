import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { patientProfileService } from '../services/api';
import AppLayout from '../components/AppLayout';
import VitalsDashboard from '../components/VitalsDashboard';
import ActivitiesDashboard from '../components/ActivitiesDashboard';
import NutritionDashboard from '../components/NutritionDashboard';
import SettingsDashboard from '../components/SettingsDashboard';

const MyHealthOverview = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({ name: "Loading...", role: "Loading..." });
    const [activeTab, setActiveTab] = useState('overview');
    const [timeframe, setTimeframe] = useState('Last 7 Days');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await patientProfileService.getProfile();
                setProfile({ name: data.name, role: 'Pro Member' });
            } catch (err) {
                setProfile({ name: "Guest User", role: "Basic Member" });
            }
        };
        fetchProfile();
    }, []);

    const renderContent = () => {
        if (activeTab === 'vitals') return <VitalsDashboard />;
        if (activeTab === 'activities') return <ActivitiesDashboard />;
        if (activeTab === 'nutrition') return <NutritionDashboard />;
        if (activeTab === 'settings') return <SettingsDashboard />;

        if (activeTab !== 'overview') {
            return (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                        error_outline
                    </span>
                    <h2 className="text-xl font-bold text-slate-800 capitalize mb-2">Not Found</h2>
                    <button onClick={() => setActiveTab('overview')} className="mt-6 border border-blue-600 px-6 py-2 rounded-xl text-blue-600 font-bold hover:bg-blue-50 transition-colors">Return to Overview</button>
                </div>
            );
        }

        const isWeekly = timeframe === 'Last 7 Days';
        const weightValue = isWeekly ? '70.5' : '71.2';
        const weightChange = isWeekly ? '-0.5kg this week' : '-1.2kg this month';
        const activityValue = isWeekly ? '8,432' : '7,950';
        const activityChange = isWeekly ? '+12% vs last week' : '+5% vs last month';

        return (
            <>
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Health Overview</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Real-time medical analysis and wellness management powered by AI.</p>
                </div>

                {/* Vital Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Heart Rate */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold text-slate-500">Heart Rate</span>
                            <div className="text-rose-500">
                                <span className="material-symbols-outlined text-[20px]">favorite</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-4xl font-black text-slate-900 tracking-tight">72</span>
                            <span className="text-sm font-bold text-slate-400">BPM</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-rose-500 text-xs font-black">
                            <span className="material-symbols-outlined text-[16px]">trending_down</span>
                            -2% from yesterday
                        </div>
                    </div>

                    {/* Blood Pressure */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold text-slate-500">Blood Pressure</span>
                            <div className="text-blue-500">
                                <span className="material-symbols-outlined text-[20px]">blood_pressure</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-4xl font-black text-slate-900 tracking-tight">120/80</span>
                            <span className="text-sm font-bold text-slate-400">mmHg</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-black">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span>
                            +1% (Optimal)
                        </div>
                    </div>

                    {/* Blood Sugar */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold text-slate-500">Blood Sugar</span>
                            <div className="text-orange-500">
                                <span className="material-symbols-outlined text-[20px]">water_drop</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-4xl font-black text-slate-900 tracking-tight">95</span>
                            <span className="text-sm font-bold text-slate-400">mg/dL</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-orange-400 text-xs font-black">
                            <span className="material-symbols-outlined text-[16px]">horizontal_rule</span>
                            ~3% (Stable)
                        </div>
                    </div>
                </div>

                {/* Chart Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weight Management Line Chart */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[320px]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base mb-1">Weight Management</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black tracking-tight">{weightValue} <span className="text-sm font-bold text-slate-400">kg</span></span>
                                    <span className="text-xs font-black text-rose-500">{weightChange}</span>
                                </div>
                            </div>
                            <select
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value)}
                                className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg focus:ring-blue-500 py-2 px-3 outline-none cursor-pointer"
                            >
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>

                        <div className="mt-auto h-40 w-full pt-4 flex items-end overflow-hidden">
                            <svg viewBox="0 0 400 120" className="w-full h-full preserve-aspect-ratio-none overflow-visible">
                                {isWeekly ? (
                                    <path d="M0,90 Q15,40 30,70 T70,50 T110,80 T150,60 T190,100 T230,50 T280,90 T320,40 T360,80 T400,30"
                                        fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                ) : (
                                    <path d="M0,80 L30,40 L60,90 L100,20 L140,70 L180,40 L220,100 L260,50 L300,90 L350,40 L400,60"
                                        fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                )}
                            </svg>
                        </div>

                        <div className="flex justify-between text-[10px] font-extrabold text-slate-300 uppercase tracking-widest mt-6 bg-white">
                            {isWeekly ? (
                                <><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></>
                            ) : (
                                <><span>Week 1</span><span></span><span>Week 2</span><span></span><span>Week 3</span><span></span><span>Week 4</span></>
                            )}
                        </div>
                    </div>

                    {/* Activity Tracking Bar Chart */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[320px]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base mb-1">Activity Tracking</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black tracking-tight">{activityValue}</span>
                                    <span className="text-sm font-bold text-slate-400">avg steps/day</span>
                                </div>
                            </div>
                            <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1.5 rounded-lg text-right max-w-[80px] leading-tight cursor-default">
                                {activityChange}
                            </div>
                        </div>

                        <div className="mt-auto h-40 w-full flex items-end justify-between gap-3 px-2 pt-4">
                            {isWeekly ? (
                                <>
                                    <div className="w-full bg-blue-100 rounded-t-lg h-[45%] hover:bg-blue-200 transition-colors group relative cursor-pointer">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">4.2k</div>
                                    </div>
                                    <div className="w-full bg-blue-100 rounded-t-lg h-[65%] hover:bg-blue-200 transition-colors group relative cursor-pointer">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">6.1k</div>
                                    </div>
                                    <div className="w-full bg-blue-100 rounded-t-lg h-[55%] hover:bg-blue-200 transition-colors group relative cursor-pointer">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">5.3k</div>
                                    </div>
                                    <div className="w-full bg-blue-100 rounded-t-lg h-[90%] hover:bg-blue-200 transition-colors group relative cursor-pointer">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">8.4k</div>
                                    </div>
                                    <div className="w-full bg-blue-100 rounded-t-lg h-[60%] hover:bg-blue-200 transition-colors group relative cursor-pointer">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">5.8k</div>
                                    </div>
                                    <div className="w-full bg-blue-100 rounded-t-lg h-[35%] hover:bg-blue-200 transition-colors group relative cursor-pointer">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">3.2k</div>
                                    </div>
                                    <div className="w-full bg-blue-100 rounded-t-lg h-[50%] hover:bg-blue-200 transition-colors group relative cursor-pointer">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">4.7k</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-full bg-blue-100 rounded-t-lg h-[70%] hover:bg-blue-200 transition-colors group relative cursor-pointer">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">7.3k avg</div>
                                    </div>
                                    <div className="w-full bg-blue-100 rounded-t-lg h-[60%] hover:bg-blue-200 transition-colors group relative cursor-pointer">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">6.1k avg</div>
                                    </div>
                                    <div className="w-full bg-blue-100 rounded-t-lg h-[80%] hover:bg-blue-200 transition-colors group relative cursor-pointer">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">8.4k avg</div>
                                    </div>
                                    <div className="w-full bg-blue-100 rounded-t-lg h-[85%] hover:bg-blue-200 transition-colors group relative cursor-pointer">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">8.9k avg</div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between text-[10px] font-extrabold text-slate-300 uppercase tracking-widest mt-6 bg-white">
                            {isWeekly ? (
                                <><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></>
                            ) : (
                                <><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <AppLayout activeTab="my-health">
            <div className="flex flex-col xl:flex-row gap-8">
                <div className="flex flex-col md:flex-row gap-8 flex-1 w-full min-w-0">
                    {/* Left Sidebar */}
                    <aside className="hidden md:flex w-64 flex-col gap-6 shrink-0">
                        <nav className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-1">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'overview' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('vitals')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'vitals' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
                                Vitals
                            </button>
                            <button
                                onClick={() => setActiveTab('activities')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'activities' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">show_chart</span>
                                Activities
                            </button>
                            <button
                                onClick={() => setActiveTab('nutrition')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'nutrition' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">apple</span>
                                Nutrition
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'settings' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">settings</span>
                                Settings
                            </button>
                        </nav>

                        <div className="mt-auto bg-red-50 dark:bg-red-950/20 rounded-2xl p-5 border border-red-100 dark:border-red-900/30 shadow-sm">
                            <p className="text-red-500 text-[10px] font-extrabold uppercase tracking-widest mb-3">Emergency</p>
                            <p className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-tight">Dr. Sarah Miller</p>
                            <p className="text-xs font-semibold text-slate-500 mb-4 mt-1">+1 (555) 000-1234</p>
                            <a href="tel:+15550001234" className="block text-center w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-md shadow-red-500/20 active:scale-95">
                                Call Now
                            </a>
                        </div>
                    </aside>

                    {/* Main Middle Area */}
                    <main className="flex-1 w-full min-w-0">
                        <div className="max-w-4xl mx-auto">
                            {renderContent()}
                        </div>
                    </main>
                </div>

                {/* Right Sidebar - Insights */}
                <aside className="w-full xl:w-80 flex flex-col gap-6 shrink-0 z-10">
                    {/* Health Score Component */}
                    <div className="bg-[#1a56db] rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden flex flex-col items-center text-center">
                        <div className="w-full flex justify-between items-center mb-6">
                            <h3 className="font-bold text-[14px]">Health Score</h3>
                            <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors flex">
                                <span className="material-symbols-outlined text-[16px]">info</span>
                            </button>
                        </div>

                        <div className="relative size-32 mb-6 cursor-pointer hover:scale-105 transition-transform">
                            <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                                <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset="39.6" strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                                <span className="text-[32px] font-black leading-none tracking-tight">85</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.1em] mt-0.5">PERCENT</span>
                            </div>
                        </div>

                        <p className="text-[12px] font-bold opacity-90 leading-relaxed px-2">Your wellness is Excellent this week!</p>
                    </div>

                    {/* AI Wellness Tips Component */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-blue-600 text-[18px]">lightbulb</span>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[14px]">AI Wellness Tips</h3>
                        </div>

                        <div className="flex flex-col gap-6 mb-6">
                            {/* Tip 1 */}
                            <div className="flex gap-4">
                                <div className="size-8 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="material-symbols-outlined text-[16px]">water_drop</span>
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-black text-slate-900 dark:text-slate-100 mb-1 leading-tight">Increase Hydration</h4>
                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">Based on your activity, drink 500ml more water today.</p>
                                </div>
                            </div>
                            {/* Tip 2 */}
                            <div className="flex gap-4">
                                <div className="size-8 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="material-symbols-outlined text-[16px]">bedtime</span>
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-black text-slate-900 dark:text-slate-100 mb-1 leading-tight">Sleep Quality</h4>
                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">Heart rate trend suggests you need 30 mins more rest.</p>
                                </div>
                            </div>
                            {/* Tip 3 */}
                            <div className="flex gap-4">
                                <div className="size-8 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="material-symbols-outlined text-[16px]">directions_run</span>
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-black text-slate-900 dark:text-slate-100 mb-1 leading-tight">Morning Jog</h4>
                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">A 20-min low intensity jog will help stabilize BP.</p>
                                </div>
                            </div>
                        </div>

                        <Link to="/health-reports-analytics" className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold text-[12px] py-3 rounded-xl transition-colors text-center block active:scale-[0.98]">
                            See Detailed Plan
                        </Link>
                    </div>

                    {/* Next Appointment Component */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors" onClick={() => navigate('/first-aid-knowledge-base')}>
                        <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">NEXT APPOINTMENT</h3>
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            </div>
                            <div>
                                <h4 className="text-[13px] font-black text-slate-900 dark:text-slate-100 mb-1 leading-tight">Annual Physical</h4>
                                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">Oct 24, 10:00 AM</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 ml-auto">chevron_right</span>
                        </div>
                    </div>
                </aside>
            </div>
        </AppLayout>
    );
};

export default MyHealthOverview;
