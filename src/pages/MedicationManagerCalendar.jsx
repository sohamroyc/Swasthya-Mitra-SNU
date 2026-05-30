import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';
import { fetchLocalMeds, addLocalMed, updateLocalMed } from '../services/medicalDb';

const MedicationManagerCalendar = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Month');
    const [baseDate, setBaseDate] = useState(new Date()); // Changed to CURRENT date
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMed, setNewMed] = useState({ name: '', dosage: '', indication: '', schedule: '' });
    const [prescriptions, setPrescriptions] = useState([]);

    const INITIAL_MEDS = [
        { id: 'm1', name: 'Lisinopril', dosage: '10mg', indication: 'Blood Pressure', schedule: 'Daily (Morning)', remaining: '14 / 30', type: 'pills', status: 'Refill Now', icon: 'pill' },
        { id: 'm2', name: 'Metformin', dosage: '500mg', indication: 'Type 2 Diabetes', schedule: 'Twice Daily', remaining: '45 / 60', type: 'pills', status: 'Refill Not Ready', icon: 'pill' },
        { id: 'm3', name: 'Atorvastatin', dosage: '20mg', indication: 'Cholesterol', schedule: 'Daily (Night)', remaining: '5 / 30', type: 'pills', status: 'Refill Urgent', icon: 'pill' }
    ];

    useEffect(() => {
        loadMedications();
    }, []);

    const loadMedications = async () => {
        try {
            if (!user) return;

            // Fetch medications specific to the logged-in user
            let { data, error } = await supabase
                .from('medications')
                .select('*')
                .eq('user_email', user.email)
                .order('created_at', { ascending: false });

            const local = fetchLocalMeds();

            if (data && data.length > 0) {
                setPrescriptions([...data, ...local]);
            } else if (local.length > 0) {
                setPrescriptions(local);
            } else {
                setPrescriptions(INITIAL_MEDS);
            }
        } catch (error) {
            console.warn("Using local medication storage");
            const local = fetchLocalMeds();
            setPrescriptions(local.length > 0 ? local : INITIAL_MEDS);
        }
    };

    const handleAddMedication = async (e) => {
        e.preventDefault();
        if (!newMed.name || !user) return;

        const medPayload = {
            name: newMed.name,
            dosage: newMed.dosage || 'N/A',
            indication: newMed.indication || 'General',
            schedule: newMed.schedule || 'Daily',
            remaining: '30 / 30',
            type: 'pills',
            status: 'Refill Not Ready',
            icon: 'pill',
            user_email: user.email
        };

        try {
            // Try Supabase first
            const { error } = await supabase.from('medications').insert([medPayload]);

            // Always save locally too for persistence in this environment
            addLocalMed(medPayload);

            setIsModalOpen(false);
            setNewMed({ name: '', dosage: '', indication: '', schedule: '' });
            loadMedications();
        } catch (error) {
            console.warn("Saved medication to local storage only");
            addLocalMed(medPayload);
            setIsModalOpen(false);
            setNewMed({ name: '', dosage: '', indication: '', schedule: '' });
            loadMedications();
        }
    };

    const handleRefill = async (id, currentType) => {
        const newRemaining = currentType === 'pills' ? '30 / 30' : '24 / 24';
        const fields = { remaining: newRemaining, status: 'Refill Not Ready' };

        try {
            // Update UI optimistic
            setPrescriptions(prescriptions.map(p =>
                p.id === id ? { ...p, ...fields } : p
            ));

            // Server update
            await supabase.from('medications').update(fields).eq('id', id);

            // Local update
            updateLocalMed(id, fields);
        } catch (error) {
            updateLocalMed(id, fields);
        }
    };

    const getMonthName = (date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const nextTime = () => {
        const newDate = new Date(baseDate);
        if (activeTab === 'Month') newDate.setMonth(newDate.getMonth() + 1);
        else if (activeTab === 'Week') newDate.setDate(newDate.getDate() + 7);
        else newDate.setDate(newDate.getDate() + 1);
        setBaseDate(newDate);
    };

    const prevTime = () => {
        const newDate = new Date(baseDate);
        if (activeTab === 'Month') newDate.setMonth(newDate.getMonth() - 1);
        else if (activeTab === 'Week') newDate.setDate(newDate.getDate() - 7);
        else newDate.setDate(newDate.getDate() - 1);
        setBaseDate(newDate);
    };

    const getCalendarCells = () => {
        if (activeTab === 'Day') {
            return (
                <div className="bg-white p-12 rounded-b-2xl border-t border-slate-200 flex flex-col items-center justify-center text-slate-500 min-h-[420px]">
                    <span className="material-symbols-outlined text-6xl mb-4 text-blue-200">calendar_view_day</span>
                    <p className="font-bold text-xl text-slate-800 mb-1">Daily View</p>
                    <p className="font-medium">Selected Date: {baseDate.toLocaleDateString()}</p>
                </div>
            );
        }
        if (activeTab === 'Week') {
            return (
                <div className="bg-white p-12 rounded-b-2xl border-t border-slate-200 flex flex-col items-center justify-center text-slate-500 min-h-[420px]">
                    <span className="material-symbols-outlined text-6xl mb-4 text-blue-200">calendar_view_week</span>
                    <p className="font-bold text-xl text-slate-800 mb-1">Weekly View</p>
                    <p className="font-medium">Week of: {baseDate.toLocaleDateString()}</p>
                </div>
            );
        }

        // --- REAL CALENDAR GENERATION LOGIC ---
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();

        // 1. Get the first day of the month (0 = Sun, 1 = Mon...)
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        // 2. Get total days in current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 3. Get total days in previous month (to show in the faded gray boxes)
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Let's build exactly 6 rows of 7 days (42 cells total) so grid always stays perfectly square
        const calendarGrid = [];

        // Add previous month's trailing days
        for (let i = 0; i < firstDayOfMonth; i++) {
            const dateNum = daysInPrevMonth - firstDayOfMonth + i + 1;
            calendarGrid.push({ dateNum, isCurrentMonth: false });
        }

        // Add current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            calendarGrid.push({ dateNum: i, isCurrentMonth: true });
        }

        // Fill the rest with next month's starting days to hit 42 cells
        const remainingCells = 42 - calendarGrid.length;
        for (let i = 1; i <= remainingCells; i++) {
            calendarGrid.push({ dateNum: i, isCurrentMonth: false });
        }

        const today = new Date();

        return (
            <div className="grid grid-cols-7 gap-px bg-slate-200 border-t border-slate-200 rounded-b-2xl overflow-hidden">
                {calendarGrid.map((cell, index) => {
                    const isToday = cell.isCurrentMonth &&
                        cell.dateNum === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear() &&
                        activeTab === 'Month';

                    // Determine if we should show mock meds on this cell
                    const isSecondOfCurrentMonth = cell.isCurrentMonth && cell.dateNum === 2;

                    return (
                        <div key={index} className={`bg-white min-h-[120px] p-2 flex flex-col ${!cell.isCurrentMonth ? 'opacity-40 bg-slate-50' : 'hover:bg-slate-50 transition-colors cursor-pointer'} ${isToday ? 'ring-2 ring-blue-600 ring-inset relative z-10 bg-blue-50/10' : ''}`}>
                            <span className={`text-sm ${isToday ? 'font-bold text-blue-600' : 'font-bold text-slate-600'}`}>
                                {cell.dateNum} {isToday ? 'Today' : ''}
                            </span>

                            {/* Render mockup meds specifically on certain dates for visual fidelity */}
                            {isSecondOfCurrentMonth && (
                                <div className="mt-2 flex flex-col gap-1.5">
                                    <div className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-1 rounded border border-emerald-100 truncate font-black">Morning Meds (3)</div>
                                    <div className="bg-amber-50 text-amber-600 text-[10px] px-2 py-1 rounded border border-amber-100 truncate font-black">Evening Meds (1)</div>
                                </div>
                            )}

                            {isToday && (
                                <div className="mt-2 flex flex-col gap-1.5">
                                    <div className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded font-bold flex items-center justify-between shadow-sm">
                                        <span>Morning Meds</span>
                                        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                    </div>
                                    <div className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded border border-blue-200 flex items-center justify-between font-bold">
                                        <span>Noon Dose</span>
                                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                                    </div>
                                    <div className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded border border-slate-200 font-bold">Evening Meds</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <AppLayout activeTab="medications">
            <div className="flex flex-col xl:flex-row gap-8">
                <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Medication Manager</h1>
                            <p className="text-slate-500 font-medium mt-1 text-lg">Adherence score: <span className="text-emerald-600 font-bold">95%</span> this month</p>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0">
                            <span className="material-symbols-outlined">add</span>
                            Add New Medication
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl font-bold text-slate-900">{getMonthName(baseDate)}</h2>
                                    <div className="flex gap-1">
                                        <button onClick={prevTime} className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200">
                                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                        </button>
                                        <button onClick={nextTime} className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200">
                                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto border border-slate-200/60">
                                    {['Month', 'Week', 'Day'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-5 py-1.5 rounded-lg font-bold text-sm transition-colors ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {activeTab === 'Month' && (
                            <div className="grid grid-cols-7 gap-px bg-slate-200 border-t border-slate-200">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="bg-slate-50 p-4 text-center font-extrabold text-[10px] uppercase tracking-wider text-slate-500">{day}</div>
                                ))}
                            </div>
                        )}

                        {getCalendarCells()}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-200 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                                    <span className="material-symbols-outlined">warning</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Drug Interaction AI</h3>
                            </div>
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4">
                                <div className="shrink-0 mt-0.5 text-amber-500">
                                    <span className="material-symbols-outlined">shield</span>
                                </div>
                                <div>
                                    <p className="font-bold text-amber-900 text-sm mb-1">Potential Moderate Interaction</p>
                                    <p className="text-xs text-amber-700/90 leading-relaxed font-semibold">Lisinopril + Potassium Supplements can increase potassium levels in your blood. Our AI recommends consulting your GP before the next dose.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
                                    <span className="material-symbols-outlined">analytics</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Health Insights</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-bold">Systolic Pressure Avg</span>
                                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 text-[11px]">122 mmHg (Normal)</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full w-3/4"></div>
                                </div>
                                <p className="text-xs text-slate-500 font-semibold leading-relaxed">Based on your regular Lisinopril adherence, your pressure is stabilizing.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Prescriptions */}
                <aside className="w-full xl:w-80 flex flex-col gap-6 shrink-0 z-10">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900">Current Prescriptions</h3>
                            <span className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-600">{prescriptions.length} Active</span>
                        </div>

                        <div className="flex flex-col gap-4">
                            {prescriptions.map((med) => (
                                <div key={med.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
                                    <div className="flex gap-4">
                                        <div className="size-12 rounded-xl bg-white flex items-center justify-center p-2 border border-slate-200 shrink-0 text-blue-600 group-hover:bg-blue-50 transition-colors">
                                            <span className="material-symbols-outlined">{med.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h4 className="font-black text-slate-900 text-sm truncate">{med.name}</h4>
                                                <span className="text-blue-600 font-bold text-[10px] shrink-0 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{med.dosage}</span>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-500 truncate">{med.indication}</p>
                                            <div className="mt-2 flex items-center gap-1.5 text-slate-600">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                <span className="text-[11px] font-bold">{med.schedule}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Remaining</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-sm font-black text-slate-900">{med.remaining.split('/')[0]}</span>
                                                <span className="text-[10px] font-bold text-slate-400">/ {med.remaining.split('/')[1]} {med.type}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleRefill(med.id, med.type)}
                                            disabled={med.status === 'Refill Not Ready'}
                                            className={`text-[11px] font-bold px-3 py-2 rounded-lg transition-all active:scale-95 ${med.status === 'Refill Urgent'
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                                : med.status === 'Refill Now'
                                                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                                }`}
                                        >
                                            {med.status}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-6 flex flex-col gap-3">
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3 text-blue-800">
                                    <div className="bg-blue-600 text-white p-1.5 rounded-lg shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">psychiatry</span>
                                    </div>
                                    <p className="text-xs font-bold leading-tight">Swasthya Mitra AI is monitoring your symptom logs for any drug side effects.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3 text-emerald-800">
                                <div className="bg-emerald-600 text-white p-1.5 rounded-lg shrink-0">
                                    <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
                                </div>
                                <p className="text-xs font-bold leading-tight">Your prescriptions are securely backed up in the cloud.</p>
                            </div>
                        </div>
                    </div>
                </aside>

            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-slate-900">Add Medication</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddMedication} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Medication Name</label>
                                <input autoFocus required value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="e.g. Amoxicillin" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Dosage</label>
                                <input value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="e.g. 250mg" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Schedule</label>
                                <input value={newMed.schedule} onChange={e => setNewMed({ ...newMed, schedule: e.target.value })} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="e.g. Twice Daily" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Indication <span className="text-slate-400 normal-case font-semibold tracking-normal">(Optional)</span></label>
                                <input value={newMed.indication} onChange={e => setNewMed({ ...newMed, indication: e.target.value })} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="e.g. Infection" />
                            </div>
                            <button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95">
                                Save Medication
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </AppLayout>
    );
}

export default MedicationManagerCalendar;
