"use client";

import { useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    className?: string;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    allowOverflow?: boolean;
}

/**
 * Unified Modal component for consistent modal behavior across the app
 */
export function Modal({
    isOpen,
    onClose,
    children,
    title,
    className,
    showCloseButton = true,
    closeOnOverlayClick = true,
    size = 'md',
    allowOverflow = false,
}: ModalProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Handle body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-[95vw]'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={closeOnOverlayClick ? onClose : undefined}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                            "relative w-full bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] md:max-h-[90vh]",
                            allowOverflow ? "overflow-visible" : "overflow-hidden",
                            sizeClasses[size],
                            className
                        )}
                    >
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
                                {title && (
                                    <h2 className="typo-h4 text-white">
                                        {title}
                                    </h2>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// ============= Confirmation Dialog =============

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'info'
}: ConfirmDialogProps) {
    const variantMap = {
        danger: "danger",
        warning: "warning",
        info: "info",
    } as const;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="p-6 space-y-6">
                <div>
                    <h3 className="typo-title-sm text-white">{title}</h3>
                    <p className="typo-body-sm text-neutral-400 mt-2">{message}</p>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className={buttonStyles({
                            variant: "secondary",
                            size: "sm",
                        })}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={buttonStyles({
                            variant: variantMap[variant],
                            size: "sm",
                            weight: "medium",
                        })}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
