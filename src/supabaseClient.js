import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
    try {
        new URL(url);
        return url.startsWith('http');
    } catch {
        return false;
    }
};

let supabaseClient;

// Initialize Supabase only if the URL is valid and keys are not placeholders
if (isValidUrl(supabaseUrl) && supabaseKey && !supabaseKey.includes('your_supabase_anon_key') && !supabaseKey.includes('xxxx')) {
    try {
        supabaseClient = createClient(supabaseUrl, supabaseKey);
    } catch (err) {
        console.warn("Failed to initialize Supabase client:", err);
    }
}

// Fallback to a mock/noop client if not properly configured yet
if (!supabaseClient) {
    console.warn("Supabase is not configured or configured with placeholders. Using mock fallback client.");
    
    // Chainable proxy that is also Thenable to prevent crashes when chaining filters (like .eq() or .order()) after select/insert/update/delete.
    const createChainableMock = () => {
        const mock = {
            then: (resolve) => resolve({ data: [], error: null }),
            select: function() { return this; },
            insert: function() { return this; },
            update: function() { return this; },
            delete: function() { return this; },
            eq: function() { return this; },
            order: function() { return this; },
            single: function() {
                this.then = (resolve) => resolve({ data: null, error: null });
                return this;
            }
        };
        return mock;
    };

    supabaseClient = {
        from: () => createChainableMock()
    };
}

export const supabase = supabaseClient;

