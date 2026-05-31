import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

/* ─── Overpass API: fetch nearby medical facilities ─── */
const fetchNearbyFacilities = async (lat, lon, radiusM = 5000) => {
    const q = `
        [out:json][timeout:15];
        (
          node["amenity"="hospital"](around:${radiusM},${lat},${lon});
          node["amenity"="clinic"](around:${radiusM},${lat},${lon});
          node["amenity"="doctors"](around:${radiusM},${lat},${lon});
          node["amenity"="health_post"](around:${radiusM},${lat},${lon});
          node["healthcare"="hospital"](around:${radiusM},${lat},${lon});
          node["healthcare"="clinic"](around:${radiusM},${lat},${lon});
          node["healthcare"="doctor"](around:${radiusM},${lat},${lon});
        );
        out body 30;
    `;
    const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: q,
        headers: { 'Content-Type': 'text/plain' },
    });
    const data = await res.json();
    return (data.elements || [])
        .filter(el => el.tags?.name)
        .map(el => ({
            id: el.id,
            name: el.tags.name,
            type: el.tags.amenity || el.tags.healthcare || 'clinic',
            address: [el.tags['addr:street'], el.tags['addr:city']].filter(Boolean).join(', ') || null,
            phone: el.tags.phone || el.tags['contact:phone'] || null,
            lat: el.lat,
            lon: el.lon,
            distance: Math.round(
                Math.sqrt(
                    Math.pow((el.lat - lat) * 111320, 2) +
                    Math.pow((el.lon - lon) * 111320 * Math.cos(lat * Math.PI / 180), 2)
                )
            ),
        }))
        .sort((a, b) => a.distance - b.distance);
};

const fmtDist = (m) => m < 1000 ? `${m} m away` : `${(m / 1000).toFixed(1)} km away`;

const facilityMeta = (type) => {
    switch (type) {
        case 'hospital': return { label: 'Hospital', icon: 'local_hospital', color: 'red' };
        case 'doctors': case 'doctor': return { label: 'Doctor', icon: 'stethoscope', color: 'emerald' };
        case 'health_post': return { label: 'Health Post', icon: 'medical_services', color: 'purple' };
        default: return { label: 'Clinic', icon: 'health_and_safety', color: 'blue' };
    }
};

const specialtiesList = [
    { name: 'General Physician', icon: 'stethoscope' },
    { name: 'Pediatrician', icon: 'child_care' },
    { name: 'Cardiologist', icon: 'cardiology' },
    { name: 'Dermatologist', icon: 'face' },
    { name: 'Neurologist', icon: 'psychology' },
    { name: 'Gynecologist', icon: 'pregnant_woman' },
    { name: 'Dentist', icon: 'dentistry' },
];

