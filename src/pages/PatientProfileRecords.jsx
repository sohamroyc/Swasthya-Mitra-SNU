import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';

const PatientProfileRecords = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { user, updateProfile } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const fields = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            gender: formData.get('gender'),
            dob: formData.get('dob'),
            bloodType: formData.get('bloodType'),
            height: formData.get('height') ? Number(formData.get('height')) : '',
            weight: formData.get('weight') ? Number(formData.get('weight')) : '',
            allergies: formData.get('allergies'),
            conditions: formData.get('conditions'),
        };
        await updateProfile(user?.email, fields);
        setIsEditing(false);
    };

    // Helper to format DOB
    const formatDob = (dob) => {
        if (!dob) return 'Not provided';
        const d = new Date(dob);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const age = Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        return `${d.toLocaleDateString('en-US', options)} (${age} years)`;
    };

    const formatGender = (g) => {
        if (!g) return 'Not provided';
        return g.charAt(0).toUpperCase() + g.slice(1).replace('-', ' ');
    };

    const getAllergyTags = (str) => {
        if (!str || !str.trim()) return [];
        return str.split(',').map(s => s.trim()).filter(Boolean);
    };

    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    const OverviewView = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Main details) */}
            <div className="lg:col-span-2 space-y-8">
                {/* Profile Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-6">
                            <div className="size-20 rounded-2xl bg-blue-600 overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center text-white text-2xl font-black">
                                {initials}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{user?.name || 'User'}</h2>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-[10px] rounded-full uppercase tracking-wider">Pro Member</span>
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-500">
                                    <span className="flex items-center gap-1 text-emerald-600"><span className="material-symbols-outlined text-[14px]">verified</span> Verified Patient</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-indigo-600"><span className="material-symbols-outlined text-[14px]">psychology</span> AI Health Enabled</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_month</span> Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">download</span> Health Report
                            </button>
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all">
                                <span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 mb-4 pb-2 border-b border-slate-100">
                            <span className="material-symbols-outlined text-blue-600">person</span> Personal Information
                        </h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date of Birth</p>
                                <p className="font-semibold text-sm">{formatDob(user?.dob)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gender</p>
                                <p className="font-semibold text-sm">{formatGender(user?.gender)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                                <p className="font-semibold text-sm">{user?.email || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                                <p className="font-semibold text-sm">{user?.phone || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medical ID */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30 p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded text-right flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">emergency</span> Emergency Access Enabled
                        </span>
                    </div>

                    <h3 className="text-sm font-bold flex items-center gap-2 text-red-600 mb-6 pb-2 border-b border-red-50">
                        <span className="material-symbols-outlined">medical_information</span> Medical ID
                    </h3>

                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Blood Type</p>
                            <p className="text-2xl font-black text-slate-900">{user?.bloodType || '—'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Height</p>
                            <p className="text-2xl font-black text-slate-900">{user?.height ? `${user.height} cm` : '—'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Weight</p>
                            <p className="text-2xl font-black text-slate-900">{user?.weight ? `${user.weight} kg` : '—'}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Known Allergies</p>
                        <div className="flex flex-wrap gap-2">
                            {getAllergyTags(user?.allergies).length > 0 ? (
                                getAllergyTags(user.allergies).map((a, i) => (
                                    <span key={i} className="px-3 py-1 bg-red-50 border border-red-100 text-red-700 font-bold text-xs rounded-lg">{a}</span>
                                ))
                            ) : (
                                <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-500 font-medium text-xs rounded-lg">No known allergies</span>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Medical Conditions</p>
                        <div className="flex flex-wrap gap-2">
                            {getAllergyTags(user?.conditions).length > 0 ? (
                                getAllergyTags(user.conditions).map((c, i) => (
                                    <span key={i} className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-700 font-bold text-xs rounded-lg">{c}</span>
                                ))
                            ) : (
                                <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-500 font-medium text-xs rounded-lg">No known conditions</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Emergency Contacts</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors bg-slate-50">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center mr-3">SJ</div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">Sarah Johnson</p>
                                    <p className="text-[10px] font-semibold text-slate-500 uppercase">Spouse • +1 555-0987</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800"><span className="material-symbols-outlined">call</span></button>
                            </div>
                            <div className="flex items-center p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors bg-slate-50">
                                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center mr-3">MJ</div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">Mark Johnson</p>
                                    <p className="text-[10px] font-semibold text-slate-500 uppercase">Brother • +1 555-1122</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800"><span className="material-symbols-outlined">call</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                {/* Health Goals */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 mb-6">
                        <span className="material-symbols-outlined text-blue-600">track_changes</span> Health Goals
                    </h3>

                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-slate-500">Daily Steps</span>
                                <span className="text-blue-600">8,432 / 10,000</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '84%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-slate-500">Sleep Target</span>
                                <span className="text-indigo-600">7.2 / 8.0 hrs</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-slate-500">Target Weight</span>
                                <span className="text-emerald-600">72 / 70 kg</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                    <button className="w-full mt-6 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50">View Detailed Progress</button>
                </div>

                {/* Privacy Settings */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined">shield</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm mb-1">Privacy Settings</h3>
                            <p className="text-xs text-slate-500 font-medium">You have full control over who sees your health data.</p>
                        </div>
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs border-b border-slate-50 pb-2">
                            <span className="font-semibold text-slate-500">Profile Visibility</span>
                            <span className="font-bold text-blue-600">Healthcare Providers Only</span>
                        </div>
                        <div className="flex justify-between text-xs pb-2">
                            <span className="font-semibold text-slate-500">Data Sharing</span>
                            <span className="font-bold text-emerald-600 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">lock</span> Encrypted (AES-256)</span>
                        </div>
                    </div>
                    <button className="w-full text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline py-2">Manage Permissions</button>
                </div>

                {/* Insurance Plan */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 mb-4 pb-2 border-b border-slate-50">
                        <span className="material-symbols-outlined text-purple-600">health_and_safety</span> Insurance Plan
                    </h3>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-800 font-bold border border-blue-200">
                            <span className="material-symbols-outlined text-lg">assured_workload</span>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-900">BlueCross BlueShield</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">ID: #44820102 A • Platinum Plus</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-emerald-600 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> Active Coverage</span>
                        <a href="#" className="text-blue-600 hover:underline">View Card</a>
                    </div>
                </div>
            </div>
        </div>
    );

    const EditView = () => (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Edit Profile & Medical ID</h1>
                <p className="text-sm font-bold text-slate-500">Manage your identity and critical health details for emergency response.</p>
            </div>

            {/* Profile Picture */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 bg-blue-600 flex items-center justify-center text-white text-2xl font-black">
                            {initials}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-600 rounded-full text-white flex items-center justify-center border-2 border-white shadow-sm">
                            <span className="material-symbols-outlined text-[14px]">add_a_photo</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">{user?.name || 'User'}</h2>
                        <p className="text-xs font-medium text-slate-400 mb-1">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">verified</span> Verified Identity</p>
                    </div>
                </div>
                <button type="button" className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-bold text-slate-700 py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">upload</span> Upload New Photo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    {/* Form 1 */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 mb-6 pb-2 border-b border-slate-100">
                            <span className="material-symbols-outlined text-blue-600">person</span> Personal Information
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Full Name</label>
                                    <input type="text" name="name" defaultValue={user?.name || ''} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Phone Number</label>
                                    <input type="text" name="phone" defaultValue={user?.phone || ''} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Email Address</label>
                                <input type="email" name="email" readOnly defaultValue={user?.email || ''} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Gender</label>
                                    <input type="text" name="gender" defaultValue={user?.gender || ''} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Date of Birth</label>
                                    <input type="date" name="dob" defaultValue={user?.dob || ''} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical ID Form */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-red-600 mb-6 pb-2 border-b border-red-50">
                            <span className="material-symbols-outlined">medical_information</span> Medical ID Details
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Blood Type</label>
                                    <select name="bloodType" defaultValue={user?.bloodType || ''} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-red-500 focus:border-red-500">
                                        <option value="">Select</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Height (cm)</label>
                                    <input type="number" name="height" defaultValue={user?.height || ''} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-red-500 focus:border-red-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Weight (kg)</label>
                                <input type="number" name="weight" defaultValue={user?.weight || ''} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-red-500 focus:border-red-500" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Known Allergies</label>
                                <textarea name="allergies" rows="2" defaultValue={user?.allergies || ''} placeholder="e.g. Penicillin, Peanuts" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-red-500 focus:border-red-500"></textarea>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Chronic Conditions</label>
                                <textarea name="conditions" rows="3" defaultValue={user?.conditions || ''} placeholder="e.g. Type 2 Diabetes, Mild Asthma" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-red-500 focus:border-red-500"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Emergency Conact */}
                    <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-red-600 mb-6 pb-2 border-b border-red-100">
                            <span className="material-symbols-outlined">emergency</span> Emergency Contact
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-red-800 mb-1">Contact Name</label>
                                <input type="text" defaultValue="Sarah Johnson" className="w-full px-3 py-2 bg-white border border-red-100 rounded-lg text-sm font-semibold focus:ring-red-500 focus:border-red-500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-red-800 mb-1">Relationship</label>
                                <input type="text" defaultValue="Spouse" className="w-full px-3 py-2 bg-white border border-red-100 rounded-lg text-sm font-semibold focus:ring-red-500 focus:border-red-500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-red-800 mb-1">Phone Number</label>
                                <input type="text" defaultValue="+1 (555) 987-6543" className="w-full px-3 py-2 bg-white border border-red-100 rounded-lg text-sm font-semibold focus:ring-red-500 focus:border-red-500" />
                            </div>
                            <button type="button" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1 mt-2">
                                <span className="material-symbols-outlined text-[14px]">add_circle</span> Add Second Contact
                            </button>
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-blue-800 mb-2">
                            <span className="material-symbols-outlined">lock</span> Privacy & HIPAA
                        </h3>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed mb-3">Your medical data is encrypted and only accessible to authorized healthcare providers during emergency events.</p>
                        <a href="#" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Learn more</a>
                    </div>

                    {/* Organ Donor */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                            <span className="material-symbols-outlined">favorite</span> Organ Donor
                        </div>
                        <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">save</span> Save All Changes
                </button>
            </div>
        </form>
    );

    return (
        <AppLayout activeTab="records">
            {isEditing ? <EditView /> : <OverviewView />}
        </AppLayout>
    );
};

export default PatientProfileRecords;
