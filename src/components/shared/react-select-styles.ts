import type { StylesConfig } from 'react-select'

type OptionType = { value: string; label: string }

export const reactSelectStyles: StylesConfig<OptionType, false> = {
	singleValue: (base) => ({
		...base,
		color: 'var(--bs-body-color)',
	}),
	control: (base, state) => ({
		...base,
		minHeight: '38px',
		borderColor: state.isFocused ? '#86b7fe' : 'var(--bs-border-color)',
		backgroundColor: 'var(--bs-body-bg)',
		boxShadow: state.isFocused
			? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
			: 'none',
		'&:hover': {
			borderColor: '#86b7fe',
		},
	}),
	option: (base, { isFocused }) => ({
		...base,
		backgroundColor: isFocused ? 'var(--bs-tertiary-bg)' : 'var(--bs-body-bg)',
		color: 'var(--bs-body-color)',
		fontWeight: 400,
		'&:active': {
			backgroundColor: 'var(--bs-tertiary-bg)',
		},
	}),
	menu: (base) => ({
		...base,
		backgroundColor: 'var(--bs-body-bg)',
		border: '1px solid var(--bs-border-color)',
		zIndex: 9999,
	}),
	menuList: (base) => ({
		...base,
		backgroundColor: 'var(--bs-body-bg)',
	}),
	group: (base) => ({
		...base,
		backgroundColor: 'var(--bs-body-bg)',
	}),
	groupHeading: (base) => ({
		...base,
		color: 'var(--bs-secondary-color)',
		backgroundColor: 'var(--bs-tertiary-bg)',
	}),
	indicatorSeparator: () => ({
		display: 'none',
	}),
	dropdownIndicator: (base, state) => ({
		...base,
		color: state.isFocused ? '#86b7fe' : 'var(--bs-secondary-color)',
	}),
	clearIndicator: (base) => ({
		...base,
		color: 'var(--bs-secondary-color)',
		'&:hover': {
			color: 'var(--bs-body-color)',
		},
	}),
	valueContainer: (base) => ({
		...base,
		padding: '0 8px',
	}),
	input: (base) => ({
		...base,
		margin: 0,
		padding: 0,
		color: 'var(--bs-body-color)',
	}),
	placeholder: (base) => ({
		...base,
		color: 'var(--bs-secondary-color)',
	}),
	noOptionsMessage: (base) => ({
		...base,
		color: 'var(--bs-secondary-color)',
		backgroundColor: 'var(--bs-body-bg)',
	}),
	multiValue: (base) => ({
		...base,
		backgroundColor: 'var(--bs-tertiary-bg)',
		borderRadius: '4px',
	}),
	multiValueLabel: (base) => ({
		...base,
		color: 'var(--bs-body-color)',
		backgroundColor: 'var(--bs-tertiary-bg)',
	}),
	multiValueRemove: (base) => ({
		...base,
		color: 'var(--bs-secondary-color)',
		backgroundColor: 'var(--bs-tertiary-bg)',
		'&:hover': {
			color: '#fff',
			backgroundColor: '#dc3545',
		},
	}),
	loadingMessage: (base) => ({
		...base,
		color: 'var(--bs-secondary-color)',
		backgroundColor: 'var(--bs-body-bg)',
	}),
}
