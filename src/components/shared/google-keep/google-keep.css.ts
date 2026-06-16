import { style } from '@vanilla-extract/css'

export const keepContainer = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
})

export const keepHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 16px',
  borderBottom: '1px solid var(--bs-border-color)',
  backgroundColor: 'var(--bs-body-bg)',
  flexShrink: 0,
})

export const keepSearch = style({
  flex: 1,
  maxWidth: 500,
  borderRadius: 24,
  backgroundColor: 'var(--bs-tertiary-bg)',
  border: '1px solid var(--bs-border-color)',
  padding: '8px 16px',
  fontSize: '0.875rem',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  selectors: {
    '&:focus': {
      borderColor: 'var(--bs-primary)',
      boxShadow: '0 0 0 2px var(--bs-primary-bg-subtle)',
      outline: 'none',
      backgroundColor: 'var(--bs-body-bg)',
    },
  },
})

export const keepGrid = style({
  flex: 1,
  overflowY: 'auto',
  padding: 16,
})

export const keepMasonry = style({
  columnCount: 2,
  columnGap: 16,
  '@media': {
    '(min-width: 768px)': {
      columnCount: 3,
    },
    '(min-width: 992px)': {
      columnCount: 4,
    },
    '(min-width: 1200px)': {
      columnCount: 5,
    },
  },
})

export const keepNote = style({
	breakInside: 'avoid',
	marginBottom: 16,
	borderRadius: 8,
	border: '1px solid var(--bs-border-color)',
	backgroundColor: 'var(--bs-body-bg)',
	overflow: 'hidden',
	transition: 'box-shadow 0.15s ease',
	selectors: {
		'&:hover': {
			boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
		},
	},
})

export const keepNoteListItem = style([
	keepNote,
	{
		breakInside: 'auto',
		marginBottom: 0,
	},
])

export const keepNotePinned = style([
  keepNote,
  {
    backgroundColor: 'var(--bs-primary-bg-subtle)',
  },
])

export const keepNoteHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: '12px 12px 0 12px',
  gap: 8,
})

export const keepNoteTitle = style({
  fontWeight: 600,
  fontSize: '0.95rem',
  lineHeight: 1.3,
  wordBreak: 'break-word',
  flex: 1,
  margin: 0,
})

export const keepNoteBody = style({
  padding: '4px 12px 12px 12px',
  fontSize: '0.85rem',
  lineHeight: 1.5,
  color: 'var(--bs-body-color)',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
})

export const keepNoteImage = style({
  width: '100%',
  maxHeight: 200,
  objectFit: 'cover',
  display: 'block',
})

export const keepNoteChecklist = style({
  padding: '4px 12px 12px 12px',
})

export const keepCheckItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '2px 0',
  fontSize: '0.85rem',
})

export const keepCheckItemDone = style([
  keepCheckItem,
  {
    textDecoration: 'line-through',
    opacity: 0.6,
  },
])

export const keepNoteFooter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '4px 8px 8px 8px',
})

export const keepNoteLabels = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 4,
})

export const keepLabel = style({
  padding: '2px 8px',
  borderRadius: 12,
  fontSize: '0.7rem',
  fontWeight: 500,
  backgroundColor: 'var(--bs-tertiary-bg)',
  color: 'var(--bs-secondary-color)',
})

export const keepNoteActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  opacity: 0,
  transition: 'opacity 0.15s ease',
  selectors: {
    [`${keepNote}:hover &`]: {
      opacity: 1,
    },
  },
})

export const keepActionBtn = style({
  padding: 4,
  borderRadius: '50%',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--bs-secondary-color)',
  transition: 'background-color 0.15s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--bs-tertiary-bg)',
    },
  },
})

export const keepColorPicker = style({
  display: 'flex',
  gap: 6,
  padding: '8px 12px',
  borderTop: '1px solid var(--bs-border-color)',
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

export const keepEmptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 64,
  color: 'var(--bs-secondary-color)',
  textAlign: 'center',
})

export const keepCreateBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 16px',
  margin: '0 auto 24px auto',
  maxWidth: 600,
  width: '100%',
  borderRadius: 8,
  border: '1px solid var(--bs-border-color)',
  backgroundColor: 'var(--bs-body-bg)',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  cursor: 'text',
})

export const keepCreateInput = style({
  flex: 1,
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontSize: '0.95rem',
  padding: 0,
  selectors: {
    '&::placeholder': {
      color: 'var(--bs-secondary-color)',
    },
  },
})

export const keepCreateExpanded = style([
  keepCreateBar,
  {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 8,
  },
])

export const keepCreateTitleInput = style({
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontSize: '1rem',
  fontWeight: 600,
  padding: '4px 0',
  selectors: {
    '&::placeholder': {
      color: 'var(--bs-secondary-color)',
      fontWeight: 400,
    },
  },
})

export const keepCreateBodyInput = style({
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  resize: 'none',
  minHeight: 60,
  padding: 0,
  selectors: {
    '&::placeholder': {
      color: 'var(--bs-secondary-color)',
    },
  },
})

export const keepCreateActions = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
})

export const keepCreateBtnGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})
