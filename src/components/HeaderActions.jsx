import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SOSEmergencyButton from './SOSEmergencyButton';

const HeaderActions = () => {
    const { user } = useAuth();

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className="flex items-center gap-4">
            <SOSEmergencyButton />
            <Link
                to="/patient-profile-records"
                className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/60 transition-all cursor-pointer block shrink-0"
            >
                {user?.photoUrl ? (
                    <img
                        alt="Profile"
                        className="h-full w-full object-cover"
                        src={user.photoUrl}
                    />
                ) : (
                    <div className="h-full w-full bg-blue-600 flex items-center justify-center text-white text-sm font-black">
                        {initials}
                    </div>
                )}
            </Link>
        </div>
    );
};

export default HeaderActions;
