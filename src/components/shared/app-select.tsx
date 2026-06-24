import Select, { type Props as ReactSelectProps } from 'react-select'
import { reactSelectStyles } from '@/components/shared/react-select-styles'

type OptionType = { value: string; label: string }

export type AppSelectProps = Omit<
	ReactSelectProps<OptionType, false>,
	'value' | 'onChange' | 'styles' | 'options'
> & {
	value: string
	onChange: (value: string) => void
	options?: readonly OptionType[]
}

export default function AppSelect({
	value,
	onChange,
	options,
	...rest
}: AppSelectProps) {
	return (
		<Select<OptionType, false>
			styles={reactSelectStyles}
			options={options}
			value={options?.find((o) => o.value === value) ?? null}
			onChange={(val) => onChange(val?.value ?? '')}
			{...rest}
		/>
	)
}
