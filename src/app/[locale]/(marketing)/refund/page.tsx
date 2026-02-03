import { getTranslations } from "next-intl/server";
import RefundClient from "./RefundClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'RefundPage' });

    return {
        title: `${t('title')} | talkflo`,
        description: t('subtitle'),
    };
}

export default function RefundPage() {
    return <RefundClient />;
}
