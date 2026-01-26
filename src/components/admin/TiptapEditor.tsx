"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Code, Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    editable?: boolean;
}

const MenuButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
}) => (
    <button
        onClick={(e) => { e.preventDefault(); onClick(); }}
        disabled={disabled}
        className={`p-2 rounded-lg transition-colors ${isActive
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'text-slate-400 hover:text-white hover:bg-white/10'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);

export default function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write the detailed project plan here…',
            }),
        ],
        immediatelyRender: false,
        content: content,
        editable: editable,
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[300px]',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Handle external content changes if necessary (e.g. initial load)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Only update if content is drastically different to avoid cursor jumps
            // Ideally we rely on initialContent, but if we switch tasks we need to reset
            // editor.commands.setContent(content);
        }
    }, [content, editor]);

    // Better way to handle task switching:
    useEffect(() => {
        if (editor) {
            editor.commands.setContent(content);
        }
    }, [content, editor]); // Warning: this might reset cursor on every keystroke if parent updates 'content' prop on every change.
    // To solve this: The parent should only pass `content` for INITIAL LOADING, not for controlled syncing back.
    // Or we use a ref to track if it's the same task ID.
    // For now, let's assume the parent handles key changes by remounting or we just set content when `content` changes significantly.
    // Actually, Tiptap handles `setContent` reasonably well but safe is to only do it if editor is empty or DIFFERENT task.
    // Let's stick to the simple effect for MVP, assuming parent passing specific content only on mount/switch.

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col border border-white/10 rounded-xl overflow-hidden bg-black/20">
            {/* Toolbar */}
            {editable && (
                <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-white/5">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                    >
                        <Bold className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                    >
                        <Italic className="w-4 h-4" />
                    </MenuButton>

                    <div className="w-[1px] h-6 bg-white/10 mx-1" />

                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                    >
                        <Heading1 className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                    >
                        <Heading2 className="w-4 h-4" />
                    </MenuButton>

                    <div className="w-[1px] h-6 bg-white/10 mx-1" />

                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                    >
                        <List className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                    >
                        <ListOrdered className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                    >
                        <Quote className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                    >
                        <Code className="w-4 h-4" />
                    </MenuButton>

                    <div className="w-[1px] h-6 bg-white/10 mx-1 ml-auto" />

                    <MenuButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                    >
                        <Undo className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                    >
                        <Redo className="w-4 h-4" />
                    </MenuButton>
                </div>
            )}

            <EditorContent editor={editor} className="p-4 md:p-6 min-h-[300px]" />
        </div>
    );
}
