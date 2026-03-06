import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../common/Icon';

const navLinks = [
    { label: 'Credit Cards', href: '#' },
    { label: 'Banking', href: '#' },
    { label: 'Lending', href: '#' },
    { label: 'Investing', href: '#' },
    { label: 'Wealth Management', href: '#' },
];

export default function Header({ onOpenAccount }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="w-full relative z-40">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-10">
                    <div className="flex items-center gap-4 py-1">
                        <Link to="/" className="text-2xl font-bold text-citi-blue tracking-tight hover:opacity-90">
                            nexus
                        </Link>
                        <div className="hidden md:flex items-center gap-2 text-xs text-gray-700">
                            <span className="font-bold">FDIC</span>
                            <span className="text-gray-500">
                                FDIC-Insured - Backed by the full faith and credit of the U.S. Government
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-700 h-full">
                        <a href="#" className="hidden sm:flex items-center gap-1 hover:text-citi-blue transition-colors">
                            <Icon name="location" className="w-4 h-4" />
                            ATM / BRANCH
                        </a>
                        <a href="#" className="hidden sm:inline hover:text-citi-blue transition-colors">ESPANOL</a>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="bg-citi-dark-blue shadow-md">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-11 py-1">
                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="px-3 py-2 text-sm text-white hover:bg-white/10 rounded transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                        <button
                            onClick={onOpenAccount}
                            className="px-3 py-2 text-sm text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1 cursor-pointer"
                        >
                            Open an Account
                            <Icon name="chevron-right" className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white p-1 cursor-pointer transition-colors hover:bg-white/10 rounded"
                        aria-label="Toggle menu"
                    >
                        <Icon name={mobileMenuOpen ? "close" : "menu"} className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-1 text-white text-sm hover:opacity-80 transition-opacity cursor-pointer">
                        <Icon name="search" className="w-4 h-4" />
                        <span className="hidden md:inline">How can we help?</span>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-citi-dark-blue border-t border-white/10 px-4 pb-3 shadow-lg">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="block px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                if (onOpenAccount) onOpenAccount();
                            }}
                            className="w-full text-left px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1 cursor-pointer"
                        >
                            Open an Account
                            <Icon name="chevron-right" className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}
