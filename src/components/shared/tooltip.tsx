import type { JSX } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

type TooltipProps = {
	placement?: 'top' | 'right' | 'bottom' | 'left'
	label: string
	children: JSX.Element
}

function AppTooltip({ 
	placement = 'top', 
	label, 
	children 
}: TooltipProps) {
	const renderTooltip = (props: React.ComponentProps<typeof Tooltip>) => (
		<Tooltip id={`tooltip-${placement}`} {...props}>
			{label}
		</Tooltip>
	)

	return (
		<OverlayTrigger
			placement={placement}
			delay={{ show: 150, hide: 400 }}
			overlay={renderTooltip}
		>
			{children}
		</OverlayTrigger>
	)
}

export default AppTooltip