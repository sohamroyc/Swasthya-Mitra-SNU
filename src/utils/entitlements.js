/**
 * Swasthya Mitra Entitlement System
 * Defines feature permissions, plan tiers, and central access controls.
 */

export const PLANS = {
  FREE: 'free',
  PLUS: 'plus',
  FAMILY: 'family',
  INSTITUTIONAL: 'institutional',
};

export const FEATURES = {
  // Free Core (Strictly preserved for all users)
  SYMPTOM_CHECKER: 'symptom_checker',
  GOVERNMENT_SCHEMES: 'government_schemes',
  CLINIC_LOCATOR: 'clinic_locator',
  BASIC_EXPLAINABILITY: 'basic_explainability',

  // Plus Features
  AI_DERMATOLOGIST: 'ai_dermatologist',
  MEDICATION_REMINDERS: 'medication_reminders',
  FULL_HEALTH_HISTORY: 'full_health_history',

  // Family Features
  FAMILY_PROFILES: 'family_profiles',
  SHARED_MEDICATIONS: 'shared_medications',

  // Institutional Features
  XRAY_ANALYSIS: 'xray_analysis',
  ANALYTICS_DASHBOARD: 'analytics_dashboard',
  ABDM_INTEGRATION: 'abdm_integration',
  FULL_MODULE_SUITE: 'full_module_suite',
};

/**
 * Plan Feature Matrix
 * Higher tiers inherit lower tier features as specified in the business model.
 */
export const PLAN_FEATURES = {
  [PLANS.FREE]: [
    FEATURES.SYMPTOM_CHECKER,
    FEATURES.GOVERNMENT_SCHEMES,
    FEATURES.CLINIC_LOCATOR,
    FEATURES.BASIC_EXPLAINABILITY,
  ],
  [PLANS.PLUS]: [
    FEATURES.SYMPTOM_CHECKER,
    FEATURES.GOVERNMENT_SCHEMES,
    FEATURES.CLINIC_LOCATOR,
    FEATURES.BASIC_EXPLAINABILITY,
    FEATURES.AI_DERMATOLOGIST,
    FEATURES.MEDICATION_REMINDERS,
    FEATURES.FULL_HEALTH_HISTORY,
  ],
  [PLANS.FAMILY]: [
    FEATURES.SYMPTOM_CHECKER,
    FEATURES.GOVERNMENT_SCHEMES,
    FEATURES.CLINIC_LOCATOR,
    FEATURES.BASIC_EXPLAINABILITY,
    FEATURES.AI_DERMATOLOGIST,
    FEATURES.MEDICATION_REMINDERS,
    FEATURES.FULL_HEALTH_HISTORY,
    FEATURES.FAMILY_PROFILES,
    FEATURES.SHARED_MEDICATIONS,
  ],
  [PLANS.INSTITUTIONAL]: [
    FEATURES.SYMPTOM_CHECKER,
    FEATURES.GOVERNMENT_SCHEMES,
    FEATURES.CLINIC_LOCATOR,
    FEATURES.BASIC_EXPLAINABILITY,
    FEATURES.AI_DERMATOLOGIST,
    FEATURES.MEDICATION_REMINDERS,
    FEATURES.FULL_HEALTH_HISTORY,
    FEATURES.FAMILY_PROFILES,
    FEATURES.SHARED_MEDICATIONS,
    FEATURES.XRAY_ANALYSIS,
    FEATURES.ANALYTICS_DASHBOARD,
    FEATURES.ABDM_INTEGRATION,
    FEATURES.FULL_MODULE_SUITE,
  ],
};

/**
 * Centralized feature permission check
 * @param {string} feature - Feature identifier from FEATURES
 * @param {string} plan - Plan identifier from PLANS (defaults to 'free')
 * @returns {boolean}
 */
