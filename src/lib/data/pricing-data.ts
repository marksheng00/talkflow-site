// Icons are removed as they are not used in data file directly
export type BillingCycle = "monthly" | "quarterly" | "yearly";

export interface PricingTier {
    name: string;
    description: string;
    price: {
        monthly: number;
        quarterly: number;
        yearly: number;
    };
    highlight?: boolean;
    features: string[];
    cta: string;
}

export const pricingTiers: PricingTier[] = [
    {
        name: "Free",
        description: "Perfect for getting started with AI speaking practice.",
        price: {
            monthly: 0,
            quarterly: 0,
            yearly: 0,
        },
        features: [
            "10 minutes of AI practice per day",
            "Basic pronunciation feedback",
            "Standard voice models",
            "Access to community topics",
            "Ad-supported experience",
        ],
        cta: "Start for Free",
    },
    {
        name: "Pro",
        description: "Accelerate your fluency with unlimited coaching.",
        price: {
            monthly: 19,
            quarterly: 17,
            yearly: 15,
        },
        highlight: true,
        features: [
            "Unlimited AI practice time",
            "Advanced grammar & tone analysis",
            "Premium SOTA voice models",
            "Priority latency (<200ms)",
            "Personalized learning roadmap",
            "Ad-free experience",
        ],
        cta: "Get Pro",
    },
    {
        name: "Ultra",
        description: "The ultimate preparation for IELTS bandwidth 8+.",
        price: {
            monthly: 49,
            quarterly: 44,
            yearly: 39,
        },
        features: [
            "Everything in Pro",
            "IELTS Mock Exams (Full length)",
            "Official Examiner Scoring System",
            "Band 9 Sample Answers",
            "Detailed error correction",
            "Speaking prediction topics",
            "Priority VIP Support",
        ],
        cta: "Get Ultra",
    },
];

export const pricingFaqs = [
    {
        q: "Can I cancel anytime?",
        a: "Yes, absolutely. You can cancel your subscription at any time from your account settings. You'll keep access until the end of your billing period.",
    },
    {
        q: "How does the 'Unlimited' practice work?",
        a: "Pro users get unlimited access to our AI conversation partners. Whether you practice for 15 minutes or 5 hours a day, there are no caps or limits.",
    },
    {
        q: "Is there a student discount?",
        a: "Yes! We offer 50% off for verified students. Just sign up with your .edu email address or contact support with your student ID.",
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Google Pay/Apple Pay.",
    },
];
