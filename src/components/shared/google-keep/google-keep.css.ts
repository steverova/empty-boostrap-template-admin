import { style } from '@vanilla-extract/css'

export const masonryGrid = style({
	columnCount: 1,
	columnGap: 16,
	'@media': {
		'(min-width: 768px)': {
			columnCount: 2,
		},
		'(min-width: 992px)': {
			columnCount: 3,
		},
		'(min-width: 1200px)': {
			columnCount: 4,
		},
		'(min-width: 1400px)': {
			columnCount: 5,
		},
	},
})

export const keepNote = style({
	breakInside: 'avoid',
	marginBottom: 16,
	transition: 'box-shadow 0.15s ease',
	selectors: {
		'&:hover': {
			boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
		},
	},
})

export const keepNoteActions = style({
	opacity: 0,
	transition: 'opacity 0.15s ease',
	selectors: {
		[`${keepNote}:hover &`]: {
			opacity: 1,
		},
	},
})

export const keepColorDot = style({
	width: 24,
	height: 24,
	borderRadius: '50%',
	border: '2px solid var(--bs-border-color)',
	cursor: 'pointer',
	transition: 'border-color 0.15s ease, transform 0.15s ease',
	selectors: {
		'&:hover': {
			borderColor: 'var(--bs-body-color)',
			transform: 'scale(1.1)',
		},
	},
})

export const keepColorDotActive = style({
	width: 24,
	height: 24,
	borderRadius: '50%',
	border: '2px solid var(--bs-primary)',
	cursor: 'pointer',
	transition: 'border-color 0.15s ease',
	selectors: {
		'&:hover': {
			borderColor: 'var(--bs-body-color)',
		},
	},
})
