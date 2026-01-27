import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
    // A list of all locales that are supported
    locales,
    // Used when no locale matches
    defaultLocale,
    // Ensure all paths have a locale prefix
    localePrefix: 'always'
});

export const config = {
    // Match only internationalized pathnames
    // and exclude some static files
    matcher: [
        // Match all pathnames except for
        // - API routes
        // - _next (Next.js internals)
        // - _vercel (Vercel internals)
        // - Static files (e.g. /favicon.ico, /logo.png, etc.)
        '/((?!api|_next|_vercel|.*\\..*).*)',
        // Match all pathnames within a locale prefix
        '/',
        '/(en|zh|zh-Hant|ko|es|ja)/:path*'
    ]
};
