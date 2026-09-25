import React, { useState } from 'react';
import { X, Sparkles, Check, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { PLANS, PLANS_CONFIG } from '../utils/entitlements';
import { paymentService } from '../services/paymentService';
import { useNavigate } from 'react-router-dom';

const UpgradeModal = ({ isOpen, onClose, defaultTargetPlan = PLANS.PLUS, featureName = null }) => {
  const { user } = useAuth();
  const { plan: currentPlan, refreshSubscription } = useSubscription();
  const navigate = useNavigate();
  const [selectedPlanId, setSelectedPlanId] = useState(defaultTargetPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.createCheckoutSession({
        planId: selectedPlanId,
        userEmail: user.email,
        billingCycle: 'monthly',
      });

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else if (result.redirectUrl) {
        await refreshSubscription();
        onClose();
        navigate(result.redirectUrl);
      }
    } catch (err) {
      setError(err.message || 'Failed to initiate plan upgrade.');
    } finally {
      setLoading(false);
    }
  };

  const plusPlan = PLANS_CONFIG[PLANS.PLUS];
  const familyPlan = PLANS_CONFIG[PLANS.FAMILY];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#1A6FE8] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Unlock Advanced Care
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {featureName
                ? `Upgrade to access ${featureName} and deeper diagnostics.`
                : 'Choose the plan that best supports your wellness journey.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="my-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Plan Selectors */}
        <div className="space-y-3 my-6">
          {/* Plus Plan Card */}
          <div
            onClick={() => setSelectedPlanId(PLANS.PLUS)}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedPlanId === PLANS.PLUS
                ? 'border-[#1A6FE8] bg-blue-50/40 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Swasthya Plus
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                  Recommended
                </span>
              </div>
              <span className="text-base font-black text-slate-900 dark:text-white">
                ₹99<span className="text-xs font-normal text-slate-500">/mo</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Unlimited AI Dermatologist scans, medication alerts, and persistent health history.
            </p>
          </div>

          {/* Family Plan Card */}
          <div
            onClick={() => setSelectedPlanId(PLANS.FAMILY)}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedPlanId === PLANS.FAMILY
                ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Swasthya Family
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                  Up to 5 Profiles
                </span>
              </div>
              <span className="text-base font-black text-slate-900 dark:text-white">
                ₹199<span className="text-xs font-normal text-slate-500">/mo</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Everything in Plus plus 5 linked family member profiles and shared pill schedules.
            </p>
          </div>
        </div>

        {/* Benefits Checklist */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Cancel anytime directly from your dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Essential emergency tools & schemes remain free forever</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              navigate('/pricing');
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 px-2"
          >
            Compare all plans
          </button>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex-1 py-3 px-6 rounded-full bg-[#1A6FE8] hover:bg-[#1558C0] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>
              {loading
                ? 'Processing...'
                : selectedPlanId === PLANS.PLUS
                ? 'Upgrade to Plus — ₹99/month'
                : 'Upgrade to Family — ₹199/month'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
