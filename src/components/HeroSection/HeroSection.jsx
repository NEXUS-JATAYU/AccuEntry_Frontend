import { motion, useReducedMotion } from 'framer-motion';
import LoginForm from '../LoginForm/LoginForm';
import Button from '../common/Button';
import ChatBotWidget from '../ChatBotWidget/ChatBotWidget';

const cardVariants = {
    hidden: { opacity: 0, y: 30, rotateY: -15 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        rotateY: 0,
        transition: {
            delay: 0.6 + i * 0.12,
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

const cards = [
    { name: 'Double Cash', gradient: 'from-citi-blue to-blue-700' },
    { name: 'Premier', gradient: 'from-gray-700 to-gray-900' },
    { name: 'Custom Cash', gradient: 'from-citi-dark-blue to-blue-900' },
    { name: 'Advantage', gradient: 'from-nexus-navy to-nexus-navy-light' },
];

const floatingShapeVariants = {
    animate: (i) => ({
        y: [0, -15, 0],
        x: [0, i % 2 === 0 ? 8 : -8, 0],
        rotate: [0, i % 2 === 0 ? 5 : -5, 0],
        transition: {
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    }),
};

export default function HeroSection({ chatState, onMinimize, onClose }) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-nexus-surface via-white to-citi-light-blue/30 pt-[88px]">
            {/* Floating decorative shapes */}
            {!prefersReducedMotion && (
                <>
                    <motion.div
                        custom={0}
                        variants={floatingShapeVariants}
                        animate="animate"
                        className="absolute top-32 right-[15%] w-64 h-64 rounded-full bg-citi-blue/[0.04] blur-xl pointer-events-none"
                    />
                    <motion.div
                        custom={1}
                        variants={floatingShapeVariants}
                        animate="animate"
                        className="absolute bottom-20 left-[10%] w-48 h-48 rounded-full bg-nexus-gold/[0.06] blur-lg pointer-events-none"
                    />
                    <motion.div
                        custom={2}
                        variants={floatingShapeVariants}
                        animate="animate"
                        className="absolute top-48 left-[5%] w-20 h-20 rounded-2xl border border-citi-blue/[0.08] rotate-12 pointer-events-none"
                    />
                </>
            )}

            {/* Decorative wave */}
            <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
                    <path d="M0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 relative z-10">
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
                    {/* Left: Text + Cards */}
                    <div className="flex-1 flex flex-col sm:flex-row gap-8 lg:gap-12 items-start w-full">
                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-xs font-bold tracking-[0.2em] text-nexus-gold uppercase mb-4"
                            >
                                Nexus® Credit Cards
                            </motion.p>

                            <motion.h1
                                className="text-4xl sm:text-5xl md:text-[3.5rem] font-display text-nexus-navy leading-[1.1] mb-6 text-balance"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                Choose the right Nexus® credit card for you
                            </motion.h1>

                            <motion.p
                                className="text-base sm:text-lg text-gray-500 leading-relaxed mb-10 max-w-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.45 }}
                            >
                                Whether you want Cash Back, a Low Intro Rate, Rewards for Costco Members, or Great Airline Miles, the choice is all yours.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="flex flex-wrap gap-3"
                            >
                                <Button href="#" size="lg" className="shadow-lg hover:shadow-xl rounded-full px-8 py-3.5 text-base">
                                    Learn More
                                </Button>
                                <Button
                                    href="/open-account"
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full px-8 py-3.5 text-base border-nexus-gold text-nexus-gold hover:bg-nexus-gold/10"
                                >
                                    Open with AI Assistant →
                                </Button>
                            </motion.div>
                        </div>

                        {/* Card Images */}
                        <div className="grid grid-cols-2 gap-3 w-full max-w-[280px] sm:max-w-[260px] shrink-0" style={{ perspective: '800px' }}>
                            {cards.map((card, i) => (
                                <motion.div
                                    key={card.name}
                                    custom={i}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{
                                        y: -6,
                                        rotateY: 8,
                                        rotateX: -4,
                                        boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)',
                                        transition: { type: 'spring', stiffness: 300, damping: 20 },
                                    }}
                                    className={`bg-gradient-to-br ${card.gradient} rounded-xl h-28 sm:h-32 flex items-center justify-center text-white shadow-lg cursor-pointer`}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    <div className="text-center">
                                        <div className="text-xl font-bold tracking-tight">nexus</div>
                                        <div className="text-[10px] opacity-80 tracking-widest mt-0.5 uppercase">{card.name}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Login Form or Inline Chatbot */}
                    <motion.div
                        className="w-full lg:w-auto shrink-0 z-20"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {chatState === 'inline' ? (
                            <ChatBotWidget
                                mode="inline"
                                onMinimize={onMinimize}
                                onClose={onClose}
                            />
                        ) : (
                            <LoginForm />
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
