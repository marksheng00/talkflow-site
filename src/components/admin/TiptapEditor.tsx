"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Code, Undo, Redo, Underline as UnderlineIcon, Link as LinkIcon } from 'lucide-react';
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
            : 'text-neutral-400 hover:text-white hover:bg-white/10'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);

export default function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Typography,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-emerald-400 underline decoration-emerald-400/30 underline-offset-4 hover:text-emerald-300 transition-colors cursor-pointer',
                },
            }),
            Placeholder.configure({
                placeholder: 'Write the detailed project plan here…',
            }),
        ],
        immediatelyRender: false,
        content: content,
        editable: editable,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] text-zinc-200 px-4 py-6 prose-p:leading-relaxed prose-headings:text-white prose-a:text-emerald-400',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (html !== content) {
                onChange(html);
            }
        },
    });

    // Only update content if it's externally changed and significantly different
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // We only want to set content if the external content is actually different
            // from what's currently in the editor. This prevents cursor jumps.
            if (!editor.isFocused) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.01] focus-within:border-white/10 transition-all">
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
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </MenuButton>

                    <div className="w-[1px] h-6 bg-white/10 mx-1" />

                    <MenuButton
                        onClick={() => {
                            const url = window.prompt('URL');
                            if (url) {
                                editor.chain().focus().setLink({ href: url }).run();
                            } else if (url === '') {
                                editor.chain().focus().unsetLink().run();
                            }
                        }}
                        isActive={editor.isActive('link')}
                    >
                        <LinkIcon className="w-4 h-4" />
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

            <EditorContent editor={editor} className="min-h-[300px]" />
        </div>
    );
}
