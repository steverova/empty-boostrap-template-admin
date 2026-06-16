import { style } from '@vanilla-extract/css'

export const calendarContainer = style({
  border: '1px solid var(--bs-border-color)',
  borderRadius: 'var(--bs-border-radius)',
  overflow: 'hidden',
})

export const calendarHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid var(--bs-border-color)',
  flexWrap: 'wrap',
  gap: 8,
  '@media': {
    '(max-width: 575.98px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 8,
    },
  },
})

export const calendarNav = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  justifyContent: 'center',
})

export const calendarGrid = style({
  overflow: 'auto',
})

export const calendarDayHeader = style({
  borderBottom: '1px solid var(--bs-border-color)',
  position: 'sticky',
  top: 0,
  backgroundColor: 'var(--bs-body-bg)',
  zIndex: 1,
})

export const calendarDay = style({
  minHeight: 80,
  padding: 4,
  borderBottom: '1px solid var(--bs-border-color)',
  borderRight: '1px solid var(--bs-border-color)',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--bs-tertiary-bg)',
    },
    '&:nth-child(7n)': {
      borderRight: 'none',
    },
  },
  '@media': {
    '(min-width: 768px)': {
      minHeight: 100,
    },
  },
})

export const calendarDayOutside = style({
  opacity: 0.4,
})

export const calendarDayToday = style({
  backgroundColor: 'var(--bs-primary-bg-subtle)',
})

export const calendarDayRangeStart = style({
  backgroundColor: 'var(--bs-primary)',
  color: 'var(--bs-white)',
  borderRadius: 'var(--bs-border-radius-sm) 0 0 var(--bs-border-radius-sm)',
})

export const calendarDayRangeEnd = style({
  backgroundColor: 'var(--bs-primary)',
  color: 'var(--bs-white)',
  borderRadius: '0 var(--bs-border-radius-sm) var(--bs-border-radius-sm) 0',
})

export const calendarDayInRange = style({
  backgroundColor: 'var(--bs-primary-bg-subtle)',
})

export const eventPill = style({
  padding: '2px 4px',
  borderRadius: 'var(--bs-border-radius-sm)',
  fontSize: '0.65rem',
  lineHeight: '16px',
  color: 'var(--bs-white)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'opacity 0.15s ease',
  selectors: {
    '&:hover': {
      opacity: 0.85,
    },
  },
  '@media': {
    '(min-width: 768px)': {
      padding: '2px 6px',
      fontSize: '0.7rem',
      lineHeight: '18px',
    },
  },
})

export const eventPillContinuation = style({
  padding: '2px 4px',
  borderRadius: 0,
  fontSize: '0.65rem',
  lineHeight: '16px',
  color: 'var(--bs-white)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  opacity: 0.85,
  transition: 'opacity 0.15s ease',
  minHeight: 18,
  selectors: {
    '&:hover': {
      opacity: 0.7,
    },
  },
  '@media': {
    '(min-width: 768px)': {
      padding: '2px 6px',
      fontSize: '0.7rem',
      lineHeight: '18px',
      minHeight: 20,
    },
  },
})

export const eventPillEnd = style({
  padding: '2px 4px',
  borderRadius: '0 var(--bs-border-radius-sm) var(--bs-border-radius-sm) 0',
  fontSize: '0.65rem',
  lineHeight: '16px',
  color: 'var(--bs-white)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  opacity: 0.85,
  transition: 'opacity 0.15s ease',
  minHeight: 18,
  selectors: {
    '&:hover': {
      opacity: 0.7,
    },
  },
  '@media': {
    '(min-width: 768px)': {
      padding: '2px 6px',
      fontSize: '0.7rem',
      lineHeight: '18px',
      minHeight: 20,
    },
  },
})

export const viewButton = style({
  fontSize: '0.75rem',
  '@media': {
    '(min-width: 768px)': {
      fontSize: '0.8rem',
    },
  },
})

export const viewButtonActive = style({
  fontSize: '0.75rem',
  '@media': {
    '(min-width: 768px)': {
      fontSize: '0.8rem',
    },
  },
})
