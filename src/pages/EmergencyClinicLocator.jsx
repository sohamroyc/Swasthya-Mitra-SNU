import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createUserIcon = () => {
    return L.divIcon({
        html: `<div class="w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-lg ring-4 ring-blue-600/30"></div>`,
        className: 'custom-leaflet-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

const createClinicIcon = (type) => {
    let colorHex = "#0f6df0"; // primary
    let iconName = "local_hospital";
    if (type === 'urgent') { colorHex = "#f59e0b"; iconName = "help_clinic"; }
    else if (type === 'pharmacy') { colorHex = "#10b981"; iconName = "local_pharmacy"; }

    return L.divIcon({
        html: `<div style="width: 40px; height: 40px; border-radius: 9999px; background-color: white; border: 2px solid ${colorHex}; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
                <span class="material-symbols-outlined" style="color: ${colorHex}; font-size: 20px;">${iconName}</span>
               </div>`,
        className: 'custom-leaflet-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
};

const CLINICS_DATA = [
    {
        id: 1,
        name: "City General Hospital",
        type: "hospital",
        status: "OPEN",
        phone: "(555) 012-3456",
        distance: "0.8 miles",
        info: "24/7 Emergency Care",
        lat: 40.730610,
        lng: -74.005242,
    },
    {
        id: 2,
        name: "St. Mary's Urgent Care",
        type: "urgent",
        status: "BUSY",
        phone: "(555) 098-7654",
        distance: "2.4 miles",
        info: "Closes at 10 PM",
        lat: 40.741000,
        lng: -73.985000,
    },
    {
        id: 3,
        name: "CVS Pharmacy - 24hr",
        type: "pharmacy",
        status: "OPEN",
        phone: "(555) 055-1212",
        distance: "3.1 miles",
        info: "Pharmacy & OTC",
        lat: 40.712000,
        lng: -73.990000,
    }
];

const FIRST_AID_GUIDES = [
    { id: 1, title: 'Chest Pain (CPR)', desc: 'Step-by-step instructions...', icon: 'heart_broken' },
    { id: 2, title: 'Choking', desc: 'Heimlich maneuver guide...', icon: 'restaurant' },
    { id: 3, title: 'Severe Bleeding', desc: 'How to apply a tourniquet...', icon: 'bloodtype' },
];

function MapController({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        // Force Leaflet to recalculate bounds to fix the "half loaded black screen" glitch
        setTimeout(() => {
            map.invalidateSize();
        }, 250);

        if (center) {
            map.flyTo(center, zoom || 13, { duration: 1.5 });
        }
    }, [center, zoom, map]);
    return null;
}

const EmergencyClinicLocator = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOpenNow, setFilterOpenNow] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [mapCenter, setMapCenter] = useState([40.725, -73.995]);
    const [userLocation, setUserLocation] = useState([40.725, -73.995]);
    const [userLocationName, setUserLocationName] = useState("451 Health Way, NY (Fallback)");
    const [mapZoom, setMapZoom] = useState(13);
    const [guideIndex, setGuideIndex] = useState(0);
    const [liveClinics, setLiveClinics] = useState(CLINICS_DATA);
    const [isLoading, setIsLoading] = useState(true);
    const [apiMessage, setApiMessage] = useState("Fetching location...");

    // Function to fetch real clinics via Overpass API (Free, No Key Needed)
    const fetchRealClinics = async (lat, lng) => {
        setIsLoading(true);
        const radius = 25000; // Increased to 25km to reliably find clinics

        try {
            setApiMessage("Fetching live clinics nearby...");

            // Query OpenStreetMap for hospitals and clinics via Overpass API
            const query = `[out:json][timeout:25];(node["amenity"="hospital"](around:${radius},${lat},${lng});way["amenity"="hospital"](around:${radius},${lat},${lng});node["amenity"="clinic"](around:${radius},${lat},${lng});way["amenity"="clinic"](around:${radius},${lat},${lng});node["amenity"="pharmacy"](around:${radius},${lat},${lng});way["amenity"="pharmacy"](around:${radius},${lat},${lng}););out center;`;

            // Try multiple mirrors if one fails
            const mirrors = [
                'https://overpass-api.de/api/interpreter',
                'https://overpass.kumi.systems/api/interpreter',
                'https://lz4.overpass-api.de/api/interpreter',
                'https://overpass.openstreetmap.fr/api/interpreter'
            ];

            let res;
            let lastError;

            for (const mirror of mirrors) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

                    const url = `${mirror}?data=${encodeURIComponent(query)}`;
                    res = await fetch(url, {
                        method: "GET",
                        signal: controller.signal,
                        headers: {
                            "Accept": "application/json"
                        }
                    });
                    clearTimeout(timeoutId);
                    if (res.ok) break;
                } catch (err) {
                    lastError = err;
                    console.warn(`Mirror ${mirror} failed: ${err.message}`);
                }
            }

            if (!res || !res.ok) {
                throw lastError || new Error(`All Overpass mirrors failed`);
            }
            const data = await res.json();

            if (data.elements && data.elements.length > 0) {
                const mappedClinics = data.elements.map((element, i) => {
                    const props = element.tags || {};
                    let type = "hospital";
                    if (props.amenity === "pharmacy") type = "pharmacy";
                    else if (props.amenity === "doctors" || props.amenity === "clinic") type = "urgent";

                    const elLat = element.center ? element.center.lat : element.lat;
                    const elLon = element.center ? element.center.lon : element.lon;

                    // Rough distance calculation in miles
                    const R = 3958.8; // Radius of the Earth in miles
                    const rlat1 = lat * (Math.PI / 180);
                    const rlat2 = elLat * (Math.PI / 180);
                    const difflat = rlat2 - rlat1;
                    const difflon = (elLon - lng) * (Math.PI / 180);
                    const a = Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2);
                    const distance = 2 * R * Math.asin(Math.sqrt(a));

                    return {
                        id: element.id,
                        name: props.name || "Medical Facility",
                        type: type,
                        status: "OPEN",
                        phone: props.phone || props['contact:phone'] || "Unlisted",
                        distance: distance.toFixed(1) + " miles",
                        info: props['healthcare:speciality'] || props.dispensing || props.amenity || "General Care",
                        lat: elLat,
                        lng: elLon,
                    };
                });

                // Sort by nearest distance first
                mappedClinics.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

                // Prefer named clinics, but fallback to unnamed if necessary to get 3
                let finalClinics = mappedClinics.filter(c => c.name !== "Medical Facility");
                if (finalClinics.length < 3) {
                    finalClinics = mappedClinics; // Fallback to all including unnamed
                }

                // Ensure only max 3 nearest items are shown
                setLiveClinics(finalClinics.slice(0, 3));
                setApiMessage(""); // Clear message if successful
            } else {
                setLiveClinics([]);
                setApiMessage("No healthcare facilities found nearby.");
            }
        } catch (error) {
            console.error("Overpass API Error", error);
            setApiMessage("Failed to fetch live clinics. Reverting to demo data.");
            setLiveClinics(CLINICS_DATA);
        } finally {
            setIsLoading(false);
        }
    };

    // Attempt Geolocation on mount with IP fallback
    useEffect(() => {
        const fetchIPLocation = async () => {
            try {
                setApiMessage("Checking network location...");
                const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
                const data = await res.json();
                if (data.latitude && data.longitude) {
                    const lat = parseFloat(data.latitude);
                    const lng = parseFloat(data.longitude);
                    setUserLocation([lat, lng]);
                    setMapCenter([lat, lng]);
                    setUserLocationName(`${data.city}, ${data.region} (Network)`);
                    fetchRealClinics(lat, lng);
                } else {
                    throw new Error("Invalid IP Data");
                }
            } catch (err) {
                console.warn("IP Geolocation failed. Using default.");
                fetchRealClinics(mapCenter[0], mapCenter[1]);
            }
        };

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setUserLocation([lat, lng]);
                    setMapCenter([lat, lng]);
                    setUserLocationName("Your Live Location");
                    fetchRealClinics(lat, lng);
                },
                (err) => {
                    console.warn("Browser Geolocation blocked/failed:", err.message);
                    fetchIPLocation(); // Fallback to IP 
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            fetchIPLocation();
        }
    }, []);

    // Filter clinics
    const displayClinics = liveClinics.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesOpen = filterOpenNow ? c.status === "OPEN" : true;
        return matchesSearch && matchesOpen;
    });

    const handleClinicClick = (clinic) => {
        setSelectedClinic(clinic.id);
        setMapCenter([clinic.lat, clinic.lng]);
        setMapZoom(15);
    };

    const nextGuide = () => {
        setGuideIndex((prev) => (prev + 1) % FIRST_AID_GUIDES.length);
    };

    const prevGuide = () => {
        setGuideIndex((prev) => (prev - 1 + FIRST_AID_GUIDES.length) % FIRST_AID_GUIDES.length);
    };

    const handleCall911 = () => {
        alert("Simulating emergency call 911...");
    };

    return (
        <AppLayout activeTab="clinics">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Nearby Clinics & SOS</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">Locate emergency healthcare, hospitals, and active clinics near you.</p>
                
                <div className="flex flex-col lg:flex-row border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm h-[640px] relative">
                    {/* Sidebar: Clinic List & SOS */}
                    <aside className="w-full lg:w-96 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shrink-0 z-10 shadow-lg h-full">
                        {/* High-Visibility SOS Section */}
                        <div className="p-6 bg-red-50 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/30 shrink-0">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-red-600 dark:text-red-400 font-bold text-lg uppercase tracking-wider flex items-center gap-2">
                                        <span className="material-symbols-outlined fill-1">emergency</span>
                                        Emergency
                                    </h3>
                                    <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[10px] font-bold animate-pulse">LIVE</span>
                                </div>
                                <button onClick={handleCall911} className="sos-pulse w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-4 rounded-xl flex flex-col items-center justify-center gap-1 transition-all shadow-lg hover:shadow-red-600/50">
                                    <span className="text-2xl font-black">CALL 911</span>
                                    <span className="text-xs opacity-90">One-tap emergency dispatch</span>
                                </button>
                            </div>
                        </div>

                        {/* First Aid Quick Guide Carousel */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
                                    Quick First Aid Guide
                                </p>
                                <div className="flex gap-1">
                                    <button onClick={prevGuide} className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><span className="material-symbols-outlined text-lg">chevron_left</span></button>
                                    <button onClick={nextGuide} className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg flex items-center gap-4 transition-all duration-300">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                                    <span className="material-symbols-outlined text-2xl">{FIRST_AID_GUIDES[guideIndex].icon}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{FIRST_AID_GUIDES[guideIndex].title}</p>
                                    <p className="text-xs text-slate-500 line-clamp-1">{FIRST_AID_GUIDES[guideIndex].desc}</p>
                                    <button className="text-[10px] mt-1 text-primary hover:underline font-bold">Read instructions →</button>
                                </div>
                            </div>
                        </div>

                        {/* Clinic Listings */}
                        <div className="p-4 flex flex-col gap-2 overflow-y-auto flex-1">
                            <h1 className="text-slate-900 dark:text-slate-100 text-base font-bold mb-2 px-2">Nearby Medical Facilities</h1>

                            {apiMessage && (
                                <div className="px-3 py-2 mx-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[11px] rounded-lg border border-blue-100 dark:border-blue-900/50 mb-2">
                                    {isLoading && <span className="material-symbols-outlined text-[14px] animate-spin mr-1 align-middle">progress_activity</span>}
                                    {apiMessage}
                                </div>
                            )}

                            {!isLoading && displayClinics.length === 0 && (
                                <div className="p-4 text-center text-slate-500 text-sm">
                                    No facilities found matching your criteria.
                                </div>
                            )}

                            {displayClinics.map(clinic => {
                                const isSelected = selectedClinic === clinic.id;
                                let bgIconColor = "bg-primary/10 text-primary";
                                let iconName = "local_hospital";
                                let statusBg = clinic.status === "OPEN" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";

                                if (clinic.type === 'urgent') { bgIconColor = "bg-amber-100 text-amber-600"; iconName = "help_clinic"; }
                                else if (clinic.type === 'pharmacy') { bgIconColor = "bg-green-100 text-green-600"; iconName = "local_pharmacy"; }

                                return (
                                    <div
                                        key={clinic.id}
                                        onClick={() => handleClinicClick(clinic)}
                                        className={`p-4 rounded-xl transition-all border cursor-pointer group ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${bgIconColor}`}>
                                                <span className="material-symbols-outlined">{iconName}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{clinic.name}</p>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusBg}`}>{clinic.status}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">call</span> {clinic.phone}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">{clinic.distance} • {clinic.info}</p>

                                                {isSelected && (
                                                    <div className="flex gap-2 mt-4 animate-fade-in-up">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); alert(`Getting directions to ${clinic.name}...`); }}
                                                            className="flex-1 py-2 rounded-lg bg-primary hover:bg-blue-700 text-white text-[11px] font-bold shadow-md shadow-primary/20 transition-colors">
                                                            Directions
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); alert(`Viewing details for ${clinic.name}...`); }}
                                                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                            Details
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </aside>

                    {/* Map Area */}
                    <section className="flex-1 relative bg-slate-100 dark:bg-slate-900 z-0 h-full">
                        {/* Interactive React Leaflet Map */}
                        <div className="absolute inset-0 leaflet-container-override">
                            <MapContainer
                                center={mapCenter}
                                zoom={mapZoom}
                                zoomControl={false}
                                style={{ height: '100%', width: '100%' }}
                            >
                                {/* Using CartoDB Dark Matter tile layer for a sleek dark mode look */}
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
                                />

                                <MapController center={mapCenter} zoom={mapZoom} />

                                {/* User Marker */}
                                <Marker position={userLocation} icon={createUserIcon()}>
                                    <Popup className="custom-popup">
                                        <div className="font-bold text-slate-800 text-sm">Your Location</div>
                                    </Popup>
                                </Marker>

                                {/* Clinic Markers */}
                                {displayClinics.map(clinic => (
                                    <Marker
                                        key={clinic.id}
                                        position={[clinic.lat, clinic.lng]}
                                        icon={createClinicIcon(clinic.type)}
                                        eventHandlers={{
                                            click: () => handleClinicClick(clinic)
                                        }}
                                    >
                                        <Popup className="custom-popup">
                                            <div className="font-bold text-slate-800 text-sm mb-1">{clinic.name}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px]">schedule</span> {clinic.info}
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>

                        {/* Map UI Controls Overlays */}
                        {/* We use Leaflet without default controls, so we add custom overlay controls here */}
                        <div className="absolute top-6 right-6 flex flex-col gap-3 z-[400] pointer-events-none">
                            <div className="flex flex-col rounded-xl overflow-hidden shadow-2xl shadow-slate-900/20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 pointer-events-auto">
                                <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 border-b border-slate-200 dark:border-slate-700 transition-colors"
                                    onClick={() => setMapZoom(z => Math.min(z + 1, 18))}>
                                    <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">add</span>
                                </button>
                                <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    onClick={() => setMapZoom(z => Math.max(z - 1, 3))}>
                                    <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">remove</span>
                                </button>
                            </div>
                            <button
                                onClick={() => { setMapCenter(userLocation); setMapZoom(13); setSelectedClinic(null); }}
                                className="p-3 rounded-xl shadow-2xl shadow-slate-900/20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors pointer-events-auto group">
                                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">my_location</span>
                            </button>
                        </div>

                        {/* Floating Search/Filter Bar */}
                        <div className="absolute top-6 left-6 md:left-[30%] lg:left-6 z-[400] pointer-events-none">
                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/20 p-2 flex gap-2 border border-slate-200/50 dark:border-slate-700/50 pointer-events-auto min-w-[280px]">
                                <button
                                    className={`flex-1 overflow-hidden relative group py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all
                                        ${!filterOpenNow ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                    onClick={() => setFilterOpenNow(false)}
                                >
                                    <span className="material-symbols-outlined text-sm">filter_alt</span>
                                    <span className="relative z-10">All Facilities</span>
                                </button>
                                <button
                                    className={`flex-1 overflow-hidden relative group py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all
                                        ${filterOpenNow ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                    onClick={() => setFilterOpenNow(true)}
                                >
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    <span className="relative z-10">Open Now</span>
                                </button>
                            </div>
                        </div>

                        {/* Current Location Footer Info */}
                        <div className="absolute bottom-6 left-6 z-[400] pointer-events-none">
                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/20 p-4 border border-slate-200/50 dark:border-slate-700/50 flex flex-col items-start gap-3 min-w-[300px] pointer-events-auto">
                                <div className="flex items-center gap-3 w-full">
                                    <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider leading-none mb-1">Your current location</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{userLocationName}</p>
                                    </div>
                                </div>
                                <div className="w-full text-xs font-semibold text-slate-500 flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-3 mt-1">
                                    <span>{displayClinics.length} Facilities found</span>
                                    <button className="text-primary hover:underline" onClick={() => { setMapCenter(userLocation); setMapZoom(13); }}>Recenter</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Injected CSS for Leaflet overrides */}
            <style jsx="true">{`
                .leaflet-container-override .leaflet-control-attribution {
                    background: rgba(15, 23, 42, 0.7) !important;
                    color: #94a3b8 !important;
                }
                .leaflet-container-override .leaflet-control-attribution a {
                    color: #38bdf8 !important;
                }
                .custom-popup .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                    padding: 4px;
                }
                .leaflet-marker-icon.custom-leaflet-icon {
                    background: none;
                    border: none;
                }
            `}</style>
        </AppLayout>
    );
};

export default EmergencyClinicLocator;
