import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { supabase } from '../supabaseClient';

const specialtiesList = [
    { name: "General Physician", icon: "stethoscope" },
    { name: "Pediatrician", icon: "child_care" },
    { name: "Cardiologist", icon: "cardiology" },
    { name: "Dermatologist", icon: "face" },
    { name: "Neurologist", icon: "psychology" },
    { name: "Gynecologist", icon: "pregnant_woman" },
    { name: "Dentist", icon: "dentistry" },
];

const FirstAidKnowledgeBase = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    return (
        <AppLayout activeTab="doctor">
            {selectedDoctor ? (
                <DoctorDetailView doctor={selectedDoctor} onBack={() => setSelectedDoctor(null)} />
            ) : (
                <DoctorListView onSelectDoctor={setSelectedDoctor} />
            )}
        </AppLayout>
    );
};

const DoctorListView = ({ onSelectDoctor }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const DEFAULT_DOCTORS = [
        {
            id: 1,
            name: "Dr. Ananya Sharma",
            specialty: "General Physician • MBBS, MD",
            experience: "15 years experience overall",
            location: "Max Hospital, Saket",
            fee: "₹800",
            satisfaction: "98%",
            stories: "120",
            avatar: "https://i.pravatar.cc/150?img=45",
            gender: "Female",
            availability: ["Available Today", "Next 3 Days"],
            role: "Senior Consultant"
        },
        {
            id: 2,
            name: "Dr. Vikram Malhotra",
            specialty: "Cardiologist • MBBS, MD, DM",
            experience: "20 years experience overall",
            location: "Fortis Escorts, New Delhi",
            fee: "₹1200",
            satisfaction: "96%",
            stories: "245",
            avatar: "https://i.pravatar.cc/150?img=12",
            gender: "Male",
            availability: ["Available Tomorrow"],
            role: "Chief Cardiologist"
        },
        {
            id: 3,
            name: "Dr. Priya Das",
            specialty: "Pediatrician • MBBS, DCH",
            experience: "10 years experience overall",
            location: "Apollo Cradle, Nehru Place",
            fee: "₹700",
            satisfaction: "99%",
            stories: "85",
            avatar: "https://i.pravatar.cc/150?img=32",
            gender: "Female",
            availability: ["Available Today", "Available Tomorrow"],
            role: "Consultant Pediatrician"
        },
        {
            id: 4,
            name: "Dr. Rohan Gupta",
            specialty: "Dermatologist • MBBS, DDVL",
            experience: "12 years experience overall",
            location: "Skin Wellness Clinic, GK II",
            fee: "₹1000",
            satisfaction: "94%",
            stories: "150",
            avatar: "https://i.pravatar.cc/150?img=11",
            gender: "Male",
            availability: ["Next 3 Days"],
            role: "Dermatology Specialist"
        }
    ];

    const [doctorsMock, setDoctorsMock] = useState(DEFAULT_DOCTORS);
    const [filters, setFilters] = useState({
        availability: [],
        fee: [],
        gender: []
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data, error } = await supabase.from('doctors').select('*');
                if (error) throw error;
                if (data && data.length > 0) {
                    setDoctorsMock(data);
                }
            } catch (error) {
                console.warn("Using local mock doctors (Supabase fetch bypassed or failed)");
            }
        };
        fetchDoctors();
    }, []);

    // Toggle filter logic
    const toggleFilter = (category, value) => {
        setFilters(prev => {
            const current = prev[category];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    // Filtered Doctors list
    const filteredDoctors = useMemo(() => {
        return doctorsMock.filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSpecialty = selectedSpecialty === "" ? true : doc.specialty.includes(selectedSpecialty);

            const matchesAvailability = filters.availability.length === 0 ? true : (doc.availability && doc.availability.some(a => filters.availability.includes(a)));
            const matchesGender = filters.gender.length === 0 ? true : filters.gender.includes(doc.gender);

            // Fee logic
            const matchesFee = filters.fee.length === 0 ? true : filters.fee.some(filterFee => {
                const feeVal = parseInt(doc.fee.replace(/[^0-9]/g, '')) || 0;
                if (filterFee === 'Free') return feeVal === 0;
                if (filterFee === '₹0 - ₹500') return feeVal >= 0 && feeVal <= 500;
                if (filterFee === '₹500 - ₹1000') return feeVal >= 500 && feeVal <= 1000;
                if (filterFee === '₹1000+') return feeVal >= 1000;
                return true;
            });

            return matchesSearch && matchesSpecialty && matchesAvailability && matchesGender && matchesFee;
        });
    }, [searchQuery, selectedSpecialty, doctorsMock, filters]);

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-8">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex bg-slate-100/80 rounded-xl px-4 py-3 items-center w-full md:w-[30%] border border-slate-200 focus-within:border-blue-500 transition-colors">
                    <span className="material-symbols-outlined text-slate-500 mr-3">location_on</span>
                    <input type="text" className="bg-transparent border-none outline-none w-full text-slate-700 placeholder-slate-400 font-medium" defaultValue="New Delhi, India" />
                </div>
                <div className="flex bg-slate-100/80 rounded-xl px-4 py-3 items-center w-full md:w-[50%] border border-slate-200 focus-within:border-blue-500 transition-colors">
                    <span className="material-symbols-outlined text-slate-500 mr-3">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-slate-700 placeholder-slate-400 font-medium"
                        placeholder="Search Specialty, Doctor name or Hospital"
                    />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-600/20 md:w-[20%]">Find Doctors</button>
            </div>

            {/* Specialties */}
            <h2 className="text-xl font-bold mb-6 text-slate-800">Top Specialties</h2>
            <div className="flex flex-wrap gap-6 mb-12">
                {specialtiesList.map((spec, i) => {
                    const isActive = selectedSpecialty === spec.name.split(' ')[0];
                    return (
                        <div
                            key={i}
                            onClick={() => setSelectedSpecialty(isActive ? "" : spec.name.split(' ')[0])}
                            className="flex flex-col items-center gap-3 cursor-pointer group"
                        >
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center border transition-all shadow-sm ${isActive ? 'bg-blue-100 border-blue-500 shadow-md' : 'bg-blue-50/50 border-slate-200 group-hover:border-blue-300 group-hover:bg-blue-50 group-hover:shadow-md'}`}>
                                <span className={`material-symbols-outlined text-3xl transition-colors ${isActive ? 'text-blue-700' : 'text-slate-700 group-hover:text-blue-600'}`}>{spec.icon}</span>
                            </div>
                            <span className={`text-xs font-bold transition-colors ${isActive ? 'text-blue-700' : 'text-slate-600 group-hover:text-blue-600'}`}>{spec.name}</span>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-64 shrink-0 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="flex items-center gap-2 font-bold text-lg mb-6 text-slate-800">
                            <span className="material-symbols-outlined text-blue-600">filter_alt</span> Filters
                        </h3>

                        <div className="space-y-6">
                            {/* Availability */}
                            <div>
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Availability</h4>
                                <div className="space-y-3">
                                    {['Available Today', 'Available Tomorrow', 'Next 3 Days'].map((opt, i) => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter('availability', opt)}>
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.availability.includes(opt) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 group-hover:border-blue-500'}`}>
                                                {filters.availability.includes(opt) && <span className="material-symbols-outlined text-[12px] font-bold">check</span>}
                                            </div>
                                            <span className="text-sm text-slate-600 font-medium">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Consultation Fee */}
                            <div>
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Consultation Fee</h4>
                                <div className="space-y-3">
                                    {['Free', '₹0 - ₹500', '₹500 - ₹1000', '₹1000+'].map((fee, i) => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter('fee', fee)}>
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filters.fee.includes(fee) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-500'}`}>
                                                {filters.fee.includes(fee) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                            </div>
                                            <span className="text-sm text-slate-600 font-medium">{fee}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Gender */}
                            <div>
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Gender</h4>
                                <div className="space-y-3">
                                    {['Male', 'Female'].map((gender, i) => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter('gender', gender)}>
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.gender.includes(gender) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 group-hover:border-blue-500'}`}>
                                                {filters.gender.includes(gender) && <span className="material-symbols-outlined text-[12px] font-bold">check</span>}
                                            </div>
                                            <span className="text-sm text-slate-600 font-medium">{gender}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Promo Box */}
                    <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 flex flex-col items-start gap-4 shadow-sm relative overflow-hidden">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg relative z-10">
                            <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="font-bold text-slate-800 mb-2">Try AI First?</h4>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">Get an instant clinical summary of your symptoms using our medical AI agents before your physical visit.</p>
                        </div>
                        <button
                            onClick={() => navigate('/ai-symptom-checker-interface')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-lg transition-colors mt-2 shadow-md shadow-blue-600/20 relative z-10"
                        >
                            Start AI Consultation
                        </button>
                    </div>
                </div>

                {/* Doctor List */}
                <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-bold text-slate-800">Top Rated Doctors in New Delhi</h2>
                        <span className="text-sm text-slate-500 font-medium">{filteredDoctors.length} matches found</span>
                    </div>

                    {filteredDoctors.length === 0 && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>
                            <h3 className="text-lg font-bold text-slate-700 mb-1">No Doctors Found</h3>
                            <p className="text-sm text-slate-500">Try adjusting your filters or search query.</p>
                        </div>
                    )}

                    {filteredDoctors.map(doc => (
                        <div key={doc.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
                            {/* Satisfaction Badge */}
                            <div className="absolute top-6 right-6 flex flex-col items-end">
                                <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">thumb_up</span> {doc.satisfaction} Satisfaction
                                </div>
                                <span className="text-xs text-slate-400 font-medium mt-1">{doc.stories} Patient Stories</span>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-28 h-28 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                                    <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex flex-col justify-center flex-1 pr-32">
                                    <h3
                                        className="text-xl font-bold text-blue-600 hover:underline cursor-pointer mb-1"
                                        onClick={() => onSelectDoctor(doc)}
                                    >
                                        {doc.name}
                                    </h3>
                                    <p className="text-sm font-semibold text-slate-700 mb-1">{doc.specialty}</p>
                                    <p className="text-xs font-medium text-slate-500 mb-3">{doc.experience}</p>

                                    <div className="flex items-center gap-6 text-sm font-semibold text-slate-600">
                                        <div className="flex items-center gap-1.5 focus:outline-none">
                                            <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                                            {doc.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 focus:outline-none">
                                            <span className="material-symbols-outlined text-[16px] text-slate-400">payments</span>
                                            {doc.fee} Consultation Fee
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                                        <button
                                            onClick={() => navigate('/ai-symptom-checker-interface')}
                                            className="w-full max-w-[200px] border border-blue-600 text-blue-600 font-bold text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">smart_toy</span> Consult AI First
                                        </button>
                                        <button
                                            className="w-full max-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2 rounded-lg transition-colors shadow-md shadow-blue-600/20"
                                            onClick={() => onSelectDoctor(doc)}
                                        >
                                            Book In-Person Visit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

import { addLocalBooking } from '../services/medicalDb';

const DoctorDetailView = ({ doctor, onBack }) => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('About');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDay, setSelectedDay] = useState(12); // Mock initial day

    const handleConfirmBooking = async () => {
        if (!selectedSlot) {
            alert('Please select a time slot to confirm your booking.');
            return;
        }

        const bookingData = {
            doctor_id: doctor.id,
            doctor_name: doctor.name,
            day: selectedDay,
            slot: selectedSlot,
            fee: doctor.fee
        };

        try {
            const { error } = await supabase.from('bookings').insert([bookingData]);

            if (!error) {
                // Success on server
            }

            // Save locally too
            addLocalBooking(bookingData);
            alert(`Booking Confirmed for ${doctor.name} on day ${selectedDay} at ${selectedSlot}!`);
            onBack();
        } catch (error) {
            console.warn("Supabase Booking Error, saved locally:", error);
            addLocalBooking(bookingData);
            alert(`Booking saved locally for ${doctor.name} on day ${selectedDay} at ${selectedSlot}!`);
            onBack();
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-6 mt-2">
            {/* Breadcrumb */}
            <div className="text-xs font-semibold text-slate-500 mb-6 flex items-center gap-2">
                <Link to="/" className="hover:text-blue-600 cursor-pointer">Home</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>New Delhi</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>{doctor.specialty.split('•')[0].trim()}s</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-slate-800 font-bold">{doctor.name}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Content Area */}
                <div className="flex-1 space-y-8">
                    {/* Header Card */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative">
                        <div className="absolute top-6 right-6 flex gap-2">
                            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-colors">
                                <span className="material-symbols-outlined">share</span>
                            </button>
                            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">favorite</span>
                            </button>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                                <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-[3px] border-white rounded-full"></div>
                            </div>
                            <div className="flex flex-col flex-1 pt-2">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight">{doctor.name}</h1>
                                <p className="text-blue-600 font-bold text-sm md:text-base mb-4">{doctor.role}</p>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm font-semibold text-slate-600 mb-6 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><span className="material-symbols-outlined text-[14px]">work</span></div>
                                        {doctor.experience.replace(' experience overall', '')}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><span className="material-symbols-outlined text-[14px]">location_on</span></div>
                                        {doctor.location}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><span className="material-symbols-outlined text-[14px]">verified</span></div>
                                        Medical Registration Verified
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">thumb_up</span> {doctor.satisfaction}
                                    </span>
                                    <span className="text-xs font-medium text-slate-500">{doctor.stories} Patient Stories</span>
                                </div>
                            </div>
                        </div>

                        {/* Divider Stats */}
                        <div className="border-t border-slate-100 mt-8 pt-6">
                            <div className="grid grid-cols-3 divide-x divide-slate-100">
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Consultations</p>
                                    <p className="text-xl font-black text-slate-900">10,000+</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                                    <p className="text-xl font-black text-slate-900">4.9/5</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Wait Time</p>
                                    <p className="text-xl font-black text-slate-900">15 Min</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Banner */}
                    <div className="bg-blue-600 rounded-2xl p-6 flex items-center justify-between text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 opacity-10">
                            <span className="material-symbols-outlined text-[120px]">smart_toy</span>
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-3xl text-white">smart_toy</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight mb-1">Wait! Try our AI Specialist First</h3>
                                <p className="text-blue-100 text-sm font-medium">Instant diagnosis & medical advice powered by Swasthya Mitra AI.</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/ai-symptom-checker-interface')} className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-lg hover:shadow-lg transition-all active:scale-95 text-sm relative z-10">
                            Try for ₹0
                        </button>
                    </div>

                    {/* Content Tabs area */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex border-b border-slate-200">
                            {['About', 'Feedback', 'Consultations'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${selectedTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="p-8 space-y-8">
                            {selectedTab === 'About' && (
                                <>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900 mb-3">Professional Summary</h4>
                                        <p className="text-slate-600 leading-relaxed text-sm font-medium">{doctor.name} is a distinguished specialist with over {doctor.experience.replace(' experience overall', '')} of experience in their field. They specialize in complex procedures, comprehensive management, and preventative care. Having trained at world-renowned institutions, they bring a data-driven yet compassionate approach to patient care.</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900 mb-4">Specializations</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['General Consultation', 'Specialized Care', 'Preventative Medicine', 'Chronic Disease Management'].map((tag, i) => (
                                                <span key={i} className="px-4 py-2 bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-full text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900 mb-4">Education & Experience</h4>
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="mt-1 text-slate-400">
                                                    <span className="material-symbols-outlined text-[20px]">school</span>
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-sm text-slate-900">{doctor.specialty.split('•')[1].trim()}</h5>
                                                    <p className="text-xs text-slate-500 mt-1 font-medium">Top Medical Institution (2005 - 2011)</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="mt-1 text-slate-400">
                                                    <span className="material-symbols-outlined text-[20px]">domain</span>
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-sm text-slate-900">{doctor.role}</h5>
                                                    <p className="text-xs text-slate-500 mt-1 font-medium">{doctor.location} (2015 - Present)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {selectedTab === 'Feedback' && (
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900 mb-3">Patient Feedback</h4>
                                    <p className="text-slate-600 text-sm">Feedback system loading... (Rating: {doctor.satisfaction} satisfaction)</p>
                                </div>
                            )}
                            {selectedTab === 'Consultations' && (
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900 mb-3">Consultation Details</h4>
                                    <p className="text-slate-600 text-sm">Consultation Fee: {doctor.fee}</p>
                                    <p className="text-slate-600 text-sm mt-2">Location: {doctor.location}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Other Specialists */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Other Specialists at {doctor.location.split(',')[0]}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: "Dr. Sarah Chen", spec: "Neurologist • 12 Years Exp", fee: "₹1000" },
                                { name: "Dr. James Wilson", spec: "Pediatrician • 8 Years Exp", fee: "₹800" },
                                { name: "Dr. Elena Rodriguez", spec: "Dermatologist • 10 Years Exp", fee: "₹900" }
                            ].map((doc, i) => (
                                <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="h-24 bg-gradient-to-r from-blue-100 to-indigo-100"></div>
                                    <div className="p-4 relative">
                                        <div className="w-16 h-16 bg-white border-4 border-white rounded-full overflow-hidden absolute -top-8 left-4 shadow-sm">
                                            <img src={`https://i.pravatar.cc/150?img=${i + 20}`} alt="Doc" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="mt-8">
                                            <h4 className="font-bold text-sm text-slate-900">{doc.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-medium mb-3">{doc.spec}</p>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-800">{doc.fee}</span>
                                                <span onClick={() => { }} className="text-blue-600 font-bold cursor-pointer hover:underline">View Profile</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Book Appointment Area */}
                <div className="w-full lg:w-[400px] shrink-0">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-8">
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Book Appointment</h3>
                        <p className="text-xs text-slate-500 font-medium mb-6">Choose your preferred slot</p>

                        {/* Mini Calendar / Days */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                            <button className="text-slate-400 hover:text-slate-800 transition-colors p-1"><span className="material-symbols-outlined text-lg">chevron_left</span></button>

                            <div className="flex flex-1 justify-center gap-2 px-2">
                                {[
                                    { day: 'Mon', num: 12, slots: 12 },
                                    { day: 'Tue', num: 13, slots: 8 },
                                    { day: 'Wed', num: 14, slots: 15 }
                                ].map((d) => (
                                    <div
                                        key={d.num}
                                        onClick={() => setSelectedDay(d.num)}
                                        className={`flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-xl cursor-pointer transition-colors border ${selectedDay === d.num ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 border-transparent' : 'bg-transparent text-slate-600 hover:bg-slate-50 border-transparent'}`}
                                    >
                                        <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${selectedDay === d.num ? 'opacity-90' : ''}`}>{d.day}</span>
                                        <span className="text-lg font-black leading-none mb-1">{d.num}</span>
                                        <span className={`text-[8px] font-bold uppercase ${selectedDay === d.num ? 'opacity-90' : 'text-emerald-500'}`}>{d.slots} Slots</span>
                                    </div>
                                ))}
                            </div>

                            <button className="text-slate-400 hover:text-slate-800 transition-colors p-1"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
                        </div>

                        {/* Slots */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                    <span className="material-symbols-outlined text-[14px]">light_mode</span> Morning
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM'].map(slot => (
                                        <div
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`rounded-lg py-2 text-center text-xs font-bold cursor-pointer transition-colors ${selectedSlot === slot ? 'border-2 border-blue-600 bg-blue-50 text-blue-600' : 'border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600'}`}
                                        >
                                            {slot}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                    <span className="material-symbols-outlined text-[14px]">partly_cloudy_day</span> Afternoon
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {['02:00 PM', '02:30 PM', '03:00 PM', '04:30 PM'].map(slot => (
                                        <div
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`rounded-lg py-2 text-center text-xs font-bold cursor-pointer transition-colors ${selectedSlot === slot ? 'border-2 border-blue-600 bg-blue-50 text-blue-600' : 'border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600'}`}
                                        >
                                            {slot}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Consultation Fee & Actions */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-semibold text-slate-600">Consultation Fee</span>
                                <span className="text-xl font-black text-slate-900">{doctor.fee}</span>
                            </div>

                            <button
                                onClick={handleConfirmBooking}
                                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 mb-3"
                            >
                                Confirm Booking <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                            <p className="text-[10px] text-center text-slate-400 font-semibold mb-6 pb-6 border-b border-slate-100">No booking fee • Free cancellation up to 2 hours before</p>

                            <div className="bg-blue-50/50 rounded-xl p-4 flex gap-3 border border-blue-100/50">
                                <span className="material-symbols-outlined text-[18px] text-blue-600">info</span>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                    <strong className="text-slate-800">Need a faster response?</strong> Use our AI Specialist to get a preliminary assessment in under 60 seconds. Best for non-emergencies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default FirstAidKnowledgeBase;
