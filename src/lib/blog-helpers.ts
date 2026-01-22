export function estimateReadingTime(blocks: any[]): number {
    if (!blocks || !Array.isArray(blocks)) return 1

    const text = blocks.reduce((acc, block) => {
        if (block._type !== 'block' || !block.children) return acc
        return acc + block.children.map((child: any) => child.text).join(' ') + ' '
    }, '')

    const words = text.trim().split(/\s+/).length
    const wordsPerMinute = 200 // 平均阅读速度
    return Math.max(1, Math.ceil(words / wordsPerMinute))
}
