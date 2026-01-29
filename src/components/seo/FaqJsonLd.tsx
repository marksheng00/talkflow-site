import React from 'react';

interface FaqItem {
    q: string;
    a: string;
}

interface FaqJsonLdProps {
    questions: FaqItem[];
}

export default function FaqJsonLd({ questions }: FaqJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": questions.map((item) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
