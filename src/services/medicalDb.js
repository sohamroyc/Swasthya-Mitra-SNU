// Minimal localStorage-backed medication database.
const MED_STORAGE_KEY = 'pokedoc_medications';
const BOOKING_STORAGE_KEY = 'pokedoc_bookings';

function getAllMeds() {
    const raw = localStorage.getItem(MED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveMeds(meds) {
    localStorage.setItem(MED_STORAGE_KEY, JSON.stringify(meds));
}

export function fetchLocalMeds() {
    return getAllMeds();
}

export function addLocalMed(med) {
    const meds = getAllMeds();
    const newMed = {
        ...med,
        id: Date.now(),
        createdAt: new Date().toISOString()
    };
    meds.unshift(newMed);
    saveMeds(meds);
    return newMed;
}

export function updateLocalMed(id, fields) {
    const meds = getAllMeds();
    const idx = meds.findIndex(m => m.id === id);
    if (idx === -1) return null;
    meds[idx] = { ...meds[idx], ...fields };
    saveMeds(meds);
    return meds[idx];
}

// Bookings
function getAllBookings() {
    const raw = localStorage.getItem(BOOKING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveBookings(bookings) {
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
}

export function addLocalBooking(booking) {
    const bookings = getAllBookings();
    const newBooking = {
        ...booking,
        id: Date.now(),
        createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    saveBookings(bookings);
    return newBooking;
}
