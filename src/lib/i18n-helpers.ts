/**
 * Internationalization utilities
 * Consolidates localization and language-related helper functions
 */

// ============= Localized Content Retrieval =============

/**
 * Get localized content from a multilingual object
 * Priority: Current Locale > English > First Available > Empty String
 *
 * @param content - Object with language codes as keys (e.g., { en: "...", zh: "..." })
 * @param locale - Current locale code (e.g., 'en', 'zh', 'zh-Hant')
 * @param fallbackLocale - Fallback locale if content[locale] not found (default: 'en')
 * @returns The localized string, or empty string if not available
 */
export function getLocalizedContent(
    content: Record<string, string> | null | undefined,
    locale: string,
    fallbackLocale = 'en'
): string {
    if (!content) return "";

    // Direct match
    if (content[locale]) return content[locale];

    // Fallback to specified locale
    if (content[fallbackLocale]) return content[fallbackLocale];

    // Use first available value
    const firstValue = Object.values(content).find(Boolean);
    return firstValue || "";
}

/**
 * Safe version of getLocalizedContent for potentially null/undefined content
 */
export function getLocalizedContentSafe(
    content: Record<string, string> | null | undefined,
    locale: string,
    fallbackLocale = 'en'
): string {
    try {
        return getLocalizedContent(content, locale, fallbackLocale);
    } catch {
        return "";
    }
}

// ============= Locale Utilities =============

export type SupportedLocale = 'en' | 'zh' | 'zh-Hant' | 'ko' | 'es' | 'ja';

export const supportedLocales: SupportedLocale[] = ['en', 'zh', 'zh-Hant', 'ko', 'es', 'ja'];

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
    return supportedLocales.includes(locale as SupportedLocale);
}

/**
 * Get display label for a locale
 */
export function getLocaleLabel(locale: SupportedLocale): string {
    const labels: Record<SupportedLocale, string> = {
        en: 'English',
        zh: '简体中文',
        'zh-Hant': '繁體中文',
        ko: '한국어',
        es: 'Español',
        ja: '日本語'
    };
    return labels[locale];
}

/**
 * Get flag emoji for a locale
 */
export function getLocaleFlag(locale: SupportedLocale): string {
    const flags: Record<SupportedLocale, string> = {
        en: '🇺🇸',
        zh: '🇨🇳',
        'zh-Hant': '🇭🇰',
        ko: '🇰🇷',
        es: '🇪🇸',
        ja: '🇯🇵'
    };
    return flags[locale];
}

// ============= Language Code Mapping =============

/**
 * Map frontend locale codes to service-specific codes
 * Used for external APIs like translation services
 */
export function mapToServiceLocale(locale: string, service: 'tencent' | 'sanity'): string {
    const mappings: Record<string, Record<string, string>> = {
        tencent: {
            'en': 'en',
            'zh': 'zh',
            'zh-Hant': 'zh-TW',
            'es': 'es',
            'ko': 'ko',
            'ja': 'ja'
        },
        sanity: {
            'en': 'en',
            'zh': 'zh',
            'zh-Hant': 'zh-Hant',
            'es': 'es',
            'ko': 'ko',
            'ja': 'ja'
        }
    };

    return mappings[service]?.[locale] || locale;
}
