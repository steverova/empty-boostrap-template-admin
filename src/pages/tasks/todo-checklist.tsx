import { nanoid } from 'nanoid'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Badge, Button, Card, Form, Collapse } from 'react-bootstrap'
import {
	ChevronDown,
	ChevronRight,
	FileText,
	Image,
	Link,
	Plus,
	Trash2,
	Video,
	X,
} from 'lucide-react'
import type { Attachment, AttachmentType, TodoItem } from './task.types'

type TodoChecklistProps = {
	value: TodoItem[]
	onChange: (todos: TodoItem[]) => void
}

export default function TodoChecklist({ value, onChange }: TodoChecklistProps) {
	const [newTodoText, setNewTodoText] = useState('')
	const [expandedId, setExpandedId] = useState<string | null>(null)
	const [attachType, setAttachType] = useState<AttachmentType>('link')
	const [attachUrl, setAttachUrl] = useState('')
	const [attachName, setAttachName] = useState('')
	const [attachTargetId, setAttachTargetId] = useState<string | null>(null)

	function addTodo() {
		if (!newTodoText.trim()) return
		const newTodo: TodoItem = {
			id: nanoid(10),
			text: newTodoText.trim(),
			description: '',
			completed: false,
			attachments: [],
		}
		onChange([...value, newTodo])
		setNewTodoText('')
	}

	function toggleTodo(id: string) {
		onChange(value.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
	}

	function updateDescription(id: string, description: string) {
		onChange(value.map((t) => (t.id === id ? { ...t, description } : t)))
	}

	function removeTodo(id: string) {
		onChange(value.filter((t) => t.id !== id))
	}

	function addLink(id: string) {
		if (!attachUrl.trim()) return
		const attachment: Attachment = {
			id: nanoid(10),
			type: attachType,
			url: attachUrl.trim(),
			name: attachName.trim() || attachUrl.trim(),
		}
		onChange(
			value.map((t) =>
				t.id === id ? { ...t, attachments: [...(t.attachments ?? []), attachment] } : t,
			),
		)
		setAttachUrl('')
		setAttachName('')
		setAttachTargetId(null)
	}

	const onDrop = useCallback(
		(acceptedFiles: File[], todoId: string) => {
			const newAttachments: Attachment[] = acceptedFiles.map((file) => ({
				id: nanoid(10),
				type: file.type.startsWith('image/')
					? 'image'
					: file.type.startsWith('video/')
						? 'video'
						: 'link',
				url: URL.createObjectURL(file),
				name: file.name,
			}))
			onChange(
				value.map((t) =>
					t.id === todoId
						? { ...t, attachments: [...(t.attachments ?? []), ...newAttachments] }
						: t,
				),
			)
		},
		[value, onChange],
	)

	function removeAttachment(todoId: string, attachmentId: string) {
		onChange(
			value.map((t) =>
				t.id === todoId
					? { ...t, attachments: (t.attachments ?? []).filter((a) => a.id !== attachmentId) }
					: t,
			),
		)
	}

	const attachmentIcon = (type: AttachmentType) => {
		switch (type) {
			case 'image':
				return <Image size={12} />
			case 'video':
				return <Video size={12} />
			case 'link':
				return <Link size={12} />
		}
	}

	return (
		<div>
			<div className='d-flex gap-2 mb-3'>
				<Form.Control
					placeholder='Add a todo...'
					value={newTodoText}
					onChange={(e) => setNewTodoText(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault()
							addTodo()
						}
					}}
				/>
				<Button variant='outline-primary' onClick={addTodo}>
					<Plus size={16} />
				</Button>
			</div>

			<div className='d-flex flex-column gap-2'>
				{value.map((todo) => {
					const isExpanded = expandedId === todo.id
					const isAttachOpen = attachTargetId === todo.id

					return (
						<Card key={todo.id} className='border'>
							<Card.Body className='py-2 px-3'>
								<div className='d-flex align-items-center gap-2'>
									<Button
										variant='link'
										className='p-0 text-decoration-none'
										onClick={() => setExpandedId(isExpanded ? null : todo.id)}
									>
										{isExpanded ? (
											<ChevronDown size={16} />
										) : (
											<ChevronRight size={16} />
										)}
									</Button>

									<Form.Check
										checked={todo.completed}
										onChange={() => toggleTodo(todo.id)}
										className='flex-shrink-0'
									/>

									<span
										className={`flex-grow-1 ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}
									>
										{todo.text}
									</span>

								{(todo.attachments?.length ?? 0) > 0 && (
									<Badge bg='secondary' className='me-1'>
										{todo.attachments?.length ?? 0} file(s)
									</Badge>
								)}

									<Button
										variant='link'
										className='p-0 text-danger'
										onClick={() => removeTodo(todo.id)}
									>
										<Trash2 size={14} />
									</Button>
								</div>

								<Collapse in={isExpanded}>
									<div className='mt-3'>
										<Form.Control
											as='textarea'
											rows={2}
											placeholder='Add a description...'
											value={todo.description ?? ''}
											onChange={(e) => updateDescription(todo.id, e.target.value)}
											className='mb-2'
										/>

										{(todo.attachments?.length ?? 0) > 0 && (
											<div className='d-flex flex-wrap gap-1 mb-2'>
												{todo.attachments?.map((att) => (
													<Badge
														key={att.id}
														bg='light'
														text='dark'
														className='d-flex align-items-center gap-1'
													>
														{attachmentIcon(att.type)}
														{att.type === 'image' || att.type === 'video' ? (
															<a
																href={att.url}
																target='_blank'
																rel='noreferrer'
																className='text-decoration-none'
															>
																{att.name}
															</a>
														) : (
															<a
																href={att.url}
																target='_blank'
																rel='noreferrer'
																className='text-decoration-none'
															>
																{att.name}
															</a>
														)}
														<X
															size={10}
															style={{ cursor: 'pointer' }}
															onClick={() => removeAttachment(todo.id, att.id)}
														/>
													</Badge>
												))}
											</div>
										)}

										{isAttachOpen ? (
											<Card className='bg-body-secondary border'>
												<Card.Body className='py-2 px-3'>
													<div className='d-flex gap-2 mb-2'>
														<Form.Select
															size='sm'
															value={attachType}
															onChange={(e) =>
																setAttachType(e.target.value as AttachmentType)
															}
															style={{ width: 120 }}
														>
															<option value='link'>Link</option>
															<option value='image'>Image</option>
															<option value='video'>Video</option>
														</Form.Select>
														<Form.Control
															size='sm'
															placeholder='URL'
															value={attachUrl}
															onChange={(e) => setAttachUrl(e.target.value)}
														/>
														<Form.Control
															size='sm'
															placeholder='Name (optional)'
															value={attachName}
															onChange={(e) => setAttachName(e.target.value)}
														/>
													</div>
													<div className='d-flex gap-2'>
														<Button
															size='sm'
															variant='primary'
															onClick={() => addLink(todo.id)}
														>
															Add
														</Button>
														<Button
															size='sm'
															variant='outline-secondary'
															onClick={() => setAttachTargetId(null)}
														>
															Cancel
														</Button>
													</div>
												</Card.Body>
											</Card>
										) : (
											<FileDropzone
												todoId={todo.id}
												onDrop={onDrop}
												onOpenLink={() => setAttachTargetId(todo.id)}
											/>
										)}
									</div>
								</Collapse>
							</Card.Body>
						</Card>
					)
				})}
			</div>
		</div>
	)
}

function FileDropzone({
	todoId,
	onDrop,
	onOpenLink,
}: {
	todoId: string
	onDrop: (files: File[], todoId: string) => void
	onOpenLink: () => void
}) {
	const onDropCallback = useCallback(
		(acceptedFiles: File[]) => {
			onDrop(acceptedFiles, todoId)
		},
		[todoId, onDrop],
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: onDropCallback,
		accept: {
			'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
			'video/*': ['.mp4', '.webm', '.ogg'],
		},
		maxSize: 10 * 1024 * 1024,
	})

	return (
		<div className='d-flex gap-2'>
			<div
				{...getRootProps()}
				className={`border rounded px-3 py-2 text-center flex-grow-1 ${isDragActive ? 'border-primary bg-body-secondary' : 'border-dashed'}`}
				style={{ cursor: 'pointer', borderStyle: 'dashed' }}
			>
				<input {...getInputProps()} />
				<FileText size={14} className='text-muted' />{' '}
				<span className='text-muted small'>
					Drop files or click to upload
				</span>
			</div>
			<Button size='sm' variant='outline-secondary' onClick={onOpenLink}>
				<Link size={14} />
			</Button>
		</div>
	)
}
