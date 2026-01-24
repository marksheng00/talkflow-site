export const locales = ['en', 'zh', 'zh-Hant', 'ko', 'es', 'ja'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
