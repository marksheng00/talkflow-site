'use client'

/**
 * This route is responsible for the built-in authoring environment of Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * If you've customized your studioPath, then make sure this file is at the correct location,
 * e.g. if your studioPath is /dashboard, then this file should live at /dashboard/[[...index]]/page.tsx
 */

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/config'

export default function StudioPage() {
    return <NextStudio config={config} />
}
