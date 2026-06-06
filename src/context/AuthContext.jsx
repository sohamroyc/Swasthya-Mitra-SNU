import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, findUserByEmail, authenticateUser, updateUser } from '../services/userDb';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

// Mapper helper to translate snake_case DB fields to camelCase JS fields
const mapProfile = (dbUser) => {
    if (!dbUser) return null;
    return {
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        password: dbUser.password,
        dob: dbUser.dob,
        gender: dbUser.gender,
        height: dbUser.height,
        weight: dbUser.weight,
        bloodType: dbUser.blood_type,
        allergies: dbUser.allergies,
        conditions: dbUser.conditions,
        createdAt: dbUser.created_at,
        photoUrl: dbUser.photo_url || null,
    };
};

// Check if Supabase is properly configured with real values rather than placeholders
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

const DEFAULT_HEALTH_MEMORY = {
    personalInfo: {
        name: '',
        dob: '',
        gender: '',
        height: '',
        weight: '',
        bloodGroup: '',
        city: '',
        state: '',
        emergencyContactName: '',
        emergencyContactRelation: '',
        emergencyContactPhone: ''
    },
    conditions: [],
    allergies: {
        drug: '',
        food: '',
        environmental: '',
        other: ''
    },
    medications: [],
    familyHistory: [],
    lifestyle: {
        smoking: 'non-smoker',
        alcohol: 'none',
        waterIntake: '4',
        sleepDuration: '7',
        physicalActivity: 'moderate',
        dietType: 'vegetarian',
        stressLevel: 'medium'
    },
    conversations: [],
    reports: []
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('pokedoc_user');
            if (stored && stored !== 'undefined') {
                return JSON.parse(stored);
            }
        } catch (err) {
            console.error("Failed to parse pokedoc_user from localStorage:", err);
        }
        return null;
    });

    const [healthMemory, setHealthMemory] = useState(DEFAULT_HEALTH_MEMORY);

    useEffect(() => {
        if (user) {
            localStorage.setItem('pokedoc_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('pokedoc_user');
        }
    }, [user]);

    // Sync and load health records from localStorage keyed by user email
    useEffect(() => {
        if (user?.email) {
            const key = `swasthya_mitra_memory_${user.email.toLowerCase()}`;
            try {
                const stored = localStorage.getItem(key);
                if (stored) {
                    setHealthMemory(JSON.parse(stored));
                } else {
                    // Seed initial demo data for highly visual experience
                    const initial = {
                        ...DEFAULT_HEALTH_MEMORY,
                        personalInfo: {
                            ...DEFAULT_HEALTH_MEMORY.personalInfo,
                            name: user.name || 'John Doe',
                            dob: user.dob || '1992-08-14',
                            gender: user.gender || 'male',
                            height: user.height || '178',
                            weight: user.weight || '72.5',
                            bloodGroup: user.bloodType || 'O+',
                            city: 'New Delhi',
                            state: 'Delhi',
                            emergencyContactName: 'Sarah Johnson',
                            emergencyContactRelation: 'Spouse',
                            emergencyContactPhone: '+1 (555) 000-1234'
                        },
                        conditions: user.conditions ? user.conditions.split(',').map(c => c.trim()).filter(Boolean) : ["Hypertension"],
                        allergies: {
                            drug: user.allergies || 'Penicillin',
                            food: 'Peanuts',
                            environmental: 'Pollen',
                            other: 'None'
                        },
                        medications: [
                            { id: 'm1', name: 'Lisinopril', dosage: '10mg', frequency: '8:00 AM Daily', startDate: '2026-01-10', notes: 'Hypertension Management' },
                            { id: 'm2', name: 'Vitamin D3', dosage: '2000IU', frequency: 'Weekly', startDate: '2026-02-01', notes: 'General Immunity' }
                        ],
                        familyHistory: ['Diabetes', 'Hypertension'],
                        lifestyle: {
                            smoking: 'non-smoker',
                            alcohol: 'none',
                            waterIntake: '6',
                            sleepDuration: '7.5',
                            physicalActivity: 'moderate',
                            dietType: 'vegetarian',
                            stressLevel: 'low'
                        },
                        conversations: [
                            { id: 'c1', date: '2026-01-15', symptoms: 'Mild headache and tightness in neck', specialist: 'General Physician AI', diagnosis: 'Mild Dehydration & Tension Headache', confidence: '92%', suggestedActions: 'Increase fluid intake to 8 glasses and rest for 6-8 hours.' },
                            { id: 'c2', date: '2026-03-22', symptoms: 'Acid reflux and bloating after meals', specialist: 'General Physician AI', diagnosis: 'Gastroesophageal Reflux (GERD)', confidence: '88%', suggestedActions: 'Avoid spicy foods and late-night caffeine, eat smaller meals.' }
                        ],
                        reports: [
                            { id: 'r1', name: 'Annual Complete Blood Count (CBC)', category: 'CBC Reports', date: '2026-02-10', summary: 'All blood counts (WBC, RBC, Platelets) are within standard clinical ranges.' },
                            { id: 'r2', name: 'Fasting Blood Sugar Test', category: 'Diabetes Reports', date: '2026-04-05', summary: 'Fasting glucose is 95 mg/dL. Well within normal limits.' }
                        ]
                    };
                    setHealthMemory(initial);
                    localStorage.setItem(key, JSON.stringify(initial));
                }
            } catch (err) {
                console.error("Failed to parse health memory:", err);
            }
        } else {
            setHealthMemory(DEFAULT_HEALTH_MEMORY);
        }
    }, [user]);

    // Active session and authentication listeners in real-time
    useEffect(() => {
        if (isSupabaseConfigured() && supabase.auth) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                if (session?.user) {
                    const email = session.user.email;
                    try {
                        const { data, error } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('email', email.toLowerCase())
                            .single();
                        if (!error && data) {
                            setUser(mapProfile(data));
                        } else {
                            setUser({
                                name: session.user.user_metadata?.name || 'User',
                                email: session.user.email,
                                phone: session.user.user_metadata?.phone || '',
                                createdAt: session.user.created_at,
                            });
                        }
                    } catch (e) {
                        console.warn("Real-time profile sync error:", e);
                    }
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                }
            });

            // Sync initial mount session
            const checkSession = async () => {
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        const email = session.user.email;
                        const { data } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('email', email.toLowerCase())
                            .single();
                        if (data) {
                            setUser(mapProfile(data));
                        }
                    }
                } catch (err) {
                    console.warn("Failed to get initial session:", err);
                }
            };
            checkSession();

            return () => {
                subscription?.unsubscribe();
            };
        }
    }, []);

    const login = async (email, password) => {
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email.toLowerCase(),
                    password,
                });

                if (error) throw error;

                if (data?.user) {
                    const { data: dbUser, error: dbError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('email', email.toLowerCase())
                        .single();

                    if (!dbError && dbUser) {
                        const mapped = mapProfile(dbUser);
                        setUser(mapped);
                        // Sync locally as well for offline fallback
                        registerUser({
                            ...mapped,
                            password: password
                        });
                        return { success: true };
                    } else {
                        const basicUser = {
                            name: data.user.user_metadata?.name || 'User',
                            email: data.user.email,
                            phone: data.user.user_metadata?.phone || '',
                            createdAt: data.user.created_at,
                        };
                        setUser(basicUser);
                        return { success: true };
                    }
                }
            } catch (err) {
                console.warn("Supabase auth login failed, falling back to local database:", err);
            }
        }

        // MOCK BACKEND LOGIC / LOCAL FALLBACK
        const found = findUserByEmail(email);
        if (!found) {
            return { success: false, error: 'No account found with that email. Please sign up first.' };
        }
        const authedUser = authenticateUser(email, password);
        if (!authedUser) {
            return { success: false, error: 'Incorrect password. Please try again.' };
        }
        setUser({ ...authedUser });
        return { success: true };
    };

    const loginWithGoogle = async () => {
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin + '/dashboard',
                    }
                });
                if (error) throw error;
                return { success: true };
            } catch (err) {
                console.warn("Supabase Google Auth login failed, falling back to local mock:", err);
            }
        }

        // MOCK BACKEND LOGIC / LOCAL FALLBACK
        const mockGoogleUser = {
            name: 'Google User',
            email: 'googleuser@gmail.com',
            phone: '',
            dob: '1995-05-15',
            gender: 'prefer-not-to-say',
            bloodType: 'O+',
            height: 175,
            weight: 70,
            allergies: 'None',
            conditions: 'None',
            createdAt: new Date().toISOString(),
            photoUrl: 'https://ui-avatars.com/api/?name=Google+User&background=0f6df0&color=fff',
        };
        setUser(mockGoogleUser);
        registerUser(mockGoogleUser);
        return { success: true };
    };

    const signup = async (userData) => {
        const { name, email, phone, password, dob, gender, height, weight, bloodType, allergies, conditions } = userData;

        if (isSupabaseConfigured()) {
            try {
                const { data, error: authError } = await supabase.auth.signUp({
                    email: email.toLowerCase(),
                    password,
                    options: {
                        data: {
                            name,
                            phone,
                        }
                    }
                });

                if (authError) throw authError;

                const dbPayload = {
                    email: email.toLowerCase(),
                    name,
                    phone,
                    dob: dob || null,
                    gender: gender || '',
                    blood_type: bloodType || '',
                    height: height ? Number(height) : null,
                    weight: weight ? Number(weight) : null,
                    allergies: allergies || '',
                    conditions: conditions || '',
                    password
                };

                const { error: dbError } = await supabase.from('profiles').insert([dbPayload]);
                
                if (!dbError) {
                    const createdUser = {
                        name,
                        email: email.toLowerCase(),
                        phone,
                        password,
                        dob: dob || '',
                        gender: gender || '',
                        height: height || '',
                        weight: weight || '',
                        bloodType: bloodType || '',
                        allergies: allergies || '',
                        conditions: conditions || '',
                        createdAt: new Date().toISOString()
                    };
                    setUser(createdUser);
                    // Sync to local DB
                    registerUser(userData);
                    return { success: true };
                } else {
                    if (dbError.code === '23505') {
                        return { success: false, error: 'An account with that email already exists in the cloud database. Please log in instead.' };
                    }
                    throw dbError;
                }
            } catch (err) {
                console.warn("Supabase signup failed, falling back to local database:", err);
            }
        }

        // MOCK BACKEND LOGIC / LOCAL FALLBACK
        const created = registerUser(userData);
        if (!created) {
            return { success: false, error: 'An account with that email already exists. Please log in instead.' };
        }
        setUser({ ...created });
        return { success: true };
    };

    const updateProfile = async (email, fields) => {
        const updatedUser = { ...user, ...fields };
        setUser(updatedUser);

        try {
            // Update in Supabase
            const dbFields = {
                name: fields.name,
                phone: fields.phone,
                dob: fields.dob || null,
                gender: fields.gender || '',
                blood_type: fields.bloodType || '',
                height: fields.height ? Number(fields.height) : null,
                weight: fields.weight ? Number(fields.weight) : null,
                allergies: fields.allergies || '',
                conditions: fields.conditions || '',
            };

            // Only include photo_url if the field is being updated (avoid overwriting with undefined)
            if (fields.photoUrl !== undefined) {
                dbFields.photo_url = fields.photoUrl;
            }

            await supabase.from('profiles').update(dbFields).eq('email', email.toLowerCase());
        } catch (err) {
            console.warn("Failed to sync profile update to Supabase, falling back to local storage:", err);
        }

        // Update locally
        updateUser(email, fields);
    };

    const updateHealthMemory = (fields) => {
        if (!user?.email) return;
        const updated = { ...healthMemory, ...fields };
        setHealthMemory(updated);
        const key = `swasthya_mitra_memory_${user.email.toLowerCase()}`;
        localStorage.setItem(key, JSON.stringify(updated));

        // Sync with base profile details if available
        if (fields.personalInfo) {
            const p = fields.personalInfo;
            updateProfile(user.email, {
                name: p.name,
                gender: p.gender,
                dob: p.dob,
                bloodType: p.bloodGroup,
                height: p.height,
                weight: p.weight,
                phone: p.emergencyContactPhone
            });
        }
    };

    const addMedication = (med) => {
        if (!user?.email) return;
        const medWithId = { ...med, id: `med_${Date.now()}` };
        const updatedMeds = [...(healthMemory.medications || []), medWithId];
        updateHealthMemory({ medications: updatedMeds });
    };

    const deleteMedication = (id) => {
        if (!user?.email) return;
        const updatedMeds = (healthMemory.medications || []).filter(m => m.id !== id);
        updateHealthMemory({ medications: updatedMeds });
    };

    const addReport = (report) => {
        if (!user?.email) return;
        const reportWithId = { ...report, id: `rep_${Date.now()}` };
        const updatedReports = [...(healthMemory.reports || []), reportWithId];
        updateHealthMemory({ reports: updatedReports });
    };

    const addConversation = (chat) => {
        if (!user?.email) return;
        const chatWithId = { ...chat, id: `chat_${Date.now()}` };
        const updatedChats = [chatWithId, ...(healthMemory.conversations || [])];
        updateHealthMemory({ conversations: updatedChats });
    };

    const clearHealthMemory = () => {
        if (!user?.email) return;
        setHealthMemory(DEFAULT_HEALTH_MEMORY);
        const key = `swasthya_mitra_memory_${user.email.toLowerCase()}`;
        localStorage.removeItem(key);
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.warn("Failed to sign out of Supabase session:", err);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            loginWithGoogle, 
            signup, 
            updateProfile, 
            logout,
            healthMemory,
            updateHealthMemory,
            addMedication,
            deleteMedication,
            addReport,
            addConversation,
            clearHealthMemory
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