/* ═══════════════════════════════════════════════════════ */
const FirstAidKnowledgeBase = () => {
    const navigate = useNavigate();

    // Search
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');

    // Location & nearby facilities
    const [locationStatus, setLocationStatus] = useState('idle'); // idle | loading | ready | denied
    const [userCity, setUserCity] = useState('');
    const [userCoords, setUserCoords] = useState(null);
    const [nearbyFacilities, setNearbyFacilities] = useState([]);
    const [facilityRadius, setFacilityRadius] = useState(5000);
    const [facilitiesLoading, setFacilitiesLoading] = useState(false);
    const locationFetchedRef = useRef(false);

    const loadFacilities = useCallback(async (lat, lon, radius) => {
        setFacilitiesLoading(true);
        try {
            const results = await fetchNearbyFacilities(lat, lon, radius);
            setNearbyFacilities(results);
        } catch (err) {
            console.error('Overpass API error:', err);
        } finally {
            setFacilitiesLoading(false);
        }
    }, []);

    const detectLocation = useCallback(() => {
        if (!navigator.geolocation) { setLocationStatus('denied'); return; }
        setLocationStatus('loading');
        navigator.geolocation.getCurrentPosition(
            async ({ coords: { latitude: lat, longitude: lon } }) => {
                setUserCoords({ lat, lon });
                setLocationStatus('ready');
                try {
                    const r = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    const geo = await r.json();
                    const a = geo.address || {};
                    const city = a.city || a.town || a.village || a.county || 'your area';
                    const state = a.state || '';
                    setUserCity(state ? `${city}, ${state}` : city);
                } catch (_) { setUserCity('your area'); }
                await loadFacilities(lat, lon, facilityRadius);
            },
            (err) => {
                console.warn('Geolocation denied:', err.message);
                setLocationStatus('denied');
            },
            { timeout: 10000, maximumAge: 60000 }
        );
    }, [facilityRadius, loadFacilities]);

    // Auto-detect on mount (once)
    useEffect(() => {
        if (!locationFetchedRef.current) {
            locationFetchedRef.current = true;
            detectLocation();
        }
    }, [detectLocation]);

    // Re-fetch when radius changes
    useEffect(() => {
        if (userCoords) loadFacilities(userCoords.lat, userCoords.lon, facilityRadius);
    }, [facilityRadius]);

    // Filter nearby facilities by search + specialty
    const filteredFacilities = nearbyFacilities.filter(f => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || f.name.toLowerCase().includes(q) || (f.address || '').toLowerCase().includes(q);
        const matchSpecialty = !selectedSpecialty || f.name.toLowerCase().includes(selectedSpecialty.toLowerCase());
        return matchSearch && matchSpecialty;
    });

    return (
        <AppLayout activeTab="doctor">
            <div className="max-w-[1100px] mx-auto px-2 py-4">

                {/* ── Search Bar ── */}
                <div className="flex flex-col md:flex-row gap-3 mb-10 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    {/* Location field */}
                    <div className="flex items-center bg-slate-100/80 rounded-xl px-4 py-3 w-full md:w-[30%] border border-slate-200 focus-within:border-blue-500 transition-colors gap-2">
                        <span className="material-symbols-outlined text-slate-500 shrink-0">location_on</span>
                        <input
                            type="text"
                            className="bg-transparent border-none outline-none w-full text-slate-700 placeholder-slate-400 font-medium text-sm"
                            value={userCity}
                            onChange={e => setUserCity(e.target.value)}
                            placeholder={locationStatus === 'loading' ? 'Detecting location…' : 'Enter city or area'}
                        />
                        {locationStatus === 'loading' && (
                            <span className="material-symbols-outlined text-blue-500 text-[16px] animate-spin shrink-0" style={{ animationDuration: '1.2s' }}>progress_activity</span>
                        )}
                        {locationStatus === 'ready' && (
                            <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0">my_location</span>
                        )}
                        {locationStatus === 'denied' && (
                            <button onClick={detectLocation} title="Retry location" className="shrink-0">
                                <span className="material-symbols-outlined text-amber-500 text-[16px]">location_off</span>
                            </button>
                        )}
                    </div>

                    {/* Search field */}
                    <div className="flex items-center bg-slate-100/80 rounded-xl px-4 py-3 w-full md:w-[50%] border border-slate-200 focus-within:border-blue-500 transition-colors gap-2">
                        <span className="material-symbols-outlined text-slate-500 shrink-0">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-slate-700 placeholder-slate-400 font-medium text-sm"
                            placeholder="Search hospitals, clinics, doctors…"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="shrink-0">
                                <span className="material-symbols-outlined text-slate-400 text-[16px]">close</span>
                            </button>
                        )}
                    </div>

                    {/* Find button */}
                    <button
                        onClick={detectLocation}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-600/20 md:w-[20%] flex items-center justify-center gap-2 text-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">location_searching</span>
                        Find Nearby
                    </button>
                </div>

                {/* ── Specialties ── */}
                <h2 className="text-xl font-bold mb-6 text-slate-800">Browse by Specialty</h2>
                <div className="flex flex-wrap gap-5 mb-12">
                    {specialtiesList.map((spec, i) => {
                        const isActive = selectedSpecialty === spec.name.split(' ')[0];
                        return (
                            <div
                                key={i}
                                onClick={() => setSelectedSpecialty(isActive ? '' : spec.name.split(' ')[0])}
                                className="flex flex-col items-center gap-3 cursor-pointer group"
                            >
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center border transition-all shadow-sm ${isActive ? 'bg-blue-100 border-blue-500 shadow-md' : 'bg-blue-50/50 border-slate-200 group-hover:border-blue-300 group-hover:bg-blue-50 group-hover:shadow-md'}`}>
                                    <span className={`material-symbols-outlined text-3xl transition-colors ${isActive ? 'text-blue-700' : 'text-slate-700 group-hover:text-blue-600'}`}>{spec.icon}</span>
                                </div>
                                <span className={`text-xs font-bold transition-colors text-center ${isActive ? 'text-blue-700' : 'text-slate-600 group-hover:text-blue-600'}`}>{spec.name}</span>
                            </div>
                        );
                    })}
                </div>

                {/* ── Realtime Nearby Facilities ── */}
                <div>
                    {/* Section header */}
                    <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                {locationStatus === 'ready' ? (
                                    <>
                                        <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                                        Nearby Doctors &amp; Facilities
                                    </>
                                ) : locationStatus === 'loading' ? (
                                    <>
                                        <span className="material-symbols-outlined text-[18px] text-blue-500 animate-spin" style={{ animationDuration: '1.2s' }}>progress_activity</span>
                                        Detecting your location…
                                    </>
                                ) : (
                                    'Doctors & Facilities'
                                )}
                            </h2>
                            {locationStatus === 'ready' && (
                                <p className="text-sm text-slate-400 font-medium mt-0.5">
                                    {userCity && <span>📍 {userCity} · </span>}
                                    {facilitiesLoading ? 'Fetching live data…' : `${filteredFacilities.length} of ${nearbyFacilities.length} results`}
                                </p>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {locationStatus === 'ready' && (
                                <>
                                    <span className="text-xs text-slate-500 font-semibold">Radius:</span>
                                    {[2000, 5000, 10000].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setFacilityRadius(r)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${facilityRadius === r ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'}`}
                                        >
                                            {r / 1000} km
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => userCoords && loadFacilities(userCoords.lat, userCoords.lon, facilityRadius)}
                                        className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                                        Refresh
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Location denied */}
                    {locationStatus === 'denied' && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-center gap-5 mb-6">
                            <div className="size-12 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-2xl">location_off</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-amber-800">Location access denied</p>
                                <p className="text-xs text-amber-700 mt-1 leading-relaxed">Enable location in your browser settings to see real nearby hospitals, clinics, and doctors in your area.</p>
                            </div>
                            <button
                                onClick={detectLocation}
                                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm"
                            >
                                Allow Location
                            </button>
                        </div>
                    )}

                    {/* Idle / loading state */}
                    {locationStatus === 'idle' && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-10 text-center">
                            <div className="size-14 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">location_searching</span>
                            </div>
                            <p className="text-slate-700 font-bold text-sm">Detecting your location</p>
                            <p className="text-slate-400 text-xs mt-1">Please allow location access when prompted</p>
                        </div>
                    )}

                    {/* Facilities grid */}
                    {(locationStatus === 'ready' || facilitiesLoading) && (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                            {/* Loading skeleton */}
                            {facilitiesLoading && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="flex gap-4 p-5 border-b border-slate-100 animate-pulse">
                                            <div className="size-12 rounded-xl bg-slate-100 shrink-0" />
                                            <div className="flex-1 space-y-2 py-1">
                                                <div className="h-3 bg-slate-100 rounded w-3/4" />
                                                <div className="h-2 bg-slate-100 rounded w-1/2" />
                                                <div className="h-2 bg-slate-100 rounded w-1/3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* No results */}
                            {!facilitiesLoading && filteredFacilities.length === 0 && nearbyFacilities.length > 0 && (
                                <div className="p-10 text-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                                    <p className="text-sm text-slate-400 font-semibold mt-3">No facilities match "{searchQuery || selectedSpecialty}"</p>
                                    <button onClick={() => { setSearchQuery(''); setSelectedSpecialty(''); }} className="mt-3 text-xs font-bold text-blue-600 hover:underline">
                                        Clear filters
                                    </button>
                                </div>
                            )}

                            {!facilitiesLoading && nearbyFacilities.length === 0 && (
                                <div className="p-10 text-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-300">location_off</span>
                                    <p className="text-sm text-slate-500 font-semibold mt-3">No facilities found within {facilityRadius / 1000} km</p>
                                    <button
                                        onClick={() => setFacilityRadius(r => Math.min(r + 5000, 20000))}
                                        className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Expand to {(facilityRadius + 5000) / 1000} km
                                    </button>
                                </div>
                            )}

                            {/* Facility cards */}
                            {!facilitiesLoading && filteredFacilities.length > 0 && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                        {filteredFacilities.map((facility, i) => {
                                            const m = facilityMeta(facility.type);
                                            const isLastRow = i >= filteredFacilities.length - (filteredFacilities.length % 3 || 3);
                                            return (
                                                <a
                                                    key={facility.id}
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.name)}&center=${facility.lat},${facility.lon}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors group border-b border-r border-slate-100 last:border-r-0"
                                                >
                                                    <div className={`size-12 rounded-xl bg-${m.color}-50 text-${m.color}-600 border border-${m.color}-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
                                                        <span className="material-symbols-outlined text-[22px]">{m.icon}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                                            <p className="text-sm font-bold text-slate-800 leading-tight">{facility.name}</p>
                                                            <span className="material-symbols-outlined text-[13px] text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 mt-0.5">open_in_new</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <span className={`text-[9px] font-black uppercase tracking-wider text-${m.color}-600 bg-${m.color}-50 border border-${m.color}-100 px-2 py-0.5 rounded`}>
                                                                {m.label}
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-0.5">
                                                                <span className="material-symbols-outlined text-[11px]">straighten</span>
                                                                {fmtDist(facility.distance)}
                                                            </span>
                                                        </div>
                                                        {facility.address && (
                                                            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[10px]">location_on</span>
                                                                {facility.address}
                                                            </p>
                                                        )}
                                                        {facility.phone && (
                                                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                                <span className="material-symbols-outlined text-[10px]">call</span>
                                                                {facility.phone}
                                                            </p>
                                                        )}
                                                    </div>
                                                </a>
                                            );
                                        })}
                                    </div>

                                    {/* Footer */}
                                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                        <span className="text-xs text-slate-400 font-semibold">
                                            {filteredFacilities.length} facilities · Live from OpenStreetMap · {facilityRadius / 1000} km radius
                                        </span>
                                        <button
                                            onClick={() => setFacilityRadius(r => Math.min(r + 5000, 20000))}
                                            disabled={facilityRadius >= 20000}
                                            className="text-xs font-bold text-blue-600 hover:underline disabled:text-slate-300 disabled:no-underline"
                                        >
                                            Load wider area →
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* ── AI Suggestion Banner ── */}
                <div className="mt-10 bg-blue-600 rounded-2xl p-6 flex items-center justify-between text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 opacity-10">
                        <span className="material-symbols-outlined text-[120px]">smart_toy</span>
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 backdrop-blur-sm">
                            <span className="material-symbols-outlined text-3xl text-white">smart_toy</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight mb-1">Not sure which facility to visit?</h3>
                            <p className="text-blue-100 text-sm font-medium">Get an instant AI symptom assessment before your visit — free &amp; instant.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/ai-symptom-checker-interface')}
                        className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-lg hover:shadow-lg transition-all active:scale-95 text-sm relative z-10 shrink-0"
                    >
                        Try AI Checker →
                    </button>
                </div>

            </div>
        </AppLayout>
    );
};

export default FirstAidKnowledgeBase;
