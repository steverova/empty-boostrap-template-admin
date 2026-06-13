import { type JSX, useState } from 'react'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

export type BTab = {
	label: string
	key: string
	content: React.ReactNode | JSX.Element
	icon?: React.ReactNode
	disabled?: boolean
}

type BaseTabsProps = {
	tabs: BTab[]
	defaultTab?: string
}

export default function BaseTabs({ tabs, defaultTab }: BaseTabsProps) {
	const [key, setKey] = useState(defaultTab ?? tabs[0]?.key ?? '')

	return (
		<Tabs
			id='base-tabs'
			unmountOnExit
			mountOnEnter
			activeKey={key}
			onSelect={(k) => setKey(k ?? '')}
			className='mb-3'
		>
			{tabs.map((tab) => (
				<Tab
					key={tab.key}
					eventKey={tab.key}
					title={
						<>
							{tab.icon && (
								<span aria-hidden className='me-2'>
									{tab.icon}
								</span>
							)}
							{tab.label}
						</>
					}
					disabled={tab.disabled}
				>
					{tab.content}
				</Tab>
			))}
		</Tabs>
	)
}
