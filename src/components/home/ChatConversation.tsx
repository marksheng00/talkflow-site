"use client";

import { useState, useEffect } from "react";
import { TypingMessage } from "./TypingMessage";

export interface ChatConversationProps {
    messages: Array<{
        text: string;
        delay: number;
        typingSpeed: number;
        className: string;
        highlightWords?: Array<{ word: string; className: string }>;
    }>;
    cycleDuration: number;
}

export function ChatConversation({ messages, cycleDuration }: ChatConversationProps) {
    const [resetTrigger, setResetTrigger] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setResetTrigger(prev => prev + 1);
        }, cycleDuration);

        return () => clearInterval(interval);
    }, [cycleDuration]);

    return (
        <div className="relative mt-4 flex-1 flex flex-col justify-center gap-4 overflow-hidden">
            {messages.map((msg, idx) => (
                <TypingMessage
                    key={`${resetTrigger}-${idx}`}
                    text={msg.text}
                    delay={msg.delay}
                    typingSpeed={msg.typingSpeed}
                    className={msg.className}
                    highlightWords={msg.highlightWords || []}
                    resetTrigger={resetTrigger}
                />
            ))}
        </div>
    );
}
