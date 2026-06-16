import { style } from '@vanilla-extract/css'

export const chatContainer = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  border: '1px solid var(--bs-border-color)',
  borderRadius: 'var(--bs-border-radius)',
  backgroundColor: 'var(--bs-body-bg)',
  overflow: 'hidden',
})

export const chatHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 16px',
  borderBottom: '1px solid var(--bs-border-color)',
  backgroundColor: 'var(--bs-body-bg)',
  flexShrink: 0,
})

export const chatHeaderInfo = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  flex: 1,
})

export const chatHeaderName = style({
  fontWeight: 600,
  fontSize: '0.95rem',
  lineHeight: 1.2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const chatHeaderStatus = style({
  fontSize: '0.75rem',
  color: 'var(--bs-secondary-color)',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})

export const statusDot = style({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
})

export const statusDotOnline = style([
  statusDot,
  { backgroundColor: '#22c55e' },
])

export const statusDotOffline = style([
  statusDot,
  { backgroundColor: '#9ca3af' },
])

export const statusDotAway = style([
  statusDot,
  { backgroundColor: '#f59e0b' },
])

export const statusDotBusy = style([
  statusDot,
  { backgroundColor: '#ef4444' },
])

export const chatMessages = style({
  flex: 1,
  overflowY: 'auto',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  minHeight: 0,
})

export const messageGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  marginBottom: 8,
})

export const messageRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: 8,
  maxWidth: '75%',
  selectors: {
    '&:first-child': {
      marginTop: 'auto',
    },
  },
  '@media': {
    '(max-width: 575.98px)': {
      maxWidth: '85%',
    },
  },
})

export const messageRowSent = style([
  messageRow,
  {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
])

export const messageRowReceived = style([
  messageRow,
  {
    alignSelf: 'flex-start',
  },
])

export const messageBubble = style({
  padding: '8px 12px',
  borderRadius: 18,
  fontSize: '0.875rem',
  lineHeight: 1.4,
  wordBreak: 'break-word',
  position: 'relative',
})

export const messageBubbleSent = style([
  messageBubble,
  {
    backgroundColor: 'var(--bs-primary)',
    color: 'var(--bs-white)',
    borderBottomRightRadius: 4,
  },
])

export const messageBubbleReceived = style([
  messageBubble,
  {
    backgroundColor: 'var(--bs-tertiary-bg)',
    color: 'var(--bs-body-color)',
    borderBottomLeftRadius: 4,
  },
])

export const messageTime = style({
  fontSize: '0.65rem',
  color: 'var(--bs-secondary-color)',
  marginTop: 2,
  whiteSpace: 'nowrap',
  selectors: {
    [`${messageRowSent} &`]: {
      textAlign: 'right',
    },
  },
})

export const messageTimeSent = style([
  messageTime,
  {
    textAlign: 'right',
  },
])

export const messageTimeReceived = style([
  messageTime,
  {
    textAlign: 'left',
  },
])

export const chatInputArea = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: 8,
  padding: 12,
  borderTop: '1px solid var(--bs-border-color)',
  backgroundColor: 'var(--bs-body-bg)',
  flexShrink: 0,
})

export const chatInput = style({
  flex: 1,
  resize: 'none',
  borderRadius: 20,
  minHeight: 40,
  maxHeight: 120,
  fontSize: '0.875rem',
  lineHeight: 1.4,
})

export const chatSendButton = style({
  borderRadius: '50%',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})

export const typingIndicator = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 12px',
  fontSize: '0.75rem',
  color: 'var(--bs-secondary-color)',
  fontStyle: 'italic',
})

export const typingDots = style({
  display: 'flex',
  gap: 3,
  alignItems: 'center',
})

export const typingDot = style({
  width: 5,
  height: 5,
  borderRadius: '50%',
  backgroundColor: 'var(--bs-secondary-color)',
  animation: 'typingBounce 1.4s ease-in-out infinite',
  selectors: {
    '&:nth-child(2)': {
      animationDelay: '0.2s',
    },
    '&:nth-child(3)': {
      animationDelay: '0.4s',
    },
  },
})

export const dateSeparator = style({
  textAlign: 'center',
  padding: '8px 0',
  fontSize: '0.7rem',
  color: 'var(--bs-secondary-color)',
  fontWeight: 500,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  selectors: {
    '&::before, &::after': {
      content: '""',
      flex: 1,
      height: 1,
      backgroundColor: 'var(--bs-border-color)',
    },
  },
})

export const emptyChat = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  gap: 12,
  color: 'var(--bs-secondary-color)',
  padding: 32,
})

export const contactsList = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  overflowY: 'auto',
})

export const contactItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 16px',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  borderBottom: '1px solid var(--bs-border-color)',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--bs-tertiary-bg)',
    },
  },
})

export const contactItemActive = style([
  contactItem,
  {
    backgroundColor: 'var(--bs-primary-bg-subtle)',
    borderLeft: '3px solid var(--bs-primary)',
  },
])

export const contactInfo = style({
  flex: 1,
  minWidth: 0,
})

export const contactName = style({
  fontWeight: 500,
  fontSize: '0.9rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const contactLastMessage = style({
  fontSize: '0.75rem',
  color: 'var(--bs-secondary-color)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const contactTime = style({
  fontSize: '0.65rem',
  color: 'var(--bs-secondary-color)',
  whiteSpace: 'nowrap',
  flexShrink: 0,
})

export const unreadBadge = style({
  backgroundColor: 'var(--bs-primary)',
  color: 'var(--bs-white)',
  fontSize: '0.65rem',
  fontWeight: 600,
  borderRadius: '50%',
  minWidth: 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})
