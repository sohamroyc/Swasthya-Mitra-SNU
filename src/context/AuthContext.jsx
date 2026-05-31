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

    useEffect(() => {
        if (user) {
            localStorage.setItem('pokedoc_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('pokedoc_user');
        }
    }, [user]);

    const login = async (email, password) => {
        try {
            // Try querying Supabase profiles first
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email.toLowerCase());

            if (!error && data && data.length > 0) {
                const dbUser = data[0];
                if (dbUser.password === password) {
                    const mapped = mapProfile(dbUser);
                    setUser(mapped);
                    // Sync locally as well for offline fallback
                    registerUser({
                        ...mapped,
                        password: password
                    });
                    return { success: true };
                } else {
                    return { success: false, error: 'Incorrect password. Please try again.' };
                }
            }
        } catch (err) {
            console.warn("Supabase auth failed, falling back to local database:", err);
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

    const signup = async (userData) => {
        const { name, email, phone, password, dob, gender, height, weight, bloodType, allergies, conditions } = userData;

        try {
            // Try signing up in Supabase profiles first
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

            const { error } = await supabase.from('profiles').insert([dbPayload]);
            
            if (!error) {
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
                // If it exists in Supabase already
                if (error.code === '23505') {
                    return { success: false, error: 'An account with that email already exists in the cloud database. Please log in instead.' };
                }
                throw error;
            }
        } catch (err) {
            console.warn("Supabase signup failed, falling back to local database:", err);
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

    const logout = async () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, updateProfile, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

