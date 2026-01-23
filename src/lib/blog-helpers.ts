import type { PortableTextBlock, PortableTextSpan } from "@portabletext/types";

export function estimateReadingTime(blocks: PortableTextBlock[]): number {
    if (!blocks || !Array.isArray(blocks)) return 1;

    const text = blocks.reduce((acc, block) => {
        if (block._type !== 'block' || !Array.isArray(block.children)) return acc;
        const spanText = block.children
            .map((child) => (child._type === 'span' ? (child as PortableTextSpan).text : ''))
            .join(' ');
        return acc + spanText + ' ';
    }, '');

    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const wordsPerMinute = 200; // 平均阅读速度
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}
