"use client";

import { useState, useEffect, useRef } from "react";

export interface TypingMessageProps {
    text: string;
    delay: number;
    typingSpeed?: number;
    className?: string;
    resetTrigger?: number;
    highlightWords?: Array<{ word: string; className: string }>;
}

export function TypingMessage({
    text,
    delay,
    typingSpeed = 50,
    className = "",
    resetTrigger = 0,
    highlightWords = [],
}: TypingMessageProps) {
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        setDisplayText("");
        setIsTyping(false);

        const startTyping = () => {
            let currentIndex = 0;
            const targetText = text;

            const typeNextChar = () => {
                if (currentIndex < targetText.length) {
                    setDisplayText(targetText.slice(0, currentIndex + 1));
                    currentIndex++;
                    setIsTyping(true);

                    const randomDelay = typingSpeed + (Math.random() * 40 - 20);
                    animationRef.current = requestAnimationFrame(() => {
                        setTimeout(typeNextChar, randomDelay);
                    });
                } else {
                    setIsTyping(false);
                }
            };

            typeNextChar();
        };

        const startDelay = setTimeout(() => {
            startTyping();
        }, delay);

        return () => {
            clearTimeout(startDelay);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [delay, resetTrigger, text, typingSpeed]);

    const renderTextWithHighlights = () => {
        if (!displayText) return displayText;

        let result = displayText;
        highlightWords.forEach(({ word, className: highlightClass }) => {
            const regex = new RegExp(`(${word})`, 'gi');
            result = result.replace(regex, `<span class="${highlightClass}">$1</span>`);
        });

        return <span dangerouslySetInnerHTML={{ __html: result }} />;
    };

    return (
        <div className={`message-bubble ${className}`} style={{ animationDelay: `${delay}ms` }}>
            <span className="whitespace-pre-wrap">
                {renderTextWithHighlights()}
                {isTyping && <span className="typing-cursor" />}
            </span>
        </div>
    );
}
