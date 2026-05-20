import { motion } from 'framer-motion';

export default function ProductCard({
    title,
    label,
    description,
    imageSrc,
    imageAlt,
    ctaText = 'Learn More',
    ctaHref = '#',
    index = 0,
}) {
    return (
        <motion.div
            className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{ y: -6 }}
        >
            <div className="px-6 pt-6">
                <p className="text-[11px] font-bold tracking-[0.15em] text-nexus-gold uppercase mb-3">
                    {label}
                </p>
                <div className="w-full h-52 bg-gray-50 rounded-xl overflow-hidden">
                    <motion.img
                        src={imageSrc}
                        alt={imageAlt}
                        className="w-full h-full object-cover block"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            </div>
            <div className="flex flex-col flex-1 px-6 py-5">
                <h3 className="text-lg font-bold text-nexus-navy mb-2 font-display">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{description}</p>
                <div className="mt-5">
                    <motion.a
                        href={ctaHref}
                        className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-citi-blue rounded-full transition-colors hover:bg-citi-dark-blue"
                        whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(5, 109, 174, 0.3)' }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {ctaText}
                    </motion.a>
                </div>
            </div>
        </motion.div>
    );
}
