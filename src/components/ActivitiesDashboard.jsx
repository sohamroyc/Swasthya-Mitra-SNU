import React, { useState } from 'react';

const ActivitiesDashboard = () => {
    const [exercises, setExercises] = useState([
        { id: 1, name: 'Morning Run', details: '3.2 km • 25 mins', calories: 320, icon: 'directions_run', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
        { id: 2, name: 'Evening Cycling', details: '5.0 km • 30 mins', calories: 410, icon: 'directions_bike', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' }
    ]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEx, setNewEx] = useState({ name: 'Yoga', duration: '30', calories: '150' });

    const predefinedIcons = {
        'Yoga': { icon: 'self_improvement', bg: 'bg-purple-100', color: 'text-purple-600' },
        'Running': { icon: 'directions_run', bg: 'bg-blue-100', color: 'text-blue-600' },
        'Cycling': { icon: 'directions_bike', bg: 'bg-indigo-100', color: 'text-indigo-600' },
        'Swimming': { icon: 'pool', bg: 'bg-cyan-100', color: 'text-cyan-600' },
        'Weightlifting': { icon: 'fitness_center', bg: 'bg-rose-100', color: 'text-rose-600' }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        const style = predefinedIcons[newEx.name] || predefinedIcons['Running'];
        setExercises([{
            id: Date.now(),
            name: newEx.name,
            details: `${newEx.duration} mins`,
            calories: parseInt(newEx.calories),
            icon: style.icon,
            iconBg: style.bg,
            iconColor: style.color
        }, ...exercises]);
        setShowAddForm(false);
        setNewEx({ name: 'Yoga', duration: '30', calories: '150' });
    };

    return (
        <div className="animate-fade-in relative">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Activity Log</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Review your physical activity, workouts, and calories burned.</p>
            </div>

            {/* Add Exercise Modal */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Log Exercise</h3>
                            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-700">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Activity Type</label>
                                <select value={newEx.name} onChange={e => setNewEx({ ...newEx, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-blue-500">
                                    {Object.keys(predefinedIcons).map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (mins)</label>
                                <input required type="number" value={newEx.duration} onChange={e => setNewEx({ ...newEx, duration: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Calories Burned (kcal)</label>
                                <input required type="number" value={newEx.calories} onChange={e => setNewEx({ ...newEx, calories: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-blue-500" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors mt-2 text-sm shadow-md shadow-blue-500/20 active:scale-95">
                                Log Activity
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 flex flex-col items-center">
                    <div className="flex flex-col md:flex-row gap-4 mb-8 w-full">
                        <div className="flex-1 bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center hover:bg-blue-100 transition-colors cursor-pointer group">
                            <span className="material-symbols-outlined text-blue-600 text-3xl mb-2 group-hover:scale-110 transition-transform">directions_walk</span>
                            <span className="text-4xl font-black text-blue-900 tracking-tight">8,432</span>
                            <span className="text-sm font-bold text-blue-500">Steps Today</span>
                            <div className="w-full bg-blue-200 rounded-full h-2 mt-4 overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '84%' }}></div>
                            </div>
                        </div>

                        <div className="flex-1 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center hover:bg-emerald-100 transition-colors cursor-pointer group">
                            <span className="material-symbols-outlined text-emerald-600 text-3xl mb-2 group-hover:scale-110 transition-transform">timer</span>
                            <span className="text-4xl font-black text-emerald-900 tracking-tight">
                                {exercises.reduce((sum, e) => sum + parseInt(e.details.match(/\d+/)?.[0] || 0), 0)}
                            </span>
                            <span className="text-sm font-bold text-emerald-500">Active Minutes</span>
                            <div className="w-full bg-emerald-200 rounded-full h-2 mt-4 overflow-hidden">
                                <div className="bg-emerald-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, exercises.reduce((sum, e) => sum + parseInt(e.details.match(/\d+/)?.[0] || 0), 0) / 60 * 100)}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 text-base">Recent Exercises</h3>
                        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors active:scale-95">
                            <span className="material-symbols-outlined text-[16px]">add</span> Log Activity
                        </button>
                    </div>

                    <div className="w-full space-y-4">
                        {exercises.length === 0 ? (
                            <div className="text-center py-6 text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">fitness_center</span>
                                <p className="text-sm font-semibold">No exercises logged yet.</p>
                            </div>
                        ) : (
                            exercises.map(ex => (
                                <div key={ex.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`${ex.iconBg} ${ex.iconColor} p-2.5 rounded-xl`}>
                                            <span className="material-symbols-outlined">{ex.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{ex.name}</h4>
                                            <p className="text-xs font-semibold text-slate-500">{ex.details}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-slate-900">{ex.calories} kcal</span>
                                        <button
                                            onClick={() => setExercises(exercises.filter(e => e.id !== ex.id))}
                                            className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivitiesDashboard;
