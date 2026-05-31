import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[14px]">health_and_safety</span>
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Swasthya<span className="text-primary"> Mitra</span></span>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    &copy; {new Date().getFullYear()} Swasthya Mitra AI Healthcare Framework. Built internally.
                </p>
                <div className="flex gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms</a>
                    <a href="#" className="hover:text-primary transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
