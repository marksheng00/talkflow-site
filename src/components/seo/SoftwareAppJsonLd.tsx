import React from 'react';

export default function SoftwareAppJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "talkflo",
        "operatingSystem": "Web, iOS, Android",
        "applicationCategory": "EducationalApplication",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1250"
        },
        "offers": {
            "@type": "AggregateOffer",
            "lowPrice": "0",
            "highPrice": "29.9",
            "priceCurrency": "USD",
            "offerCount": "3"
        },
        "description": "Master English fluency with talkflo. Real-time AI role-play, instant pronunciation feedback, and professional coaching for IELTS, TOEFL and job interviews."
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
