import { useState } from 'react'
import type { Editor } from '@tiptap/react'
import { FileType } from 'lucide-react'
import ToolbarButton from './toolbar-button'
import { exportToPdf } from '../export-pdf'

type ToolbarExportPdfProps = {
	editor: Editor
	filename?: string
}

export default function ToolbarExportPdf({ editor, filename = 'documento' }: ToolbarExportPdfProps) {
	const [exporting, setExporting] = useState(false)

	return (
		<ToolbarButton
			icon={FileType}
			label='Exportar PDF'
			tooltip='Exportar como PDF'
			action={async () => {
				setExporting(true)
				try {
					await exportToPdf(editor.getHTML(), filename)
				} finally {
					setExporting(false)
				}
			}}
			disabled={() => exporting}
			editor={editor}
		/>
	)
}
