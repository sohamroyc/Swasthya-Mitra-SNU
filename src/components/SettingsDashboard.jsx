import React, { useState } from 'react';

const SettingsDashboard = () => {
    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567'
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 800);
    };

    return (
        <div className="animate-fade-in relative">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Manage your profile, preferences, and privacy.</p>
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="absolute top-0 right-0 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in z-50">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    <span className="text-sm font-bold">Settings saved successfully!</span>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Settings Sidebar */}
                <div className="w-full md:w-1/3 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`text-left w-full px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        Profile Information
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`text-left w-full px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'notifications' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">notifications</span>
                        Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`text-left w-full px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'privacy' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                        Privacy & Security
                    </button>
                </div>

                {/* Settings Content */}
                <div className="w-full md:w-2/3 p-8">
                    {activeTab === 'profile' && (
                        <div className="animate-fade-in h-full flex flex-col">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-xl flex items-center justify-center text-blue-500 relative group cursor-pointer overflow-hidden">
                                    <span className="material-symbols-outlined text-[40px] group-hover:scale-110 transition-transform">person</span>
                                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-white text-[24px]">photo_camera</span>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{formData.firstName} {formData.lastName}</h2>
                                    <p className="text-sm font-semibold text-slate-500 mb-3">{formData.email}</p>
                                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors border border-slate-200 active:scale-95">
                                        Upload New Avatar
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">First Name</label>
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Last Name</label>
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 mt-auto">
                                    <button type="submit" disabled={isSaving} className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}>
                                        {isSaving ? (
                                            <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Saving...</>
                                        ) : 'Save Changes'}
                                    </button>
                                    <button type="button" onClick={() => setFormData({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '+1 (555) 123-4567' })} className="px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm rounded-xl transition-colors border border-slate-200 active:scale-95">
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center p-8">
                            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">notifications_off</span>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Notification Preferences</h3>
                            <p className="text-sm font-medium text-slate-500">Configure your email and push notifications here. We are working on adding these controls shortly.</p>
                        </div>
                    )}

                    {activeTab === 'privacy' && (
                        <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center p-8">
                            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">security</span>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Privacy & Security</h3>
                            <p className="text-sm font-medium text-slate-500">Manage your password, 2FA, and data sharing controls. Available in next update.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsDashboard;
