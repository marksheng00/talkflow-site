"use client";

import { useState, useEffect } from "react";

export function AnimatedCounter({ from, to, skipAnimation = false }: { from: number; to: number; skipAnimation?: boolean }) {
    const [count, setCount] = useState(skipAnimation ? to : from);
    const [isComplete, setIsComplete] = useState(skipAnimation);

    useEffect(() => {
        if (skipAnimation) {
            // Initial state is already handled by useState.
            // If props update to true later, we might want to force update:
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (!isComplete) setIsComplete(true);
            if (count !== to) setCount(to);
            return;
        }

        let startTime: number | null = null;
        const duration = 600; // Animation duration in ms

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuad = (t: number) => t * (2 - t);
            const currentCount = Math.floor(from + (to - from) * easeOutQuad(progress));

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsComplete(true);
            }
        };

        requestAnimationFrame(animate);
    }, [from, to, skipAnimation]);

    return (
        <span className={`text-2xl font-black transition-colors ${skipAnimation ? '' : 'animate-in zoom-in-50 duration-300'} ${isComplete ? '' : 'text-white'}`}>
            {count}
        </span>
    );
}
