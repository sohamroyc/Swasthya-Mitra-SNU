import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Pill, ShieldCheck, Heart, X, AlertCircle } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

const RELATIONSHIPS = ['Spouse', 'Child', 'Parent', 'Sibling', 'Grandparent', 'Other'];

const FamilyManager = () => {
  const { familyMembers, addFamilyMember, removeFamilyMember, plan } = useSubscription();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1 owner profile + linked family members
  const usedCount = 1 + (familyMembers?.length || 0);
  const maxProfiles = 5;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter member name.');
      return;
    }

    if (usedCount >= maxProfiles) {
      setError('Profile limit reached. Family plans support up to 5 profiles.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addFamilyMember({
        name: name.trim(),
        relationship,
        email: email.trim(),
        notes: notes.trim(),
      });
      setName('');
      setEmail('');
      setNotes('');
      setIsAdding(false);
    } catch (err) {
      setError(err.message || 'Failed to add family member.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (memberId) => {
    if (window.confirm('Remove this family member from your shared family health plan?')) {
      try {
        await removeFamilyMember(memberId);
      } catch (err) {
        console.error('Failed to remove member:', err);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Family Health Circle
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Shared health records & medication sync across household profiles.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Profiles Capacity
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {usedCount} / {maxProfiles} used
            </span>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            disabled={usedCount >= maxProfiles}
            className="flex items-center gap-1.5 py-2.5 px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/10 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-4">
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${(usedCount / maxProfiles) * 100}%` }}
          />
        </div>
      </div>

      {/* Add Member Dialog */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="my-6 p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
              New Family Member Profile
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@example.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
              Health Notes or Medication Needs
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Takes thyroid meds daily at 7 AM"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
            >
              {loading ? 'Saving...' : 'Add to Circle'}
            </button>
          </div>
        </form>
      )}

      {/* Profiles List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {/* Primary Account Holder Card */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
              ME
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 dark:text-white">Primary Account</span>
                <span className="px-2 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[9px] font-bold">
                  Owner
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Full Plan Admin
              </p>
            </div>
          </div>
        </div>

        {/* Linked Family Members */}
        {familyMembers?.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-black text-sm flex items-center justify-center shrink-0">
                {m.member_name ? m.member_name.slice(0, 2).toUpperCase() : 'FM'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {m.member_name}
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-[9px] font-bold">
                    {m.relationship}
                  </span>
                </div>
                {m.notes ? (
                  <p className="text-[10px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                    <Pill className="w-2.5 h-2.5 text-indigo-500" /> {m.notes}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-0.5">Linked health profile</p>
                )}
              </div>
            </div>

            <button
              onClick={() => handleRemove(m.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors shrink-0"
              title="Remove profile"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyManager;
