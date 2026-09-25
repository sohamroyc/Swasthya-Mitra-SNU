// Minimal localStorage-backed user database.
// Stores registered users as an array under 'pokedoc_users'.

const STORAGE_KEY = 'pokedoc_users';

function getAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function save(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/** Register a new user. Returns the created user object or null if email already exists. */
export function registerUser(fields) {
    const { name, email, phone, password, dob, gender, height, weight, bloodType, allergies, conditions } = fields;
    const users = getAll();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return null; // already registered
    }
    const user = {
        name,
        email: email.toLowerCase(),
        phone,
        password, // For mock DB purposes; real backend should hash this
        dob: dob || '',
        gender: gender || '',
        height: height || '',
        weight: weight || '',
        bloodType: bloodType || '',
        allergies: allergies || '',
        conditions: conditions || '',
        createdAt: new Date().toISOString(),
    };
    users.push(user);
    save(users);
    return user;
}

/** Authenticate a user by email and password. Returns the user object or null. */
export function authenticateUser(email, password) {
    const user = getAll().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
        return user;
    }
    return null;
}

/** Look up a registered user by email. Returns the user object or null. */
export function findUserByEmail(email) {
    return getAll().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/** Update an existing user record by email. Merges provided fields. Returns updated user or null. */
export function updateUser(email, fields) {
    const users = getAll();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...fields };
    save(users);
    return users[idx];
}
