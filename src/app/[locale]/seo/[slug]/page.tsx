import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/lib/sanity.client';
import { seoLandingPageBySlugQuery } from '@/lib/sanity.queries';
import { PortableText } from '@portabletext/react';
import FaqJsonLd from '@/components/seo/FaqJsonLd';
import SoftwareAppJsonLd from '@/components/seo/SoftwareAppJsonLd';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { buttonStyles } from '@/components/ui/Button';
import { FaqItem } from '@/components/ui/FaqItem';
import { urlFor } from '@/lib/sanity.image';
import Link from 'next/link';

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const pages = await client.fetch(`
    *[_type == "seoLandingPage" && status == "published"] {
      slug,
      language
    }
  `);

  return pages
    .filter((page: any) => page.language === params.locale)
    .map((page: any) => ({
      slug: page.slug.current,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await client.fetch(seoLandingPageBySlugQuery, {
    slug: params.slug,
    language: params.locale,
  });

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  const baseUrl = 'https://talkflo.hicall.ai';
  const ogImage = page.ogImage
    ? urlFor(page.ogImage).width(1200).height(630).url()
    : `${baseUrl}/og-image.png`;

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    keywords: page.targetKeywords,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription,
      type: 'article',
      url: `${baseUrl}/${params.locale}/seo/${params.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle || page.title,
      description: page.metaDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: `${baseUrl}/${params.locale}/seo/${params.slug}`,
      languages: page.translations?.reduce(
        (acc: Record<string, string>, t: any) => {
          acc[t.language] = `${baseUrl}/${t.language}/seo/${t.slug.current}`;
          return acc;
        },
        {}
      ),
    },
  };
}

export default async function SeoLandingPage({ params }: PageProps) {
  const page = await client.fetch(seoLandingPageBySlugQuery, {
    slug: params.slug,
    language: params.locale,
  });

  if (!page) {
    notFound();
  }

  return (
    <AuroraBackground className="pb-24 text-white">
      <FaqJsonLd
        questions={page.faqItems?.map((item: any) => ({
          q: item.question,
          a: item.answer,
        })) || []}
      />
      <SoftwareAppJsonLd />

      <article className="section-block">
        <div className="section-shell section-stack">
          <header className="section-heading text-center">
            <h1 className="typo-hero text-foreground max-w-4xl mx-auto">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="typo-subtitle-lg text-muted/60 mt-4 max-w-3xl mx-auto">
                {page.subtitle}
              </p>
            )}
            <p className="typo-body-lg text-neutral-400 mt-6 max-w-2xl mx-auto">
              {page.heroDescription}
            </p>
            <div className="mt-8">
              <Link
                href={page.ctaLink}
                className={buttonStyles({
                  variant: "primary",
                  size: "lg",
                })}
              >
                {page.ctaText}
              </Link>
            </div>
          </header>

          {page.introduction && (
            <section className="prose prose-invert prose-lg max-w-none">
              <PortableText value={page.introduction} />
            </section>
          )}

          {page.sections && page.sections.length > 0 && (
            <section className="space-y-12">
              {page.sections.map((section: any, idx: number) => (
                <div
                  key={idx}
                  className={`${
                    section.highlight
                      ? 'bg-gradient-to-br from-emerald-400/20 via-teal-400/15 to-green-500/10 rounded-3xl p-8 md:p-12'
                      : ''
                  }`}
                >
                  <h2 className="typo-h2 text-white mb-6">
                    {section.heading}
                  </h2>
                  <div className="prose prose-invert prose-lg max-w-none">
                    <PortableText value={section.content} />
                  </div>
                </div>
              ))}
            </section>
          )}

          {page.faqItems && page.faqItems.length > 0 && (
            <section className="section-block">
              <div className="section-shell section-stack">
                <div className="section-heading">
                  <h2 className="typo-h2 text-white">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-4">
                  {page.faqItems.map((item: any, idx: number) => (
                    <FaqItem
                      key={idx}
                      question={item.question}
                      answer={item.answer}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {page.relatedPages && page.relatedPages.length > 0 && (
            <section className="section-block">
              <div className="section-shell section-stack">
                <div className="section-heading">
                  <h2 className="typo-h2 text-white">
                    Related Articles
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {page.relatedPages.map((related: any, idx: number) => (
                    <Link
                      key={idx}
                      href={`/${params.locale}/seo/${related.slug.current}`}
                      className="block p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <h3 className="typo-h4 text-white mb-2">
                        {related.title}
                      </h3>
                      <p className="typo-body-sm text-neutral-400">
                        Learn more about {related.title.toLowerCase()}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="text-center py-12 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 rounded-3xl">
            <h2 className="typo-h3 text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="typo-body-lg text-neutral-300 mb-6 max-w-2xl mx-auto">
              Join thousands of learners improving their English speaking skills with TalkFlow
            </p>
            <Link
              href={page.ctaLink}
              className={buttonStyles({
                variant: "primary",
                size: "lg",
              })}
            >
              {page.ctaText}
            </Link>
          </section>
        </div>
      </article>
    </AuroraBackground>
  );
}
