import React, { useState } from 'react';

const NutritionDashboard = () => {
    const [waterGlasses, setWaterGlasses] = useState(5);
    const maxGlasses = 8;

    const [meals, setMeals] = useState([
        { id: 1, name: 'Breakfast', description: 'Oatmeal, Banana', calories: 350 },
        { id: 2, name: 'Lunch', description: 'Chicken Salad', calories: 450 }
    ]);
    const [showAddMealForm, setShowAddMealForm] = useState(false);
    const [newMeal, setNewMeal] = useState({ name: '', description: '', calories: '' });

    const handleGlassClick = (index) => {
        setWaterGlasses(index + 1);
    };

    const handleAddMeal = (e) => {
        e.preventDefault();
        if (newMeal.name && newMeal.calories) {
            setMeals([...meals, {
                id: Date.now(),
                name: newMeal.name,
                description: newMeal.description,
                calories: parseInt(newMeal.calories)
            }]);
            setShowAddMealForm(false);
            setNewMeal({ name: '', description: '', calories: '' });
        }
    };

    const totalConsumed = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const goal = 2200;
    const remaining = Math.max(0, goal - totalConsumed);
    const progress = Math.min((totalConsumed / goal) * 100, 100);

    return (
        <div className="animate-fade-in relative">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nutrition Tracker</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Monitor your diet, caloric intake, and hydration.</p>
            </div>

            {/* Add Meal Modal Overlay */}
            {showAddMealForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Add Meal Log</h3>
                            <button onClick={() => setShowAddMealForm(false)} className="text-slate-400 hover:text-slate-700">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddMeal} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Meal Name</label>
                                <input required type="text" placeholder="e.g., Dinner" value={newMeal.name} onChange={e => setNewMeal({ ...newMeal, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                                <input type="text" placeholder="e.g., Grilled Salmon & Veggies" value={newMeal.description} onChange={e => setNewMeal({ ...newMeal, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Calories (kcal)</label>
                                <input required type="number" placeholder="400" value={newMeal.calories} onChange={e => setNewMeal({ ...newMeal, calories: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-blue-500" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors mt-2 text-sm shadow-md shadow-blue-500/20">
                                Save Meal
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Calories Budget */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 w-full text-center md:text-left">
                        <h3 className="font-bold text-slate-900 text-base mb-1">Calories Budget</h3>
                        <p className="text-sm font-medium text-slate-500 mb-4">You have {remaining} kcal left today.</p>

                        <div className="flex justify-between mb-2">
                            <div>
                                <span className="block text-xl font-black text-slate-900">{totalConsumed}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Consumed</span>
                            </div>
                            <div>
                                <span className="block text-xl font-black text-slate-900">{goal}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Goal</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                            <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-1/2">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Carbs ({(200 - (progress / 100) * 200).toFixed(0)}g left)</span>
                                <span>{((progress / 100) * 200).toFixed(0)} / 200g</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Proteins ({(120 - (progress / 100) * 120).toFixed(0)}g left)</span>
                                <span>{((progress / 100) * 120).toFixed(0)} / 120g</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Fats ({(50 - (progress / 100) * 50).toFixed(0)}g left)</span>
                                <span>{((progress / 100) * 50).toFixed(0)} / 50g</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hydration */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-slate-500">Hydration</span>
                        <div className="text-cyan-500">
                            <span className="material-symbols-outlined text-[20px]">water_drop</span>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-4xl font-black text-slate-900 tracking-tight">{(waterGlasses * 0.25).toFixed(1)}</span>
                        <span className="text-sm font-bold text-slate-400">/ 2.0 L</span>
                    </div>
                    <div className="flex gap-2 justify-between mt-2">
                        {Array.from({ length: maxGlasses }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleGlassClick(index)}
                                className={`w-8 h-10 rounded-lg transition-all transform active:scale-90 ${index < waterGlasses ? 'bg-cyan-500 shadow-lg shadow-cyan-500/20' : 'bg-cyan-50 hover:bg-cyan-100 border border-cyan-100'}`}
                                aria-label={`Drink glass ${index + 1}`}
                                title={`${(index + 1) * 250} ml`}
                            />
                        ))}
                    </div>
                </div>

                {/* Meals */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <span className="text-sm font-bold text-slate-900">Meals Today</span>
                        <button onClick={() => setShowAddMealForm(true)} className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[16px] mr-1">add</span> Add Log
                        </button>
                    </div>
                    {meals.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-6 text-center">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">fastfood</span>
                            <p className="text-xs font-semibold">No meals logged yet today.</p>
                        </div>
                    ) : (
                        <ul className="space-y-4 flex-1 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
                            {meals.map(meal => (
                                <li key={meal.id} className="flex justify-between items-center group">
                                    <div className="flex-1">
                                        <span className="block font-bold text-sm text-slate-800">{meal.name}</span>
                                        <span className="text-xs font-medium text-slate-500">{meal.description}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-black text-slate-700">{meal.calories} kcal</span>
                                        <button onClick={() => setMeals(meals.filter(m => m.id !== meal.id))} className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NutritionDashboard;
