export type NavItem = {
	type: 'item' | 'group' | 'link'
	id: string
	label: string
	icon?: string
	path?: string
	auth?: string[]
	children?: NavItem[]
}