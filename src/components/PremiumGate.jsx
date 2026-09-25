import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { FEATURES, PLANS } from '../utils/entitlements';
import UpgradeModal from './UpgradeModal';
import AppLayout from './AppLayout';
import { Link } from 'react-router-dom';

const FEATURE_META = {
  [FEATURES.AI_DERMATOLOGIST]: {
    name: 'AI Dermatologist',
    headline: 'Unlock advanced skin analysis with Swasthya Mitra Plus.',
    subheadline:
      'Upload high-resolution skin lesions, rashes, and photos for real-time visual assessment, clinical condition matching, and specialist triage guidance.',
    requiredPlan: PLANS.PLUS,
    priceCta: 'Upgrade to Plus — ₹99/month',
    activeTab: 'dermatologist',
    highlights: [
      'Visual condition recognition for acne, eczema, nevus & rashes',
      'Instant clinical confidence score & risk categorization',
      'Follow-up dermatologist consultation recommendations',
      'Completely confidential with encrypted photo processing',
    ],
  },
  [FEATURES.XRAY_ANALYSIS]: {
    name: 'AI Chest X-Ray Analyser',
    headline: 'Clinical radiology insights tailored for healthcare institutions.',
    subheadline:
      'Pneumonia detection, opacity heatmaps, and structured radiological reporting designed for Primary Health Centers and clinics.',
    requiredPlan: PLANS.INSTITUTIONAL,
    priceCta: 'Contact Institutional Desk',
    activeTab: 'xray',
    isEnterprise: true,
    highlights: [
      'Automated chest radiograph pneumonia screening',
      'ABDM compliant data and HL7/FHIR export readiness',
      'Aggregate clinic level health monitoring dashboards',
    ],
  },
};

const PremiumGate = ({ feature, children, wrapInLayout = true }) => {
  const { hasAccess, loading } = useSubscription();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If subscription data is loading, we can show a minimal skeleton or let it pass smoothly
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF] dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#1A6FE8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Checking health access privileges...</p>
        </div>
      </div>
    );
  }

  // Access Granted
  if (hasAccess(feature)) {
    return children;
  }

  // Access Gated: Render elegant upgrade card matching Swasthya Mitra design system
  const meta = FEATURE_META[feature] || {
    name: 'Advanced Care Module',
    headline: 'Unlock advanced health tools with Swasthya Mitra Plus.',
    subheadline: 'Upgrade your subscription to unlock this premium clinical feature.',
    requiredPlan: PLANS.PLUS,
    priceCta: 'Upgrade to Plus — ₹99/month',
    activeTab: 'dashboard',
    highlights: ['Comprehensive AI diagnostics', 'Priority triage', 'Continuous records sync'],
  };

  const content = (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4">
      {/* Premium Upgrade Container */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-blue-500/5 p-8 md:p-12">
        {/* Subtle decorative background gradient */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-400/10 blur-3xl pointer-events-none" />

        {/* Top Badge */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1A6FE8] dark:text-[#4F92F8] text-xs font-bold uppercase tracking-wider border border-blue-200/50 dark:border-blue-800/50">
            <Lock className="w-3.5 h-3.5" />
            <span>Plus Feature</span>
          </span>

          <span className="text-xs font-semibold text-slate-400">
            Swasthya Mitra Healthcare
          </span>
        </div>

        {/* Main Title & Subtitle */}
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {meta.name}
          </h1>
          <p className="text-lg font-bold text-[#0057B8] dark:text-[#00D4FF] mt-2 leading-snug">
            {meta.headline}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            {meta.subheadline}
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {meta.highlights.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Trust Note */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            <strong className="text-slate-800 dark:text-slate-200">Patient-First Guarantee:</strong> Essential emergency tools, local clinic discovery, and government scheme eligibility are always 100% free.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {meta.isEnterprise ? (
            <Link
              to="/pricing"
              className="py-3.5 px-6 rounded-full bg-slate-900 dark:bg-slate-800 text-cyan-400 text-xs font-bold shadow-md hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
            >
              <span>{meta.priceCta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-3.5 px-8 rounded-full bg-[#1A6FE8] hover:bg-[#1558C0] text-white text-xs md:text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 transform"
            >
              <Sparkles className="w-4 h-4" />
              <span>{meta.priceCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <Link
            to="/pricing"
            className="py-3.5 px-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-750 transition-all active:scale-95"
          >
            Compare All Plans
          </Link>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTargetPlan={meta.requiredPlan || PLANS.PLUS}
        featureName={meta.name}
      />
    </div>
  );

  if (wrapInLayout) {
    return <AppLayout activeTab={meta.activeTab}>{content}</AppLayout>;
  }

  return content;
};

export default PremiumGate;
