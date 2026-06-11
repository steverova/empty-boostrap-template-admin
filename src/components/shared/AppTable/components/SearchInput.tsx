import type { JSX } from 'react'

type AppInputProps = {
	containerClassName?: string
	error?: boolean
	helperText?: string
	adornmentLeft?: JSX.Element
	adornmentRight?: JSX.Element
} & React.InputHTMLAttributes<HTMLInputElement>

export default function AppInput(props: AppInputProps): JSX.Element {
	const { containerClassName, error, helperText, adornmentLeft, adornmentRight, ...inputProps } = props
	
	return (
		<div
			className={containerClassName}
			style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
			<div className='input-group ' style={{ height: '38px' }}>
				{adornmentLeft && (
					<span 
						className='input-group-text' 
						id='basic-addon1'
						style={{ padding: '0 8px', display: 'flex', alignItems: 'center', minWidth: 'auto' }}>
						{adornmentLeft}
					</span>
				)}

				<input
					{...inputProps}
					aria-describedby='basic-addon1'
					className={`form-control ${props.className ?? ''} ${error ? 'is-invalid' : ''}`}
					style={{ height: '100%' }}
					type={props.type ?? 'text'}
				/>

				{adornmentRight && (
					<span 
						className='input-group-text' 
						id='basic-addon2'
						style={{ padding: '0 8px', display: 'flex', alignItems: 'center', minWidth: 'auto' }}>
						{adornmentRight}
					</span>
				)}
			</div>

			{helperText && (
				<small
					className={`form-text ${error ? 'text-danger' : 'text-muted'}`}
					style={{
						fontSize: '0.75rem',
						marginTop: '4px',
						display: 'block',
						position: 'absolute',
						top: '100%',
						left: 0,
						marginBottom: '2rem'
					}}>
					{helperText}
				</small>
			)}
		</div>
	)
}
