import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const CheckoutCancel = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-display flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center space-y-5 animate-fade-in">
        <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
          <Shield className="w-7 h-7 text-[#0057B8]" />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Checkout Incomplete
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            No payment was charged. You remain on your current Swasthya Mitra plan with full access to all essential free features.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/pricing"
            className="py-2.5 px-6 rounded-full bg-[#1A6FE8] hover:bg-[#1558C0] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Return to Pricing</span>
          </Link>

          <Link
            to="/dashboard"
            className="py-2.5 px-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancel;
