"use client";

import { useState, useEffect } from "react";

export function AnimatedCounter({ 
    from, 
    to, 
    skipAnimation = false,
    className = "text-2xl font-black"
}: { 
    from: number; 
    to: number; 
    skipAnimation?: boolean;
    className?: string;
}) {
    const [count, setCount] = useState(from);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (skipAnimation) return;

        let startTime: number | null = null;
        const duration = 600; // Animation duration in ms
        let rafId: number;

        const animate = (currentTime: number) => {
            if (!startTime) {
                startTime = currentTime;
                setIsComplete(false);
                setCount(from);
            }
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuad = (t: number) => t * (2 - t);
            const currentCount = Math.floor(from + (to - from) * easeOutQuad(progress));

            setCount(currentCount);

            if (progress < 1) {
                rafId = requestAnimationFrame(animate);
            } else {
                setIsComplete(true);
            }
        };

        rafId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(rafId);
    }, [from, to, skipAnimation]);

    const displayCount = skipAnimation ? to : count;
    const complete = skipAnimation ? true : isComplete;

    return (
        <span className={`${className} transition-colors ${skipAnimation ? '' : 'animate-in zoom-in-50 duration-300'} ${complete ? '' : 'text-white'}`}>
            {displayCount}
        </span>
    );
}
