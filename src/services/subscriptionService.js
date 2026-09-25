import { supabase } from '../supabaseClient';
import { PLANS } from '../utils/entitlements';

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return (
    url &&
    key &&
    !url.includes('your_supabase_project_url') &&
    !key.includes('your_supabase_anon_key') &&
    !key.includes('xxxx')
  );
};

const getLocalSubKey = (email) => `swasthya_sub_${(email || 'guest').toLowerCase()}`;
const getLocalFamilyKey = (email) => `swasthya_family_${(email || 'guest').toLowerCase()}`;

/**
 * Creates a default Free subscription object
 */
export const createDefaultSubscription = (email) => ({
  id: 'sub_free_default',
  user_email: email || '',
  plan_id: PLANS.FREE,
  status: 'active',
  provider: 'system',
  provider_customer_id: null,
  provider_subscription_id: null,
  current_period_start: new Date().toISOString(),
  current_period_end: null, // Free doesn't expire
  cancel_at_period_end: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const subscriptionService = {
  /**
   * Fetch active subscription for a given user email
   */
  async getUserSubscription(email) {
    if (!email) return createDefaultSubscription(null);

    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_email', email.toLowerCase())
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase subscription fetch error, using local fallback:', err);
      }
    }

    // 2. Local fallback storage
    try {
      const stored = localStorage.getItem(getLocalSubKey(email));
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn('Failed to parse local subscription record:', err);
    }

    const defaultSub = createDefaultSubscription(email);
    localStorage.setItem(getLocalSubKey(email), JSON.stringify(defaultSub));
    return defaultSub;
  },

  /**
   * Update or create user subscription (e.g. after upgrade/downgrade)
   */
  async updateUserSubscription(email, planId, options = {}) {
    if (!email) throw new Error('User email is required');

    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default

    const payload = {
      user_email: email.toLowerCase(),
      plan_id: planId || PLANS.FREE,
      status: options.status || 'active',
      provider: options.provider || 'system',
      provider_customer_id: options.customerId || null,
      provider_subscription_id: options.subscriptionId || `sub_${Date.now()}`,
      current_period_start: now.toISOString(),
      current_period_end: planId === PLANS.FREE ? null : (options.currentPeriodEnd || periodEnd.toISOString()),
      cancel_at_period_end: options.cancelAtPeriodEnd || false,
      updated_at: now.toISOString(),
    };

    // Save to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { data: existing } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_email', email.toLowerCase())
          .maybeSingle();

        if (existing?.id) {
          await supabase.from('subscriptions').update(payload).eq('id', existing.id);
        } else {
          await supabase.from('subscriptions').insert([{ ...payload, created_at: now.toISOString() }]);
        }
      } catch (err) {
        console.warn('Failed to sync subscription to Supabase, saved locally:', err);
      }
    }

    // Always cache locally
    localStorage.setItem(getLocalSubKey(email), JSON.stringify({ ...payload, id: `sub_${email}_${Date.now()}` }));
    return payload;
  },

  /**
   * Cancel subscription at period end
   */
  async cancelSubscription(email) {
    if (!email) throw new Error('Email is required');

    const current = await this.getUserSubscription(email);
    const updated = {
      ...current,
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('subscriptions')
          .update({ cancel_at_period_end: true, updated_at: updated.updated_at })
          .eq('user_email', email.toLowerCase());
      } catch (err) {
        console.warn('Supabase cancel update failed:', err);
      }
    }

    localStorage.setItem(getLocalSubKey(email), JSON.stringify(updated));
    return updated;
  },

  /**
   * Family members management
   */
  async getFamilyMembers(ownerEmail) {
    if (!ownerEmail) return [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('family_members')
          .select('*')
          .eq('owner_user_email', ownerEmail.toLowerCase())
          .order('created_at', { ascending: true });

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase family members query failed, using local storage:', err);
      }
    }

    try {
      const stored = localStorage.getItem(getLocalFamilyKey(ownerEmail));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async addFamilyMember(ownerEmail, memberData) {
    if (!ownerEmail) throw new Error('Owner email required');

    const currentMembers = await this.getFamilyMembers(ownerEmail);
    if (currentMembers.length >= 5) {
      throw new Error('Family plan limit reached. Maximum 5 profiles permitted.');
    }

    const newMember = {
      id: `fam_${Date.now()}`,
      owner_user_email: ownerEmail.toLowerCase(),
      member_name: memberData.name,
      member_email: memberData.email || '',
      relationship: memberData.relationship || 'Family Member',
      notes: memberData.notes || '',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('family_members').insert([newMember]).select().single();
        if (!error && data) {
          const updated = [...currentMembers, data];
          localStorage.setItem(getLocalFamilyKey(ownerEmail), JSON.stringify(updated));
          return data;
        }
      } catch (err) {
        console.warn('Supabase family member insert error:', err);
      }
    }

    const updated = [...currentMembers, newMember];
    localStorage.setItem(getLocalFamilyKey(ownerEmail), JSON.stringify(updated));
    return newMember;
  },

  async removeFamilyMember(ownerEmail, memberId) {
    if (!ownerEmail) return [];

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('family_members')
          .delete()
          .eq('id', memberId)
          .eq('owner_user_email', ownerEmail.toLowerCase());
      } catch (err) {
        console.warn('Supabase family member delete error:', err);
      }
    }

    const currentMembers = await this.getFamilyMembers(ownerEmail);
    const updated = currentMembers.filter((m) => m.id !== memberId);
    localStorage.setItem(getLocalFamilyKey(ownerEmail), JSON.stringify(updated));
    return updated;
  },
};
