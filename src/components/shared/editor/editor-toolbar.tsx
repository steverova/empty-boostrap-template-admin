import type { Editor } from '@tiptap/react'
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bold,
	Code,
	Heading1,
	Italic,
	List,
	ListChecks,
	ListOrdered,
	Minus,
	Quote,
	Redo2,
	Strikethrough,
	Table2,
	Underline,
	Undo2,
} from 'lucide-react'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import { toolbar, toolbarButton, toolbarGroup } from './editor.styles.css'
import {
	ToolbarButton,
	ToolbarCallout,
	ToolbarColumnsButton,
	ToolbarColorPicker,
	ToolbarDivider,
	ToolbarExportPdf,
	ToolbarExportWord,
	ToolbarExpandable,
	ToolbarFontFamily,
	ToolbarFontSize,
	ToolbarHighlightButton,
	ToolbarImagePopover,
	ToolbarImportWord,
	ToolbarIndentButtons,
	ToolbarLinkPopover,
	ToolbarPageBreak,
	ToolbarUnderlineColor,
	ToolbarYouTubePopover,
} from './toolbar'

type EditorToolbarProps = {
	editor: Editor
	filename?: string
}

export default function EditorToolbar({ editor, filename }: EditorToolbarProps) {
	return (
		<div className={toolbar}>
			<div className={toolbarGroup}>
				<ToolbarButton
					icon={Bold}
					label='Negrita'
					tooltip='Negrita (Ctrl+B)'
					action={(e) => e.chain().focus().toggleBold().run()}
					isActive={(e) => e.isActive('bold')}
					editor={editor}
				/>
				<ToolbarButton
					icon={Italic}
					label='Cursiva'
					tooltip='Cursiva (Ctrl+I)'
					action={(e) => e.chain().focus().toggleItalic().run()}
					isActive={(e) => e.isActive('italic')}
					editor={editor}
				/>
				<ToolbarButton
					icon={Underline}
					label='Subrayado'
					tooltip='Subrayado (Ctrl+U)'
					action={(e) => e.chain().focus().toggleUnderline().run()}
					isActive={(e) => e.isActive('underline')}
					editor={editor}
				/>
				<ToolbarButton
					icon={Strikethrough}
					label='Tachado'
					tooltip='Tachado (Ctrl+Shift+X)'
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
				<ToolbarHighlightButton editor={editor} />
				<ToolbarUnderlineColor editor={editor} />
			</div>

			<ToolbarDivider />

			<div className={toolbarGroup}>
				<ToolbarFontSize editor={editor} />
				<ToolbarFontFamily editor={editor} />
			</div>

			<ToolbarDivider />

			<div className={toolbarGroup}>
				<Dropdown as={ButtonGroup}>
					<ToolbarButton
						icon={Heading1}
						label='Encabezado'
						tooltip='Encabezado'
						action={() => {}}
						isActive={(e) =>
							e.isActive('heading', { level: 1 }) ||
							e.isActive('heading', { level: 2 }) ||
							e.isActive('heading', { level: 3 })
						}
						editor={editor}
					/>
					<Dropdown.Toggle
						split
						variant='link'
						className={toolbarButton}
						aria-label='Opciones de encabezado'
					/>
					<Dropdown.Menu>
						<Dropdown.Item
							onClick={() => editor.chain().focus().setParagraph().run()}
						>
							<span className='fw-normal'>Párrafo</span>
						</Dropdown.Item>
						<Dropdown.Item
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 1 }).run()
							}
						>
							<span className='fs-4'>Título 1</span>
						</Dropdown.Item>
						<Dropdown.Item
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 2 }).run()
							}
						>
							<span className='fs-5'>Título 2</span>
						</Dropdown.Item>
						<Dropdown.Item
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 3 }).run()
							}
						>
							<span className='fs-6'>Título 3</span>
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>

			<ToolbarDivider />

			<div className={toolbarGroup}>
				<ToolbarButton
					icon={List}
					label='Lista con viñetas'
					tooltip='Lista con viñetas'
					action={(e) => e.chain().focus().toggleBulletList().run()}
					isActive={(e) => e.isActive('bulletList')}
					editor={editor}
				/>
				<ToolbarButton
					icon={ListOrdered}
					label='Lista numerada'
					tooltip='Lista numerada'
					action={(e) => e.chain().focus().toggleOrderedList().run()}
					isActive={(e) => e.isActive('orderedList')}
					editor={editor}
				/>
				<ToolbarButton
					icon={ListChecks}
					label='Lista de tareas'
					tooltip='Lista de tareas'
					action={(e) => e.chain().focus().toggleTaskList().run()}
					isActive={(e) => e.isActive('taskList')}
					editor={editor}
				/>
			</div>

			<ToolbarDivider />

			<div className={toolbarGroup}>
				<ToolbarIndentButtons editor={editor} />
			</div>

			<ToolbarDivider />

			<div className={toolbarGroup}>
				<ToolbarButton
					icon={AlignLeft}
					label='Alinear izquierda'
					tooltip='Alinear izquierda'
					action={(e) => e.chain().focus().setTextAlign('left').run()}
					isActive={(e) => e.isActive({ textAlign: 'left' })}
					editor={editor}
				/>
				<ToolbarButton
					icon={AlignCenter}
					label='Centrar'
					tooltip='Centrar'
					action={(e) => e.chain().focus().setTextAlign('center').run()}
					isActive={(e) => e.isActive({ textAlign: 'center' })}
					editor={editor}
				/>
				<ToolbarButton
					icon={AlignRight}
					label='Alinear derecha'
					tooltip='Alinear derecha'
					action={(e) => e.chain().focus().setTextAlign('right').run()}
					isActive={(e) => e.isActive({ textAlign: 'right' })}
					editor={editor}
				/>
				<ToolbarButton
					icon={AlignJustify}
					label='Justificar'
					tooltip='Justificar'
					action={(e) => e.chain().focus().setTextAlign('justify').run()}
					isActive={(e) => e.isActive({ textAlign: 'justify' })}
					editor={editor}
				/>
			</div>

			<ToolbarDivider />

			<div className={toolbarGroup}>
				<ToolbarButton
					icon={Quote}
					label='Cita'
					tooltip='Bloque de cita'
					action={(e) => e.chain().focus().toggleBlockquote().run()}
					isActive={(e) => e.isActive('blockquote')}
					editor={editor}
				/>
				<ToolbarButton
					icon={Code}
					label='Bloque de código'
					tooltip='Bloque de código'
					action={(e) => e.chain().focus().toggleCodeBlock().run()}
					isActive={(e) => e.isActive('codeBlock')}
					editor={editor}
				/>
				<ToolbarButton
					icon={Minus}
					label='Línea horizontal'
					tooltip='Línea horizontal'
					action={(e) => e.chain().focus().setHorizontalRule().run()}
					editor={editor}
				/>
				<ToolbarColumnsButton editor={editor} />
				<ToolbarCallout editor={editor} />
				<ToolbarExpandable editor={editor} />
				<ToolbarPageBreak editor={editor} />
			</div>

			<ToolbarDivider />

			<div className={toolbarGroup}>
				<ToolbarLinkPopover editor={editor} />
				<ToolbarImagePopover editor={editor} />
				<ToolbarYouTubePopover editor={editor} />
				<ToolbarColorPicker editor={editor} />
			</div>

			<ToolbarDivider />

			<div className={toolbarGroup}>
				<ToolbarButton
					icon={Table2}
					label='Insertar tabla'
					tooltip='Insertar tabla'
					action={(e) =>
						e
							.chain()
							.focus()
							.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
							.run()
					}
					editor={editor}
				/>
			</div>

			<ToolbarDivider />

			<div className={toolbarGroup}>
				<ToolbarImportWord editor={editor} />
				<ToolbarExportWord editor={editor} filename={filename} />
				<ToolbarExportPdf editor={editor} filename={filename} />
			</div>

			<div className={toolbarGroup} style={{ marginLeft: 'auto' }}>
				<ToolbarButton
					icon={Undo2}
					label='Deshacer'
					tooltip='Deshacer (Ctrl+Z)'
					action={(e) => e.chain().focus().undo().run()}
					disabled={(e) => !e.can().undo()}
					editor={editor}
				/>
				<ToolbarButton
					icon={Redo2}
					label='Rehacer'
					tooltip='Rehacer (Ctrl+Shift+Z)'
					action={(e) => e.chain().focus().redo().run()}
					disabled={(e) => !e.can().redo()}
					editor={editor}
				/>
			</div>
		</div>
	)
}
