import { StringInputProps, set, unset } from 'sanity'
import { Box, Flex, Tooltip, Text, Card } from '@sanity/ui'
import { CheckmarkIcon } from '@sanity/icons'

// 预定义的颜色映射 (Tailwind 类 -> Hex 预览)
// 这些 Hex 值仅用于 Studio 内的预览，实际前端使用 Tailwind 类
export const COLORS = [
    { title: 'Blue', value: 'blue', hex: '#3b82f6' },
    { title: 'Emerald', value: 'emerald', hex: '#10b981' },
    { title: 'Purple', value: 'purple', hex: '#a855f7' },
    { title: 'Rose', value: 'rose', hex: '#f43f5e' },
    { title: 'Amber', value: 'amber', hex: '#f59e0b' },
    { title: 'Cyan', value: 'cyan', hex: '#06b6d4' },
    { title: 'Indigo', value: 'indigo', hex: '#6366f1' },
    { title: 'Orange', value: 'orange', hex: '#f97316' },
    { title: 'Teal', value: 'teal', hex: '#14b8a6' },
    { title: 'Pink', value: 'pink', hex: '#ec4899' },
    { title: 'Sky', value: 'sky', hex: '#0ea5e9' },
    { title: 'Slate', value: 'slate', hex: '#64748b' },
]

export function ColorPicker(props: StringInputProps) {
    const { value, onChange, readOnly } = props

    const handleClick = (colorValue: string) => {
        if (readOnly) return
        if (value === colorValue) {
            // 允许取消选择，或者保持选中，这里我选择允许取消
            // onChange(unset()) 
            return // 或者不做任何事
        }
        onChange(set(colorValue))
    }

    return (
        <Flex wrap="wrap" gap={2}>
            {COLORS.map((color) => {
                const isSelected = value === color.value
                return (
                    <Tooltip
                        key={color.value}
                        content={
                            <Box padding={2}>
                                <Text size={1}>{color.title}</Text>
                            </Box>
                        }
                        placement="top"
                    >
                        <Card
                            onClick={() => handleClick(color.value)}
                            style={{
                                backgroundColor: color.hex,
                                width: '32px',
                                height: '32px',
                                cursor: readOnly ? 'default' : 'pointer',
                                border: isSelected ? '2px solid white' : '2px solid transparent',
                                boxShadow: isSelected ? '0 0 0 2px #333' : 'none',
                                position: 'relative',
                                borderRadius: '50%',
                                transition: 'all 0.2s',
                            }}
                            className="hover:scale-110" // Using custom class mostly for transform
                        >
                            {isSelected && (
                                <Flex
                                    justify="center"
                                    align="center"
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <CheckmarkIcon style={{ color: 'white' }} />
                                </Flex>
                            )}
                        </Card>
                    </Tooltip>
                )
            })}
        </Flex>
    )
}
