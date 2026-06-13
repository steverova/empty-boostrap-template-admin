import Editor from '@components/shared/editor'
import { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

export default function EditorExamplePage() {
	const [content, setContent] = useState('')

	return (
		<Container fluid className='py-4'>
			<Row className='mb-3'>
				<Col>
					<h2>Editor de Texto</h2>
					<p className='text-secondary'>
						Editor rico con Tiptap, React Bootstrap y Lucide icons.
					</p>
				</Col>
			</Row>
			<Row>
				<Col lg={8}>
					<Editor
						placeholder='Comienza a escribir...'
						characterLimit={5000}
						onUpdate={(ed) => setContent(ed.getHTML())}
					/>
				</Col>
				<Col lg={4}>
					<div
						className='border rounded p-3 bg-body-secondary'
						style={{ minHeight: 200 }}
					>
						<h6 className='text-secondary mb-2'>Vista previa (HTML):</h6>
						<pre
							className='small mb-0'
							style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
						>
							{content || '<p></p>'}
						</pre>
					</div>
				</Col>
			</Row>
		</Container>
	)
}
