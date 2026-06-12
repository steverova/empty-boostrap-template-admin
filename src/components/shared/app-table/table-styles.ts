import type { StylesConfig } from 'react-select'

export const selectStyles: StylesConfig<{ value: number; label: string }> = {
	singleValue: (base) => ({
		...base,
		textAlign: 'center',
		width: '100%',
		margin: 0,
		color: 'var(--bs-body-color)',
	}),
	control: (base, state) => ({
		...base,
		textAlign: 'center',
		minHeight: '31px',
		borderColor: state.isFocused ? '#86b7fe' : 'var(--bs-border-color)',
		backgroundColor: 'var(--bs-body-bg)',
		boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : 'none',
		'&:hover': {
			borderColor: '#86b7fe',
		},
	}),
	option: (base, { isFocused, isSelected }) => ({
		...base,
		backgroundColor: isSelected
			? '#0d6efd'
			: isFocused
				? 'var(--bs-tertiary-bg)'
				: 'var(--bs-body-bg)',
		color: isSelected ? '#fff' : 'var(--bs-body-color)',
		'&:active': {
			backgroundColor: isSelected ? '#0d6efd' : 'var(--bs-tertiary-bg)',
		},
	}),
	menu: (base) => ({
		...base,
		backgroundColor: 'var(--bs-body-bg)',
		border: '1px solid var(--bs-border-color)',
	}),
	indicatorSeparator: () => ({
		display: 'none',
	}),
	dropdownIndicator: (base, state) => ({
		...base,
		color: state.isFocused ? '#86b7fe' : 'var(--bs-secondary-color)',
	}),
	valueContainer: (base) => ({
		...base,
		padding: '0 6px',
		textAlign: 'center',
		justifyContent: 'center',
	}),
	input: (base) => ({
		...base,
		textAlign: 'center',
		margin: 0,
		padding: 0,
		color: 'var(--bs-body-color)',
	}),
	placeholder: (base) => ({
		...base,
		color: 'var(--bs-secondary-color)',
	}),
}
