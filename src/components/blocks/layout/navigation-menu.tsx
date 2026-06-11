import { type JSX, useState } from 'react'
import { Link, useLocation } from 'react-router'
import styled from 'styled-components'
import {
	Award,
	BarChart3,
	Building2,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	CreditCard,
	ExternalLink,
	FileText,
	Flag,
	Folder,
	Gift,
	Globe,
	Gauge,
	Hourglass,
	HelpCircle,
	ListChecks,
	Mail,
	Package,
	RefreshCw,
	ShieldCheck,
	Tag,
	Ticket,
	Upload,
	Users,
	XCircle,
	Zap,
} from 'lucide-react'
import { type NavItem, navigationMenu } from '../../../router/navigation-menu'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; 'aria-label'?: string }>> = {
	speedometer2: Gauge,
	people: Users,
	'shield-lock': ShieldCheck,
	'file-earmark-text': FileText,
	'file-text': FileText,
	folder: Folder,
	globe: Globe,
	gift: Gift,
	'question-circle': HelpCircle,
	tag: Tag,
	building: Building2,
	'lightning-charge': Zap,
	'box-seam': Package,
	'arrow-repeat': RefreshCw,
	award: Award,
	'list-check': ListChecks,
	'cloud-upload': Upload,
	'card-list': CreditCard,
	'check-circle': CheckCircle,
	'hourglass-split': Hourglass,
	'x-circle': XCircle,
	'bar-chart': BarChart3,
	ticket: Ticket,
	'envelope-paper': Mail,
	whatsapp: ExternalLink,
	'flag-fill': Flag,
	'chevron-up': ChevronUp,
	'chevron-down': ChevronDown,
}

function Icon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
	const Component = iconMap[name]
	if (!Component) return null
	return <Component size={size} className={className} />
}

const StyledNavLink = styled(Link)`
	&:hover {
	  color: var(--bs-text-body-emphasis) !important;
		background: #5c54541f;
	}
`

const StyledGroupButton = styled.button`
  text-decoration: none;
  color: var(--bs-body-color);
	&:hover {
	  color: var(--bs-text-body-emphasis) !important;
		background: #5c54541f;
	}
`

type NavigationMenuProps = {
	userRole?: string | undefined
}

export default function NavigationMenu({
	userRole,
}: NavigationMenuProps): JSX.Element {
	const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
	const location = useLocation()

	const toggleGroup = (groupId: string): void => {
		setOpenGroups((prev) => {
			const newSet = new Set(prev)
			if (newSet.has(groupId)) {
				newSet.delete(groupId)
			} else {
				newSet.add(groupId)
			}
			return newSet
		})
	}

	const filterNavItems = (items: NavItem[]): NavItem[] => {
		return items
			.map((item) => {
				if (item.type === 'item' || item.type === 'link') {
					if (!item.auth || !userRole || userRole === 'guest') return item
					return item.auth.includes(userRole) ? item : null
				}
				if (item.children) {
					const filteredChildren = filterNavItems(item.children)
					return filteredChildren.length > 0
						? { ...item, children: filteredChildren }
						: null
				}
				return item
			})
			.filter((item): item is NavItem => item !== null)
	}

	const filteredMenu = filterNavItems(navigationMenu)

	const renderNavItem = (navItem: NavItem, level: number = 0): JSX.Element => {
		if (navItem.type === 'item') {
			const isActive = location.pathname === navItem.path
			return (
				<li className='nav-item' key={navItem.id}>
					<StyledNavLink
						className={`nav-link d-flex align-items-center text-decoration-none ${isActive ? 'text-body bg-body' : 'text-body-secondary'}`}
						to={navItem.path ?? '/'}
					>
						<Icon className='me-2' name={navItem.icon} />
						{navItem.label}
					</StyledNavLink>
				</li>
			)
		}

		if (navItem.type === 'link') {
			return (
				<li className='nav-item' key={navItem.id}>
					<a
						className={`nav-link d-flex align-items-center text-decoration-none text-body-secondary`}
						href={navItem.path}
						target='_blank'
						rel='noopener noreferrer'
					>
						<Icon className='me-2' name={navItem.icon} />
						{navItem.label}
					</a>
				</li>
			)
		}

		return (
			<li className='nav-item' key={navItem.id}>
				<StyledGroupButton
					className='nav-link  d-flex align-items-center justify-content-between w-100 text-body-secondary'
					onClick={() => toggleGroup(navItem.id)}
					type='button'
				>
					<span className='d-flex align-items-center'>
						<Icon className='me-1' name={navItem.icon} />
						{navItem.label}
					</span>
					<Icon name={openGroups.has(navItem.id) ? 'chevron-up' : 'chevron-down'} />
				</StyledGroupButton>
				{openGroups.has(navItem.id) && navItem.children && (
					<ul className='nav flex-column ms-3'>
						{navItem.children.map((child) => renderNavItem(child, level + 1))}
					</ul>
				)}
			</li>
		)
	}

	return (
		<ul className='nav nav-pills flex-column mb-auto'>
			{filteredMenu.map((navItem) => renderNavItem(navItem))}
		</ul>
	)
}
