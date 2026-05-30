import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

const HealthReportsAnalytics = () => {
    const [filter, setFilter] = useState('7'); // days: 7,30,180,custom
    const [metrics, setMetrics] = useState({
        bp: { systolic: 118, diastolic: 79, change: -2 },
        bmi: { value: 22.5, status: 'Healthy' },
        glucose: { value: 94, change: 4 }
    });
    const handleShare = () => {
        navigator.clipboard.writeText('Check out my health report on Swasthya Mitra!');
        alert('Report link copied to clipboard!');
    };
    const handleGeneratePDF = () => {
        // Placeholder: In real app, integrate with PDF library
        alert('PDF generation is not implemented in this demo.');
    };
    return (
        <AppLayout activeTab="my-health">
            <div className="max-w-[1200px] w-full px-6 py-8">
                                {/* Page Title & Actions */}
                                <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">Health Reports &amp; Analytics</h1>
                                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Deep-dive analysis into your physiological metrics with AI-driven summaries.</p>
                                        {/* Display dynamic metrics */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                                                <p className="text-sm font-medium text-slate-500">Avg Blood Pressure</p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.bp.systolic}/{metrics.bp.diastolic}<span className="text-sm font-normal text-slate-400"> mmHg</span></p>
                                                <p className="text-xs text-emerald-500 flex items-center"><span className="material-symbols-outlined text-sm">arrow_downward</span> {metrics.bp.change}% from last month</p>
                                            </div>
                                            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                                                <p className="text-sm font-medium text-slate-500">BMI Index</p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.bmi.value}<span className="text-sm font-normal text-slate-400"> {metrics.bmi.status}</span></p>
                                                <p className="text-xs text-slate-400 flex items-center"><span className="material-symbols-outlined text-sm">remove</span> Stable</p>
                                            </div>
                                            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                                                <p className="text-sm font-medium text-slate-500">Avg Glucose</p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.glucose.value}<span className="text-sm font-normal text-slate-400"> mg/dL</span></p>
                                                <p className="text-xs text-rose-500 flex items-center"><span className="material-symbols-outlined text-sm">arrow_upward</span> +{metrics.glucose.change}% from last month</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700">
                                            <span className="material-symbols-outlined">share</span>
                                            Share with Doctor
                                        </button>
                                        <button onClick={handleGeneratePDF} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20">
                                            <span className="material-symbols-outlined">picture_as_pdf</span>
                                            Generate PDF Report
                                        </button>
                                    </div>
                                </div>
                                {/* Filters Bar */}
                                <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
                                    <button onClick={() => setFilter('7')} className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg ${filter === '7' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'} px-4 text-sm font-semibold`}
                                    >Last 7 Days<span className="material-symbols-outlined text-[18px]">expand_more</span></button>
                                    <button onClick={() => setFilter('30')} className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg ${filter === '30' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'} px-4 text-sm font-medium`}
                                    >Last 30 Days<span className="material-symbols-outlined text-[18px]">expand_more</span></button>
                                    <button onClick={() => setFilter('180')} className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg ${filter === '180' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'} px-4 text-sm font-medium`}
                                    >Last 6 Months<span className="material-symbols-outlined text-[18px]">expand_more</span></button>
                                    <button onClick={() => setFilter('custom')} className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg ${filter === 'custom' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'} px-4 text-sm font-medium`}
                                    >Custom Range<span className="material-symbols-outlined text-[18px]">calendar_today</span></button>
                                </div>
                                {/* Metric Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg Blood Pressure</p>
                                            <span className="material-symbols-outlined text-primary">blood_pressure</span>
                                        </div>
                                        <p className="text-slate-900 dark:text-white text-3xl font-bold">118/79 <span className="text-sm font-normal text-slate-400">mmHg</span></p>
                                        <div className="flex items-center gap-1 text-emerald-500 font-semibold text-sm">
                                            <span className="material-symbols-outlined text-sm">arrow_downward</span>
                                            <span>-2% from last month</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">BMI Index</p>
                                            <span className="material-symbols-outlined text-primary">scale</span>
                                        </div>
                                        <p className="text-slate-900 dark:text-white text-3xl font-bold">22.5 <span className="text-sm font-normal text-slate-400">Healthy</span></p>
                                        <div className="flex items-center gap-1 text-slate-400 font-semibold text-sm">
                                            <span className="material-symbols-outlined text-sm">remove</span>
                                            <span>Stable</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg Glucose</p>
                                            <span className="material-symbols-outlined text-primary">glucose</span>
                                        </div>
                                        <p className="text-slate-900 dark:text-white text-3xl font-bold">94 <span className="text-sm font-normal text-slate-400">mg/dL</span></p>
                                        <div className="flex items-center gap-1 text-rose-500 font-semibold text-sm">
                                            <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                            <span>+4% from last month</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Main Analytics Charts Area */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                    {/* Blood Pressure Line Chart Card */}
                                    <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <h3 className="text-slate-900 dark:text-white font-bold text-lg">Blood Pressure Trend</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs">Continuous monitoring data</p>
                                            </div>
                                            <button className="text-slate-400 hover:text-primary">
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </div>
                                        <div className="flex min-h-[220px] flex-col gap-6 py-4">
                                            <svg fill="none" height="180" preserveaspectratio="none" viewbox="0 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0 109C18.1 109 18.1 21 36.3 21C54.4 21 54.4 41 72.6 41C90.7 41 90.7 93 108.9 93C127 93 127 33 145.2 33C163.3 33 163.3 101 181.5 101C199.6 101 199.6 61 217.8 61C236 61 236 45 254.1 45C272.3 45 272.3 121 290.4 121C308.6 121 308.6 149 326.7 149C344.9 149 344.9 1 363.1 1C381.2 1 381.2 81 399.4 81C417.5 81 417.5 129 435.7 129C453.8 129 453.8 25 472 25V150H0V109Z" fill="url(#bp_gradient)"></path>
                                                <path d="M0 109C18.1 109 18.1 21 36.3 21C54.4 21 54.4 41 72.6 41C90.7 41 90.7 93 108.9 93C127 93 127 33 145.2 33C163.3 33 163.3 101 181.5 101C199.6 101 199.6 61 217.8 61C236 61 236 45 254.1 45C272.3 45 272.3 121 290.4 121C308.6 121 308.6 149 326.7 149C344.9 149 344.9 1 363.1 1C381.2 1 381.2 81 399.4 81C417.5 81 417.5 129 435.7 129C453.8 129 453.8 25 472 25" stroke="#0f6df0" strokeLinecap="round" strokeWidth="4"></path>
                                                <defs>
                                                    <lineargradient gradientunits="userSpaceOnUse" id="bp_gradient" x1="0" x2="0" y1="0" y2="150">
                                                        <stop stopColor="#0f6df0" stopOpacity="0.2"></stop>
                                                        <stop offset="1" stopColor="#0f6df0" stopOpacity="0"></stop>
                                                    </lineargradient>
                                                </defs>
                                            </svg>
                                            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-4 px-2">
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Mon</p>
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Tue</p>
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Wed</p>
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Thu</p>
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Fri</p>
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sat</p>
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sun</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Glucose Bar Chart Card */}
                                    <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <h3 className="text-slate-900 dark:text-white font-bold text-lg">Glucose Distribution</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs">Fasting and post-meal levels</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Normal</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Variation</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex min-h-[220px] items-end justify-around px-3 gap-3">
                                            <div className="flex flex-col items-center gap-3 w-full group">
                                                <div className="relative w-full">
                                                    <div className="bg-slate-100 dark:bg-slate-800 rounded-t-lg w-full h-[160px] absolute bottom-0 opacity-20"></div>
                                                    <div className="bg-primary rounded-t-lg w-full h-[120px] relative transition-all group-hover:bg-primary/80"></div>
                                                </div>
                                                <p className="text-slate-400 text-xs font-bold uppercase">Jan</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-3 w-full group">
                                                <div className="relative w-full">
                                                    <div className="bg-slate-100 dark:bg-slate-800 rounded-t-lg w-full h-[160px] absolute bottom-0 opacity-20"></div>
                                                    <div className="bg-primary rounded-t-lg w-full h-[140px] relative transition-all group-hover:bg-primary/80"></div>
                                                </div>
                                                <p className="text-slate-400 text-xs font-bold uppercase">Feb</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-3 w-full group">
                                                <div className="relative w-full">
                                                    <div className="bg-slate-100 dark:bg-slate-800 rounded-t-lg w-full h-[160px] absolute bottom-0 opacity-20"></div>
                                                    <div className="bg-primary rounded-t-lg w-full h-[80px] relative transition-all group-hover:bg-primary/80"></div>
                                                </div>
                                                <p className="text-slate-400 text-xs font-bold uppercase">Mar</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-3 w-full group">
                                                <div className="relative w-full">
                                                    <div className="bg-slate-100 dark:bg-slate-800 rounded-t-lg w-full h-[160px] absolute bottom-0 opacity-20"></div>
                                                    <div className="bg-primary rounded-t-lg w-full h-[155px] relative transition-all group-hover:bg-primary/80"></div>
                                                </div>
                                                <p className="text-slate-400 text-xs font-bold uppercase">Apr</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-3 w-full group">
                                                <div className="relative w-full">
                                                    <div className="bg-slate-100 dark:bg-slate-800 rounded-t-lg w-full h-[160px] absolute bottom-0 opacity-20"></div>
                                                    <div className="bg-primary rounded-t-lg w-full h-[95px] relative transition-all group-hover:bg-primary/80"></div>
                                                </div>
                                                <p className="text-slate-400 text-xs font-bold uppercase">May</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-3 w-full group">
                                                <div className="relative w-full">
                                                    <div className="bg-slate-100 dark:bg-slate-800 rounded-t-lg w-full h-[160px] absolute bottom-0 opacity-20"></div>
                                                    <div className="bg-primary rounded-t-lg w-full h-[110px] relative transition-all group-hover:bg-primary/80"></div>
                                                </div>
                                                <p className="text-slate-400 text-xs font-bold uppercase">Jun</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* AI Insights & Wellness Analysis Section */}
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    <div className="xl:col-span-2 flex flex-col gap-6 rounded-xl p-8 bg-primary/10 border border-primary/20">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary rounded-lg text-white">
                                                <span className="material-symbols-outlined">psychology</span>
                                            </div>
                                            <h3 className="text-slate-900 dark:text-white font-bold text-xl">AI Wellness Insights</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex gap-4 p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-primary/10">
                                                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                                                <div>
                                                    <p className="text-slate-900 dark:text-white font-semibold">Healthy Trend Detected</p>
                                                    <p className="text-slate-600 dark:text-slate-400 text-sm">Your resting heart rate has stabilized at 68 bpm, showing a positive response to your new morning routine.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-primary/10">
                                                <span className="material-symbols-outlined text-amber-500 mt-1">warning</span>
                                                <div>
                                                    <p className="text-slate-900 dark:text-white font-semibold">Minor Glucose Fluctuation</p>
                                                    <p className="text-slate-600 dark:text-slate-400 text-sm">Recent spikes observed after 8 PM. Consider tracking late-night sodium or carbohydrate intake for more precision.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="w-full py-3 bg-white dark:bg-slate-900 text-primary border border-primary/30 rounded-lg font-bold text-sm hover:bg-primary hover:text-white transition-all">
                                            View Full AI Recommendation Set
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-6 rounded-xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">Top Risk Factors</h3>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm font-medium text-slate-500">Sleep Quality</span>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">85%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                                    <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm font-medium text-slate-500">Physical Activity</span>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">62%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                                    <div className="bg-primary h-2 rounded-full" style={{ width: '62%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm font-medium text-slate-500">Stress Levels</span>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">40%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                            <p className="text-slate-500 dark:text-slate-400 text-xs italic">Analytics are updated every 4 hours based on your connected wearable devices.</p>
                                        </div>
                                    </div>
                                </div>
            </div>
        </AppLayout>
    );
};

export default HealthReportsAnalytics;
