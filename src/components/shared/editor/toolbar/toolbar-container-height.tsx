import AppTooltip from '@components/shared/tooltip'
import { MoveHorizontal } from 'lucide-react'
import { toolbarButton } from '../editor.styles.css'
import { useEditorStore } from '../editor.store'

type WidthOption = 'auto' | 'sm' | 'md' | 'lg'

const widths: WidthOption[] = ['auto', 'sm', 'md', 'lg']

const labels: Record<WidthOption, string> = {
	auto: 'Ancho automático',
	sm: 'Ancho pequeño (600px)',
	md: 'Ancho mediano (900px)',
	lg: 'Ancho grande (1200px)',
}

export default function ToolbarContainerWidth() {
	const containerWidth = useEditorStore((s) => s.containerWidth)
	const setContainerWidth = useEditorStore((s) => s.setContainerWidth)

	const nextWidth = () => {
		const idx = widths.indexOf(containerWidth)
		setContainerWidth(widths[(idx + 1) % widths.length])
	}

	return (
		<AppTooltip label={labels[containerWidth]} placement='bottom'>
			<button
				type='button'
				className={toolbarButton}
				aria-label='Cambiar ancho del editor'
				onMouseDown={(e) => e.preventDefault()}
				onClick={nextWidth}
			>
				<MoveHorizontal size={16} strokeWidth={2} />
			</button>
		</AppTooltip>
	)
}
