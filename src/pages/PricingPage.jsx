import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { PLANS, PLANS_CONFIG } from '../utils/entitlements';
import PricingCard from '../components/PricingCard';
import UpgradeModal from '../components/UpgradeModal';
import Footer from '../components/Footer';
import {
  ShieldCheck,
  Sparkles,
  Users,
  Building,
  Check,
  X,
  HelpCircle,
  ArrowRight,
  Mail,
  ChevronDown,
  PhoneCall,
  HeartPulse,
} from 'lucide-react';

const COMPARISON_ROWS = [
  {
    category: 'Core Clinical & Emergency',
    items: [
      { name: 'AI Symptom Checker', free: true, plus: true, family: true, institutional: true },
      { name: 'Government Health Scheme Finder', free: true, plus: true, family: true, institutional: true },
      { name: 'Emergency Clinic & Hospital Locator', free: true, plus: true, family: true, institutional: true },
      { name: 'Basic Explainable AI Guidance', free: true, plus: true, family: true, institutional: true },
      { name: 'SOS One-Tap Emergency Dispatch', free: true, plus: true, family: true, institutional: true },
    ],
  },
  {
    category: 'Advanced Visual Diagnostics & Habits',
    items: [
      { name: 'AI Dermatologist (Skin lesions & rashes)', free: false, plus: true, family: true, institutional: true },
      { name: 'Personalized Medication Alerts & Refills', free: false, plus: true, family: true, institutional: true },
      { name: 'Continuous Health History & Memory', free: false, plus: true, family: true, institutional: true },
      { name: 'Priority AI Medical Triage Processing', free: false, plus: true, family: true, institutional: true },
    ],
  },
  {
    category: 'Household & Family Care',
    items: [
      { name: 'Linked Family Profiles', free: '1 profile', plus: '1 profile', family: 'Up to 5 profiles', institutional: 'Multi-user' },
      { name: 'Shared Household Medication Schedule', free: false, plus: false, family: true, institutional: true },
      { name: 'Caregiver Alerts & Emergency Sync', free: false, plus: false, family: true, institutional: true },
    ],
  },
  {
    category: 'Institutional & Public Health Solutions',
    items: [
      { name: 'AI Chest X-Ray Analyser (Pneumonia Detection)', free: false, plus: false, family: false, institutional: true },
      { name: 'Anonymized Epidemiological Analytics', free: false, plus: false, family: false, institutional: true },
      { name: 'ABDM-Aligned Integration & FHIR Export', free: false, plus: false, family: false, institutional: true },
      { name: 'Dedicated PHC Offline Hardware Deployment', free: false, plus: false, family: false, institutional: true },
    ],
  },
];

const FAQS = [
  {
    q: 'Will essential health guidance and emergency services always remain free?',
    a: 'Yes, absolutely. The AI Symptom Checker, Government Scheme eligibility finder, Emergency Clinic locator, and SOS tools are public health essentials and will always remain 100% free with zero paywalls.',
  },
  {
    q: 'Can I cancel or switch my plan at any time?',
    a: 'Yes. You can upgrade, downgrade, or cancel your subscription anytime directly from your account settings with a single click. If you cancel, you will maintain access until the end of your current billing period.',
  },
  {
    q: 'How does the Family Plan (5 profiles) work?',
    a: 'The Family Plan allows the primary account holder to add up to 4 additional family members (children, spouse, aging parents). Each member maintains their own health notes and medication reminders while sharing a unified household wellness overview.',
  },
  {
    q: 'Is my personal health data kept private and secure?',
    a: 'Swasthya Mitra is engineered with a strict privacy-first architecture. Your clinical inputs and images are never sold or used for commercial advertising. Data is encrypted in transit and at rest.',
  },
  {
    q: 'How can PHCs, NGOs, or State Health Departments onboard the Institutional tier?',
    a: 'Institutions can get in touch through our institutional desk. We provide customized on-premise or cloud deployments with ABDM compliance, X-ray triage, and regional health analytics.',
  },
];

