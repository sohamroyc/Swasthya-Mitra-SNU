import React, { useState, useEffect } from 'react';

const VitalsDashboard = () => {
    const [heartRate, setHeartRate] = useState(72);
    const [spo2, setSpo2] = useState(98);
    const [temp, setTemp] = useState(98.6);
    const [history, setHistory] = useState([68, 70, 75, 72, 73, 71, 74, 76, 75, 72, 71, 72, 73, 75, 74, 72, 71, 73]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate live reading changes
            const newHR = Math.floor(70 + Math.random() * 8); // 70-78
            setHeartRate(newHR);
            setHistory(prev => {
                const newHistory = [...prev.slice(1), newHR];
                return newHistory;
            });

            if (Math.random() > 0.8) {
                setSpo2(Math.floor(97 + Math.random() * 3)); // 97-99
            }
            if (Math.random() > 0.9) {
                setTemp(+(98.4 + Math.random() * 0.4).toFixed(1)); // 98.4-98.8
            }
        }, 2000); // update every 2s

        return () => clearInterval(interval);
    }, []);

    // Generate path for SVG based on live history
    const yMax = 100;
    const yMin = 60;
    const pathD = history.map((val, i) => {
        const x = (i / (history.length - 1)) * 800;
        const y = 150 - ((val - yMin) / (yMax - yMin)) * 150;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vitals Monitoring</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Live simulation of your crucial health metrics.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Data
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Heart Rate Trends - Live */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-1 md:col-span-2">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-slate-900 text-base mb-1">Live Heart Rate</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black tracking-tight">{heartRate} <span className="text-sm font-bold text-slate-400">BPM</span></span>
                                <span className={`text-xs font-black ${heartRate > 75 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                    {heartRate > 75 ? 'Slightly Elevated' : 'Resting Avg'}
                                </span>
                            </div>
                        </div>
                        <div className="text-rose-500 bg-rose-50 p-3 rounded-xl">
                            <span className="material-symbols-outlined text-[24px] animate-pulse">favorite</span>
                        </div>
                    </div>

                    <div className="h-48 w-full pt-4 flex items-end relative overflow-hidden">
                        {/* Grid lines */}
                        <div className="absolute inset-x-0 bottom-0 border-b border-slate-100 border-dashed"></div>
                        <div className="absolute inset-x-0 top-1/2 border-b border-slate-100 border-dashed"></div>
                        <div className="absolute inset-x-0 top-0 border-b border-slate-100 border-dashed"></div>

                        <svg viewBox="0 0 800 150" className="w-full h-full preserve-aspect-ratio-none overflow-visible relative z-10">
                            {/* Smooth path generation */}
                            <path
                                d={pathD}
                                fill="none"
                                stroke="#f43f5e"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transition-all duration-1000 ease-linear"
                            />
                        </svg>
                    </div>
                    <div className="flex justify-between text-[10px] font-extrabold text-slate-300 uppercase tracking-widest mt-4">
                        <span>-60s</span><span>-45s</span><span>-30s</span><span>-15s</span><span>Now</span>
                    </div>
                </div>

                {/* Blood Oxygen */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-slate-500">Blood Oxygen (SpO2)</span>
                        <div className="text-blue-500 bg-blue-50 p-2 rounded-xl">
                            <span className="material-symbols-outlined text-[20px]">air</span>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-4xl font-black text-slate-900 tracking-tight transition-all duration-500">{spo2}</span>
                        <span className="text-sm font-bold text-slate-400">%</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-black">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Optimal Range (95-100%)
                    </div>
                </div>

                {/* Body Temperature */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-slate-500">Body Temperature</span>
                        <div className="text-amber-500 bg-amber-50 p-2 rounded-xl">
                            <span className="material-symbols-outlined text-[20px]">thermometer</span>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-4xl font-black text-slate-900 tracking-tight transition-all duration-500">{temp}</span>
                        <span className="text-sm font-bold text-slate-400">°F</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-black">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Normal (97.8-99.1°F)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VitalsDashboard;
