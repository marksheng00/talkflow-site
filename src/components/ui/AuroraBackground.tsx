"use client";
import React from "react";
import { motion, MotionProps } from "framer-motion";

type AuroraProps = Omit<React.HTMLAttributes<HTMLDivElement>, "style"> & MotionProps & {
    style?: React.CSSProperties | any; // Loose typing to allow Motion values
    children?: React.ReactNode;
};

export const AuroraBackground = ({
    children,
    className = "",
    ...props
}: AuroraProps) => {
    return (
        <motion.div
            className={`relative flex flex-col bg-transparent ${className}`}
            {...props}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none isolate">
                <div
                    className={`
            absolute -inset-[10px] opacity-50
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,#3b82f6_10%,#a855f7_15%,#06b6d4_20%,#10b981_25%,#3b82f6_30%)]
            [background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-40 will-change-transform
          `}
                ></div>
                {/* Secondary moving blobs for more depth */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/25 rounded-full filter blur-[128px] animate-blob decoration-clone"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/25 rounded-full filter blur-[128px] animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-20 w-[500px] h-[500px] bg-emerald-500/25 rounded-full filter blur-[128px] animate-blob animation-delay-4000"></div>
            </div>
            <div className="relative z-10 w-full">{children}</div>
        </motion.div>
    );
};
