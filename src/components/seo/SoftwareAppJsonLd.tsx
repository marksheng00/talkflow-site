import React from 'react';

export default function SoftwareAppJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "talkflo",
        "operatingSystem": "Web, iOS, Android",
        "applicationCategory": "EducationalApplication",
        "featureList": [
            "Real-time AI Voice Interaction",
            "Adaptive Role-play Scenarios",
            "IELTS/TOEFL Pronunciation Scoring",
            "Instant Grammar & Tone Feedback",
            "Personalized Learning Roadmap",
            "Multilingual Support"
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1250",
            "bestRating": "5",
            "worstRating": "1"
        },
        "offers": {
            "@type": "AggregateOffer",
            "lowPrice": "0",
            "highPrice": "29.9",
            "priceCurrency": "USD",
            "offerCount": "3"
        },
        "description": "Master English fluency with talkflo. User-centric AI speaking coach that provides real-time role-play, instant pronunciation scoring, and customized coaching for professional and academic exams."
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
