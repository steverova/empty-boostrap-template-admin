import { useColorTheme } from '@hooks/use-color-theme'
import { Palette } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'

const PRESET_COLORS = [
	{ label: 'Azul', value: '#0d6efd' },
	{ label: 'Indigo', value: '#6610f2' },
	{ label: 'Púrpura', value: '#6f42c1' },
	{ label: 'Rosa', value: '#d63384' },
	{ label: 'Rojo', value: '#dc3545' },
	{ label: 'Naranja', value: '#fd7e14' },
	{ label: 'Amarillo', value: '#ffc107' },
	{ label: 'Verde', value: '#198754' },
	{ label: 'Turquesa', value: '#20c997' },
	{ label: 'Celeste', value: '#0dcaf0' },
]

export default function ColorThemeSelector() {
	const { color, setColor } = useColorTheme()
	const [show, setShow] = useState(false)
	const [customColor, setCustomColor] = useState(color)
	const target = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		setCustomColor(color)
	}, [color])

	return (
		<>
			<Button
				ref={target}
				size='sm'
				variant='outline-secondary'
				onClick={() => setShow(!show)}
				className='d-flex align-items-center gap-1'
				title='Cambiar color de tema'
			>
				<Palette size={16} />
				<span
					className='rounded-circle d-inline-block'
					style={{
						width: 14,
						height: 14,
						backgroundColor: color,
						border: '2px solid var(--bs-border-color)',
					}}
				/>
			</Button>

			<Overlay
				target={target.current}
				show={show}
				placement='top'
				onHide={() => setShow(false)}
				rootClose
			>
				<Popover className='no-arrow'>
					<Popover.Body className='p-2'>
						<div className='d-flex flex-column gap-2'>
							<div className='d-flex flex-wrap gap-1'>
								{PRESET_COLORS.map((c) => (
									<button
										key={c.value}
										type='button'
										className='rounded-circle border-0 p-0'
										style={{
											width: 24,
											height: 24,
											backgroundColor: c.value,
											outline:
												color === c.value
													? '2px solid var(--bs-body-color)'
													: '2px solid transparent',
											outlineOffset: 2,
											cursor: 'pointer',
										}}
										title={c.label}
										onClick={() => {
											setColor(c.value)
											setCustomColor(c.value)
										}}
									/>
								))}
							</div>

							<hr className='my-1' />

							<div className='d-flex align-items-center gap-2'>
								<input
									type='color'
									value={customColor}
									onChange={(e) => {
										setCustomColor(e.target.value)
										setColor(e.target.value)
									}}
									className='border-0 p-0'
									style={{ width: 28, height: 28, cursor: 'pointer' }}
								/>
								<input
									type='text'
									value={customColor}
									onChange={(e) => {
										const v = e.target.value
										setCustomColor(v)
										if (/^#[0-9a-f]{6}$/i.test(v)) setColor(v)
									}}
									className='form-control form-control-sm'
									placeholder='#000000'
									maxLength={7}
								/>
							</div>
						</div>
					</Popover.Body>
				</Popover>
			</Overlay>
		</>
	)
}
