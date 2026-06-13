import BaseTabs from '@/components/shared/base-tabs'
import Editor from '@components/shared/editor'
import { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

export default function EditorExamplePage() {
	const [content, setContent] = useState('')

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
								characterLimit={5000}
								exportFilename='mi-documento'
								onUpdate={(ed) => setContent(ed.getHTML())}
							/>
						),
					},
					{
						label: 'HTML Preview',
						key: 'html-preview',
						content: (
							<div
								className='border rounded p-3 bg-body-secondary'
								style={{ minHeight: 200 }}
							>
								<h6 className='text-secondary mb-2'>
									Vista previa (HTML):
								</h6>

								<pre
									className='small mb-0'
									style={{
										whiteSpace: 'pre-wrap',
										wordBreak: 'break-word',
									}}
								>
									{content || '<p></p>'}
								</pre>
							</div>
						),
					},
				]}
			/>
		</Container>
	)
}