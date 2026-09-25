import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { subscriptionService, createDefaultSubscription } from '../services/subscriptionService';
import { hasFeatureAccess, PLANS } from '../utils/entitlements';

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState([]);

  // Fetch subscription & family members whenever authenticated user changes
  const loadSubscriptionData = useCallback(async () => {
    if (!user?.email) {
      setSubscription(createDefaultSubscription(null));
      setFamilyMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const sub = await subscriptionService.getUserSubscription(user.email);
      setSubscription(sub);

      if (sub?.plan_id === PLANS.FAMILY) {
        const members = await subscriptionService.getFamilyMembers(user.email);
        setFamilyMembers(members);
      } else {
        setFamilyMembers([]);
      }
    } catch (err) {
      console.error('Failed to load subscription data:', err);
      setSubscription(createDefaultSubscription(user.email));
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadSubscriptionData();
  }, [loadSubscriptionData]);

  // Derived state
  const plan = subscription?.plan_id || PLANS.FREE;
  const status = subscription?.status || 'active';
  const currentPeriodEnd = subscription?.current_period_end || null;
  const cancelAtPeriodEnd = subscription?.cancel_at_period_end || false;

  /**
   * Check whether current user has entitlement to a given feature
   */
  const hasAccess = useCallback(
    (feature) => {
      // If subscription is canceled and past expiry, falls back to Free
      if (currentPeriodEnd && new Date(currentPeriodEnd) < new Date() && status !== 'active') {
        return hasFeatureAccess(feature, PLANS.FREE);
      }
      return hasFeatureAccess(feature, plan);
    },
    [plan, currentPeriodEnd, status]
  );

  const refreshSubscription = async () => {
    await loadSubscriptionData();
  };

  const upgradePlan = async (targetPlanId, options = {}) => {
    if (!user?.email) throw new Error('You must be logged in to modify plans.');
    const updated = await subscriptionService.updateUserSubscription(user.email, targetPlanId, options);
    await refreshSubscription();
    return updated;
  };

  const cancelCurrentSubscription = async () => {
    if (!user?.email) throw new Error('You must be logged in to cancel subscription.');
    const updated = await subscriptionService.cancelSubscription(user.email);
    await refreshSubscription();
    return updated;
  };

  const addMember = async (memberData) => {
    if (!user?.email) throw new Error('User not logged in');
    const newMember = await subscriptionService.addFamilyMember(user.email, memberData);
    const updated = await subscriptionService.getFamilyMembers(user.email);
    setFamilyMembers(updated);
    return newMember;
  };

  const removeMember = async (memberId) => {
    if (!user?.email) throw new Error('User not logged in');
    const updated = await subscriptionService.removeFamilyMember(user.email, memberId);
    setFamilyMembers(updated);
    return updated;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        plan,
        status,
        currentPeriodEnd,
        cancelAtPeriodEnd,
        loading,
        hasAccess,
        refreshSubscription,
        upgradePlan,
        cancelSubscription: cancelCurrentSubscription,
        familyMembers,
        addFamilyMember: addMember,
        removeFamilyMember: removeMember,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
