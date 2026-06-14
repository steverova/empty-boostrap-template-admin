import AppTooltip from '@components/shared/tooltip'
import type { Editor } from '@tiptap/react'
import { toolbarButton } from '../editor.styles.css'

type ToolbarButtonProps = {
	icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
	label: string
	tooltip: string
	action: (editor: Editor) => void
	isActive?: (editor: Editor) => boolean
	disabled?: (editor: Editor) => boolean
	editor: Editor
}

export default function ToolbarButton({
	icon: Icon,
	label,
	tooltip,
	action,
	isActive,
	disabled,
	editor,
}: ToolbarButtonProps) {
	const active = isActive?.(editor) ?? false
	const isDisabled = disabled?.(editor) ?? false

	return (
		<AppTooltip label={tooltip} placement='top'>
			<button
				type='button'
				className={toolbarButton}
				data-active={active}
				disabled={isDisabled}
				aria-label={label}
				onMouseDown={(e) => e.preventDefault()}
				onClick={() => action(editor)}
			>
				<Icon size={16} strokeWidth={2} />
			</button>
		</AppTooltip>
	)
}
