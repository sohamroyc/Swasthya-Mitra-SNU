import React from 'react';
import { Check, X, Sparkles, Users, Building, ShieldCheck, ArrowRight } from 'lucide-react';
import { PLANS } from '../utils/entitlements';

const PricingCard = ({
  plan,
  currentPlan = PLANS.FREE,
  billingCycle = 'monthly',
  onSelect,
  isProcessing = false,
}) => {
  const isCurrent = currentPlan?.toLowerCase() === plan.id.toLowerCase();
  const isHighlight = plan.highlight;
  const isInstitutional = plan.isEnterprise || plan.id === PLANS.INSTITUTIONAL;

  const displayPrice = billingCycle === 'yearly' && plan.yearlyDisplay ? plan.yearlyDisplay : plan.priceDisplay;
  const displayPeriod = billingCycle === 'yearly' && plan.yearlyDisplay ? '' : plan.period;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl p-6 md:p-8 transition-all duration-300 ${
        isHighlight
          ? 'bg-white dark:bg-slate-900 border-2 border-[#1A6FE8] shadow-xl shadow-blue-500/10 scale-[1.02] z-10'
          : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Highlight Header Badge */}
      {isHighlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#0057B8] to-[#00D4FF] text-white text-xs font-black uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            {plan.badgeText || 'Most Popular'}
          </span>
        </div>
      )}

      {/* Top Details */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {plan.id === PLANS.FREE && <ShieldCheck className="w-5 h-5 text-slate-500" />}
            {plan.id === PLANS.PLUS && <Sparkles className="w-5 h-5 text-[#1A6FE8]" />}
            {plan.id === PLANS.FAMILY && <Users className="w-5 h-5 text-indigo-500" />}
            {plan.id === PLANS.INSTITUTIONAL && <Building className="w-5 h-5 text-cyan-500" />}
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {plan.displayName}
            </h3>
          </div>
          {isCurrent && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
              Active Plan
            </span>
          )}
        </div>

        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 min-h-[36px] mb-6">
          {plan.description}
        </p>

        {/* Price Section */}
        <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {displayPrice}
            </span>
            {displayPeriod && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {displayPeriod}
              </span>
            )}
          </div>
          {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              Billed annually • Save 16%
            </p>
          )}
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-8">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Included in {plan.name}
          </p>
          <ul className="space-y-2.5">
            {plan.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs">
                {feat.included ? (
                  <div className="h-4 w-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 stroke-[2]" />
                  </div>
                )}
                <span
                  className={`leading-relaxed ${
                    feat.included
                      ? feat.bold
                        ? 'font-bold text-slate-900 dark:text-white'
                        : 'font-medium text-slate-700 dark:text-slate-300'
                      : 'text-slate-400 dark:text-slate-500 line-through'
                  }`}
                >
                  {feat.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-auto">
        {isCurrent ? (
          <button
            disabled
            className="w-full py-3 px-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider cursor-default border border-slate-200 dark:border-slate-700"
          >
            Current Plan
          </button>
        ) : isInstitutional ? (
          <button
            onClick={() => onSelect(plan)}
            className="w-full py-3 px-4 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-400 text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Talk to Our Team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => onSelect(plan)}
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${
              isHighlight
                ? 'bg-[#1A6FE8] hover:bg-[#1558C0] text-white shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>{isProcessing ? 'Processing...' : plan.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
