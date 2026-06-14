import { globalStyle, style, styleVariants } from '@vanilla-extract/css'

export const editorWrapper = style({
	display: 'flex',
	flexDirection: 'column',
	border: '1px solid var(--bs-border-color)',
	borderRadius: 'var(--bs-border-radius)',
	backgroundColor: 'var(--bs-body-bg)',
	overflow: 'visible',
	':focus-within': {
		borderColor: 'var(--bs-primary)',
		boxShadow: '0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25)',
	},
})

export const editorSize = styleVariants({
	sm: { fontSize: '0.875rem' },
	md: { fontSize: '1rem' },
	lg: { fontSize: '1.125rem' },
})

export const containerWidth = styleVariants({
	auto: {},
	sm: { maxWidth: 600, marginInline: 'auto' },
	md: { maxWidth: 900, marginInline: 'auto' },
	lg: { maxWidth: 1200, marginInline: 'auto' },
})

export const toolbar = style({
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'center',
	gap: '2px',
	padding: '6px 8px',
	borderBottom: '1px solid var(--bs-border-color)',
	backgroundColor: 'var(--bs-tertiary-bg)',
})

export const toolbarSticky = style({
	position: 'sticky',
	top: 0,
	zIndex: 10,
})

export const toolbarGroup = style({
	display: 'inline-flex',
	alignItems: 'center',
	gap: '2px',
})

export const toolbarDivider = style({
	width: 1,
	height: 24,
	margin: 0,
	marginInline: 4,
	padding: 0,
	border: 'none',
	borderInlineStart: '1px solid var(--bs-border-color)',
	alignSelf: 'center',
})

export const toolbarButton = style({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: 32,
	height: 32,
	padding: 0,
	border: 'none',
	borderRadius: 'var(--bs-border-radius-sm)',
	backgroundColor: 'transparent',
	color: 'var(--bs-body-color)',
	cursor: 'pointer',
	transition: 'background-color 0.15s ease, color 0.15s ease',
	selectors: {
		'&:hover:not(:disabled)': {
			backgroundColor: 'var(--bs-tertiary-bg)',
		},
		'&:focus-visible': {
			outline: '2px solid var(--bs-primary)',
			outlineOffset: -2,
		},
		'&:disabled': {
			opacity: 0.5,
			cursor: 'not-allowed',
		},
		'&[data-active="true"]': {
			backgroundColor: 'var(--bs-primary)',
			color: 'var(--bs-primary-text)',
		},
	},
})

export const contentArea = style({
	flex: 1,
	minHeight: 200,
	padding: '12px 16px',
	outline: 'none',
	overflowY: 'auto',
})

globalStyle(`${contentArea} .tiptap`, {
	outline: 'none',
})

globalStyle(`${contentArea} .tiptap p.is-editor-empty:first-child::before`, {
	content: 'attr(data-placeholder)',
	float: 'left',
	color: 'var(--bs-secondary-color)',
	pointerEvents: 'none',
	height: 0,
	fontStyle: 'italic',
})

globalStyle(`${contentArea} .tiptap h1`, {
	fontSize: '2em',
	fontWeight: 700,
	marginTop: '0.67em',
	marginBottom: '0.67em',
})

globalStyle(`${contentArea} .tiptap h2`, {
	fontSize: '1.5em',
	fontWeight: 600,
	marginTop: '0.83em',
	marginBottom: '0.83em',
})

globalStyle(`${contentArea} .tiptap h3`, {
	fontSize: '1.17em',
	fontWeight: 600,
	marginTop: '1em',
	marginBottom: '1em',
})

globalStyle(`${contentArea} .tiptap ul`, {
	paddingLeft: '1.5em',
})

globalStyle(`${contentArea} .tiptap ol`, {
	paddingLeft: '1.5em',
})

globalStyle(`${contentArea} .tiptap ul[data-type="taskList"]`, {
	paddingLeft: 0,
	listStyle: 'none',
})

globalStyle(`${contentArea} .tiptap ul[data-type="taskList"] li`, {
	display: 'flex',
	alignItems: 'flex-start',
	gap: '8px',
})

globalStyle(`${contentArea} .tiptap ul[data-type="taskList"] li label input[type="checkbox"]`, {
	marginTop: '4px',
})

globalStyle(`${contentArea} .tiptap blockquote`, {
	paddingLeft: '1em',
	marginLeft: 0,
	marginRight: 0,
	borderLeft: '3px solid var(--bs-primary)',
	color: 'var(--bs-secondary-color)',
})

globalStyle(`${contentArea} .tiptap pre`, {
	backgroundColor: 'var(--bs-tertiary-bg)',
	borderRadius: 'var(--bs-border-radius)',
	padding: '12px 16px',
	overflowX: 'auto',
	fontFamily: 'monospace',
	fontSize: '0.9em',
})

globalStyle(`${contentArea} .tiptap code`, {
	backgroundColor: 'var(--bs-tertiary-bg)',
	borderRadius: '3px',
	padding: '2px 4px',
	fontFamily: 'monospace',
	fontSize: '0.9em',
})

globalStyle(`${contentArea} .tiptap pre code`, {
	backgroundColor: 'transparent',
	padding: 0,
	fontSize: 'inherit',
})

globalStyle(`${contentArea} .tiptap mark`, {
	backgroundColor: '#fff3bf',
	borderRadius: '2px',
	padding: '1px 2px',
})

globalStyle(`${contentArea} .tiptap img`, {
	maxWidth: '100%',
	height: 'auto',
	borderRadius: 'var(--bs-border-radius)',
})

globalStyle(`${contentArea} .tiptap a`, {
	color: 'var(--bs-primary)',
	textDecoration: 'underline',
})

