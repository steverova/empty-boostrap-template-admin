import BaseTabs from '@/components/shared/base-tabs'
import Editor, { EditorPreview } from '@components/shared/editor'
import { useState } from 'react'
import Container from 'react-bootstrap/Container'

const STORAGE_KEY = 'editor-example-content'

export default function EditorExamplePage() {
	const [content, setContent] = useState(() => {
		return localStorage.getItem(STORAGE_KEY) || ''
	})

	const handleUpdate = (html: string) => {
		setContent(html)
		localStorage.setItem(STORAGE_KEY, html)
	}

	return (
		<Container fluid className='py-4'>
			<BaseTabs
				tabs={[
					{
						label: 'Editor',
						key: 'editor',
						content: (
							<Editor
								placeholder='Comienza a escribir...'
								exportFilename='mi-documento'
								initialContent={content}
								onUpdate={(ed) => handleUpdate(ed.getHTML())}
							/>
						),
					},
					{
						label: 'Vista previa',
						key: 'html-preview',
						content: (
							<EditorPreview
								content={content}
							/>
						),
					},
				]}
			/>
		</Container>
	)
}