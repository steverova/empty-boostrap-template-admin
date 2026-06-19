import type { LucideIcon } from 'lucide-react'

export type NavItem = {
	type: 'item' | 'group' | 'link'
	id: string
	label: string
	icon?: LucideIcon
	path?: string
	auth?: string[]
	children?: NavItem[]
}
