import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Menu, X, LogOut, User, RefreshCw, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/home' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Routes', path: '/routes' },
        { name: 'Apply', path: '/apply' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-lg py-4'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link to="/home" className="flex items-center space-x-3 group">
                        <div className="bg-gradient-to-tr from-kasc-primary to-kasc-secondary p-2.5 rounded-xl shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                            <Bus className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-xl font-bold font-display tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'
                                }`}>
                                KASC Transport
                            </h1>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/20 shadow-sm">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${location.pathname === link.path
                                        ? 'bg-kasc-primary text-white shadow-md'
                                        : 'text-slate-600 hover:text-kasc-primary hover:bg-white/50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="hidden lg:block text-right">
                                    <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                                    <p className="text-xs text-slate-500 font-medium">{user?.department}</p>
                                </div>
                                <div className="h-10 w-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                    <User className="h-5 w-5 text-indigo-600" />
                                </div>
                            </div>

                            <button
                                onClick={logout}
                                className="p-2.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors duration-300"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-[70px] left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl z-40 md:hidden overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${location.pathname === link.path
                                        ? 'bg-kasc-primary/10 text-kasc-primary'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {/* Quick Actions for Mobile */}
                            <div className="pt-4 pb-2">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">Quick Actions</p>
                                {[
                                    { name: 'Change Route', path: '/change-route', icon: 'RefreshCw' },
                                    { name: 'Cancel Route', path: '/cancel-route', icon: 'XCircle' }
                                ].map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-kasc-primary transition-all group"
                                    >
                                        {link.icon === 'RefreshCw' && <RefreshCw className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-500" />}
                                        {link.icon === 'XCircle' && <XCircle className="h-5 w-5 mr-3 text-slate-400 group-hover:text-red-500" />}
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center space-x-3 mb-4 px-4">
                                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{user?.name}</p>
                                        <p className="text-xs text-slate-500">{user?.department}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
