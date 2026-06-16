import { style, styleVariants } from '@vanilla-extract/css'

const baseDropzone = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  padding: 32,
  borderWidth: 2,
  borderStyle: 'dashed',
  borderRadius: 8,
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  borderColor: 'rgba(0, 0, 0, 0.15)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textAlign: 'center',
  minHeight: 160,
  ':hover': {
    borderColor: 'rgba(0, 0, 0, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  ':focus-visible': {
    outline: '2px solid #0d6efd',
    outlineOffset: 2,
  },
})

export const dropzoneStyle = styleVariants({
  default: [baseDropzone],
  active: [
    baseDropzone,
    {
      borderColor: '#0d6efd',
      backgroundColor: 'rgba(13, 110, 253, 0.08)',
    },
  ],
  reject: [
    baseDropzone,
    {
      borderColor: '#dc3545',
      backgroundColor: 'rgba(220, 53, 69, 0.08)',
    },
  ],
})

export const thumbnailGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: 12,
  width: '100%',
})

export const thumbnail = style({
  position: 'relative',
  aspectRatio: '1',
  borderRadius: 8,
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.1)',
})

export const thumbnailImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const thumbnailRemove = style({
  position: 'absolute',
  top: 4,
  right: 4,
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
})

export const fileList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
})

export const fileItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '8px 12px',
  borderRadius: 6,
  backgroundColor: 'rgba(0, 0, 0, 0.03)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
})

export const progressContainer = style({
  width: '100%',
  marginTop: 4,
})
