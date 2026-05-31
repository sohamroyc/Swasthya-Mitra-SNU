import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import VitalsDashboard from '../components/VitalsDashboard';
import ActivitiesDashboard from '../components/ActivitiesDashboard';
import NutritionDashboard from '../components/NutritionDashboard';


const TABS = [
  { id: 'overview',    label: 'Overview',    icon: 'grid_view' },
  { id: 'vitals',      label: 'Vitals',      icon: 'monitor_heart' },
  { id: 'activities',  label: 'Activities',  icon: 'show_chart' },
  { id: 'nutrition',   label: 'Nutrition',   icon: 'nutrition' },

];

const STAT_CARDS = [
  {
    label: 'Heart Rate',
    value: '72',
    unit: 'BPM',
    icon: 'favorite',
    color: 'rose',
    trend: 'trending_down',
    trendText: '-2% from yesterday',
    trendColor: 'text-rose-500',
  },
  {
    label: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    icon: 'blood_pressure',
    color: 'blue',
    trend: 'check_circle',
    trendText: 'Optimal Range',
    trendColor: 'text-emerald-500',
  },
  {
    label: 'Blood Sugar',
    value: '95',
    unit: 'mg/dL',
    icon: 'water_drop',
    color: 'orange',
    trend: 'horizontal_rule',
    trendText: 'Stable',
    trendColor: 'text-orange-400',
  },
];

const AI_TIPS = [
  { icon: 'water_drop', color: 'emerald', title: 'Increase Hydration',  desc: 'Based on your activity, drink 500ml more water today.' },
  { icon: 'bedtime',    color: 'amber',   title: 'Sleep Quality',       desc: 'Heart rate trend suggests you need 30 mins more rest.' },
  { icon: 'directions_run', color: 'blue', title: 'Morning Jog',        desc: 'A 20-min low-intensity jog will help stabilize BP.' },
];

