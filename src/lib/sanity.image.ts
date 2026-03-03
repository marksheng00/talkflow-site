import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { client } from './sanity.client';

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
    return builder.image(source);
}

export function isValidSanityImage(source: any): boolean {
    if (!source) return false;
    // An image source is valid if it's a string (image ID)
    if (typeof source === 'string') return true;
    // Or if it has an asset with a reference
    if (source.asset && (source.asset._ref || source.asset._id)) return true;
    // Or if it's a direct reference
    if (source._ref || source._id) return true;
    return false;
}
