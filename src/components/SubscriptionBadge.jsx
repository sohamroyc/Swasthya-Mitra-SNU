import React from 'react';
import { Sparkles, Users, Building, Shield } from 'lucide-react';
import { PLANS } from '../utils/entitlements';

const SubscriptionBadge = ({ plan = PLANS.FREE, status = 'active', size = 'sm', className = '' }) => {
  const normalized = (plan || PLANS.FREE).toLowerCase();

  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-0.5 font-bold',
    md: 'text-xs px-3 py-1 font-extrabold',
    lg: 'text-sm px-4 py-1.5 font-black',
  };

  const currentSize = sizeClasses[size] || sizeClasses.sm;

  if (normalized === PLANS.PLUS) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm shadow-blue-500/20 uppercase tracking-wider ${currentSize} ${className}`}
      >
        <Sparkles className="w-3 h-3" />
        <span>PLUS</span>
        {status === 'active' && <span className="opacity-90 font-semibold">• Active</span>}
      </span>
    );
  }

  if (normalized === PLANS.FAMILY) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 uppercase tracking-wider ${currentSize} ${className}`}
      >
        <Users className="w-3 h-3" />
        <span>FAMILY</span>
        {status === 'active' && <span className="opacity-90 font-semibold">• Active</span>}
      </span>
    );
  }

  if (normalized === PLANS.INSTITUTIONAL) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-slate-900 dark:bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-sm uppercase tracking-wider ${currentSize} ${className}`}
      >
        <Building className="w-3 h-3" />
        <span>INSTITUTIONAL</span>
      </span>
    );
  }

  // Free default
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase tracking-wider ${currentSize} ${className}`}
    >
      <Shield className="w-3 h-3 text-[#0057B8]" />
      <span>FREE PLAN</span>
    </span>
  );
};

export default SubscriptionBadge;