const MyHealthOverview = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('Last 7 Days');

  const isWeekly = timeframe === 'Last 7 Days';

  const weightValue  = isWeekly ? '70.5' : '71.2';
  const weightChange = isWeekly ? '-0.5 kg this week' : '-1.2 kg this month';
  const stepsValue   = isWeekly ? '8,432' : '7,950';
  const stepsChange  = isWeekly ? '+12% vs last week' : '+5% vs last month';

  const weeklyBars  = [45, 65, 55, 90, 60, 35, 50];
  const monthlyBars = [70, 60, 80, 85];
  const bars        = isWeekly ? weeklyBars : monthlyBars;
  const barLabels   = isWeekly
    ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    : ['Week 1','Week 2','Week 3','Week 4'];
  const barTooltips = isWeekly
    ? ['4.2k','6.1k','5.3k','8.4k','5.8k','3.2k','4.7k']
    : ['7.3k avg','6.1k avg','8.4k avg','8.9k avg'];

  const renderOverview = () => (
    <>
      {/* Vital Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-default"
          >
            <div className="flex justify-between items-center mb-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</span>
              <div className={`size-9 rounded-xl bg-${card.color}-50 flex items-center justify-center text-${card.color}-500`}>
                <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">{card.value}</span>
              <span className="text-sm font-bold text-slate-400">{card.unit}</span>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${card.trendColor}`}>
              <span className="material-symbols-outlined text-[14px]">{card.trend}</span>
              {card.trendText}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Weight Management</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-slate-900">
                  {weightValue}
                  <span className="text-sm font-bold text-slate-400 ml-1">kg</span>
                </span>
                <span className="text-xs font-bold text-rose-500">{weightChange}</span>
              </div>
            </div>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="h-40 w-full overflow-visible">
            <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {isWeekly ? (
                <>
                  <path d="M0,90 Q15,40 30,70 T70,50 T110,80 T150,60 T190,100 T230,50 T280,90 T320,40 T360,80 T400,30 V120 H0 Z" fill="url(#wGrad)"/>
                  <path d="M0,90 Q15,40 30,70 T70,50 T110,80 T150,60 T190,100 T230,50 T280,90 T320,40 T360,80 T400,30" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </>
              ) : (
                <>
                  <path d="M0,80 L30,40 L60,90 L100,20 L140,70 L180,40 L220,100 L260,50 L300,90 L350,40 L400,60 V120 H0 Z" fill="url(#wGrad)"/>
                  <path d="M0,80 L30,40 L60,90 L100,20 L140,70 L180,40 L220,100 L260,50 L300,90 L350,40 L400,60" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </>
              )}
            </svg>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-3">
            {barLabels.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Activity Tracking</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-slate-900">{stepsValue}</span>
                <span className="text-sm font-bold text-slate-400">avg steps/day</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
              {stepsChange}
            </span>
          </div>
          <div className="h-40 w-full flex items-end justify-between gap-2">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold pointer-events-none z-10">
                  {barTooltips[i]}
                </div>
                <div
                  className="w-full bg-blue-100 hover:bg-blue-500 rounded-t-lg transition-colors cursor-pointer"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-3">
            {barLabels.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>
      </div>
    </>
  );

  const renderTabContent = () => {
    if (activeTab === 'vitals')     return <VitalsDashboard />;
    if (activeTab === 'activities') return <ActivitiesDashboard />;
    if (activeTab === 'nutrition')  return <NutritionDashboard />;

    return renderOverview();
  };

  return (
    <AppLayout activeTab="my-health">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">My Health Overview</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Real-time medical analysis and wellness management powered by AI.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* ── Left: Tab content ── */}
        <div className="flex-1 min-w-0">
          {/* Horizontal Tab Bar */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 mb-6 shadow-sm overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {renderTabContent()}
        </div>

        {/* ── Right: Insights Sidebar ── */}
        <aside className="w-full xl:w-72 flex flex-col gap-5 shrink-0">
          {/* Health Score */}
          <div className="bg-gradient-to-br from-[#1a56db] to-[#1e3a8a] rounded-2xl p-6 text-white shadow-lg shadow-blue-700/20 flex flex-col items-center text-center">
            <div className="w-full flex justify-between items-center mb-5">
              <h3 className="font-bold text-sm">Health Score</h3>
              <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors" title="About Health Score">
                <span className="material-symbols-outlined text-[16px]">info</span>
              </button>
            </div>
            <div className="relative size-32 mb-5">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none"/>
                <circle
                  cx="50" cy="50" r="42"
                  stroke="white" strokeWidth="8" fill="none"
                  strokeDasharray="264" strokeDashoffset="39.6"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black leading-none">85</span>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5 opacity-80">PERCENT</span>
              </div>
            </div>
            <p className="text-xs font-semibold opacity-90 leading-relaxed">
              Your wellness is <span className="font-black">Excellent</span> this week! 🎉
            </p>
          </div>

          {/* AI Wellness Tips */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-500 text-[18px]">lightbulb</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">AI Wellness Tips</h3>
            </div>
            <div className="space-y-4 mb-5">
              {AI_TIPS.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`size-8 rounded-full bg-${tip.color}-50 dark:bg-${tip.color}-900/20 text-${tip.color}-500 flex items-center justify-center shrink-0 mt-0.5`}>
                    <span className="material-symbols-outlined text-[16px]">{tip.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 mb-0.5">{tip.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/health-reports-analytics"
              className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs py-3 rounded-xl transition-colors text-center block border border-slate-100 dark:border-slate-700"
            >
              See Detailed Plan →
            </Link>
          </div>

          {/* Next Appointment */}
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
            onClick={() => navigate('/first-aid-knowledge-base')}
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">NEXT APPOINTMENT</p>
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-900/50 text-blue-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-0.5">Annual Physical</h4>
                <p className="text-[11px] font-semibold text-slate-500">Oct 24, 10:00 AM</p>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30 p-5">
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-3">Emergency Contact</p>
            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Dr. Sarah Miller</p>
            <p className="text-xs text-slate-500 mb-4 mt-1">+1 (555) 000-1234</p>
            <a
              href="tel:+15550001234"
              className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-md shadow-red-500/20 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              Call Now
            </a>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default MyHealthOverview;
