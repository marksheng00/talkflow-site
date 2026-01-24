import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales } from './config';

export default getRequestConfig(async ({ locale }) => {
    const activeLocale = locale || 'en';

    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(activeLocale as any)) notFound();

    return {
        locale: activeLocale,
        messages: (await import(`../../messages/${activeLocale}.json`)).default
    };
});
