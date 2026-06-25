export type RgbColor = { r: number; g: number; b: number }

export function hexToRgb(hex: string): RgbColor | null {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
		: null
}

export function applyColorTheme(color: string) {
	const root = document.documentElement
	const rgb = hexToRgb(color)
	if (!rgb) return

	const { r, g, b } = rgb
	const isLight = r > 128

	root.style.setProperty('--bs-primary', color)
	root.style.setProperty('--bs-primary-rgb', `${r}, ${g}, ${b}`)
	root.style.setProperty('--bs-primary-text-emphasis', `color-mix(in srgb, ${color} 80%, ${isLight ? 'black' : 'white'})`)
	root.style.setProperty('--bs-primary-bg-subtle', `rgba(${r}, ${g}, ${b}, 0.1)`)
	root.style.setProperty('--bs-primary-border-subtle', `rgba(${r}, ${g}, ${b}, 0.2)`)

	const btnStyle = document.getElementById('color-theme-primary-btn') ?? (() => {
		const el = document.createElement('style')
		el.id = 'color-theme-primary-btn'
		document.head.appendChild(el)
		return el
	})()
	btnStyle.textContent = `
		.btn-primary {
			--bs-btn-bg: ${color};
			--bs-btn-border-color: ${color};
			--bs-btn-hover-bg: color-mix(in srgb, ${color} 85%, black);
			--bs-btn-hover-border-color: color-mix(in srgb, ${color} 85%, black);
			--bs-btn-active-bg: color-mix(in srgb, ${color} 75%, black);
			--bs-btn-active-border-color: color-mix(in srgb, ${color} 75%, black);
			--bs-btn-color: #fff;
		}
	`

	root.style.setProperty('--bs-link-color', color)
	root.style.setProperty(
		'--bs-link-color-dark',
		`color-mix(in srgb, ${color} 75%, black)`,
	)

	root.style.setProperty(
		'--bs-focus-ring-color',
		`rgba(${r}, ${g}, ${b}, 0.25)`,
	)

	root.style.setProperty('--bs-btn-subtle-color', `color-mix(in srgb, ${color} 100%, ${isLight ? 'black' : 'white'})`)
	root.style.setProperty('--bs-btn-subtle-bg', `rgba(${r}, ${g}, ${b}, 0.1)`)
	root.style.setProperty('--bs-btn-subtle-border-color', `rgba(${r}, ${g}, ${b}, 0.2)`)

	root.style.setProperty(
		'--bs-nav-tabs-link-active-bg',
		`rgba(${r}, ${g}, ${b}, 0.08)`,
	)

	root.style.setProperty(
		'--bs-badge-color',
		`color-mix(in srgb, ${color} 100%, ${isLight ? 'black' : 'white'})`,
	)

	root.style.setProperty(
		'--bs-dropdown-link-active-bg',
		`rgba(${r}, ${g}, ${b}, 0.1)`,
	)

	root.style.setProperty('--bs-progress-bar-bg', color)

	root.style.setProperty('--bs-list-group-active-bg', color)
	root.style.setProperty('--bs-list-group-active-border-color', color)

	root.style.setProperty('--app-layout-bg', `rgba(${r}, ${g}, ${b}, 0.08)`)
	root.style.setProperty('--app-layout-bg-strong', `rgba(${r}, ${g}, ${b}, 0.15)`)
}

export function clearColorTheme() {
	const root = document.documentElement
	const vars = [
		'--bs-primary',
		'--bs-primary-rgb',
		'--bs-primary-text-emphasis',
		'--bs-primary-bg-subtle',
		'--bs-primary-border-subtle',
		'--bs-link-color',
		'--bs-link-color-dark',
		'--bs-focus-ring-color',
		'--bs-btn-color',
		'--bs-btn-bg',
		'--bs-btn-hover-bg',
		'--bs-btn-active-bg',
		'--bs-btn-border-color',
		'--bs-btn-hover-border-color',
		'--bs-btn-active-border-color',
		'--bs-btn-subtle-color',
		'--bs-btn-subtle-bg',
		'--bs-btn-subtle-border-color',
		'--bs-nav-tabs-link-active-bg',
		'--bs-badge-color',
		'--bs-dropdown-link-active-bg',
		'--bs-progress-bar-bg',
		'--bs-list-group-active-bg',
		'--bs-list-group-active-border-color',
		'--app-layout-bg',
		'--app-layout-bg-strong',
	]
	vars.forEach((v) => root.style.removeProperty(v))
}
