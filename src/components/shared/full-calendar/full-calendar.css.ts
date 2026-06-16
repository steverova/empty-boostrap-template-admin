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
})

export const calendarNav = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})

export const calendarGrid = style({
  overflow: 'auto',
})

export const calendarDayHeader = style({
  borderBottom: '1px solid var(--bs-border-color)',
})

export const calendarDay = style({
  minHeight: 100,
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
  padding: '2px 6px',
  borderRadius: 'var(--bs-border-radius-sm)',
  fontSize: '0.7rem',
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
})

export const eventPillContinuation = style({
  padding: '2px 6px',
  borderRadius: 0,
  fontSize: '0.7rem',
  lineHeight: '18px',
  color: 'var(--bs-white)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  opacity: 0.85,
  transition: 'opacity 0.15s ease',
  minHeight: 20,
  selectors: {
    '&:hover': {
      opacity: 0.7,
    },
  },
})

export const eventPillEnd = style({
  padding: '2px 6px',
  borderRadius: '0 var(--bs-border-radius-sm) var(--bs-border-radius-sm) 0',
  fontSize: '0.7rem',
  lineHeight: '18px',
  color: 'var(--bs-white)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  opacity: 0.85,
  transition: 'opacity 0.15s ease',
  minHeight: 20,
  selectors: {
    '&:hover': {
      opacity: 0.7,
    },
  },
})

export const viewButton = style({
  fontSize: '0.8rem',
})

export const viewButtonActive = style({
  fontSize: '0.8rem',
})

export const rangeIndicator = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '8px 16px',
  borderBottom: '1px solid var(--bs-border-color)',
  fontSize: '0.875rem',
  color: 'var(--bs-primary)',
})
