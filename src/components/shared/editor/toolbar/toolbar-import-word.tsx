import type { Editor } from '@tiptap/react'
import { useRef } from 'react'
import { FileUp } from 'lucide-react'
import ToolbarButton from './toolbar-button'
import mammoth from 'mammoth'

type ToolbarImportWordProps = {
	editor: Editor
}

export default function ToolbarImportWord({ editor }: ToolbarImportWordProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFile = async (file: File) => {
		try {
			const arrayBuffer = await file.arrayBuffer()
			const result = await mammoth.convertToHtml({ arrayBuffer })
			const html = result.value
			if (html) {
				editor.chain().focus().insertContent(html).run()
			}
		} catch (err) {
			console.error('Error importing Word file:', err)
		}
	}

	return (
		<>
			<input
				ref={fileInputRef}
				type='file'
				accept='.doc,.docx'
				style={{ display: 'none' }}
				onChange={(e) => {
					const file = e.target.files?.[0]
					if (file) handleFile(file)
					e.target.value = ''
				}}
			/>
			<ToolbarButton
				icon={FileUp}
				label='Importar Word'
				tooltip='Importar archivo Word (.doc, .docx)'
				action={() => fileInputRef.current?.click()}
				editor={editor}
			/>
		</>
	)
}
