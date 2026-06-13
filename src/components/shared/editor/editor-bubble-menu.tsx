import { useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { BubbleMenuPlugin } from '@tiptap/extension-bubble-menu'
import { Bold, Code, Italic, Strikethrough, Underline } from 'lucide-react'
import { toolbar, toolbarGroup } from './editor.styles.css'
import { ToolbarButton, ToolbarColorPicker, ToolbarDivider } from './toolbar'

type EditorBubbleMenuProps = {
	editor: Editor
}

export default function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!menuRef.current || !editor) return

		const plugin = BubbleMenuPlugin({
			editor,
			element: menuRef.current,
			pluginKey: 'editorBubbleMenu',
			shouldShow: ({ from, to }) => from !== to,
		})

		editor.registerPlugin(plugin)

		return () => {
			editor.unregisterPlugin('editorBubbleMenu')
		}
	}, [editor])

	return (
		<div ref={menuRef} style={{ display: undefined }}>
			<div className={toolbar}>
				<div className={toolbarGroup}>
					<ToolbarButton
						icon={Bold}
						label='Negrita'
						tooltip='Negrita'
						action={(e) => e.chain().focus().toggleBold().run()}
						isActive={(e) => e.isActive('bold')}
						editor={editor}
					/>
					<ToolbarButton
						icon={Italic}
						label='Cursiva'
						tooltip='Cursiva'
						action={(e) => e.chain().focus().toggleItalic().run()}
						isActive={(e) => e.isActive('italic')}
						editor={editor}
					/>
					<ToolbarButton
						icon={Underline}
						label='Subrayado'
						tooltip='Subrayado'
						action={(e) => e.chain().focus().toggleUnderline().run()}
						isActive={(e) => e.isActive('underline')}
						editor={editor}
					/>
					<ToolbarButton
						icon={Strikethrough}
						label='Tachado'
						tooltip='Tachado'
						action={(e) => e.chain().focus().toggleStrike().run()}
						isActive={(e) => e.isActive('strike')}
						editor={editor}
					/>
					<ToolbarButton
						icon={Code}
						label='Código'
						tooltip='Código en línea'
						action={(e) => e.chain().focus().toggleCode().run()}
						isActive={(e) => e.isActive('code')}
						editor={editor}
					/>
				</div>
				<ToolbarDivider />
				<div className={toolbarGroup}>
					<ToolbarColorPicker editor={editor} />
				</div>
			</div>
		</div>
	)
}
