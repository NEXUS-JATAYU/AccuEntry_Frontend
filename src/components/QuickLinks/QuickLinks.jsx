import { motion } from 'framer-motion';
import QuickLinkItem from '../common/QuickLinkItem';
import Icon from '../common/Icon';

const links = [
    { icon: <Icon name="credit-card" />, label: 'Credit Cards' },
    { icon: <Icon name="checking" />, label: 'Checking Accounts' },
    { icon: <Icon name="mortgage" />, label: 'Mortgage' },
    { icon: <Icon name="personal-loans" />, label: 'Personal Loans' },
    { icon: <Icon name="investing" />, label: 'Investing Options' },
    { icon: <Icon name="small-business" />, label: 'Small Business' },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
};

export default function QuickLinks() {
    return (
        <section className="bg-white border-b border-gray-100 relative z-20">
            {/* Top gradient line */}
            <div className="h-px bg-gradient-to-r from-transparent via-citi-blue/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
                <motion.div
                    className="flex items-center justify-start md:justify-center gap-1 md:gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide scroll-smooth snap-x snap-mandatory"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {links.map((link) => (
                        <motion.div key={link.label} variants={itemVariants} className="snap-center">
                            <QuickLinkItem icon={link.icon} label={link.label} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom gradient line */}
            <div className="h-px bg-gradient-to-r from-transparent via-citi-blue/20 to-transparent" />
        </section>
    );
}
