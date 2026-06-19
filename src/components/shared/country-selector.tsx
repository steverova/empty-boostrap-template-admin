import countryData from 'country-list/data.json'
import { useMemo } from 'react'
import Select, {
	components,
	type GroupBase,
	type OptionProps,
	type Props as SelectProps,
	type SingleValueProps as SingleValuePropsTyped,
} from 'react-select'
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

const ALL_COUNTRIES: CountryItem[] = (
	countryData as Array<{ code: string; name: string }>
).map((c) => ({
	code: c.code,
	name: c.name,
	flag: codeToFlag(c.code),
}))

const COUNTRY_OPTIONS: GroupBase<CountryItem>[] = [
	{
		label: 'Países',
		options: ALL_COUNTRIES,
	},
]

interface CountrySelectorProps
	extends Omit<
		SelectProps<CountryItem>,
		'options' | 'formatOptionLabel' | 'components' | 'styles'
	> {
	showFlag?: boolean
	showCode?: boolean
	placeholder?: string
	components?: SelectProps<CountryItem>['components']
	styles?: SelectProps<CountryItem>['styles']
}

function CountryOption(props: OptionProps<CountryItem, false>) {
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

function CountrySingleValue(props: SingleValuePropsTyped<CountryItem, false>) {
	const { data, selectProps } = props
	const showFlag =
		(selectProps as unknown as { showFlag?: boolean }).showFlag !== false
	const showCode = (selectProps as unknown as { showCode?: boolean }).showCode
	return (
		<components.SingleValue {...props}>
			<div className='d-flex align-items-center gap-2'>
				{showFlag && (
					<span style={{ fontSize: '1.2em', lineHeight: 1 }}>{data.flag}</span>
				)}
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
	components: customComponents,
	styles: customStyles,
	...rest
}: CountrySelectorProps) {
	const stylesMerged = useMemo(
		() => ({ ...reactSelectStyles(), ...customStyles }),
		[customStyles],
	)

	return (
		<Select<CountryItem, false, GroupBase<CountryItem>>
			{...rest}
			options={COUNTRY_OPTIONS}
			placeholder={placeholder}
			isSearchable
			formatOptionLabel={(option) => (
				<div className='d-flex align-items-center gap-2'>
					{showFlag && (
						<span style={{ fontSize: '1.2em', lineHeight: 1 }}>
							{option.flag}
						</span>
					)}
					<span>{option.name}</span>
					{showCode && (
						<span className='text-muted small'>({option.code})</span>
					)}
				</div>
			)}
			components={{
				Option: CountryOption,
				SingleValue: CountrySingleValue,
				...customComponents,
			}}
			styles={stylesMerged as any}
			classNamePrefix='country-selector'
		/>
	)
}

// eslint-disable-next-line react-refresh/only-export-components
export { type CountryItem, codeToFlag }