const PricingPage = () => {
  const { user } = useAuth();
  const { plan: currentPlan } = useSubscription();
  const navigate = useNavigate();

  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [institutionalInquirySent, setInstitutionalInquirySent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSelectPlan = (plan) => {
    if (plan.id === PLANS.INSTITUTIONAL) {
      const contactSection = document.getElementById('institutional-section');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!user) {
      navigate('/login?redirect=/pricing');
      return;
    }

    setSelectedPlanForModal(plan.id);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-display flex flex-col">
      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-10 w-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-xs flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-xl tracking-tight leading-none">
            <span className="text-[#0057B8] dark:text-white">Swasthya</span>
            <span className="bg-gradient-to-r from-[#0057B8] to-[#00D4FF] dark:from-white dark:to-[#00D4FF] bg-clip-text text-transparent ml-1">
              Mitra
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#1A6FE8] px-3 py-1.5 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/subscription"
                className="text-xs font-bold px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Manage Subscription
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/create-account"
                className="text-xs font-bold px-4 py-2 rounded-full bg-[#1A6FE8] hover:bg-[#1558C0] text-white shadow-sm transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── HERO HEADER ── */}
      <section className="pt-12 pb-8 px-4 text-center max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1A6FE8] dark:text-[#4F92F8] text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200/50 dark:border-blue-800/50">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Transparent Healthcare Packaging</span>
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Choose the care that fits your needs.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
          Start with essential health guidance for free, or unlock advanced tools for deeper health management.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-full mt-8 border border-slate-200/80 dark:border-slate-700/80">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`py-1.5 px-5 rounded-full text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`py-1.5 px-5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
              Save 16%
            </span>
          </button>
        </div>
      </section>

      {/* ── PRICING CARDS GRID ── */}
      <section className="max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {/* Free Tier */}
          <PricingCard
            plan={PLANS_CONFIG[PLANS.FREE]}
            currentPlan={currentPlan}
            billingCycle={billingCycle}
            onSelect={handleSelectPlan}
          />

          {/* Plus Tier (Highlighted) */}
          <PricingCard
            plan={PLANS_CONFIG[PLANS.PLUS]}
            currentPlan={currentPlan}
            billingCycle={billingCycle}
            onSelect={handleSelectPlan}
          />

          {/* Family Tier */}
          <PricingCard
            plan={PLANS_CONFIG[PLANS.FAMILY]}
            currentPlan={currentPlan}
            billingCycle={billingCycle}
            onSelect={handleSelectPlan}
          />
        </div>
      </section>

      {/* ── INSTITUTIONAL SECTION ── */}
      <section id="institutional-section" className="max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-bold uppercase tracking-wider border border-cyan-500/30">
                  Public Health & Institutions
                </span>
                <span className="text-xs text-slate-400">PHCs • NGOs • Health Departments</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Swasthya Mitra for Public Health & Hospitals
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Equip community healthcare workers, primary health centers, and rural clinics with our complete diagnostic suite including the AI Chest X-Ray analyser, ABDM-aligned architecture, and anonymized district epidemiological tracking.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>AI Chest X-Ray Analyser (pneumonia detection)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>District health registry & ABDM integration</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Aggregate anonymized public health analytics</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Dedicated offline-first edge deployment</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 flex flex-col justify-center space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Talk to our Institutional Desk</span>
              </h3>
              <p className="text-xs text-slate-300">
                Custom contracts, SLAs, and technical pilot deployments tailored to your jurisdiction.
              </p>

              {institutionalInquirySent ? (
                <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold text-center">
                  Thank you! Our institutional health lead will contact your facility shortly.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setInstitutionalInquirySent(true);
                  }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    required
                    placeholder="Organization / PHC Name"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Official Contact Email"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold transition-all shadow-md active:scale-95"
                  >
                    Request Institutional Consultation
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE COMPARISON TABLE ── */}
      <section className="max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Detailed Feature Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Complete transparency across all plans and healthcare capabilities.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 sm:p-5 font-black text-slate-800 dark:text-slate-200 w-1/3 min-w-[200px]">
                  Feature Capability
                </th>
                <th className="p-4 sm:p-5 font-bold text-slate-700 dark:text-slate-300 text-center min-w-[100px]">
                  Free (₹0)
                </th>
                <th className="p-4 sm:p-5 font-extrabold text-[#1A6FE8] text-center min-w-[120px] bg-blue-50/40 dark:bg-blue-950/20">
                  Plus (₹99/mo)
                </th>
                <th className="p-4 sm:p-5 font-bold text-indigo-600 dark:text-indigo-400 text-center min-w-[120px]">
                  Family (₹199/mo)
                </th>
                <th className="p-4 sm:p-5 font-bold text-slate-700 dark:text-slate-300 text-center min-w-[120px]">
                  Institutional
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((group, gIdx) => (
                <React.Fragment key={gIdx}>
                  <tr className="bg-slate-100/70 dark:bg-slate-800/40">
                    <td
                      colSpan={5}
                      className="px-4 py-2.5 font-extrabold text-[11px] text-slate-600 dark:text-slate-400 uppercase tracking-wider"
                    >
                      {group.category}
                    </td>
                  </tr>
                  {group.items.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                        {row.name}
                      </td>

                      {/* Free */}
                      <td className="p-4 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? (
                            <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                          )
                        ) : (
                          <span className="font-bold text-slate-700 dark:text-slate-300">{row.free}</span>
                        )}
                      </td>

                      {/* Plus */}
                      <td className="p-4 text-center bg-blue-50/30 dark:bg-blue-950/10">
                        {typeof row.plus === 'boolean' ? (
                          row.plus ? (
                            <Check className="w-4 h-4 text-[#1A6FE8] mx-auto font-black" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                          )
                        ) : (
                          <span className="font-extrabold text-[#1A6FE8]">{row.plus}</span>
                        )}
                      </td>

                      {/* Family */}
                      <td className="p-4 text-center">
                        {typeof row.family === 'boolean' ? (
                          row.family ? (
                            <Check className="w-4 h-4 text-indigo-600 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                          )
                        ) : (
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{row.family}</span>
                        )}
                      </td>

                      {/* Institutional */}
                      <td className="p-4 text-center">
                        {typeof row.institutional === 'boolean' ? (
                          row.institutional ? (
                            <Check className="w-4 h-4 text-cyan-600 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                          )
                        ) : (
                          <span className="font-bold text-slate-700 dark:text-slate-300">{row.institutional}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Everything you need to know about our healthcare subscriptions.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#1A6FE8]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTargetPlan={selectedPlanForModal || PLANS.PLUS}
      />

      <Footer />
    </div>
  );
};

export default PricingPage;
