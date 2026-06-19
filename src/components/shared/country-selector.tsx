import { useMemo } from 'react'
import Select, { type GroupBase, type Props as SelectProps, components } from 'react-select'
import countryData from 'country-list/data.json'
import { reactSelectStyles } from './react-select-styles'

function codeToFlag(code: string): string {
	return code
		.toUpperCase()
		.split('')
		.map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
		.join('')
}

interface CountryItem {
	code: string
	name: string
	flag: string
}

const ALL_COUNTRIES: CountryItem[] = (countryData as Array<{ code: string; name: string }>).map(
	(c) => ({
		code: c.code,
		name: c.name,
		flag: codeToFlag(c.code),
	}),
)

const COUNTRY_OPTIONS: GroupBase<CountryItem>[] = [
	{
		label: 'Países',
		options: ALL_COUNTRIES,
	},
]

interface CountrySelectorProps extends Omit<SelectProps<CountryItem>, 'options' | 'formatOptionLabel'> {
	showFlag?: boolean
	showCode?: boolean
	placeholder?: string
}

function CountryOption(props: React.ComponentProps<typeof components.Option<CountryItem, false>>) {
	const { data, isSelected } = props
	return (
		<components.Option {...props}>
			<div className='d-flex align-items-center gap-2'>
				<span style={{ fontSize: '1.2em', lineHeight: 1 }}>{data.flag}</span>
				<span className='flex-grow-1'>{data.name}</span>
				{isSelected && <span className='text-muted small'>✓</span>}
			</div>
		</components.Option>
	)
}

function CountrySingleValue(props: React.ComponentProps<typeof components.SingleValue<CountryItem, false>>) {
	const { data, selectProps } = props
	const showFlag = (selectProps as unknown as { showFlag?: boolean }).showFlag !== false
	const showCode = (selectProps as unknown as { showCode?: boolean }).showCode
	return (
		<components.SingleValue {...props}>
			<div className='d-flex align-items-center gap-2'>
				{showFlag && <span style={{ fontSize: '1.2em', lineHeight: 1 }}>{data.flag}</span>}
				<span>{data.name}</span>
				{showCode && <span className='text-muted small'>({data.code})</span>}
			</div>
		</components.SingleValue>
	)
}

export default function CountrySelector({
	showFlag = true,
	showCode = false,
	placeholder = 'Selecciona un país',
	...rest
}: CountrySelectorProps) {
	const styles = useMemo(() => ({ ...reactSelectStyles }), [])

	return (
		<Select<CountryItem, false, GroupBase<CountryItem>>
			{...rest}
			options={COUNTRY_OPTIONS}
			placeholder={placeholder}
			isSearchable
			formatOptionLabel={(option) => (
				<div className='d-flex align-items-center gap-2'>
					{showFlag && <span style={{ fontSize: '1.2em', lineHeight: 1 }}>{option.flag}</span>}
					<span>{option.name}</span>
					{showCode && <span className='text-muted small'>({option.code})</span>}
				</div>
			)}
			components={{
				Option: CountryOption,
				SingleValue: CountrySingleValue,
				...rest.components,
			}}
			styles={styles}
			classNamePrefix='country-selector'
		/>
	)
}

export { codeToFlag, type CountryItem }