export const hasFeatureAccess = (feature, plan = PLANS.FREE) => {
  const normalizedPlan = (plan || PLANS.FREE).toLowerCase();
  const allowedFeatures = PLAN_FEATURES[normalizedPlan] || PLAN_FEATURES[PLANS.FREE];
  return allowedFeatures.includes(feature);
};

export const canUse = (feature, plan) => hasFeatureAccess(feature, plan);

/**
 * Plan metadata for display, pricing tables, and UI cards
 */
export const PLANS_CONFIG = {
  [PLANS.FREE]: {
    id: PLANS.FREE,
    name: 'Free',
    displayName: 'Swasthya Free',
    price: 0,
    priceDisplay: '₹0',
    period: 'forever',
    description: 'Essential AI health guidance and emergency discovery for all citizens.',
    popular: false,
    highlight: false,
    ctaText: 'Current Plan',
    features: [
      { text: 'AI Symptom Checker', included: true },
      { text: 'Government Health Scheme Finder', included: true },
      { text: 'Emergency Clinic & Hospital Locator', included: true },
      { text: 'Basic Explainable AI Guidance', included: true },
      { text: 'AI Dermatologist skin scans', included: false },
      { text: 'Medication alerts & reminders', included: false },
      { text: 'Linked family profiles', included: false },
    ],
  },
  [PLANS.PLUS]: {
    id: PLANS.PLUS,
    name: 'Plus',
    displayName: 'Swasthya Plus',
    price: 99,
    priceDisplay: '₹99',
    period: '/month',
    yearlyPrice: 990,
    yearlyDisplay: '₹990/year',
    description: 'Advanced visual AI diagnostics and proactive health management.',
    popular: true,
    highlight: true,
    badgeText: 'Recommended Care',
    ctaText: 'Upgrade to Plus',
    features: [
      { text: 'Everything in Free', included: true, bold: true },
      { text: 'Unlimited AI Dermatologist scans', included: true },
      { text: 'Proactive medication reminders', included: true },
      { text: 'Full health-history persistence', included: true },
      { text: 'Priority AI medical triage processing', included: true },
      { text: 'Up to 5 linked family profiles', included: false },
    ],
  },
  [PLANS.FAMILY]: {
    id: PLANS.FAMILY,
    name: 'Family',
    displayName: 'Swasthya Family',
    price: 199,
    priceDisplay: '₹199',
    period: '/month',
    yearlyPrice: 1990,
    yearlyDisplay: '₹1,990/year',
    description: 'Comprehensive health monitoring and medication sync for your entire household.',
    popular: false,
    highlight: false,
    badgeText: 'Complete Household',
    ctaText: 'Get Family Plan',
    maxMembers: 5,
    features: [
      { text: 'Everything in Plus', included: true, bold: true },
      { text: 'Up to 5 linked family profiles', included: true },
      { text: 'Shared family medication tracking', included: true },
      { text: 'Unified household health history', included: true },
      { text: 'Individual emergency profiles', included: true },
    ],
  },
  [PLANS.INSTITUTIONAL]: {
    id: PLANS.INSTITUTIONAL,
    name: 'Institutional',
    displayName: 'Institutional & Public Health',
    price: null,
    priceDisplay: 'Custom',
    period: 'per facility',
    description: 'Tailored for Primary Health Centers (PHCs), NGOs, and State Health Departments.',
    popular: false,
    highlight: false,
    isEnterprise: true,
    ctaText: 'Contact Us',
    features: [
      { text: 'Full Swasthya Mitra module suite', included: true, bold: true },
      { text: 'AI Chest X-Ray Analyser (pneumonia detection)', included: true },
      { text: 'Aggregate anonymised epidemiological analytics', included: true },
      { text: 'ABDM-aligned architecture & EMR export', included: true },
      { text: 'Dedicated offline-first clinic deployments', included: true },
    ],
  },
};

export const getPlanDetails = (planId) => {
  const key = (planId || PLANS.FREE).toLowerCase();
  return PLANS_CONFIG[key] || PLANS_CONFIG[PLANS.FREE];
};
