import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { PLANS, getPlanDetails } from '../utils/entitlements';
import SubscriptionBadge from '../components/SubscriptionBadge';
import UpgradeModal from '../components/UpgradeModal';
import FamilyManager from '../components/FamilyManager';
import {
  CreditCard,
  Calendar,
  ShieldCheck,
  Sparkles,
  Users,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

const ManageSubscription = () => {
  const { user } = useAuth();
  const {
    subscription,
    plan,
    status,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    cancelSubscription,
    refreshSubscription,
  } = useSubscription();

  const navigate = useNavigate();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [notification, setNotification] = useState(null);

  const planDetails = getPlanDetails(plan);

  const handleCancel = async () => {
    if (
      !window.confirm(
        'Are you sure you want to cancel your plan renewal? You will retain all premium access until the end of your current billing period.'
      )
    ) {
      return;
    }

    setIsCanceling(true);
    try {
      await cancelSubscription();
      setNotification({
        type: 'info',
        message: 'Your subscription will not renew after the current billing cycle.',
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to cancel subscription.',
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Active (No expiration)';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AppLayout activeTab="subscription">
      <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-4 px-2 sm:px-4">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <Link to="/dashboard" className="hover:text-slate-600 dark:hover:text-slate-300">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-[#0057B8] dark:text-[#00D4FF]">Subscription & Billing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Manage Your Care Plan
            </h1>
          </div>

          <button
            onClick={refreshSubscription}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#1A6FE8] px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Status</span>
          </button>
        </div>

        {/* Notifications */}
        {notification && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 ${
              notification.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/30 text-red-600 border border-red-200 dark:border-red-900/50'
                : 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Current Plan Overview Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {planDetails.displayName}
                </h2>
                <SubscriptionBadge plan={plan} status={status} size="md" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                {planDetails.description}
              </p>
            </div>

            <div className="text-right">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {planDetails.priceDisplay}
              </span>
              <span className="text-xs text-slate-400 font-semibold ml-1">
                {planDetails.period}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Next Renewal / Cycle End</span>
              </p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {formatDate(currentPeriodEnd)}
              </p>
              {cancelAtPeriodEnd && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                  <AlertTriangle className="w-3 h-3" /> Ends at cycle end
                </span>
              )}
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>Billing Provider</span>
              </p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">
                {subscription?.provider || 'Standard System'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Secure clinical billing</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Holder</span>
              </p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {user?.email || 'Authenticated User'}
              </p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Verified Medical ID</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="py-2.5 px-6 rounded-full bg-[#1A6FE8] hover:bg-[#1558C0] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/10 active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{plan === PLANS.FREE ? 'Upgrade to Plus or Family' : 'Change Plan'}</span>
              </button>

              <Link
                to="/pricing"
                className="py-2.5 px-5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
              >
                View Full Pricing
              </Link>
            </div>

            {plan !== PLANS.FREE && !cancelAtPeriodEnd && (
              <button
                onClick={handleCancel}
                disabled={isCanceling}
                className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 hover:underline px-3 py-1.5"
              >
                {isCanceling ? 'Processing...' : 'Cancel Subscription'}
              </button>
            )}
          </div>
        </div>

        {/* Family Management Section (If on Family Plan) */}
        {plan === PLANS.FAMILY ? (
          <FamilyManager />
        ) : (
          /* Family Plan Upgrade Teaser */
          <div className="rounded-3xl border border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-r from-indigo-50/50 to-blue-50/40 dark:from-indigo-950/20 dark:to-blue-950/20 p-6 md:p-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Looking after aging parents or family members?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                  The Swasthya Mitra Family Plan includes up to 5 linked profiles, shared pill schedules, and caregiver alerts for just ₹199/month.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsUpgradeModalOpen(true);
              }}
              className="py-2.5 px-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 active:scale-95"
            >
              <span>Explore Family Care</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Subscriptions auto-renew every 30 days unless canceled. Core emergency features, government scheme search, and symptom consultations are always 100% free.
          </span>
        </div>
      </div>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        defaultTargetPlan={plan === PLANS.FREE ? PLANS.PLUS : PLANS.FAMILY}
      />
    </AppLayout>
  );
};

export default ManageSubscription;
