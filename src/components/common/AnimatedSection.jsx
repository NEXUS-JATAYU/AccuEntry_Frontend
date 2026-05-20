import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const directionOffsets = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
};

export default function AnimatedSection({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    threshold = 0.15,
    className = '',
    once = true,
    as = 'div',
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: threshold });
    const prefersReducedMotion = useReducedMotion();

    const offset = directionOffsets[direction] || directionOffsets.up;

    const MotionTag = motion.create(as);

    if (prefersReducedMotion) {
        return (
            <MotionTag ref={ref} className={className}>
                {children}
            </MotionTag>
        );
    }

    return (
        <MotionTag
            ref={ref}
            className={className}
            initial={{ opacity: 0, ...offset }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            {children}
        </MotionTag>
    );
}
