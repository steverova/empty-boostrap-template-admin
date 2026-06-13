import { useState } from 'react'
import type { Editor } from '@tiptap/react'
import Dropdown from 'react-bootstrap/Dropdown'
import { FileDown, FileText, FileType } from 'lucide-react'
import { exportToWord } from './export-word'
import { exportToPdf } from './export-pdf'

type EditorExportMenuProps = {
	editor: Editor
	filename?: string
}

export default function EditorExportMenu({ editor, filename = 'documento' }: EditorExportMenuProps) {
	const [exporting, setExporting] = useState(false)

	const html = editor.getHTML()

	const handleWord = async () => {
		setExporting(true)
		try {
			await exportToWord(html, filename)
		} finally {
			setExporting(false)
		}
	}

	const handlePdf = async () => {
		setExporting(true)
		try {
			await exportToPdf(html, filename)
		} finally {
			setExporting(false)
		}
	}

	return (
		<Dropdown align='end'>
			<Dropdown.Toggle
				variant='outline-secondary'
				size='sm'
				disabled={exporting}
				id='editor-export-dropdown'
			>
				<FileDown size={14} className='me-1' />
				{exporting ? 'Exportando...' : 'Exportar'}
			</Dropdown.Toggle>
			<Dropdown.Menu>
				<Dropdown.Item onClick={handleWord} disabled={exporting}>
					<FileText size={14} className='me-2' />
					Exportar como Word
				</Dropdown.Item>
				<Dropdown.Item onClick={handlePdf} disabled={exporting}>
					<FileType size={14} className='me-2' />
					Exportar como PDF
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	)
}
