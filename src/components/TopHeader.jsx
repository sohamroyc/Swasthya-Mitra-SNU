import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderActions from './HeaderActions';

const TopHeader = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const [notifications, setNotifications] = useState([
        { id: 1, type: "reminder", text: "Your flu shot is due tomorrow.", time: "10 mins ago", unread: true, icon: "vaccines", color: "blue" },
        { id: 2, type: "report", text: "New blood test results available.", time: "2 hours ago", unread: true, icon: "description", color: "emerald" },
        { id: 3, type: "appointment", text: "Dr. Sharma confirmed your appointment.", time: "1 day ago", unread: false, icon: "event", color: "violet" }
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            // Example navigation, could be customized
            // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm shrink-0 w-full mb-6">
            {/* Logo area */}
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
                    <span className="material-symbols-outlined font-bold text-xl">health_and_safety</span>
                </div>
                <div className="hidden sm:block">
                    <h1 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">Swasthya Mitra</h1>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">AI Wellness Hub</p>
                </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4 sm:mx-8 hidden md:block">
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-blue-500 transition-colors">search</span>
                    <input
                        className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent rounded-full pl-10 pr-4 py-2.5 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 font-medium shadow-sm hover:shadow-md focus:shadow-md"
                        placeholder="Search health records, symptoms, doctors..."
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-4 relative">
                <HeaderActions />
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

                {/* Notification Bell */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-500 ${showNotifications ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <span className="material-symbols-outlined text-xl">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2 h-2.5 w-2.5 bg-blue-600 rounded-full border-[1.5px] border-white dark:border-slate-800 shadow-sm"></span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transform origin-top-right z-50">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    Notifications
                                    {unreadCount > 0 && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-black">{unreadCount} New</span>}
                                </h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors focus:outline-none"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[350px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    <div className="flex flex-col">
                                        {notifications.map(notification => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 flex gap-4 items-start border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${notification.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                            >
                                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-${notification.color}-600 bg-${notification.color}-100 dark:bg-${notification.color}-500/20`}>
                                                    <span className="material-symbols-outlined text-[20px]">{notification.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0 pt-0.5">
                                                    <p className={`text-sm tracking-tight leading-snug ${notification.unread ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                                                        {notification.text}
                                                    </p>
                                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[12px]">schedule</span> {notification.time}
                                                    </p>
                                                </div>
                                                {notification.unread && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-2"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center flex flex-col items-center">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3 text-slate-400">
                                            <span className="material-symbols-outlined text-3xl">notifications_off</span>
                                        </div>
                                        <p className="text-slate-500 font-semibold text-sm">No new notifications</p>
                                    </div>
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center">
                                    <button className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                        View All Activity
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopHeader;
