import React from 'react';

export default function BrandJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "talkflo",
        "description": "Next-generation AI English speaking coach platform for IELTS/TOEFL preparation and fluency training.",
        "url": "https://talkflo.hicall.ai",
        "logo": "https://talkflo.hicall.ai/talkflo_logo.png",
        "knowsAbout": ["English Language Learning", "Artificial Intelligence", "Voice Synthesis", "IELTS Preparation"],
        "sameAs": [
            "https://twitter.com/talkflo",
            "https://www.linkedin.com/company/talkflo"
        ],
        "parentOrganization": {
            "@type": "Organization",
            "name": "BeyondThink LLC"
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "US"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
