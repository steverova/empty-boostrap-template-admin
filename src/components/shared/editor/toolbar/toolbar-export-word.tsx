import { useState } from 'react'
import type { Editor } from '@tiptap/react'
import { FileText } from 'lucide-react'
import ToolbarButton from './toolbar-button'
import { exportToWord } from '../export-word'

type ToolbarExportWordProps = {
	editor: Editor
	filename?: string
}

export default function ToolbarExportWord({ editor, filename = 'documento' }: ToolbarExportWordProps) {
	const [exporting, setExporting] = useState(false)

	return (
		<ToolbarButton
			icon={FileText}
			label='Exportar Word'
			tooltip='Exportar como Word (.doc)'
			action={async () => {
				setExporting(true)
				try {
					await exportToWord(editor.getHTML(), filename)
				} finally {
					setExporting(false)
				}
			}}
			disabled={() => exporting}
			editor={editor}
		/>
	)
}
