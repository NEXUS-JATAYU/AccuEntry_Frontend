import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../common/Icon';

const navLinks = [
    {
        label: 'Credit Cards',
        href: '#',
        description: 'View and manage available credit card options',
    },
    {
        label: 'Banking',
        href: '#',
        description: 'Access checking, savings, and everyday banking services',
    },
    {
        label: 'Lending',
        href: '#',
        description: 'Explore personal, auto, and home loan solutions',
    },
    {
        label: 'Investing',
        href: '#',
        description: 'Discover investment tools and opportunities',
    },
    {
        label: 'Wealth Management',
        href: '#',
        description: 'Personalized financial planning and advisory services',
    },
];

export default function Header({ onOpenAccount }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'shadow-lg backdrop-blur-xl bg-white/90'
                    : 'bg-white'
            }`}
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        >
            {/* Top Bar */}
            <div className={`border-b border-gray-200/60 transition-all duration-300 ${scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-10 opacity-100'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-10">
                    <div className="flex items-center gap-4 py-1">
                        <Link to="/" className="text-2xl font-bold text-citi-blue tracking-tight">
                            nexus
                        </Link>
                        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-bold text-gray-700">FDIC</span>
                            <span>
                                FDIC-Insured · Backed by the full faith and credit of the U.S. Government
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <a href="#" className="hidden sm:flex items-center gap-1.5 hover:text-citi-blue transition-colors">
                            <Icon name="location" className="w-3.5 h-3.5" />
                            ATM / BRANCH
                        </a>
                        <a href="#" className="hidden sm:inline hover:text-citi-blue transition-colors">ESPAÑOL</a>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="bg-nexus-navy">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-12">
                    {/* Scrolled logo */}
                    {scrolled && (
                        <Link to="/" className="text-xl font-bold text-white tracking-tight mr-6">
                            nexus
                        </Link>
                    )}

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-0.5 relative">
                        {navLinks.map((link) => (
                            <div
                                key={link.label}
                                className="relative"
                                onMouseEnter={() => setHoveredLink(link.label)}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                <a
                                    href={link.href}
                                    className="relative px-3.5 py-2 text-sm text-white/90 hover:text-white rounded-md transition-colors"
                                >
                                    {link.label}
                                    {hoveredLink === link.label && (
                                        <motion.div
                                            className="absolute bottom-0 left-3 right-3 h-0.5 bg-nexus-gold rounded-full"
                                            layoutId="navIndicator"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </a>

                                {/* Tooltip */}
                                <AnimatePresence>
                                    {hoveredLink === link.label && link.description && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                            className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white text-gray-700 text-sm rounded-xl p-4 border border-gray-100 shadow-2xl pointer-events-none"
                                        >
                                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />
                                            {link.description}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        {/* Open Account CTA */}
                        <motion.button
                            onClick={() => (window.location.href = '/open-account')}
                            className="ml-2 px-4 py-1.5 text-sm font-semibold text-nexus-navy bg-nexus-gold rounded-full flex items-center gap-1.5 cursor-pointer"
                            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(201,150,59,0.4)' }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                            Open an Account
                            <Icon name="chevron-right" className="w-3 h-3" />
                        </motion.button>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white p-1.5 cursor-pointer transition-colors hover:bg-white/10 rounded-lg"
                        aria-label="Toggle menu"
                    >
                        <Icon name={mobileMenuOpen ? 'close' : 'menu'} className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-1.5 text-white/80 text-sm hover:text-white transition-colors cursor-pointer">
                        <Icon name="search" className="w-4 h-4" />
                        <span className="hidden md:inline">How can we help?</span>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="md:hidden bg-nexus-navy border-t border-white/10 overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-1">
                                {navLinks.map((link, i) => (
                                    <motion.a
                                        key={link.label}
                                        href={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="block px-3 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}
                                <motion.button
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navLinks.length * 0.05 }}
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        if (onOpenAccount) onOpenAccount();
                                    }}
                                    className="w-full text-left px-3 py-2.5 text-sm font-semibold text-nexus-gold hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                    Open an Account
                                    <Icon name="chevron-right" className="w-3 h-3" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.header>
    );
}
