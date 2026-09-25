import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { getPlanDetails, PLANS } from '../utils/entitlements';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan') || PLANS.PLUS;
  const { refreshSubscription } = useSubscription();
  const plan = getPlanDetails(planId);

  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  return (
    <div className="min-h-screen bg-[#F8FAFF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-display flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center space-y-6 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
          <CheckCircle className="w-9 h-9" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1A6FE8] text-[10px] font-extrabold uppercase tracking-wider">
            Subscription Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Welcome to {plan.displayName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Your healthcare subscription is active. All advanced visual diagnostics, reminders, and history persistence have been unlocked.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-4 h-4 text-[#1A6FE8]" />
            <span>Unlocked Privileges:</span>
          </div>
          <ul className="text-slate-600 dark:text-slate-400 space-y-1.5 pl-6 list-disc">
            {plan.features
              .filter((f) => f.included)
              .slice(0, 4)
              .map((f, i) => (
                <li key={i}>{f.text}</li>
              ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/ai-dermatologist"
            className="py-3 px-6 rounded-full bg-[#1A6FE8] hover:bg-[#1558C0] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <span>Try AI Dermatologist</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/dashboard"
            className="py-3 px-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Need to modify settings later? Access them under Manage Subscription.</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