globalStyle(`${contentArea} .tiptap hr`, {
	border: 'none',
	borderTop: '1px solid var(--bs-border-color)',
	margin: '1em 0',
})

globalStyle(`${contentArea} .tiptap table`, {
	borderCollapse: 'collapse',
	width: '100%',
	margin: '1em 0',
})

globalStyle(`${contentArea} .tiptap table td`, {
	border: '1px solid var(--bs-border-color)',
	padding: '8px 12px',
	minWidth: 80,
	position: 'relative',
})

globalStyle(`${contentArea} .tiptap table th`, {
	border: '1px solid var(--bs-border-color)',
	padding: '8px 12px',
	minWidth: 80,
	position: 'relative',
	backgroundColor: 'var(--bs-tertiary-bg)',
	fontWeight: 600,
})

globalStyle(`${contentArea} .tiptap table .selectedCell`, {
	backgroundColor: 'rgba(var(--bs-primary-rgb), 0.1)',
})

globalStyle(`${contentArea} .tiptap .ProseMirror-selectednode`, {
	outline: '2px solid var(--bs-primary)',
	borderRadius: 'var(--bs-border-radius)',
	position: 'relative',
})

globalStyle(`${contentArea} .tiptap .ProseMirror-selectednode img`, {
	display: 'block',
	borderRadius: 'var(--bs-border-radius)',
})

globalStyle(`${contentArea} .tiptap div[data-youtube]`, {
	margin: '8px 0',
	borderRadius: 'var(--bs-border-radius)',
})

globalStyle(`${contentArea} .tiptap div[data-youtube] iframe`, {
	width: '100%',
	aspectRatio: '16 / 9',
	border: 0,
	borderRadius: 'var(--bs-border-radius)',
})

export const statusBar = style({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '4px 12px',
	borderTop: '1px solid var(--bs-border-color)',
	backgroundColor: 'var(--bs-tertiary-bg)',
	fontSize: '0.75rem',
	color: 'var(--bs-secondary-color)',
})

export const editorPreview = style({
	border: '1px solid var(--bs-border-color)',
	borderRadius: 'var(--bs-border-radius)',
	backgroundColor: 'var(--bs-body-bg)',
	overflow: 'hidden',
})

export const charCount = styleVariants({
	normal: {},
	limit: {
		color: 'var(--bs-danger)',
		fontWeight: 600,
	},
})

export const colorPickerWrapper = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: '4px',
	padding: '8px',
	maxWidth: 180,
})

export const colorSwatch = style({
	width: 24,
	height: 24,
	borderRadius: 4,
	border: '2px solid transparent',
	cursor: 'pointer',
	transition: 'border-color 0.15s ease, transform 0.1s ease',
	selectors: {
		'&:hover': {
			transform: 'scale(1.15)',
		},
		'&[data-selected="true"]': {
			borderColor: 'var(--bs-body-color)',
		},
	},
})

globalStyle(`${contentArea} .tiptap .editor-two-columns`, {
	display: 'flex',
	gap: '1rem',
	margin: '1em 0',
	padding: '8px',
	border: '2px dashed var(--bs-primary)',
	borderRadius: 'var(--bs-border-radius)',
})

globalStyle(`${contentArea} .tiptap .editor-two-columns:empty::before`, {
	content: '"Columnas"',
	color: 'var(--bs-secondary-color)',
	fontStyle: 'italic',
})

globalStyle(`${contentArea} .tiptap .editor-column-block`, {
	flex: '1 1 0',
	minWidth: 0,
	padding: '8px 12px',
	border: '1px solid var(--bs-border-color)',
	borderRadius: 'var(--bs-border-radius-sm)',
	backgroundColor: 'var(--bs-body-bg)',
})

globalStyle(`${contentArea} .tiptap .editor-column-block:empty::before`, {
	content: '"Escribe aquí..."',
	color: 'var(--bs-secondary-color)',
	fontStyle: 'italic',
	fontSize: '0.875em',
})

globalStyle(`${contentArea} .tiptap pre code .hljs-keyword`, { color: '#cf222e' })
globalStyle(`${contentArea} .tiptap pre code .hljs-string`, { color: '#0a3069' })
globalStyle(`${contentArea} .tiptap pre code .hljs-comment`, { color: '#6e7781', fontStyle: 'italic' })
globalStyle(`${contentArea} .tiptap pre code .hljs-function`, { color: '#8250df' })
globalStyle(`${contentArea} .tiptap pre code .hljs-number`, { color: '#0550ae' })
globalStyle(`${contentArea} .tiptap pre code .hljs-title`, { color: '#6639ba' })
globalStyle(`${contentArea} .tiptap pre code .hljs-built_in`, { color: '#e36209' })
globalStyle(`${contentArea} .tiptap pre code .hljs-params`, { color: '#953800' })
globalStyle(`${contentArea} .tiptap pre code .hljs-attr`, { color: '#0550ae' })
globalStyle(`${contentArea} .tiptap pre code .hljs-literal`, { color: '#0550ae' })
globalStyle(`${contentArea} .tiptap pre code .hljs-type`, { color: '#953800' })
globalStyle(`${contentArea} .tiptap pre code .hljs-meta`, { color: '#0550ae' })
globalStyle(`${contentArea} .tiptap pre code .hljs-selector-class`, { color: '#6639ba' })
globalStyle(`${contentArea} .tiptap pre code .hljs-selector-tag`, { color: '#116329' })
globalStyle(`${contentArea} .tiptap pre code .hljs-addition`, { color: '#116329', backgroundColor: '#dafbe1' })
globalStyle(`${contentArea} .tiptap pre code .hljs-deletion`, { color: '#cf222e', backgroundColor: '#ffebe9' })

globalStyle(`${contentArea} .tiptap .editor-page-break`, {
	margin: '16px 0',
})
