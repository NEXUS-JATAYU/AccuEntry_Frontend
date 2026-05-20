import { motion } from 'framer-motion';

export default function QuickLinkItem({ icon, label, href = '#' }) {
    return (
        <motion.a
            href={href}
            className="flex flex-col items-center gap-1.5 px-4 sm:px-5 py-3 sm:py-4 rounded-xl transition-colors group min-w-[85px] shrink-0 relative"
            whileHover={{ backgroundColor: 'rgba(5, 109, 174, 0.05)' }}
        >
            <motion.span
                className="text-citi-blue text-2xl flex items-center justify-center"
                whileHover={{ scale: 1.2, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
                {icon}
            </motion.span>
            <span className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-nexus-navy text-center whitespace-nowrap transition-colors">
                {label}
            </span>
            {/* Hover indicator line */}
            <motion.div
                className="absolute bottom-0 left-1/2 h-0.5 bg-nexus-gold rounded-full"
                initial={{ width: 0, x: '-50%' }}
                whileHover={{ width: '60%', x: '-50%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
        </motion.a>
    );
}
