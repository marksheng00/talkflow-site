import { getTranslations } from "next-intl/server";
import TermsClient from "./TermsClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'TermsPage' });

    return {
        title: `${t('title')} | talkflo`,
        description: t('subtitle'),
    };
}

export default function TermsPage() {
    return <TermsClient />;
}
