import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";

export type BlogSlug = { current: string };

export type BlogCategory = {
  title: string;
  slug: BlogSlug;
  parent?: string;
  color?: string;
  description?: string;
};

export type BlogAuthor = {
  name: string;
  bio?: string;
  image?: SanityImageSource;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: BlogSlug;
  excerpt?: string;
  body: PortableTextBlock[];
  mainImage?: (SanityImageSource & { alt?: string }) | null;
  author?: BlogAuthor | null;
  categories?: BlogCategory[] | null;
  publishedAt?: string;
  language?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  translations?: Array<{
    language: string;
    slug: BlogSlug;
  }>;
};
