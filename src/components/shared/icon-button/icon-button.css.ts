import { style, styleVariants } from '@vanilla-extract/css'

const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: '1',
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  lineHeight: 1,
  backgroundColor: 'transparent',
  color: 'inherit',
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  ':focus-visible': {
    outline: '2px solid currentColor',
    outlineOffset: 2,
  },
  ':disabled': {
    opacity: 0.5,
    pointerEvents: 'none',
  },
})

export const iconButtonStyle = styleVariants({
  sm: [base, { width: 32, height: 32 }],
  md: [base, { width: 40, height: 40 }],
  lg: [base, { width: 48, height: 48 }],
})

export const elevationStyle = style({
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
})
