/**
 * Unified background components
 * Consolidates AuroraBackground, FluentBackground, and related visual components
 */

// Re-export individual background components for backward compatibility
export { AuroraBackground } from './AuroraBackground';
export { default as FluentBackground } from './FluentBackground';
export { SpotlightCard } from './SpotlightCard';

// ============= Theme Configuration =============

export interface BackgroundTheme {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

export const themes: Record<string, BackgroundTheme> = {
    emerald: {
        name: 'Emerald',
        colors: {
            primary: '#10b981',
            secondary: '#06b6d4',
            accent: '#3b82f6'
        }
    },
    blue: {
        name: 'Blue',
        colors: {
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            accent: '#06b6d4'
        }
    },
    amber: {
        name: 'Amber',
        colors: {
            primary: '#f59e0b',
            secondary: '#f97316',
            accent: '#eab308'
        }
    }
};

// ============= Animation Keyframes =============

export const blobAnimations = `
@keyframes blob-one {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes blob-two {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-30px, 30px) scale(1.1); }
  66% { transform: translate(20px, -20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes blob-three {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, 50px) scale(1.1); }
  66% { transform: translate(-30px, -30px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
`;
