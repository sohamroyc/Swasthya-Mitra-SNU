import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientProfileService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';

const MainWellnessDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({ name: user?.name || "Loading..." });

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await patientProfileService.getProfile();
            setProfile({ name: user?.name || data.name });
        };
        fetchProfile();
    }, [user]);

    return (
        <AppLayout activeTab="dashboard">
            <div>
                <h2 className="text-3xl font-extrabold tracking-tight">Good morning, {(profile.name || "User").split(' ')[0]}</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your wellness overview.</p>
            </div>
                            <section>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">bolt</span>
                                    Quick Actions
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                                    <Link to="/ai-symptom-checker-interface" className="group relative block overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-3xl">psychology</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                        </div>
                                        <h4 className="font-bold text-lg">AI Symptom Checker</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Describe how you feel for an instant preliminary analysis.</p>
                                    </Link>
                                    <Link to="/ai-x-ray-analysis-tool" className="group relative block overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="size-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-3xl">radiology</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                        </div>
                                        <h4 className="font-bold text-lg">AI X-Ray Analysis</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Upload scan reports or images for detailed insights.</p>
                                    </Link>
                                    <Link to="/first-aid-knowledge-base" className="group relative block overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="size-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-3xl">chat</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                        </div>
                                        <h4 className="font-bold text-lg">Talk to AI Doctor</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">First aid knowledge and emergency tips anytime.</p>
                                    </Link>
                                    <Link to="/ai-dermatologist" className="group relative block overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="size-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-3xl">face</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                        </div>
                                        <h4 className="font-bold text-lg">AI Dermatologist</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Instant skin health assessment and visual analysis.</p>
                                    </Link>
                                    <Link to="/government-health-schemes" className="group relative block overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="size-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-3xl">verified_user</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                        </div>
                                        <h4 className="font-bold text-lg">Health Schemes</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Discover Govt healthcare programs easily.</p>
                                    </Link>
                                </div>
                            </section>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <section>
                                        <div className="flex items-center justify-between mb-5">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                                                    <span className="material-symbols-outlined text-xl">analytics</span>
                                                </div>
                                                Health Metrics
                                            </h3>
                                            <button className="text-[13px] font-bold text-primary hover:text-blue-700 hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
                                                View All
                                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                            {/* Heart Rate Card */}
                                            <div className="group relative bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-900/50 shadow-sm hover:shadow-xl hover:shadow-red-500/10 transition-all overflow-hidden cursor-pointer duration-300">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors"></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="size-12 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center border border-red-100 dark:border-red-900/30 group-hover:scale-105 transition-transform duration-300">
                                                            <span className="material-symbols-outlined font-light text-[24px]">favorite</span>
                                                        </div>
                                                        <span className="text-[14px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">Heart Rate</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1.5 mb-1 mt-6">
                                                        <span className="text-[40px] font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">72</span>
                                                        <span className="text-slate-400 font-bold text-[14px]">bpm</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-4">
                                                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full w-[65%] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sleep Card */}
                                            <div className="group relative bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-900/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all overflow-hidden cursor-pointer duration-300">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center border border-blue-100 dark:border-blue-900/30 group-hover:scale-105 transition-transform duration-300">
                                                            <span className="material-symbols-outlined font-light text-[24px]">bedtime</span>
                                                        </div>
                                                        <span className="text-[14px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">Sleep</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1.5 mb-1 mt-6">
                                                        <span className="text-[40px] font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">7.5</span>
                                                        <span className="text-slate-400 font-bold text-[14px]">hrs</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-4">
                                                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full w-[80%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Steps Card */}
                                            <div className="group relative bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-900/50 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all overflow-hidden cursor-pointer duration-300">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="size-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center border border-orange-100 dark:border-orange-900/30 group-hover:scale-105 transition-transform duration-300">
                                                            <span className="material-symbols-outlined font-light text-[24px]">directions_run</span>
                                                        </div>
                                                        <span className="text-[14px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">Steps</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1.5 mb-1 mt-6">
                                                        <span className="text-[40px] font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">8,432</span>
                                                        <span className="text-slate-400 font-bold text-[14px]">steps</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-4">
                                                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full w-[70%] shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                    <section>
                                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                <h3 className="font-bold flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary">timeline</span>
                                                    Activity History
                                                </h3>
                                                <select className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-primary">
                                                    <option>Last 7 Days</option>
                                                    <option>Last 30 Days</option>
                                                </select>
                                            </div>
                                            <div className="p-6 h-64 flex items-end justify-between gap-2">
                                                <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[40%]" title="Mon">
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">4,200 steps</div>
                                                </div>
                                                <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[60%]" title="Tue"></div>
                                                <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[85%]" title="Wed"></div>
                                                <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[45%]" title="Thu"></div>
                                                <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[70%]" title="Fri"></div>
                                                <div className="flex-1 bg-primary/40 rounded-t-lg relative group h-[95%]" title="Sat"></div>
                                                <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[30%]" title="Sun"></div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                <div className="space-y-6">
                                    <section>
                                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                                <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                                        <span className="material-symbols-outlined text-xl">medication</span>
                                                    </div>
                                                    Medication Reminders
                                                </h3>
                                                <button className="text-slate-400 hover:text-indigo-600 transition-colors tooltip" aria-label="Edit Reminders">
                                                    <span className="material-symbols-outlined text-[22px]">more_horiz</span>
                                                </button>
                                            </div>
                                            <div className="p-5 space-y-4">
                                                {/* Reminder Card 1 */}
                                                <div className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm transition-all cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 text-indigo-600 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 group-hover:scale-105 transition-transform duration-300">
                                                            <span className="material-symbols-outlined font-light text-[24px]">pill</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[16px] font-black text-slate-900 dark:text-white truncate">Lisinopril 10mg</p>
                                                            <p className="text-[13px] font-medium text-slate-500 mt-0.5 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> 1 tablet, Daily</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end gap-1.5">
                                                        <p className="text-[12px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg border border-indigo-100/50 dark:border-indigo-800/30">08:00 AM</p>
                                                    </div>
                                                </div>

                                                {/* Reminder Card 2 (Taken) */}
                                                <div className="group flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border-2 border-emerald-100/50 dark:border-emerald-900/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/50">
                                                            <span className="material-symbols-outlined font-light text-[24px]">vaccines</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[16px] font-black text-emerald-900 dark:text-emerald-100 truncate line-through decoration-emerald-300/60 decoration-2">Omega-3 Fish Oil</p>
                                                            <p className="text-[13px] font-medium text-emerald-600/70 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-300/50"></span> 2 softgels, Morning</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end gap-1.5">
                                                        <p className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-lg flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">check_circle</span> Taken</p>
                                                    </div>
                                                </div>

                                                {/* Reminder Card 3 */}
                                                <div className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-sm transition-all cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/40 dark:to-amber-900/40 text-orange-600 flex items-center justify-center border border-orange-100 dark:border-orange-800/50 group-hover:scale-105 transition-transform duration-300">
                                                            <span className="material-symbols-outlined font-light text-[24px]">medication_liquid</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[16px] font-black text-slate-900 dark:text-white truncate">Vitamin D3</p>
                                                            <p className="text-[13px] font-medium text-slate-500 mt-0.5 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> 1 tablet, Evening</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end gap-1.5">
                                                        <p className="text-[12px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg border border-slate-200/50 dark:border-slate-600/50">09:00 PM</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-5 pb-5">
                                                <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary dark:text-white dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl py-3.5 text-[14px] font-bold transition-colors flex items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                                    Add New Reminder
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                    <section>
                                        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-primary rounded-3xl p-7 text-white relative overflow-hidden shadow-xl shadow-primary/20 group cursor-pointer hover:shadow-2xl hover:shadow-primary/30 transition-shadow">
                                            {/* Decorative Background Elements */}
                                            <div className="absolute top-0 right-0 -mt-10 -mr-10 size-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                                            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 size-40 bg-black/10 rounded-full blur-2xl"></div>

                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-6">
                                                    <h4 className="font-black text-xl tracking-tight text-white/95">Upcoming Appointment</h4>
                                                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold tracking-widest text-white border border-white/20 animate-pulse uppercase shadow-sm">Live Soon</span>
                                                </div>

                                                <div className="flex items-center gap-4 mb-6 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                                                    <div className="size-16 rounded-full border-[3px] border-white/40 overflow-hidden shadow-inner flex-shrink-0">
                                                        <img className="w-full h-full object-cover" data-alt="Doctor portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2LTfL8vmnxFUqEHMPndVYKPcjEunq9AZV8yexl57tmHbFl-Ey8I7dA4rMvTOiNgn1-5-drx_r21deFRRSZhiegA6ubVf_XAykAQ3jgxLlNCamGFlhXJqvhGCBfti-aae-qQtjq8PMDaR2chCrYkbjdbm0QZKsCSse4-sYQiliBS8VahTvF-nEkMq_3Em4Qb-MOwf5aarHg6xCoY6aWI6piZB3Y2mJYtvP_-gc5hb0YCL1dS3d8BMRBeT2_AjvYjZV9iDcSjPTr-k" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[18px] font-bold text-white leading-tight truncate">Dr. Sarah Miller</p>
                                                        <p className="text-[13px] font-medium text-blue-100 flex items-center gap-1.5 mt-1"><span className="material-symbols-outlined text-[15px]">favorite</span> Cardiologist</p>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center mb-6 border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-white/10 p-2 rounded-lg text-blue-100">
                                                            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                                                        </div>
                                                        <span className="text-[14px] font-bold text-white/90">Oct 26, 2024</span>
                                                    </div>
                                                    <div className="w-px h-8 bg-white/10"></div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-white/10 p-2 rounded-lg text-indigo-100">
                                                            <span className="material-symbols-outlined text-[20px]">schedule</span>
                                                        </div>
                                                        <span className="text-[14px] font-bold text-white/90">10:30 AM</span>
                                                    </div>
                                                </div>

                                                <button className="w-full py-4 bg-white text-indigo-900 rounded-xl text-[14px] font-black tracking-wide hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xl group-hover:-translate-y-1">
                                                    <span className="material-symbols-outlined text-[22px]">video_camera_front</span>
                                                    JOIN VIDEO CALL
                                                </button>
                                            </div>
                                            <span className="material-symbols-outlined absolute -bottom-12 -right-12 text-[180px] text-white/5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700 pointer-events-none">cardiology</span>
                                        </div>
                                    </section>
                                </div>
                            </div>
        </AppLayout>
    );
};

export default MainWellnessDashboard;
