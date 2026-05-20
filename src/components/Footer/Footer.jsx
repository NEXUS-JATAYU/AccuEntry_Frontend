import { motion } from 'framer-motion';
import AnimatedSection from '../common/AnimatedSection';

export default function Footer() {
    return (
        <AnimatedSection threshold={0.1} duration={0.5}>
            <footer className="bg-nexus-navy text-white/70 mt-0">
                {/* Top gradient line */}
                <div className="h-px bg-gradient-to-r from-transparent via-nexus-gold/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4 flex-wrap">
                            <span className="text-2xl font-bold text-white tracking-tight shrink-0">nexus</span>
                            <span className="text-xs leading-relaxed max-w-2xl text-white/40">
                                © 2026 Nexusgroup Inc. Nexus, Nexus and Arc Design and other marks used herein are service marks of Nexusgroup Inc. or its affiliates, used and registered throughout the world.
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-5 text-xs shrink-0">
                            {['Privacy', 'Terms of Use', 'AdChoices', 'Security'].map((link) => (
                                <motion.a
                                    key={link}
                                    href="#"
                                    className="text-white/50 hover:text-nexus-gold transition-colors relative"
                                    whileHover={{ y: -1 }}
                                >
                                    {link}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 pt-5 border-t border-white/10 text-xs text-white/30 text-center sm:text-left leading-relaxed">
                        Banking products and services are offered by Citibank, N.A. Member FDIC. Equal Housing Lender. NMLS# 412915.
                    </div>
                </div>
            </footer>
        </AnimatedSection>
    );
}
